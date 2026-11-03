const http = require("http");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\cb9682aa-7134-4ce1-b434-b3099baa1a06";

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", reject);
    if (options.body) {
      req.write(options.body);
    }
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
    } catch (e) {
      // ignore json parse error
    }
  }
  return Array.from(types);
}

function stripTags(html) {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ");
  // Strip tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return text.replace(/\s+/g, " ").trim();
}

function countWords(text) {
  const words = text.match(/\b[A-Za-z0-9_\-\u00C0-\u024F]+\b/g);
  return words ? words.length : 0;
}

function extractInternalLinks(html) {
  const links = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const raw = match[1];
    if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/_next") && !raw.startsWith("/api/")) {
      const clean = raw.split("#")[0].split("?")[0];
      if (clean) links.add(clean);
    } else if (raw.startsWith("https://webixsolutions.com/")) {
      const clean = raw.replace("https://webixsolutions.com", "").split("#")[0].split("?")[0];
      if (clean) links.add(clean);
    }
  }
  return Array.from(links);
}

async function runAudit() {
  console.log("=================================================");
  console.log("PHASE 9 — FULL SITE AUDIT & AI-VISIBILITY CRAWLER");
  console.log("=================================================\n");

  // 1. Fetch sitemap
  console.log("1. Fetching sitemap.xml to discover all published URLs...");
  const sitemapRes = await request("/sitemap.xml");
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let locMatch;
  while ((locMatch = locRegex.exec(sitemapRes.body)) !== null) {
    const fullUrl = locMatch[1];
    const pathOnly = fullUrl.replace("https://webixsolutions.com", "") || "/";
    urls.push(pathOnly);
  }
  console.log(`Discovered ${urls.length} indexable URLs in sitemap.xml.`);

  // Add noindex utility routes for full coverage
  const allRoutes = [...urls, "/code-of-conduct/", "/styleguide/"];

  const routeResults = {};
  const inLinksCount = {};
  allRoutes.forEach((r) => (inLinksCount[r] = 0));

  console.log("\n2. Crawling all routes, inspecting metadata, H1s, canonicals, schema, word counts, and GPTBot rendering...");

  for (const route of allRoutes) {
    // Normal crawl
    const res = await request(route);
    const html = res.body;

    // Title
    const titleMatch = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
    const rawTitle = titleMatch ? titleMatch[1].trim() : "";
    const title = rawTitle.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    // Meta description
    const metaMatch = /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i.exec(html) ||
                      /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i.exec(html);
    const meta = metaMatch ? metaMatch[1].trim() : "";

    // H1 count & text
    const h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const h1Count = h1Matches.length;
    const h1Text = h1Matches.length > 0 ? stripTags(h1Matches[0]) : "";

    // Canonical
    const canonicalMatch = /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i.exec(html) ||
                           /<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i.exec(html);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";

    // Robots
    const robotsMatch = /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i.exec(html);
    const robots = robotsMatch ? robotsMatch[1].trim() : (res.headers["x-robots-tag"] || "index, follow");

    // JSON-LD types
    const jsonLdTypes = parseJsonLd(html);

    // Word count
    const bodyText = stripTags(html);
    const wordCount = countWords(bodyText);

    // Outgoing internal links
    const outLinks = extractInternalLinks(html);
    outLinks.forEach((target) => {
      if (inLinksCount[target] !== undefined) {
        inLinksCount[target]++;
      }
    });

    // GPTBot test
    const gptRes = await request(route, {
      headers: {
        "User-Agent": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
      },
    });
    const gptHtml = gptRes.body;
    const gptHasH1 = /<h1\b[^>]*>/i.test(gptHtml);
    const gptHasH2 = /<h2\b[^>]*>/i.test(gptHtml);

    routeResults[route] = {
      status: res.statusCode,
      title,
      rawTitle,
      titleLength: title.length,
      rawTitleLength: rawTitle.length,
      meta,
      metaLength: meta.length,
      h1Count,
      h1Text,
      canonical,
      robots,
      jsonLdTypes,
      wordCount,
      outLinksCount: outLinks.length,
      gptBotOk: gptHasH1 && gptHasH2,
    };
  }

  // Assign inLinks
  allRoutes.forEach((r) => {
    routeResults[r].inLinksCount = inLinksCount[r];
  });

  // Check for any violations
  const issues = [];
  for (const [route, data] of Object.entries(routeResults)) {
    if (data.status !== 200) issues.push(`[${route}] Status is ${data.status}`);
    if (data.titleLength > 60) issues.push(`[${route}] Title > 60 chars (${data.titleLength}): "${data.title}"`);
    if (data.metaLength > 155) issues.push(`[${route}] Meta description > 155 chars (${data.metaLength})`);
    if (data.h1Count !== 1) issues.push(`[${route}] H1 count is ${data.h1Count} (must be exactly 1)`);
    if (!data.canonical.startsWith("https://webixsolutions.com")) issues.push(`[${route}] Invalid canonical: "${data.canonical}"`);
    if (!data.canonical.endsWith("/")) issues.push(`[${route}] Canonical missing trailing slash: "${data.canonical}"`);
    if (!data.gptBotOk) issues.push(`[${route}] GPTBot check failed (H1 or H2 missing in initial HTML)`);
  }

  // 3. Test Redirects & 410 Gone
  console.log("\n3. Testing 301 Redirects and 410 Gone rules...");
  const redirectTests = [
    { url: "/market/R98273", expected: 410, desc: "Market spam URL prefix" },
    { url: "/market", expected: 410, desc: "Market root" },
    { url: "/wp-admin/", expected: 410, desc: "WordPress admin prefix" },
    { url: "/wp-login.php", expected: 410, desc: "WordPress login PHP" },
    { url: "/xmlrpc.php", expected: 410, desc: "WordPress XML-RPC endpoint" },
    { url: "/ai-contextual-governance-solution/", expected: 410, desc: "Deprecated AI governance page" },
    { url: "/?p=123", expected: 410, desc: "WordPress ?p=* parameter" },
    { url: "/home/", expected: 301, location: "/", desc: "Legacy /home/ to /" },
    { url: "/blog/", expected: 301, location: "/blogs/", desc: "Legacy /blog/ to /blogs/" },
    { url: "/portfolio/", expected: 301, location: "/our-work/", desc: "Legacy /portfolio/ to /our-work/" },
    { url: "/work/", expected: 301, location: "/our-work/", desc: "Legacy /work/ to /our-work/" },
    { url: "/about/", expected: 301, location: "/about-us/", desc: "Legacy /about/ to /about-us/" },
    { url: "/contact/", expected: 301, location: "/contact-us/", desc: "Legacy /contact/ to /contact-us/" },
    { url: "/category/restaurant/", expected: 301, location: "/industries/", desc: "Restaurant category mapping" },
    { url: "/category/digital-marketing/", expected: 301, location: "/blogs/", desc: "Category prefix to /blogs/" },
    { url: "/tag/seo/", expected: 301, location: "/blogs/", desc: "Tag prefix to /blogs/" },
    { url: "/author/haroon/", expected: 301, location: "/blogs/", desc: "Author prefix to /blogs/" },
    { url: "/feed/", expected: 301, location: "/blogs/", desc: "RSS feed to /blogs/" },
    { url: "/ai-automation-agency-business-model/", expected: 301, location: "/ai-automation-services/", desc: "Agency model article redirect" },
    { url: "/about-us", expected: 301, location: "/about-us/", desc: "Trailing slash enforcement" },
  ];

  const redirectResults = [];
  for (const t of redirectTests) {
    const res = await request(t.url);
    const pass = res.statusCode === t.expected && (!t.location || (res.headers.location && res.headers.location.endsWith(t.location)));
    redirectResults.push({
      ...t,
      actualStatus: res.statusCode,
      actualLocation: res.headers.location || null,
      pass,
    });
    if (!pass) {
      issues.push(`[Redirect ${t.url}] Expected ${t.expected} (loc: ${t.location}), got ${res.statusCode} (loc: ${res.headers.location})`);
    }
  }

  // 4. Test Staging X-Robots-Tag vs Production
  console.log("\n4. Testing Host-based X-Robots-Tag...");
  const stagingRes = await request("/", { headers: { Host: "staging.webixsolutions.com" } });
  const stagingTag = stagingRes.headers["x-robots-tag"] || "";
  const stagingPass = stagingTag.includes("noindex");

  const prodRes = await request("/", { headers: { Host: "webixsolutions.com" } });
  const prodTag = prodRes.headers["x-robots-tag"] || "";
  const prodPass = !prodTag.includes("noindex");

  console.log(`Staging host (staging.webixsolutions.com) X-Robots-Tag: "${stagingTag}" (Pass: ${stagingPass})`);
  console.log(`Production host (webixsolutions.com) X-Robots-Tag: "${prodTag || 'none'}" (Pass: ${prodPass})`);

  if (!stagingPass) issues.push("Staging host did not send X-Robots-Tag: noindex");
  if (!prodPass) issues.push("Production host sent X-Robots-Tag: noindex");

  // 5. Test llms.txt & llms-full.txt
  console.log("\n5. Checking llms.txt and llms-full.txt...");
  const llmsRes = await request("/llms.txt");
  const llmsFullRes = await request("/llms-full.txt");
  const llmsPass = llmsRes.statusCode === 200 && llmsRes.body.includes("Webix Solutions");
  const llmsFullPass = llmsFullRes.statusCode === 200 && llmsFullRes.body.includes("Published Services");

  console.log(`/llms.txt: Status ${llmsRes.statusCode}, Length ${llmsRes.body.length} chars (Pass: ${llmsPass})`);
  console.log(`/llms-full.txt: Status ${llmsFullRes.statusCode}, Length ${llmsFullRes.body.length} chars (Pass: ${llmsFullPass})`);

  if (!llmsPass) issues.push("/llms.txt failed verification");
  if (!llmsFullPass) issues.push("/llms-full.txt failed verification");

  console.log("\n=================================================");
  console.log(`AUDIT COMPLETE: ${issues.length} ISSUES FOUND`);
  console.log("=================================================");
  if (issues.length > 0) {
    issues.forEach((iss) => console.log(`  ❌ ${iss}`));
  } else {
    console.log("  ✅ ALL AUDIT CHECKS PASSED WITH 100% COMPLIANCE!");
  }

  // Save audit data to artifact for report generation
  const auditReport = {
    timestamp: new Date().toISOString(),
    totalRoutesAudited: allRoutes.length,
    issuesCount: issues.length,
    issues,
    routes: routeResults,
    redirects: redirectResults,
    stagingRobots: { stagingPass, stagingTag, prodPass, prodTag },
    llms: { llmsPass, llmsLen: llmsRes.body.length, llmsFullPass, llmsFullLen: llmsFullRes.body.length },
  };

  fs.writeFileSync(path.join(ARTIFACT_DIR, "full-site-audit.json"), JSON.stringify(auditReport, null, 2), "utf-8");
  console.log(`\nSaved structured audit report to ${path.join(ARTIFACT_DIR, "full-site-audit.json")}`);
}

runAudit().catch((err) => {
  console.error("Audit failed with error:", err);
  process.exit(1);
});
