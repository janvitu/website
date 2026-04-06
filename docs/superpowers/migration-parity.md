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
- [x] Favicons + meta tags
- [x] Open Graph tags
- [ ] robots.txt / sitemap (robots.txt missing; sitemap not generated; note: @astrojs/sitemap not installed)

## Cross-cutting
- [ ] Fonts load (Gilroy) and render identically
- [ ] Tailwind custom utilities (`.base-grid`, `.link-strikethrough`, `.center--horizontal-vertical`)
- [ ] Scroll-to-top button works
- [ ] Scroll indicator animation works
- [ ] Glossary tooltips work
- [x] How-I-AI tab switching works (incl. URL hash sync)
- [x] How-I-AI nav LED button visible on every page
- [ ] Lighthouse score parity (perf, a11y, SEO within 5 points) ← PENDING HUMAN VERIFICATION

## Lighthouse Parity Scores

> **Status:** Pending human verification. Run Lighthouse manually on both builds after cutover.
>
> Instructions:
> 1. Run `pnpm preview:astro` (Astro on port 4321)
> 2. Run `python3 -m http.server 1313 -d dist/` (Hugo on port 1313)
> 3. Run Lighthouse in Chrome DevTools on each route listed below
> 4. Record scores and verify Astro is within 5 points of Hugo on perf, a11y, SEO

| Route | Hugo Perf | Hugo A11y | Hugo SEO | Astro Perf | Astro A11y | Astro SEO |
|-------|-----------|-----------|----------|------------|------------|-----------|
| `/` | - | - | - | - | - | - |
| `/about/` | - | - | - | - | - | - |
| `/contact/` | - | - | - | - | - | - |
| `/blog/` | - | - | - | - | - | - |
| `/how-i-ai/` | - | - | - | - | - | - |
