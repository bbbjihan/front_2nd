const fs = require("fs");
const log = fs.readFileSync(
  "packages/assignment-6/lhci_reports/manifest.json",
  "utf8"
);
console.log(JSON.parse(log));
const logs = JSON.parse(log);
logs.forEach((log) => {
  console.log(log.summary);
});

console.log(`실행횟수: ${logs.length}\n`);
console.log("---\n");

let chart = "";
chart += "|Performance|Accessibility|Best-Practices|SEO|Average|\n";
chart += "|---|---|---|---|---|";

summary = [0, 0, 0, 0, 0];

logs.forEach((log) => {
  const perf = log.summary.performance * 100;
  const access = log.summary.accessibility * 100;
  const best = log.summary["best-practices"] * 100;
  const seo = log.summary.seo * 100;
  const aver =
    Object.values(log.summary).reduce((acc, res) => res + acc, 0) * 25;
  chart += `\n|${perf}점|${access}점|${best}점|${seo}점|${aver}점`;

  summary[0] += perf;
  summary[1] += access;
  summary[2] += best;
  summary[3] += seo;
  summary[4] += aver;
});

console.log(chart);
console.log(summary);
