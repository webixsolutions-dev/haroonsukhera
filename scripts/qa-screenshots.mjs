import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";

const url = process.argv[2] || "http://localhost:3000/";
const outPrefix = process.argv[3] || "qa/home";

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

  // Scroll down the page in steps to trigger all lazy-loaded images and intersection observers
  await page.evaluate(async () => {
    const distance = 450;
    const delay = 80;
    const maxScroll = document.documentElement.scrollHeight;
    for (let y = 0; y <= maxScroll; y += distance) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, delay));
    }
    // Wait for all images to decode
    const imgs = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => {
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
          setTimeout(res, 2500);
        });
      })
    );
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(800);

  const file = `${outPrefix}-${vp.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Saved screenshot: ${file}`);
  await page.close();
}

await browser.close();
console.log("All screenshots captured.");
