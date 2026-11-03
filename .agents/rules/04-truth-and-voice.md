# Rule 04 — Truth and voice (always on)

## Truth
- Every fact, number, name, link and claim comes from `docs/site-facts.md`. If you need something that isn't there, write `[[CONFIRM: …]]` and add it to `docs/OPEN-QUESTIONS.md`. Never invent.
- No prices, rates, budgets or cost talk anywhere — not in copy, FAQ, form fields or schema.
- Testimonials render only entries with `verified: true` and `permission: true`, and the section only appears when there are 3 or more. Never write a testimonial yourself.
- Partner-delivered projects (built with a freelance partner) show a live link and site name only when `partnerPermission: true`; otherwise screenshot + generic label ("E-commerce site, Australia — delivered with a freelance partner").
- Zelvomart, LaptopSouq.ae and Miraj Builders appear only as projects. Do not say Haroon owns or runs them.
- Never write "in-house". Say "a 20+ person team".
- Webix CRM screenshots: demo data only.

## Voice
- First person ("I") for Haroon; "my team" for Webix delivery. Plain, confident, specific English, short sentences. Founder talking to a CEO, not an agency brochure.
- Answer first, then detail. Prefer facts to adjectives.
- Sentence case for headings and buttons. Buttons say exactly what happens: "Send a message", "WhatsApp me", "See the work", "Book a call".

## Banned words and phrases
unlock, unleash, elevate, empower, supercharge, skyrocket, game-changer, cutting-edge, state-of-the-art, next level, in today's digital landscape, fast-paced world, one-stop shop, tailored solutions, seamless, synergy, leverage (verb), passionate, results-driven, best-in-class, world-class, revolutionize, journey (for a sales process), "look no further", "whether you're X or Y", "dive in", "elevate your brand". Run `scripts/check-banned-phrases.js` (adapted from reference) before every review.
