import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error("Usage: node scripts/shots.mjs <slug> <url>");
  process.exit(1);
}
mkdirSync("shots", { recursive: true });

const chromeExe = "C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe";
const launchOptions = existsSync(chromeExe) ? { executablePath: chromeExe } : {};

const browser = await chromium.launch(launchOptions);
const targets = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, scale: 1, clipHeight: 2400 },
  { name: "mobile", viewport: { width: 390, height: 844 }, scale: 2, clipHeight: 1700, mobile: true },
  { name: "tablet", viewport: { width: 1024, height: 768 }, scale: 1, clipHeight: 2000, mobile: false },
];

for (const t of targets) {
  const page = await browser.newPage({
    viewport: t.viewport,
    deviceScaleFactor: t.scale,
    isMobile: !!t.mobile,
    hasTouch: !!t.mobile,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.addStyleTag({
    content: `[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],iframe[src*="chat" i],[class*="whatsapp" i]{display:none!important}`,
  }).catch(() => {});
  const height = Math.min(t.clipHeight, await page.evaluate(() => document.documentElement.scrollHeight || 1000));
  await page.screenshot({
    path: `shots/${slug}-${t.name}.png`,
    clip: { x: 0, y: 0, width: t.viewport.width, height },
  });
  console.log(`shots/${slug}-${t.name}.png`);
  await page.close();
}
await browser.close();
