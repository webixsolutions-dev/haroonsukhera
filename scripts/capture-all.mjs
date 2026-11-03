import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";

mkdirSync("shots", { recursive: true });

const candidates = [
  { slug: "beorganichealth", url: "https://beorganichealth.com/" },
  { slug: "hciorlando", url: "https://hciorlando.com/" },
  { slug: "clubc-education", url: "https://clubc.education/" },
  { slug: "vivonow", url: "https://vivonow.com/" },
  { slug: "partner-solar-au", url: "https://sparkcharge.au/" },
  { slug: "partner-screens-au", url: "https://bondiscreens.com.au/" },
  { slug: "laptopamazon", url: "https://laptopamazon.com/" },
  { slug: "savegrin", url: "https://savegrin.com/" },
];

async function capture() {
  const browser = await chromium.launch();

  for (const c of candidates) {
    console.log(`Processing ${c.slug} (${c.url})...`);
    for (const t of [
      { name: "desktop", width: 1440, height: 900, scale: 1, mobile: false },
      { name: "mobile", width: 390, height: 844, scale: 2, mobile: true },
      { name: "tablet", width: 1024, height: 768, scale: 1, mobile: false },
    ]) {
      const outPath = `shots/${c.slug}-${t.name}.png`;
      if (existsSync(outPath)) {
        console.log(`  Already exists: ${outPath}`);
        continue;
      }
      try {
        const page = await browser.newPage({
          viewport: { width: t.width, height: t.height },
          deviceScaleFactor: t.scale,
          isMobile: t.mobile,
          hasTouch: t.mobile,
        });
        await page.goto(c.url, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(1000);
        await page.addStyleTag({
          content: `[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],iframe[src*="chat" i],[class*="whatsapp" i]{display:none!important}`,
        }).catch(() => {});
        await page.screenshot({ path: outPath });
        console.log(`  Saved: ${outPath}`);
        await page.close();
      } catch (err) {
        console.warn(`  Failed ${outPath}:`, err.message);
      }
    }
  }

  await browser.close();
  console.log("Candidate capture completed.");
}

capture().catch(console.error);
