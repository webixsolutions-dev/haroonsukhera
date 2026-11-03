const fs = require("fs");
const path = require("path");

const BANNED_PHRASES = [
  "cutting-edge",
  "cutting edge",
  "game-changer",
  "game changer",
  "world-class",
  "world class",
  "innovative solution",
  "seamlessly",
  "synergy",
  "delve into",
  "testament to",
  "we delivers",
  "for for",
  "best in class",
  "unleash",
  "supercharge your",
];

const SCAN_DIRS = ["content", "app", "components"];

function scanDir(dir) {
  let issues = [];
  if (!fs.existsSync(dir)) return issues;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== "node_modules" && ent.name !== ".next") {
        issues = issues.concat(scanDir(full));
      }
    } else if (
      ent.name.endsWith(".ts") ||
      ent.name.endsWith(".tsx") ||
      ent.name.endsWith(".md") ||
      ent.name.endsWith(".mdx")
    ) {
      const text = fs.readFileSync(full, "utf-8").toLowerCase();
      BANNED_PHRASES.forEach((phrase) => {
        if (text.includes(phrase)) {
          issues.push({ file: full, phrase });
        }
      });
    }
  }
  return issues;
}

console.log("=================================================");
console.log("BANNED PHRASE & BUZZWORD AUDIT");
console.log("=================================================");

let allIssues = [];
SCAN_DIRS.forEach((d) => {
  allIssues = allIssues.concat(scanDir(d));
});

if (allIssues.length === 0) {
  console.log("  ✅ ZERO banned phrases found in content/, app/, or components/!");
} else {
  console.log(`Found ${allIssues.length} banned phrase instances:`);
  allIssues.forEach((iss) => {
    console.log(`  ❌ ${iss.file} -> contains "${iss.phrase}"`);
  });
}
