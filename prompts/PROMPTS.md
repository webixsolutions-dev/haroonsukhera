# Antigravity prompts — paste one phase at a time

How to use:
- Start each phase in a **new conversation** in Antigravity (keeps context clean). The rules in `.agents/rules/` load automatically.
- Use **Planning** mode. Read the plan it gives you, then reply "Approved, build it" (or correct it).
- Don't move to the next phase until the screenshots look right to you.
- Model: use the strongest model Antigravity offers for Phase 0 and Phase 3 (hero + 3D). The default model is fine for the other phases.

---

## Phase 0 — Set up the project
```
Read AGENTS.md, every file in .agents/rules/, and every file in docs/.

Set up the project in this folder:
1. Create a Next.js App Router project with TypeScript strict and Tailwind CSS v4, using the same Next.js and React versions as reference/webix/package.json. Keep all existing folders (docs, public/images, assets, scripts, reference, prompts, .agents).
2. Add only the dependencies listed in .agents/rules/01-stack.md. Copy reference/webix/open-next.config.ts and wrangler.jsonc (rename the worker to "haroonsukhera"), and the build/deploy scripts from reference/webix/package.json.
3. Fonts: download Cabinet Grotesk (500, 800) and Satoshi (400, 500) WOFF2 from fontshare.com into public/fonts and load them with next/font/local; Instrument Serif italic via next/font/google.
4. Put the design tokens from docs/03-design-system.md in app/globals.css and map them in the Tailwind theme.
5. Create content/facts.ts from docs/site-facts.md and empty registries: content/work.ts (types from docs/05-portfolio.md), content/services.ts, content/faq.ts, content/testimonials.ts (empty array), content/navigation.ts.
6. Create .env.example (Turnstile keys, Google Calendar booking vars from reference/webix/docs/BOOKING-SETUP.md, GA4 + Clarity IDs, contact email destination).

Show me the file tree and the plan for Phase 1. Don't build pages yet.
```

---

## Phase 1 — Foundation: glass, header, footer, SEO plumbing
```
Phase 1. Read .agents/rules/*, docs/03-design-system.md, docs/04-seo-ai.md, docs/01-pages.md (Global layout), docs/06-images.md.

Build:
1. Glass components exactly per the Liquid Glass recipe: <Glass variant="default|text|on-light">, the pointer-follow highlight (desktop only), reduced-transparency fallback, and the optional refraction filter for desktop Chromium (feature-detected, off for text panels).
2. Primitives: <Section surface="obsidian|graphite|bone|molten">, <Container>, <Button variant="primary|glass|text">, <Chip>, <Kicker>.
3. Logo: app/icon.svg and a <Logo> component — "Orbit H" icon (two rounded vertical bars, Molten crossbar, thin circle, Molten dot top-right) + "Haroon Sukhera" in Instrument Serif italic. apple-icon.png 180×180 on Obsidian.
4. Header (transparent on hero → glass pill after 80px; mobile sheet from the right, 80% width, glass) and the glass mobile bottom bar (WhatsApp me · Send a message). Footer per docs/01-pages.md.
5. SEO plumbing: lib/schema.ts (adapt reference/webix/lib/schema.ts to the @graph in docs/04-seo-ai.md), a metadata helper using the titles/metas from docs/04-seo-ai.md, app/robots.ts, app/sitemap.ts from the registries, public/llms.txt generated from content/facts.ts (adapt reference/webix/scripts/generate-llms-full.mjs), middleware with X-Robots-Tag noindex on non-production hosts, not-found page with the copy from docs/02-copy.md.
6. Cookie consent (adapt reference/webix/components/analytics/*): GA4 and Microsoft Clarity load only after consent.

Make a /styleguide page (noindex) showing tokens, type scale, all surfaces next to each other, buttons, chips and every glass variant over hero/hero-glass-field.webp. Run the page-qa workflow on /styleguide and show me screenshots at 390 and 1440.
```

---

## Phase 2 — Portfolio pipeline
```
Phase 2. Read docs/05-portfolio.md, docs/site-facts.md, .agents/rules/04-truth-and-voice.md.

1. Install Playwright (dev) and the Python packages pillow, numpy, scipy. Test scripts/shots.mjs and scripts/compose_mockups.py on one site.
2. For every candidate in docs/05-portfolio.md (except "Never show"): find the live URL (for coded projects: the Vercel production domain or the repo README; if only *.vercel.app, showLink: false), take screenshots, compose the mockup with the scene suggested for its type, and add an entry to content/work.ts. Fill title, label ("Industry, Country — scope"), summary (2–4 plain lines, no adjectives you can't prove), filters and stack by reading the live site / repo. Mark anything you're unsure about with [[CONFIRM]].
3. Partner projects: partnerPermission false, showLink false, generic title.
4. Webix CRM: only demo-data screens — if you can't get them, leave it unpublished.
5. Build /dev/review/ (noindex, excluded from sitemap): every mockup with its label, filters and a checkbox UI so I can pick the 6 featured projects. List every [[CONFIRM]] at the top.

Show me /dev/review/ at 1440 and the list of anything you couldn't capture.
```

---

## Phase 3 — Home page + 3D "Orbit H"
```
Phase 3. Read .agents/rules/*, docs/01-pages.md (Home), docs/02-copy.md (HOME), docs/03-design-system.md (3D + glass), docs/06-images.md.

Build the home page exactly: 8 sections, surfaces as listed, copy word for word.
- Hero: desktop = glass card with H1/sub/buttons/chips over hero-glass-field, photo cut-out, and the real-time Orbit H (React Three Fiber, procedural geometry per the spec, lazy-loaded, poster first then cross-fade). Mobile = studio photo + text + Orbit H mobile render, no WebGL. One orchestrated load animation only.
- The Core: desktop Orbit H rotates to one of 6 angles per selected capability; glass panel shows title, line, 3 thumbnails from content/work.ts by filter, link to /work/?f=…. Mobile = 6 chips. All 6 panels in the HTML.
- Selected work: Embla carousel of the featured items.
- Work with me: 3 glass doors + 4-step process with a line that draws once on scroll.
- FAQ accordion (all answers in HTML) + FAQPage JSON-LD. Final CTA on cta-light-field.
- Testimonials section renders only if content/testimonials.ts has ≥ 3 verified items (it's empty now).
Respect reduced motion / reduced transparency. Run the page-qa workflow and show me screenshots at 390, 768, 1440, the GPTBot curl check and Lighthouse mobile scores.
```

---

## Phase 4 — About
```
Phase 4. Read docs/01-pages.md (About), docs/02-copy.md (ABOUT), docs/04-seo-ai.md.
Build /about/ with the sections listed, copy word for word, ProfilePage + BreadcrumbList JSON-LD. The official bio block has working "Copy bio" buttons and a "Download photo" link (photos/haroon-hero-studio.webp). Run page-qa and show me 390 and 1440.
```

---

## Phase 5 — Services
```
Phase 5. Read docs/01-pages.md (Services), docs/02-copy.md (SERVICES), docs/site-facts.md (Webix service links).
Build /services/: header with jump chips, 6 service blocks (image, answer, what you get, 2–3 samples pulled from content/work.ts by filter, links to the Webix pages from site-facts — open in a new tab), the freelancers and agencies block, process, FAQ. JSON-LD: ItemList of Service + FAQPage + BreadcrumbList. Run page-qa and show me 390 and 1440.
```

---

## Phase 6 — Work
```
Phase 6. Read docs/01-pages.md (Work), docs/02-copy.md (WORK), docs/05-portfolio.md.
Build /work/: filter chips (sticky glass on scroll) with ?f= preselect, grid of published items, detail panel (dialog) whose content is in the HTML for every project, partner note, CTA. CollectionPage + ItemList JSON-LD. Delete /dev/review/. Run page-qa and show me 390 and 1440, plus /work/?f=coded.
```

---

## Phase 7 — Contact, booking, privacy
```
Phase 7. Read docs/01-pages.md (Contact), docs/02-copy.md (CONTACT), reference/webix/app/api/contact/route.ts, reference/webix/lib/booking/*, reference/webix/components/booking/*, reference/webix/docs/BOOKING-SETUP.md.
Build /contact/: 3 doors (preselected from ?type=), adaptive form with the exact fields per type (no budget field), zod validation, Turnstile, success/error states, WhatsApp/email/booking block, small FAQ. Adapt the Webix booking engine for "Book a 20-minute call with Haroon". Build /privacy/ in plain English (form data, email delivery, analytics only after consent, contact email). Run page-qa and show me 390 and 1440, plus a successful test submission.
```

---

## Phase 8 — Final QA and launch (Cloudflare free plan)
```
Phase 8. Run page-qa on every page. Then:
1. Full-site audit (adapt reference/webix/scripts/audit-full-site.js and run-lighthouse-audits.js): broken links, missing alt text, duplicate titles, JSON-LD validity, GPTBot curl on all 5 pages.
2. Confirm no prices, "in-house", banned phrases, or ownership claims about Zelvomart/LaptopSouq.ae/Miraj Builders anywhere.
3. Deploy to Cloudflare Workers with @opennextjs/cloudflare (see reference/webix/docs/DEPLOY.md), connect haroonsukhera.com, force HTTPS, check www → apex redirect.
4. Give me the launch checklist from docs/04-seo-ai.md as a short to-do list.
```
