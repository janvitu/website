# Hugo → Astro Migration Design

**Date:** 2026-04-06
**Status:** Approved, pending implementation plan
**Branch:** `feat/astro-migration` (all work stays on this branch — no merging to `main` until the user has thoroughly examined the final output)

## Goal

Replace the current Hugo + separate Vite/Solid cookie-consent app with a single Astro project. Preserve all current URLs, visuals, and content. Wire up i18n routing so Czech can be revived later. Drop the cookie consent app entirely (will be rebuilt from scratch in the future if needed).

The migration must be **scalable** (easy to add pages, components, content) and **easy to manage** (one build, one config, type-safe content).

## Non-Goals

- No visual redesign. Pixel parity with current Hugo output is the bar.
- No refactor of `/how-i-ai` tab logic — port vanilla TS as-is, refactor later.
- No cleanup of unused/dead CSS — port verbatim, clean up post-migration.
- No Czech menu revival — content ported, routing reserved, but unlinked.
- No new features. This is a stack swap, not a product change.

## Target Stack

- **Astro 5** with `@astrojs/netlify` adapter
- `output: 'hybrid'` — static by default, server endpoints available when needed
- **Tailwind 4** (reuses existing `tailwind.config.js` with retargeted content globs)
- **TypeScript strict** (carry forward current `tsconfig.json` settings)
- **Astro Content Collections** for Markdown content
- **Astro i18n routing**: `defaultLocale: 'en'`, `locales: ['en', 'cs']`, `prefixDefaultLocale: false`
- **Node 23 / pnpm** (unchanged)
- **`trailingSlash: 'always'`** to match current Hugo URLs

## Project Structure (post-migration)

```
website/
├── src/
│   ├── pages/                  # routes (index.astro, about.astro, work/, how-i-ai/, ...)
│   ├── layouts/                # BaseLayout.astro, PageLayout.astro, HowIAiLayout.astro
│   ├── components/             # Nav.astro, Footer.astro, Hero.astro, Tabs.astro, ...
│   ├── content/
│   │   ├── config.ts           # zod collection schemas
│   │   ├── blog/
│   │   ├── work/
│   │   └── pages/              # privacy-policy, etc.
│   ├── i18n/                   # en.json, cs.json, getT.ts helper
│   ├── styles/                 # global.css (ported from hugo/assets/css/tailwind.css)
│   ├── scripts/                # ported from hugo/assets/ts/
│   └── assets/                 # images, fonts, svgs
├── public/                     # static passthrough (favicons, robots.txt)
├── astro.config.mjs
├── tailwind.config.js          # updated content globs to ./src/**
├── tsconfig.json               # extends astro/tsconfigs/strict
├── netlify.toml                # publish = "dist"
└── package.json
```

Deleted at cutover: `hugo/`, `app/`, `vite.config.ts`, `tsconfig.node.json`, all Hugo/Vite scripts in `package.json`.

## URL Preservation

Hugo currently emits:
- `/` (homepage)
- `/about/`
- `/work/`, `/work/<slug>/`
- `/blog/`, `/blog/<slug>/`
- `/contact/`
- `/how-i-ai/`
- `/privacy-policy/`

Astro file-based routing matches 1:1 via `src/pages/*.astro` and `[slug].astro` for collections. `trailingSlash: 'always'` enforces Hugo-equivalent URLs.

## i18n Strategy

- `astro.config.mjs` declares both locales but **only English routes are generated** during initial migration.
- Czech content files are ported into `src/content/` with locale frontmatter or filename suffix, but no `/cs/*` routes are emitted yet (gated behind a feature flag or simply not built).
- `src/i18n/getT.ts` helper: `getT(Astro.currentLocale)` returns a typed translator reading from `en.json` / `cs.json` (ported verbatim from `hugo/i18n/`).
- Templates use `{t('footer.scrolltotop')}` instead of Hugo's `{{ i18n }}`.
- When Czech is later revived: flip the flag, link from menu, done.

## Components & Islands

- All shared UI (Nav, Footer, Hero, Process, ArticlePreview, etc.) → `.astro` components (server-rendered, zero JS shipped).
- `/how-i-ai` tab switching: keep vanilla TS, ported as a `<script>` tag inside the page or layout (Astro bundles automatically).
- Scroll indicator (`motion` library) and glossary scripts: ported as `<script>` tags in the relevant layouts.
- **No client framework islands in v1** — cookie consent is dropped, nothing else needs reactivity.

## Content Collections

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    // ... audited from existing .md frontmatter
  }),
});

const work = defineCollection({ /* ... */ });
const pages = defineCollection({ /* ... */ });

export const collections = { blog, work, pages };
```

Exact schemas determined during implementation by reading existing `hugo/content/**/*.md` frontmatter.

## Styling

- Port `hugo/assets/css/tailwind.css` verbatim into `src/styles/global.css` (custom utilities `.base-grid`, `.link-strikethrough`, etc.).
- Port `hugo/static/css/*` verbatim.
- Carry over `tailwind.config.js`, only changing the `content` globs to point at `./src/**/*.{astro,html,md,mdx,ts,tsx}`.
- Carry over the typography plugin and any design tokens (`--color-accent`, `--color-sunset`).
- Tailwind 4 integration approach (`@astrojs/tailwind` integration vs Tailwind 4 Vite plugin) decided during implementation — Tailwind 4 documentation prefers the Vite plugin.

## Risk Mitigation

The user explicitly asked for a fresh project but with risk mitigation. Key invariants:

1. **Hugo stays buildable until the final cutover commit.** Both `hugo/` and `src/` coexist throughout the migration. `package.json` keeps `build:hugo` alongside new `build:astro`.
2. **Netlify keeps deploying Hugo until the final commit.** `netlify.toml` is the last thing flipped.
3. **Per-page parity checklist** committed as `docs/superpowers/migration-parity.md` — every Hugo page listed, ticked off only after visual diff against the new Astro version.
4. **Local diff workflow:** build both Hugo and Astro, serve from two ports, eyeball each route. Optional: a script that diffs rendered HTML for structural drift.
5. **Cutover is one PR** that:
   - Flips `netlify.toml` `publish` and `command`
   - Deletes `hugo/`, `app/`, `vite.config.ts`, `tsconfig.node.json`
   - Removes Hugo/Vite scripts from `package.json`
6. **Easy rollback:** the cutover is a single commit; `git revert` restores Hugo immediately.
7. **No merge to `main` without explicit user sign-off.** All migration work — including the cutover commit — lives on `feat/astro-migration`. The branch is only merged after the user has thoroughly examined the final output and approves.

## Migration Order (smallest blast radius first)

1. Scaffold Astro + Tailwind 4 + Netlify adapter; empty `BaseLayout` renders
2. Port global CSS, fonts, favicons → confirm typography matches Hugo
3. Port Nav + Footer + i18n helper
4. Port simple pages: `/`, `/about/`, `/contact/`, `/privacy-policy/`
5. Port `/work/` index + `[slug].astro` + `work` content collection
6. Port `/blog/` (same pattern as `/work/`)
7. Port `/how-i-ai/` (largest, most complex, ported last)
8. Final cutover PR (flip Netlify, delete Hugo + app)

Each step gets its own commit and ticks an entry in the parity checklist.

## Open Items Deferred to Implementation Plan

- Exact frontmatter schemas for each content collection (needs auditing existing `.md` files)
- Tailwind 4 integration choice (`@astrojs/tailwind` vs Vite plugin)
- Whether any Hugo shortcodes are used in Markdown content (and how to replace them — Astro components in MDX, or HTML)
- How `motion` library scroll-indicator script integrates with Astro's `<script>` bundling
- How to handle the `/how-i-ai` page's URL hash sync for tab linking (should still work as-is, ported verbatim)

## Success Criteria

- `pnpm build` produces a `dist/` indistinguishable from current Hugo output for every route
- Every page in the parity checklist is visually verified
- Netlify build succeeds on the cutover branch
- `hugo/`, `app/`, `vite.config.ts` no longer exist on `main` after merge
- A single `git revert` restores the previous Hugo setup if anything goes wrong post-deploy
