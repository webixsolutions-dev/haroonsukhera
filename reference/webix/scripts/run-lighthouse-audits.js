const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
process.env.CHROME_PATH = CHROME_PATH;

const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\cb9682aa-7134-4ce1-b434-b3099baa1a06";
const TEMP_DIR = path.join(ARTIFACT_DIR, "lighthouse-temp");
fs.mkdirSync(TEMP_DIR, { recursive: true });

const TARGETS = [
  { name: "Home", url: "http://localhost:3000/" },
  { name: "Service (AI Automation)", url: "http://localhost:3000/ai-automation-services/" },
  { name: "Offers", url: "http://localhost:3000/offers/" },
  { name: "Our Work", url: "http://localhost:3000/our-work/" },
  { name: "Blog Post (GEO)", url: "http://localhost:3000/how-ai-search-engines-decide/" },
];

async function main() {
  console.log("=================================================");
  console.log("RUNNING LIGHTHOUSE MOBILE AUDITS (5 ROUTES)");
  console.log("=================================================\n");

  const results = [];

  for (const target of TARGETS) {
    console.log(`Auditing: ${target.name} (${target.url})...`);
    const outputPath = path.join(TEMP_DIR, `${target.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.json`);

    try {
      const cmd = `npx.cmd lighthouse "${target.url}" --output=json --output-path="${outputPath}" --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --quiet`;
      execSync(cmd, { env: { ...process.env, CHROME_PATH }, stdio: "pipe" });

      const raw = fs.readFileSync(outputPath, "utf-8");
      const report = JSON.parse(raw);

      const perfScore = Math.round((report.categories.performance?.score || 0) * 100);
      const a11yScore = Math.round((report.categories.accessibility?.score || 0) * 100);
      const bpScore = Math.round((report.categories["best-practices"]?.score || 0) * 100);
      const seoScore = Math.round((report.categories.seo?.score || 0) * 100);

      const fcp = report.audits["first-contentful-paint"]?.displayValue || "N/A";
      const lcp = report.audits["largest-contentful-paint"]?.displayValue || "N/A";
      const cls = report.audits["cumulative-layout-shift"]?.displayValue || "0";
      const tbt = report.audits["total-blocking-time"]?.displayValue || "0 ms";
      const si = report.audits["speed-index"]?.displayValue || "N/A";

      const summary = {
        name: target.name,
        url: target.url,
        performance: perfScore,
        accessibility: a11yScore,
        bestPractices: bpScore,
        seo: seoScore,
        fcp,
        lcp,
        cls,
        tbt,
        speedIndex: si,
      };

      console.log(`  -> Performance: ${perfScore} | Accessibility: ${a11yScore} | Best Practices: ${bpScore} | SEO: ${seoScore}`);
      console.log(`     LCP: ${lcp} | CLS: ${cls} | TBT: ${tbt}\n`);

      results.push(summary);
    } catch (e) {
      console.error(`  ❌ Failed to audit ${target.name}:`, e.message);
      results.push({ name: target.name, url: target.url, error: e.message });
    }
  }

  const outReportPath = path.join(ARTIFACT_DIR, "lighthouse-mobile-summary.json");
  fs.writeFileSync(outReportPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`Saved results to ${outReportPath}`);
}

main();
