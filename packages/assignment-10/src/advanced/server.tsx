// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import express, { Request } from "express";
import ReactDOMServer from "react-dom/server";
import { App } from "./App.tsx";
import createProxy from "./createProxy.ts";

const app = express();
const port = 3333;
const proxy = createProxy();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function render(AppNode, req: Request) {
  let cachedHTML = proxy.getCachedFile(req.url);

  if (!cachedHTML) {
    const HTMLApp = ReactDOMServer.renderToString(<AppNode url={req.url} />);

    cachedHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple SSR</title>
      </head>
      <body>
        <div id="root">${HTMLApp}</div>
      </body>
      </html>
    `;

    proxy.setCacheFile(req.url, cachedHTML);
  }

  return cachedHTML;
}

app.get("*", (req, res) => {
  const appHTML = render(App, req as Request);

  res.send(appHTML);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
