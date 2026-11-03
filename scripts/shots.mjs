// Take desktop + mobile screenshots of a live site for the portfolio.
// Usage: node scripts/shots.mjs <slug> <url>
// Setup once: npm i -D playwright && npx playwright install chromium
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error("Usage: node scripts/shots.mjs <slug> <url>");
  process.exit(1);
}
mkdirSync("shots", { recursive: true });

const browser = await chromium.launch();
const targets = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, scale: 1, clipHeight: 2400 },
  { name: "mobile", viewport: { width: 390, height: 844 }, scale: 2, clipHeight: 1700, mobile: true },
];

for (const t of targets) {
  const page = await browser.newPage({
    viewport: t.viewport,
    deviceScaleFactor: t.scale,
    isMobile: !!t.mobile,
    hasTouch: !!t.mobile,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500); // let sliders, fonts and lazy images settle
  // Hide common cookie banners / chat widgets so they don't cover the design
  await page.addStyleTag({
    content: `[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],iframe[src*="chat" i],[class*="whatsapp" i]{display:none!important}`,
  });
  const height = Math.min(t.clipHeight, await page.evaluate(() => document.documentElement.scrollHeight));
  await page.screenshot({
    path: `shots/${slug}-${t.name}.png`,
    clip: { x: 0, y: 0, width: t.viewport.width, height },
    fullPage: true,
  });
  console.log(`shots/${slug}-${t.name}.png`);
  await page.close();
}
await browser.close();
