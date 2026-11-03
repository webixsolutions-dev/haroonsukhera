# Rule 02 — Design "Liquid Glass + 3D" (always on)

Full spec: `docs/03-design-system.md`. Never break these:

- **Dark-first.** Base Obsidian `#0C0D10`; light sections use Bone `#F3F1EC`. Accent Molten `#FF5A1F`. Webix red `#ED1C24` appears ONLY in the Webix Solutions section and Webix links.
- **Neighbouring sections never share a background.**
- **Glass is the identity, but limited:** header pill, hero card, Core panel, "Work with me" doors, contact panel, mobile bottom bar, project detail panel. Max ~6 glass panels visible at once. Glass always sits on something with colour (3D render, light field) — never on a flat colour.
- **Text on glass must pass WCAG AA.** Use the tinted glass recipe for text-heavy panels. `prefers-reduced-transparency` → solid frosted panels.
- **Shapes:** 24px radius panels, pill buttons, 1px light hairlines. No cut corners (that's the Webix style).
- **Fonts:** Cabinet Grotesk (headings), Satoshi (text), Instrument Serif italic only for the "Haroon Sukhera" signature moments. No other fonts.
- **Type:** sentence case; H1 `clamp(2.5rem, 1.4rem + 4.6vw, 5.25rem)`; paragraphs ≤ 66ch; never colour one word of a headline; max 3 small kickers per page.
- **Motion:** one orchestrated load moment (hero). Allowed scroll moments: Core rotation, work carousel, process line draw. No fade-up on every section. Numbers final in HTML. Respect `prefers-reduced-motion`.
- **3D:** real-time only on desktop ≥1024px with a capable GPU and no reduced-motion; everywhere else the pre-rendered images in `public/images/hero/`. 3D is decorative (`aria-hidden`), never holds text.
- **Images:** use only files in `public/images/` (already provided). `next/image`, explicit sizes, hero `priority`, others lazy.
- **Self-review before showing anything:** does any section look like a generic AI template (same card grid everywhere, glow everywhere, caps eyebrow on every heading)? Is the page compact on a phone? Fix first.
