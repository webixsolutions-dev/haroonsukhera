# AGENTS.md — haroonsukhera.com

This repository is the personal website of **Haroon Sukhera** — full-stack web developer and Founder & CEO of Webix Solutions.

Before any task:
1. Read every file in `.agents/rules/` (always on).
2. Read the files in `docs/` that the task touches. `docs/site-facts.md` is the ONLY source for facts, numbers, names and links. `docs/02-copy.md` is the approved copy — use it word for word unless told otherwise.
3. Make a short plan (files to create/change) and wait for approval before writing code.

Hard rules (short version):
- 5 pages only: `/`, `/about/`, `/services/`, `/work/`, `/contact/` (+ `/privacy/` in the footer, + 404). Never add pages without asking.
- Server-render every piece of meaningful text (AI crawlers don't run JavaScript).
- No prices, rates, budgets or "starting from" anywhere. No invented facts, reviews, clients or numbers.
- Never write "in-house". Never present Zelvomart, LaptopSouq.ae or Miraj Builders as Haroon's own businesses — they appear only as projects.
- Design = Liquid Glass + 3D per `docs/03-design-system.md`. Mobile first.
- `reference/webix/` holds working code from the Webix Solutions site (booking, contact API, schema helpers, consent banner, Cloudflare config, QA scripts). Reuse and adapt it — do not copy its design (red cut-corner style).
- Screenshots at 390 / 768 / 1440 px after every page, reviewed against the design system, before showing Haroon.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
