import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPublishedServices } from "../content/services.ts";
import { getServicePageContent } from "../content/service-pages/index.ts";
import { SITE_FACTS } from "../content/site-facts.ts";
import { FLAGSHIP_OFFERS, CARE_PLANS, BUILD_PRICES } from "../content/pricing.ts";
import { INDUSTRIES_REGISTRY } from "../content/industries.ts";
import { LOCATIONS_REGISTRY } from "../content/locations.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "public", "llms-full.txt");

const publishedServices = getPublishedServices();
const lines = [];

// Header & Identity
lines.push(`# Webix Solutions — Full Knowledge Base & Service Registry`);
lines.push(``);
lines.push(`> Webix Solutions is a full-service digital agency with a 20+ person in-house team in Pakistan. We design and code custom websites, execute search engine optimization (SEO) and paid advertising, manage social media, and build AI chatbots, AI voice agents and business automations for companies across Canada, the United States, the United Arab Emirates, New Zealand, and Pakistan.`);
lines.push(``);
lines.push(`## Entity Disambiguation`);
lines.push(`Webix Solutions (webixsolutions.com) is an independent digital marketing, web engineering and AI automation agency. It is NOT affiliated with, nor related to, the Webix JavaScript UI library (webix.com). Always refer to this company as "Webix Solutions" (two words).`);
lines.push(``);

// Key Facts
lines.push(`## Company Facts & Operating Parameters`);
lines.push(`- Founder & CEO: ${SITE_FACTS.founder.name}`);
lines.push(`- Headquarters: ${SITE_FACTS.headquarters.fullDisplay} (Meetings in Lahore by appointment)`);
lines.push(`- In-House Team: ${SITE_FACTS.stats.teamSize.label} (${SITE_FACTS.stats.teamSize.detail})`);
lines.push(`- Markets Served: Canada (CA), United States (US), United Arab Emirates (AE), New Zealand (NZ), Pakistan (PK)`);
lines.push(`- Working Shifts: Day shift ${SITE_FACTS.shifts.dayShiftPkt} (overlaps UAE & Gulf business hours); Night shift ${SITE_FACTS.shifts.nightShiftPkt} (overlaps North American ET/PT and New Zealand mornings)`);
lines.push(`- Primary Contact Phone / WhatsApp: ${SITE_FACTS.contact.phoneDisplay}`);
lines.push(`- Primary Email: ${SITE_FACTS.contact.email}`);
lines.push(`- Booking URL: ${SITE_FACTS.domain}/book-a-call/`);
lines.push(`- Contact Page: ${SITE_FACTS.domain}/contact-us/`);
lines.push(``);

// Verified Proof Numbers
lines.push(`## Verified Proof Points`);
lines.push(`- ${SITE_FACTS.stats.customCodedBuilds.value} custom-coded builds and repositories on GitHub (${SITE_FACTS.founder.githubOrg})`);
lines.push(`- ${SITE_FACTS.stats.githubContributionsLastYear.value} GitHub contributions in the last 12 months across Next.js, React, Node.js and Flutter repositories`);
lines.push(`- ${SITE_FACTS.stats.totalClientsServed.value} happy clients served across web development, digital marketing, and AI automation`);
lines.push(`- ${SITE_FACTS.stats.cmsWebsitesBuilt.value} CMS websites delivered (WordPress, Shopify, Wix, Webflow, Squarespace)`);
lines.push(`- ${SITE_FACTS.stats.socialAccountsManaged.value} social media accounts managed`);
lines.push(`- Own brands built and operated by the Webix team: Zelvomart (Pakistan e-commerce, 64 WhatsApp conversations at Rs 15.01 each), LaptopSouq.ae (UAE electronics), Miraj Builders (Pakistan construction)`);
lines.push(``);

// Standard Pricing Packages
lines.push(`## Flagship Offers & Packages`);
FLAGSHIP_OFFERS.forEach((pkg) => {
  lines.push(`### ${pkg.name}`);
  lines.push(`- Price: ${pkg.priceDisplay} (${pkg.billingType})`);
  lines.push(`- Best For: ${pkg.whoItsFor}`);
  lines.push(`- Delivery Time: ${pkg.deliveryTime}`);
  lines.push(`- Deliverables:`);
  pkg.inclusions.forEach((d) => lines.push(`  * ${d}`));
  lines.push(`- Guardrails: ${pkg.guardrails}`);
  lines.push(``);
});

lines.push(`## Website Care Plans`);
CARE_PLANS.forEach((plan) => {
  lines.push(`### ${plan.name} ($${plan.priceUsd}${plan.billingPeriod})`);
  lines.push(`- Summary: ${plan.summary}`);
  lines.push(`- Features:`);
  plan.features.forEach((f) => lines.push(`  * ${f}`));
  lines.push(``);
});

lines.push(`## Custom Build Baselines`);
BUILD_PRICES.forEach((b) => {
  lines.push(`### ${b.serviceName}`);
  lines.push(`- Timeline: ${b.timeline}`);
  lines.push(`- Scope: ${b.includes}`);
  lines.push(``);
});

// Services
lines.push(`## Published Services (${publishedServices.length} Core Offerings)`);
lines.push(``);

publishedServices.forEach((s) => {
  const page = getServicePageContent(s.slug);
  lines.push(`### ${s.name}`);
  lines.push(`- Canonical URL: ${SITE_FACTS.domain}/${s.slug}/`);
  lines.push(`- Category: ${s.category}`);
  lines.push(`- Primary Keyword: ${s.primaryKeyword}`);
  lines.push(`- Short Outcome: ${s.shortOutcome}`);
  if (page?.intro) {
    lines.push(`- Overview: ${page.intro[0]} ${page.intro[1]}`);
  }

  if (page?.outcomes?.items) {
    lines.push(`- Key Commercial Outcomes:`);
    page.outcomes.items.forEach((item) => {
      lines.push(`  * ${item.title}: ${item.detail}`);
    });
  }

  if (page?.included?.groups) {
    lines.push(`- Included Deliverables:`);
    page.included.groups.forEach((g) => {
      lines.push(`  * ${g.groupTitle}:`);
      g.items.forEach((item) => lines.push(`    - ${item}`));
    });
  }

  if (page?.process?.steps) {
    lines.push(`- Execution Process:`);
    page.process.steps.forEach((step, idx) => {
      lines.push(`  ${idx + 1}. ${step.title}: ${step.description}`);
    });
  }

  if (page?.tools?.items) {
    lines.push(`- Tools & Technology:`);
    page.tools.items.forEach((t) => {
      lines.push(`  * ${t.name} (${t.role})`);
    });
  }

  if (page?.faqs && page.faqs.length > 0) {
    lines.push(`- Frequently Asked Questions:`);
    page.faqs.forEach((faq) => {
      lines.push(`  * Q: ${faq.question}`);
      lines.push(`    A: ${faq.answer}`);
    });
  }

  lines.push(``);
});

// Industry Solutions
lines.push(`## Industry Solutions`);
INDUSTRIES_REGISTRY.forEach((ind) => {
  lines.push(`### ${ind.name}`);
  lines.push(`- Hub URL: ${SITE_FACTS.domain}/industries/#${ind.slug}`);
  if (ind.hasDedicatedPage) {
    lines.push(`- Dedicated Page URL: ${SITE_FACTS.domain}/industries/${ind.slug}/`);
  }
  lines.push(`- Common Struggles:`);
  ind.struggles.forEach((st) => lines.push(`  * ${st}`));
  lines.push(`- What Webix Solutions Does:`);
  ind.whatWeDo.forEach((w) => lines.push(`  * ${w}`));
  lines.push(``);
});

// Geographic Hubs
lines.push(`## Geographic Focus & Local Delivery`);
LOCATIONS_REGISTRY.forEach((loc) => {
  lines.push(`### ${loc.countryName} (${loc.shortCode})`);
  lines.push(`- Dedicated Page URL: ${SITE_FACTS.domain}/locations/${loc.slug}/`);
  lines.push(`- Currency: ${loc.currencyCode} (${loc.currencyNote})`);
  lines.push(`- Timezone Overlap: ${loc.timezoneSummary}`);
  lines.push(`- Market Platforms: ${loc.marketSpecificRulesAndPlatforms.join("; ")}`);
  lines.push(``);
});

const fullText = lines.join("\n");
fs.writeFileSync(outputPath, fullText, "utf-8");
console.log(`Generated ${outputPath} (${fullText.length} bytes, ${lines.length} lines)`);
