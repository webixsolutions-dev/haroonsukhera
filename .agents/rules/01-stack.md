# Rule 01 — Stack, structure, working style (always on)

## Stack (do not change without asking)
- Next.js App Router (same major version as `reference/webix/package.json`), TypeScript strict, React Server Components by default.
- Tailwind CSS v4 with design tokens as CSS variables in `app/globals.css`.
- `motion` for component animation, `lenis` for desktop smooth scroll only, `embla-carousel-react` for carousels, `lucide-react` icons.
- 3D: `three`, `@react-three/fiber`, `@react-three/drei` — loaded lazily, desktop only (see design system). Nothing else heavy.
- Content lives in TypeScript files under `content/` (no CMS, no database). Content change = edit file + redeploy.
- Fonts self-hosted with `next/font/local`: Cabinet Grotesk (500, 800) + Satoshi (400, 500) from fontshare.com (free licence). Instrument Serif italic via `next/font/google`.
- Forms: route handler + zod + Cloudflare Turnstile. Booking: adapt `reference/webix/lib/booking/*` + `components/booking/*` + `app/api/booking/*`.
- Hosting: Cloudflare Workers free plan via `@opennextjs/cloudflare` (copy `reference/webix/open-next.config.ts` and `wrangler.jsonc`, rename the worker to `haroonsukhera`). Free plans only.

## Folder structure
```
app/
  layout.tsx                 fonts, metadata base, JSON-LD @graph, header, footer, mobile bar
  page.tsx                   home
  about/page.tsx  services/page.tsx  work/page.tsx  contact/page.tsx  privacy/page.tsx
  api/contact/route.ts  api/booking/*
  robots.ts  sitemap.ts  not-found.tsx  llms.txt/route.ts (or public/llms.txt)
components/                  one component per file
  glass/  three/  home/  work/  services/  contact/  layout/  ui/
content/
  facts.ts                   mirror of docs/site-facts.md
  copy/*.ts                  page copy from docs/02-copy.md
  work.ts                    portfolio registry (docs/05-portfolio.md)
  services.ts  faq.ts  navigation.ts
lib/  schema.ts  utils.ts  booking/*
public/images/...            already provided — do not regenerate
assets/mockups/ assets/photos-original/   source files, not served
scripts/  compose_mockups.py  shots.mjs  + QA scripts from reference/webix/scripts
```
- Pages read text from `content/` — no hard-coded copy in components (UI labels excepted).
- Nav, footer, sitemap, Work filters and Services samples are generated from the registries.
- A registry item with `published: false` never renders and never appears in the sitemap.

## Routing
- `trailingSlash: true`. Canonical host `https://haroonsukhera.com`.
- Non-production hosts send `X-Robots-Tag: noindex` (adapt `reference/webix/middleware.ts`; drop the Webix 410/redirect rules).

## Working style
- Small, reviewable steps. After each page/component: `build` + `lint` + typecheck, then screenshots at 390, 768, 1440 px, review, fix, then show Haroon.
- Ask before adding any dependency not listed here (say why + gzipped size).
- Never commit secrets. `.env.example` lists every variable.
- Anything marked `[CONFIRM]` in the docs is built behind a flag (hidden in production) and listed in `docs/OPEN-QUESTIONS.md`.

## Definition of done (every page)
1. Zero TypeScript/lint errors.
2. `curl -s -A "GPTBot" <url>` contains the H1, all H2s, body text and FAQ answers.
3. Title ≤ 60 chars, meta description ≤ 155, one H1, absolute canonical, valid JSON-LD.
4. No horizontal scroll at 360px; keyboard focus visible; reduced-motion and reduced-transparency respected.
5. Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility, 100 SEO.
