const fs = require("fs");
const log = fs.readFileSync(
  "packages/assignment-6/lhci_reports/manifest.json",
  "utf8"
);
const logs = JSON.parse(log);

let chart = "";
chart += "|구분|Performance|Accessibility|Best-Practices|SEO|Average|\n";
chart += "|---|---|---|---|---|---|";
const summary = [0, 0, 0, 0, 0];

logs.forEach((log, i) => {
  const perf = log.summary.performance * 100;
  const access = log.summary.accessibility * 100;
  const best = log.summary["best-practices"] * 100;
  const seo = log.summary.seo * 100;
  const aver =
    Object.values(log.summary).reduce((acc, res) => res + acc, 0) * 25;
  chart += `\n|run:${
    i + 1
  }|${perf}점|${access}점|${best}점|${seo}점|${aver.toFixed(2)}점`;

  summary[0] += perf;
  summary[1] += access;
  summary[2] += best;
  summary[3] += seo;
  summary[4] += aver;
});
chart += `\n|합계|${(summary[0] / logs.length).toFixed(2)}점|${(
  summary[1] / logs.length
).toFixed(2)}점|${(summary[2] / logs.length).toFixed(2)}점|${(
  summary[3] / logs.length
).toFixed(2)}점|${(summary[4] / logs.length).toFixed(2)}점`;
console.log(summary);
console.log(chart);

// github.rest.issues.createComment({
//   issue_number: context.issue.number,
//   owner: context.repo.owner,
//   repo: context.repo.repo,
//   body: `### ✅ Lighthouse C.I. dashboard \n---\n${chart}\n`,
// });
