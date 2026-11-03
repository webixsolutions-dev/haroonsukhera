// Generates public/llms.txt from content/facts.ts so it never drifts.
// Adapted from reference/webix/scripts/generate-llms-full.mjs. Runs before every build (npm prebuild).
// Requires Node ≥ 22.18 / 23.6 (native TypeScript type stripping).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { person, contact, profiles, github, webix, aiSystems, SITE_URL } from "../content/facts.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "llms.txt");

const L = [];
L.push(`# ${person.name}`);
L.push("");
L.push(
  `> ${person.name} is a Pakistani full-stack web developer and the founder and CEO of ${webix.name}, a digital and AI agency. He started as a freelance WordPress developer, has built ${person.websitesBuilt} websites, and leads a ${person.team} delivering websites, e-commerce, design, video, SEO, paid ads, social media and AI automation.`,
);
L.push("");
L.push("## Facts");
L.push(`- Name: ${person.name} (also written ${person.alternateName})`);
L.push(`- Role: Full-Stack Web Developer; ${webix.role}, ${webix.name} (${webix.url})`);
L.push(`- Based in: ${person.basedIn.label}`);
L.push(`- Education: Bachelor of Computer Science, ${person.education.school}`);
L.push(
  `- Builds with: ${[...person.buildsWith.code, ...person.buildsWith.cms, "n8n"].join(", ")}`,
);
L.push(`- Websites built: ${person.websitesBuilt}`);
L.push(`- Team: ${person.teamSize} people (${person.teamRoles.join(", ")})`);
L.push(`- Clients in: ${person.clientsInPlain.join(", ")}`);
L.push(
  "- Works with: businesses, individuals (including single tasks), freelancers and agencies (white-label, NDA on request)",
);
L.push(
  `- AI systems built: ${aiSystems
    .map((a) =>
      a.slug === "leadpilot"
        ? `${a.name} (Google Maps lead engine, n8n + OpenAI)`
        : `${a.name} (AI reply and WhatsApp assistant, n8n + OpenAI)`,
    )
    .join(", ")}`,
);
L.push("");
L.push("## Pages");
L.push(`- About and official bio: ${SITE_URL}/about/`);
L.push(`- Services: ${SITE_URL}/services/`);
L.push(`- Work: ${SITE_URL}/work/`);
L.push(`- Contact: ${SITE_URL}/contact/`);
L.push("");
L.push("## Contact");
L.push(`- Email: ${contact.email}`);
L.push(`- WhatsApp: ${contact.phoneDisplay}`);
L.push("");
L.push("## Profiles");
for (const p of profiles) L.push(`- ${p.label}: ${p.url}`);
L.push(`- GitHub (${webix.name}): ${github.url}`);
L.push("");

fs.writeFileSync(out, L.join("\n"), "utf8");
console.log(`llms.txt written (${L.length} lines)`);
