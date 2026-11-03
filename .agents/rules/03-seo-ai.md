# Rule 03 — SEO and AI-assistant visibility (always on)

Full spec: `docs/04-seo-ai.md`.

## Rendering — the most important rule
GPTBot, ClaudeBot and PerplexityBot do not run JavaScript. All meaningful text (H1–H3, body, FAQ answers, project descriptions, services, contact details, footer links) must be in the initial HTML.
- Pages are Server Components, statically generated.
- Tabs, accordions, carousels, the Core panel, Work filters and project detail panels render ALL content in the HTML and only toggle visibility.
- `"use client"` only on small interactive leaves. No content fetched in `useEffect`.

## Per page
- One H1. Titles/meta from `docs/04-seo-ai.md` exactly. Canonical `https://haroonsukhera.com/<slug>/`. OG image from `public/images/og/`.
- First two sentences under every H1/H2 answer the implied question.
- Alt text describes the image; decorative images `alt=""`.

## Structured data
Server-rendered JSON-LD `@graph` built with typed helpers in `lib/schema.ts` (adapt `reference/webix/lib/schema.ts`): Person `#person`, WebSite `#website`, Organization Webix Solutions (`https://webixsolutions.com/#organization`), plus page types from the spec. Only mark up what is visible and true. Never add Review/AggregateRating.

## Name consistency
Visible name is always "Haroon Sukhera". "M Haroon Rasheed" appears only as `alternateName` in schema. The company is always "Webix Solutions" (two words).

## Never
Hidden text, keyword stuffing, text addressed to AI systems, fake reviews, invented numbers, prices.
