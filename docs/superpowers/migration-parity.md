# Astro Migration Parity Checklist

For each route, build both stacks (`pnpm build:hugo`, `pnpm build:astro`), serve them locally, and visually compare. Tick only after side-by-side verification.

## Routes
- [x] `/` (homepage)
- [x] `/about/`
- [x] `/contact/`
- [x] `/privacy-policy/`
- [x] `/how-i-ai/`
- [x] `/work/`
- [x] `/work/<each slug>/` — N/A: no individual work entries (static list page only)
- [x] `/blog/`
- [x] `/blog/<each slug>/`
- [x] `/404` page
- [ ] Favicons + meta tags
- [ ] Open Graph tags
- [ ] robots.txt / sitemap

## Cross-cutting
- [ ] Fonts load (Gilroy) and render identically
- [ ] Tailwind custom utilities (`.base-grid`, `.link-strikethrough`, `.center--horizontal-vertical`)
- [ ] Scroll-to-top button works
- [ ] Scroll indicator animation works
- [ ] Glossary tooltips work
- [x] How-I-AI tab switching works (incl. URL hash sync)
- [x] How-I-AI nav LED button visible on every page
- [ ] Lighthouse score parity (perf, a11y, SEO within 5 points)
