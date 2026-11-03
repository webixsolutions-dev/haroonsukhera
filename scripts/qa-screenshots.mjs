import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";

const url = process.argv[2] || "http://localhost:3000/styleguide/";
const outPrefix = process.argv[3] || "qa/styleguide";

mkdirSync("qa", { recursive: true });

const chromeExe = "C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe";
const launchOptions = existsSync(chromeExe) ? { executablePath: chromeExe } : {};

const browser = await chromium.launch(launchOptions);
const viewports = [
  { name: "390", width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
  { name: "768", width: 768, height: 1024, isMobile: false, deviceScaleFactor: 1 },
  { name: "1440", width: 1440, height: 900, isMobile: false, deviceScaleFactor: 1 },
];

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    deviceScaleFactor: vp.deviceScaleFactor,
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1000);

  const file = `${outPrefix}-${vp.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Saved screenshot: ${file}`);
  await page.close();
}

await browser.close();
console.log("All screenshots captured.");
