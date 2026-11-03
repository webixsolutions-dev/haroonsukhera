// Banned phrase audit (adapted from reference/webix/scripts/check-banned-phrases.js).
// Rule 04 list + "in-house" + price talk. Exit code 1 on any hit.
// Usage: node scripts/check-banned-phrases.js
const fs = require("fs");
const path = require("path");

const BANNED = [
  "unlock",
  "unleash",
  "elevate",
  "empower",
  "supercharge",
  "skyrocket",
  "game-changer",
  "game changer",
  "cutting-edge",
  "cutting edge",
  "state-of-the-art",
  "state of the art",
  "next level",
  "next-level",
  "in today's digital landscape",
  "fast-paced world",
  "one-stop shop",
  "one stop shop",
  "tailored solutions",
  "seamless",
  "synergy",
  "passionate",
  "results-driven",
  "best-in-class",
  "best in class",
  "world-class",
  "world class",
  "revolutionize",
  "revolutionise",
  "look no further",
  "dive in",
  "delve",
  "in-house",
  "in house",
  "starting from",
  "starting at",
  "per hour",
  "hourly rate",
  "pkr",
  "usd",
];

// Regex checks (word-boundary sensitive).
const PATTERNS = [
  { name: "leverage (verb)", re: /\bleverag(e|es|ed|ing)\b/i },
  { name: "journey", re: /\bjourney\b/i },
  { name: "whether you're X or Y", re: /whether you['’]re .{1,40} or /i },
  { name: "price/pricing/budget", re: /\b(price|prices|pricing|budget|budgets|rates?)\b/i },
  { name: "currency amount", re: /(\$\s?\d|€\s?\d|£\s?\d|\bRs\.?\s?\d)/ },
];

// Lines that legitimately contain a pattern (code identifiers, comments that state the rule).
const ALLOW_LINE = [
  /No budget or price field/i,
  /no prices/i,
  /never .*price/i,
  /budget field/i,
  /rate-?limit/i,
  /RATE_LIMIT/,
  /\bgenerate\b/i,
  /\bmoderate\b/i,
  /\baccurate\b/i,
  /frameRate|rateLimit|isRateLimited/,
  /\$\{/,
  /schema-dts/i,
];

const SCAN_DIRS = ["content", "app", "components", "lib", "public/llms.txt"];
const EXT = /\.(ts|tsx|md|mdx|txt|json)$/;

function walk(p, out) {
  if (!fs.existsSync(p)) return out;
  const st = fs.statSync(p);
  if (st.isFile()) {
    if (EXT.test(p)) out.push(p);
    return out;
  }
  for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
    if (["node_modules", ".next", "fonts"].includes(ent.name)) continue;
    walk(path.join(p, ent.name), out);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(d, []));
const hits = [];
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (ALLOW_LINE.some((re) => re.test(line))) return;
    const lower = line.toLowerCase();
    for (const p of BANNED) {
      const re = new RegExp(`(^|[^a-z])${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i");
      if (re.test(lower)) hits.push(`${f}:${i + 1}  "${p}"  →  ${line.trim().slice(0, 120)}`);
    }
    for (const { name, re } of PATTERNS) {
      if (re.test(line)) hits.push(`${f}:${i + 1}  ${name}  →  ${line.trim().slice(0, 120)}`);
    }
  });
}

console.log("BANNED PHRASE AUDIT — scanned", files.length, "files");
if (hits.length === 0) {
  console.log("  OK: zero hits");
} else {
  console.log(`  ${hits.length} hit(s):`);
  hits.forEach((h) => console.log("  ✗ " + h));
  process.exit(1);
}
