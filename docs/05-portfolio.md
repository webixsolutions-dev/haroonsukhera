# 05 — Portfolio

## Registry (`content/work.ts`)
```ts
export type WorkFilter = "coded" | "cms" | "stores" | "design" | "ai" | "partner";
export type WorkItem = {
  slug: string;
  title: string;              // site/brand name — or a generic label when the name can't be shown
  label: string;              // "Industry, Country — scope"
  summary: string;            // 2–4 lines for the detail panel (what was built, for whom, what's special)
  filters: WorkFilter[];
  stack: string[];            // e.g. ["Next.js", "Node.js", "PostgreSQL"]
  url?: string;
  showLink: boolean;          // false for partner work without permission, staging links, etc.
  partnerPermission?: boolean;// partner projects only: true = may show name + link
  image: string;              // composed mockup in /images/work/
  featured?: boolean;         // max 6 — home "Selected work"
  published: boolean;
};
```

## Pipeline for every project
1. `node scripts/shots.mjs <slug> <url>` → `shots/<slug>-desktop.png` (1440 wide) and `shots/<slug>-mobile.png` (390 wide).
2. `python3 scripts/compose_mockups.py --mockup assets/mockups/<scene>.png --shots <files left→right> --out public/images/work/<slug>.webp`
   - Coded platforms: `mock-trio` (tablet=desktop shot, laptop=desktop shot, phone=mobile shot) or `mock-desktop-phone`.
   - CMS sites: `mock-laptop-angle` or `mock-laptop-front`.
   - Stores: `mock-phone-pair` (two mobile shots: home + product page).
   - Design: `mock-poster-frame`, `mock-social-grid` (3 square designs). Video: `mock-reel-phone` (a still from the reel).
3. Add the entry to `content/work.ts`. Filters, counts, sitemap and llms.txt update automatically.
If a scene keeps a faint green tint on the floor after composing, use another scene for that project.

## Candidates

### Coded platforms (GitHub org `webixsolutions-dev`, deployed on Vercel team "Webix projects")
Live URLs: take each project's production domain from the Vercel dashboard (or the repo README). If only a `*.vercel.app` URL exists, set `showLink: false`.
| Repo / project | What it is |
|---|---|
| jooblie-platform (+ jooblie-admin, jooblie-mobile-app, jooblie-3d-landing) | Job platform: web app, admin panel, Flutter mobile app, 3D landing page — strongest full-stack showcase |
| laptop-souq-next (+ laptop-souq-backend) | E-commerce platform with separate back end (UAE) |
| zelvomart (+ zelvomart-backend) | E-commerce platform with back end (Pakistan) |
| miraj-builders | Construction company platform (Pakistan) |
| ccog-university-portal / university-portal-web | University portal |
| webix-crm | Agency CRM — **screenshots with demo data only** |
| data-record (frontend + backend) | Data management app |
| cospace-owner-web | Workspace/booking owner dashboard |
| camz-cleaning-next, swanson-kc-legal-solutions, resilient-minds, world-education-society, adult-mixer-calgary, orvanta-advisory, home-framing-ltd, true-north-telecom-ai, walshkon-consultant, jurisnexa | Custom-coded business websites (mostly Canada/US) |
| WebixSolutions | The Webix Solutions website |
Do NOT describe Zelvomart, LaptopSouq.ae or Miraj Builders as Haroon's own businesses — they are projects.

### WordPress & Shopify (Haroon's picks first)
beorganichealth.com · hciorlando.com · clubc.education · vivonow.com · then from: perceptiaai.com · sarah.greentree-nutrition.com · rabbitholemotel.com · goinspectly.com · savegrin.com · kingskoneicecream.com · digitalcraze.io · spobeauty.com · wellvibe.xyz · jaridatoday.com · techbrightnews.com

### Online stores
laptopamazon.com · kamboglo.oscillatorz.com · dashbuyy.com · beorganichealth.com · (coded) Zelvomart, LaptopSouq.ae

### Partner projects (delivered with a freelance partner) — `filters: ["partner", …]`, `partnerPermission: false` until Haroon confirms
sparkcharge.au · bondiscreens.com.au · 2life.com.au (landing page) · setinstonedidcot.co.uk (home page) · himmelsweg.de (mobile menu) · wohnungsaufloesung-bsr.com · tedelecuador.com
Without permission: no name, no link — label like "Solar company, Australia — WordPress website, delivered with a freelance partner".

### AI automation
LeadPilot and ReplyDesk — use `/images/ai-systems/ai-leadpilot.webp` and `ai-replydesk.webp` (no mockup), text from `docs/site-facts.md`.

### Design & video
`published: false` until Haroon's team sends the files (8–12 designs, 4–6 reels). Then compose on `mock-poster-frame`, `mock-social-grid`, `mock-reel-phone`.

### Never show
ayurvedahakim.in · nesper.staging360.de · urologie-rosenlechner.at · hsp.lovestoblog.com · any `*.hostingersite.com` temporary URL · Google Sheets links.

## Choosing the 6 featured projects
Phase 2 builds a private review page (`/dev/review/`, noindex, not in sitemap, removed before launch) showing every composed mockup with its label. Haroon picks 6. Suggested default until he picks: Jooblie platform · LaptopSouq.ae · Zelvomart · University portal · beorganichealth.com · LeadPilot.
