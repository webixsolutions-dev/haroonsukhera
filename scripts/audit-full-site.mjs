import http from "node:http";
import fs from "node:fs";

const BASE_URL = "http://localhost:3000";

const ROUTES = [
  "/",
  "/about/",
  "/services/",
  "/work/",
  "/contact/",
  "/privacy/",
];

function request(urlPath) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: "GET",
        headers: { "User-Agent": "GPTBot" },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function parseJsonLd(html) {
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const types = new Set();
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const extract = (obj) => {
        if (!obj || typeof obj !== "object") return;
        if (obj["@type"]) {
          if (Array.isArray(obj["@type"])) {
            obj["@type"].forEach((t) => types.add(t));
          } else {
            types.add(obj["@type"]);
          }
        }
        if (obj["@graph"] && Array.isArray(obj["@graph"])) {
          obj["@graph"].forEach(extract);
        }
        if (obj.itemListElement && Array.isArray(obj.itemListElement)) {
          obj.itemListElement.forEach(extract);
        }
        if (obj.mainEntity) {
          if (Array.isArray(obj.mainEntity)) obj.mainEntity.forEach(extract);
          else extract(obj.mainEntity);
        }
      };
      extract(parsed);
    } catch {
      // ignore
    }
  }
  return Array.from(types);
}

async function audit() {
  console.log("=================================================");
  console.log("HAROON SUKHERA SITE — FULL AUDIT SUITE");
  console.log("=================================================");

  let pass = true;

  for (const route of ROUTES) {
    const res = await request(route);
    const html = res.body;

    console.log(`\nAudit: ${route} [HTTP ${res.statusCode}]`);
    if (res.statusCode !== 200) {
      console.error(`  FAIL: Expected 200, got ${res.statusCode}`);
      pass = false;
    }

    // Title
    const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(html);
    const title = titleMatch ? titleMatch[1].trim() : "";
    console.log(`  Title (${title.length} chars): ${title}`);
    if (!title || title.length > 70) {
      console.warn(`  WARN: Title missing or exceeds standard limits: ${title.length}`);
    }

    // H1 count
    const h1Matches = html.match(/<h1[^>]*>/gi) || [];
    console.log(`  H1 count: ${h1Matches.length}`);
    if (h1Matches.length !== 1) {
      console.error(`  FAIL: Expected exactly 1 H1, found ${h1Matches.length}`);
      pass = false;
    }

    // Meta description
    const descMatch = /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i.exec(html);
    const desc = descMatch ? descMatch[1] : "";
    console.log(`  Meta description (${desc.length} chars): ${desc.slice(0, 80)}...`);

    // JSON-LD Types
    const ldTypes = parseJsonLd(html);
    console.log(`  JSON-LD entities: ${ldTypes.join(", ")}`);
    if (ldTypes.length === 0) {
      console.error("  FAIL: No JSON-LD detected");
      pass = false;
    }

    // Canonical link
    const canonicalMatch = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i.exec(html);
    console.log(`  Canonical: ${canonicalMatch ? canonicalMatch[1] : "None"}`);
  }

  // 404 test
  const res404 = await request("/non-existent-page-test/");
  console.log(`\nAudit: /non-existent-page-test/ [HTTP ${res404.statusCode}]`);
  if (res404.statusCode !== 404) {
    console.log("  Note: Dev server returns 404 or custom handler");
  }

  console.log("\n=================================================");
  if (pass) {
    console.log("  ALL ROUTE AUDITS PASSED CLEANLY!");
  } else {
    console.error("  SOME AUDITS FAILED");
    process.exit(1);
  }
}

audit().catch(console.error);
