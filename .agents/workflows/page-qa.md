# Workflow — page QA (run after every page)

1. `npm run build`, `npm run lint`, `npx tsc --noEmit` → zero errors.
2. `node scripts/check-banned-phrases.js` → zero hits (also search for: in-house, price, $, PKR, "starting from").
3. Start the production build and run `curl -s -A "GPTBot" http://localhost:3000/<page>/` — confirm H1, every H2, body copy and FAQ answers are in the HTML.
4. Check title ≤ 60, meta ≤ 155, one H1, canonical, OG image, JSON-LD valid (paste into validator.schema.org).
5. Screenshots at 360, 390, 768, 1024, 1440 px. Review against `docs/03-design-system.md`:
   - no horizontal scroll at 360px; mobile hero = content height
   - neighbouring sections have different surfaces
   - glass only where allowed, text on glass readable
   - no generic-template look (same card grid everywhere, glow on everything)
6. Turn on reduced motion and reduced transparency in DevTools → page still looks right, 3D off, glass solid.
7. Lighthouse mobile: performance ≥ 90, accessibility ≥ 95, SEO 100.
8. Show Haroon the 390 and 1440 screenshots with a 3-line summary.
