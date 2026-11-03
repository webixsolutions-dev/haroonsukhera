# 01 — Pages and layout

Five pages. Person first → company second → work third. Mobile first: every section fits a phone screen without feeling long.

| URL | Job | Main sections |
|---|---|---|
| `/` | Who Haroon is, what he does, proof, how to start | 8 sections below |
| `/about/` | The official biography — the page Google and AI assistants should quote | Story, now, how I work, education, Webix, official bio, profiles |
| `/services/` | What you can hire him for, with samples, each linking to the matching Webix page | 6 services + freelancers block + process + FAQ |
| `/work/` | All projects, one page, filter chips, detail panels | Filters, grid, partner projects, CTA |
| `/contact/` | Start: who are you? → adaptive form, WhatsApp, email, book a call | Doors, form, direct contacts, booking |
| `/privacy/` | Footer only | Plain privacy policy (forms, analytics after consent) |

## Global layout
- **Header:** left = "Orbit H" icon + "Haroon Sukhera" in Instrument Serif italic. Right (desktop) = About · Services · Work · Contact + pill button "Work with me". Transparent on the hero, becomes a liquid-glass pill after 80px scroll. Mobile: icon + name + menu button → sheet from the right, 80% width, glass, links + WhatsApp + email.
- **Mobile bottom bar (glass, phones only):** "WhatsApp me" · "Send a message".
- **Footer (Obsidian):** large signature "Haroon Sukhera", the short bio line, page links, profile icons (LinkedIn, Upwork, Facebook, Instagram, Threads, GitHub), "Founder & CEO of Webix Solutions →" link, email, WhatsApp, © year, Privacy.

---

## Home `/`

| # | Section | Surface | Layout | Images |
|---|---|---|---|---|
| 1 | **Hero** | Obsidian + 3D | Desktop: text + glass card left, Orbit H right (real-time 3D), cut-out photo overlapping the bottom-left of the glass card. Mobile: photo (studio version) on top, H1 + sub + buttons, chips; Orbit H render behind, low opacity. | `hero/hero-orbit-desktop.webp`, `hero/hero-orbit-mobile.webp`, `photos/haroon-hero-studio.webp`, `photos/haroon-hero-cutout.webp`, `hero/hero-glass-field.webp` |
| 2 | **Meet Haroon** | Bone | Photo left (at-work), 3-line intro right, 3 fact chips | `photos/haroon-at-work.webp` |
| 3 | **Webix Solutions** | Obsidian | One wide glass panel over the Webix render: what the company is, team, markets, button to webixsolutions.com. Webix red allowed here only. | `webix/webix-company.webp` |
| 4 | **The Core** | Graphite #17191E | The signature interaction. Desktop: Orbit H on the left rotates to a face per capability; right: glass panel with title, one line, 3 sample thumbnails, link "See this work" → `/work/?f=<filter>`. Mobile: 6 pill chips; tapping one swaps the panel (all 6 panels in HTML). | service images in `services/` as chip icons |
| 5 | **Selected work** | Bone | Embla carousel of 6 featured projects in mockups, label "Industry, Country — scope", button "See all work" | composed mockups from `public/images/work/` |
| 6 | **Work with me** | Obsidian | 3 glass doors (Business · Individual · Freelancer/agency) with image, 2 lines, button → `/contact/?type=…`. Below: 4-step process strip; the connecting line draws once on scroll. | `work-with-me/*.webp` |
| 7 | **FAQ** | Bone | Accordion, 8 questions, all answers in HTML, FAQPage schema | — |
| 8 | **Final call to action** | Molten light field | One line + "Send a message" + "WhatsApp me" | `misc/cta-light-field.webp` |

Testimonials: a section between 6 and 7 that renders only when ≥ 3 verified testimonials exist in `content/testimonials.ts` (empty at launch).

## About `/about/`
1. **Header block** (Bone): H1, 2-line answer, story photo (`photos/haroon-story.webp`) on the `misc/about-backdrop.webp` feel.
2. **The story** (Obsidian): 3 short paragraphs (copy doc).
3. **What I do now** (Bone): coded platforms + CMS + leading the team; 3 chips.
4. **How I work** (Graphite): 4 principles in glass cards.
5. **Education** (Bone): one line card.
6. **Webix Solutions** (Obsidian): same panel as home, shorter.
7. **Official bio** (Bone): short and medium versions, each with a "Copy" button (for journalists, event hosts, partners). Name, title, photo download (`photos/haroon-hero-studio.webp`).
8. **Find me online** (Obsidian): profile links list (sameAs).
9. CTA.

## Services `/services/`
1. **Header** (Obsidian): H1 + 2 lines + jump chips to each service.
2. **Six service blocks** alternating Bone / Graphite. Each: service image, H2, 2-sentence answer, "What you get" (3 short lines), 2–3 sample thumbnails pulled from `content/work.ts` by tag, link "Full details at Webix Solutions" (target from facts). Services: Full-stack development · Websites on WordPress and Shopify · Online stores · Design and video · Marketing (SEO, ads, social, Google Maps) · AI automation.
3. **For freelancers and agencies** (Molten-tinted glass on Obsidian): white-label promise + link to Webix white-label page + button "Partner with me".
4. **How a project runs** (Bone): same 4 steps as home.
5. **FAQ** (Obsidian): 5 service questions.
6. CTA.

## Work `/work/`
1. **Header** (Obsidian): H1 + 2 lines.
2. **Filter chips** (glass, sticky under header on scroll): All · Coded platforms · WordPress & Shopify · Online stores · Design & video · AI automation · Partner projects. URL param `?f=` (`coded`, `cms`, `stores`, `design`, `ai`, `partner`) preselects a filter so Haroon can share e.g. `haroonsukhera.com/work/?f=design`. Initial HTML shows all projects.
3. **Grid** (Bone): cards = mockup image, title (or generic label), "Industry, Country — scope", stack chips. Clicking opens a glass detail panel (dialog) with 3–5 lines, stack, "Visit site" (if `showLink`). Detail text is in the HTML for every project.
4. **Partner projects** note (Graphite): one line explaining they were delivered with freelance partners.
5. CTA.

## Contact `/contact/`
1. **Header** (Obsidian): H1 + 2 lines.
2. **Who are you?** 3 glass doors (preselected from `?type=business|individual|freelancer`).
3. **Form** (glass panel): fields change by type (see copy doc). Labels above inputs. Turnstile. Success state with `misc/success-tile.webp`.
4. **Direct** (Bone): WhatsApp, email, "Book a 20-minute call" (booking widget), profile links.
5. Small FAQ (3 questions).

## 404
Obsidian, `misc/not-found-pieces.webp`, one line, buttons Home / Work.
