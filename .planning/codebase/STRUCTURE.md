# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
website/                          # Repository root
├── hugo/                         # Hugo site source
│   ├── assets/                   # Processed assets (compiled by Hugo/Tailwind CLI)
│   │   ├── css/                  # Tailwind source + compiled output
│   │   │   ├── tailwind.css      # Tailwind source with design tokens + custom classes
│   │   │   └── tw.css            # Compiled output (committed, consumed by Hugo)
│   │   ├── ts/                   # TypeScript scripts compiled by Hugo js.Build
│   │   │   ├── index.ts          # Main page script (scroll-to-top, scroll indicator)
│   │   │   ├── glossary.ts       # About page glossary hover/keyboard interaction
│   │   │   ├── selector.ts       # DOM selector helpers ($, $$)
│   │   │   └── utils.ts          # Utility functions (scrollToTop, copyContent)
│   │   └── jsconfig.json         # TypeScript path config for Hugo assets
│   ├── content/                  # Page content (Markdown + HTML)
│   │   ├── _index.en.html        # Homepage content (English)
│   │   ├── _index.cs.html        # Homepage content (Czech)
│   │   ├── about/                # About section
│   │   ├── blog/                 # Blog posts
│   │   ├── contact/              # Contact page
│   │   ├── work/                 # Work/portfolio section
│   │   ├── privacy-policy.en.md  # Privacy policy (English)
│   │   └── privacy-policy.cs.md  # Privacy policy (Czech)
│   ├── data/                     # Structured JSON data for templates
│   │   ├── process.json          # Process steps (Czech)
│   │   └── process.en.json       # Process steps (English)
│   ├── i18n/                     # Translation strings for Hugo templates
│   │   ├── en.json               # English strings
│   │   └── cs.json               # Czech strings
│   ├── layouts/                  # Hugo Go template layouts
│   │   ├── _default/             # Fallback layouts
│   │   │   ├── baseof.html       # Base HTML shell for all pages
│   │   │   ├── list.html         # Default list layout
│   │   │   └── single.html       # Default single layout
│   │   ├── about/                # About section layout
│   │   ├── blog/                 # Blog list + single layouts
│   │   ├── contact/              # Contact layout
│   │   ├── work/                 # Work list + single layouts
│   │   ├── partials/             # Reusable template fragments
│   │   │   ├── CookieConsent/    # Cookie banner and dialog mount points
│   │   │   ├── Sections/         # Full-page section partials
│   │   │   ├── blog/             # Blog-specific partials
│   │   │   ├── contact/          # Contact sidebar partial
│   │   │   ├── head/             # HTML head sub-partials
│   │   │   ├── nav/              # Navigation partials
│   │   │   └── svg/              # Inline SVG icon partials
│   │   ├── shortcodes/           # Hugo shortcodes for use in content
│   │   ├── index.html            # Homepage layout
│   │   └── 404.html              # 404 page layout
│   ├── static/                   # Static files served as-is
│   │   ├── css/                  # Non-Tailwind CSS (fonts, base styles)
│   │   ├── fonts/                # Web font files (Gilroy, Libre Baskerville)
│   │   └── logos/                # Logo assets
│   ├── resources/                # Hugo generated resource cache (committed)
│   └── config.toml               # Hugo site configuration
├── app/                          # SolidJS cookie consent island
│   ├── src/
│   │   ├── components/
│   │   │   ├── Buttons/          # ButtonFilled, ButtonOutlined + barrel index.ts
│   │   │   ├── Dialog/           # Dialog shell, slide router, slides
│   │   │   │   ├── Routes/       # Slide content components (about, consent, Detail/)
│   │   │   │   ├── DialogButtons.tsx
│   │   │   │   ├── Slide.tsx     # Slide content switcher (Switch/Match)
│   │   │   │   └── SlideRouter.tsx # Tab navigation for dialog slides
│   │   │   └── Switch/           # Toggle switch UI component
│   │   ├── context/
│   │   │   └── cookieProvider.tsx # SolidJS context + useCookieContext hook
│   │   ├── data/
│   │   │   └── consent.ts        # Bilingual cookie text content (cs + en)
│   │   ├── utils/
│   │   │   └── Cookies.ts        # setCookie, getCookie, setConsentCookies
│   │   ├── CookieBanner.tsx      # Banner component (shown before consent)
│   │   └── CookieDialog.tsx      # Dialog component (manage settings)
│   ├── app.tsx                   # Root App component + language detection
│   ├── index.tsx                 # SolidJS mount point (renders into #cookie-consent)
│   ├── index.html                # Dev-only HTML shell
│   └── dist/                     # Vite build output (not consumed by Hugo directly)
├── dist/                         # Hugo publish output (deployable site)
├── .planning/                    # GSD planning artifacts
│   └── codebase/                 # Codebase analysis documents
├── .netlify/                     # Netlify local state (not for editing)
├── node_modules/                 # pnpm dependencies
├── package.json                  # Scripts + dependency manifest
├── pnpm-lock.yaml                # Lockfile
├── tailwind.config.js            # Tailwind content paths + plugins
├── vite.config.ts                # Vite config for SolidJS island build
├── tsconfig.json                 # TypeScript config (root level)
├── tsconfig.node.json            # TypeScript config for Node tools
├── netlify.toml                  # Netlify build + dev commands
└── .prettierrc                   # Prettier formatting config
```

## Directory Purposes

**`hugo/content/`:**
- Purpose: All page content authored as Markdown or HTML fragments
- Contains: Content files with YAML/TOML frontmatter, named with locale suffix (`.en.md`, `.cs.html`)
- Key files: `hugo/content/_index.en.html` (homepage), `hugo/content/blog/` (posts)

**`hugo/layouts/`:**
- Purpose: All Hugo Go template files that produce the final HTML
- Contains: `_default/` fallbacks, per-section layouts, partials, shortcodes
- Key files: `hugo/layouts/_default/baseof.html` (base shell), `hugo/layouts/index.html` (homepage), `hugo/layouts/partials/head/imports.html` (CSS injection)

**`hugo/layouts/partials/svg/`:**
- Purpose: Inline SVG icons included via `{{ partial "svg/Name.svg" }}`
- Contains: `.svg` files treated as Hugo partials - no JS or CSS needed for icons
- Key files: `hugo/layouts/partials/svg/Logo.svg`, `hugo/layouts/partials/svg/ArrowRight.svg`

**`hugo/assets/ts/`:**
- Purpose: Page-level TypeScript compiled by Hugo's `js.Build` at build time with fingerprinting
- Contains: Small focused modules, not a framework application
- Key files: `hugo/assets/ts/index.ts` (global), `hugo/assets/ts/glossary.ts` (about page only)

**`hugo/assets/css/`:**
- Purpose: Tailwind source (edited) and compiled output (auto-generated, committed)
- Key files: `hugo/assets/css/tailwind.css` (edit this), `hugo/assets/css/tw.css` (never edit directly)

**`hugo/i18n/`:**
- Purpose: All UI label strings for Hugo templates
- Key files: `hugo/i18n/en.json`, `hugo/i18n/cs.json`

**`hugo/data/`:**
- Purpose: JSON data loaded in templates via `.Site.Data.keyname`
- Key files: `hugo/data/process.json` (Czech), `hugo/data/process.en.json` (English)

**`app/src/components/`:**
- Purpose: SolidJS UI components for the cookie consent island
- Contains: Buttons, Dialog slides, Switch toggle
- Pattern: PascalCase component directories with `index.tsx` or named files

**`app/src/context/`:**
- Purpose: SolidJS reactive state shared across the island
- Key files: `app/src/context/cookieProvider.tsx`

**`hugo/static/`:**
- Purpose: Files copied verbatim to `dist/` root; not processed by Hugo pipeline
- Contains: Web fonts, non-Tailwind CSS, logos

## Key File Locations

**Entry Points:**
- `hugo/config.toml`: Hugo site config, language settings, menus
- `app/index.tsx`: SolidJS island mount
- `app/app.tsx`: Root `App` component
- `hugo/assets/ts/index.ts`: Global page-level TypeScript

**Configuration:**
- `tailwind.config.js`: Tailwind content scan paths and plugins
- `hugo/assets/css/tailwind.css`: Design tokens and custom component classes
- `vite.config.ts`: Vite build for the SolidJS island
- `netlify.toml`: Build command and publish directory for deployment

**Core Logic:**
- `app/src/utils/Cookies.ts`: Cookie read/write and `gtag()` consent signalling
- `app/src/data/consent.ts`: All bilingual cookie UI text
- `app/src/context/cookieProvider.tsx`: Reactive consent state
- `hugo/assets/ts/glossary.ts`: About page interactive glossary with motion animation

**Layout Shell:**
- `hugo/layouts/_default/baseof.html`: Outer HTML, head, header, footer, main block, global TS script

## Naming Conventions

**Files:**
- Hugo content: `_index.en.html` / `index.en.md` (list vs single, locale suffix)
- Hugo layouts: `list.html` / `single.html` (Hugo convention)
- Hugo partials: PascalCase for component-like partials (`CookieBanner.html`), camelCase for utilities (`contactSide.html`, `contactFooter.html`)
- Hugo SVG partials: PascalCase matching icon name (`ArrowRight.svg`)
- SolidJS components: PascalCase (`CookieBanner.tsx`, `SlideRouter.tsx`)
- SolidJS utilities: PascalCase file, camelCase exports (`Cookies.ts` → `getCookie`, `setCookie`)
- TypeScript assets: camelCase (`index.ts`, `glossary.ts`, `selector.ts`, `utils.ts`)
- Data files: `process.json` (Czech default), `process.en.json` (English variant)

**Directories:**
- Hugo: lowercase (`layouts`, `content`, `partials`, `assets`)
- SolidJS components: PascalCase (`Buttons/`, `Dialog/`, `Switch/`)
- SolidJS data/context/utils: lowercase (`context/`, `data/`, `utils/`)

## Where to Add New Code

**New Hugo page section:**
- Content: `hugo/content/{section-name}/` with `_index.en.html` and/or `_index.cs.html`
- Layout: `hugo/layouts/{section-name}/list.html` (and `single.html` if needed)
- Menu entry: `hugo/config.toml` under `[languages.en.menu.main]`

**New Hugo partial:**
- Reusable section: `hugo/layouts/partials/Sections/{PartialName}.html`
- General: `hugo/layouts/partials/{partialName}.html`
- Use PascalCase for component-like partials, camelCase for utility partials

**New i18n string:**
- Add to both `hugo/i18n/en.json` and `hugo/i18n/cs.json`
- Reference in templates as `{{ i18n "your.key" }}`

**New TypeScript interaction (page-level):**
- Scoped to one page: create `hugo/assets/ts/{featureName}.ts`, compile with `{{ $js := resources.Get "ts/{featureName}.ts" | js.Build | fingerprint }}` inside the relevant layout
- Global: add to `hugo/assets/ts/index.ts`

**New SolidJS component:**
- Place in `app/src/components/{ComponentName}/index.tsx` or `app/src/components/{ComponentName}.tsx`
- Follow PascalCase directory naming
- Export from component file directly (no barrel unless grouping like `Buttons/index.ts`)

**New CSS utility or component class:**
- Add to `hugo/assets/css/tailwind.css` using `@apply` with Tailwind utilities
- Run `npm run dev:tailwind` to watch and recompile

**New data-driven section:**
- Create `hugo/data/{name}.json` (Czech default) and `hugo/data/{name}.en.json` (English)
- Access in templates via `.Site.Data.{name}`

**New SVG icon:**
- Add `hugo/layouts/partials/svg/{IconName}.svg` as an SVG partial
- Use in templates as `{{ partial "svg/{IconName}.svg" }}`

## Special Directories

**`dist/`:**
- Purpose: Final built site output, ready for deployment
- Generated: Yes (by Hugo build)
- Committed: Yes (appears to be committed based on git tree)

**`hugo/resources/_gen/`:**
- Purpose: Hugo's generated resource cache (processed images, assets)
- Generated: Yes (by Hugo)
- Committed: Yes (speeds up CI builds)

**`hugo/assets/css/tw.css`:**
- Purpose: Compiled Tailwind output
- Generated: Yes (by Tailwind CLI)
- Committed: Yes (Hugo asset pipeline reads it)

**`app/dist/`:**
- Purpose: Vite build output for the SolidJS island
- Generated: Yes (by `npm run build:solid`)
- Committed: Yes (Hugo needs the built JS at `dist/js/CookieBanner/`)

**`.planning/`:**
- Purpose: GSD planning artifacts and codebase analysis
- Generated: No
- Committed: No (`.planning` directory appears to be in use for planning)

**`node_modules/`:**
- Purpose: pnpm installed dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-03-28*
