# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Hybrid static site with isolated interactive island

**Key Characteristics:**
- Hugo static site generator handles all page rendering and routing
- SolidJS micro-app compiled separately handles the cookie consent UI island
- Tailwind CSS compiled as an asset pipeline step, consumed by Hugo
- TypeScript scripts compiled by Hugo's `js.Build` pipeline at build time
- No server-side logic; deployment to Netlify static hosting with optional Netlify Functions

## Layers

**Content Layer:**
- Purpose: Source of truth for page content and metadata
- Location: `hugo/content/`
- Contains: Markdown (`.md`) and HTML content files, organized by section (blog, about, contact, work)
- Depends on: Nothing
- Used by: Hugo layout templates

**Layout/Template Layer:**
- Purpose: HTML structure for all pages and partials
- Location: `hugo/layouts/`
- Contains: Go template `.html` files - base layout, page-type layouts, reusable partials, SVG icons, shortcodes
- Depends on: Content layer, i18n strings, site data, static assets
- Used by: Hugo build process to render final HTML

**Asset Pipeline Layer:**
- Purpose: TypeScript interactivity scripts and CSS compiled at build time
- Location: `hugo/assets/ts/`, `hugo/assets/css/`
- Contains: TypeScript modules (`index.ts`, `glossary.ts`, `selector.ts`, `utils.ts`) compiled by Hugo `js.Build`; Tailwind CSS source (`tailwind.css`) compiled by Tailwind CLI
- Depends on: `motion` library (imported from node_modules)
- Used by: Layout templates via Hugo asset pipeline with fingerprinting

**Interactive Island Layer (Cookie Consent):**
- Purpose: Cookie consent banner and settings dialog as a reactive SolidJS application
- Location: `app/`
- Contains: SolidJS components, context provider, data, and cookie utilities
- Depends on: `solid-js`, `motion`, `zod` (installed via pnpm)
- Used by: Built separately via Vite; output JS file is manually copied to `hugo/assets/js/CookieBanner/` and then served via Hugo

**Internationalisation Layer:**
- Purpose: All UI strings for Hugo templates
- Location: `hugo/i18n/`
- Contains: `en.json`, `cs.json`
- Depends on: Nothing
- Used by: Layout templates via `{{ i18n "key" }}`

**Site Data Layer:**
- Purpose: Structured data referenced by templates
- Location: `hugo/data/`
- Contains: `process.json` (Czech), `process.en.json` (English) - process step cards used on homepage
- Depends on: Nothing
- Used by: `hugo/layouts/partials/process.html`

## Data Flow

**Page Rendering:**

1. Hugo reads content files from `hugo/content/`
2. Hugo selects layout from `hugo/layouts/` based on section and type
3. Layouts pull i18n strings, site data, and partial templates
4. Tailwind CSS (pre-compiled to `hugo/assets/css/tw.css`) is fingerprinted and injected via `hugo/layouts/partials/head/imports.html`
5. TypeScript assets in `hugo/assets/ts/` are compiled inline by Hugo `js.Build` and injected into specific page layouts
6. Hugo publishes rendered HTML to `dist/` (root-level)

**Cookie Consent Island Flow:**

1. `hugo/layouts/partials/CookieConsent/CookieBanner.html` renders `<div id="cookie-consent"></div>` mount point
2. Hugo injects the pre-built SolidJS bundle (from `dist/js/CookieBanner/`) as a script tag
3. On `DOMContentLoaded`, `app/index.tsx` mounts the `App` component into `#cookie-consent`
4. `App` reads `html[lang]` attribute to select language from `app/src/data/consent.ts`
5. `App` reads existing consent cookie via `app/src/utils/Cookies.ts`
6. User interaction updates `CookieContext` reactive state and writes consent cookie + calls `gtag()`

**TypeScript Script Execution:**
1. `hugo/assets/ts/index.ts` is compiled and fingerprinted by Hugo `js.Build`
2. Injected as a `defer` script in `_default/baseof.html`
3. Activates scroll-to-top button and scroll indicator animation on `DOMContentLoaded`
4. `glossary.ts` injected only on the about page (`about/list.html`) - handles hover/keyboard reveal of glossary terms with stagger animation

**State Management:**
- SolidJS `createContext` + `createSignal` in `app/src/context/cookieProvider.tsx` manages cookie consent state across the island
- Hugo pages carry no client-side shared state; each page is stateless after render

## Key Abstractions

**Hugo Partials:**
- Purpose: Reusable template fragments injected into layouts
- Examples: `hugo/layouts/partials/header.html`, `hugo/layouts/partials/footer.html`, `hugo/layouts/partials/head.html`, `hugo/layouts/partials/process.html`
- Pattern: `{{ partial "name.html" . }}` - always pass the current page context (`.`)

**SVG Partials:**
- Purpose: Inline SVG icons embedded via partial system for easy theming
- Examples: `hugo/layouts/partials/svg/Logo.svg`, `hugo/layouts/partials/svg/ArrowRight.svg`
- Pattern: `{{ partial "svg/Name.svg" }}` - no context needed

**Base Grid:**
- Purpose: 12-column CSS grid applied via `.base-grid` utility class, used throughout page layouts
- Examples: All major layouts use `class="base-grid"` or `class="grid grid-cols-12"`
- Pattern: Content columns declared explicitly, e.g. `col-start-3 col-end-12`

**SolidJS Cookie Context:**
- Purpose: Shared reactive state for cookie consent across the island
- Examples: `app/src/context/cookieProvider.tsx` - `CookieProvider`, `useCookieContext`
- Pattern: Wrap in `<CookieProvider>` at root, consume via `useCookieContext()` hook in any child

**i18n Strings:**
- Purpose: All display text in Hugo templates
- Examples: `hugo/i18n/en.json`, `hugo/i18n/cs.json`
- Pattern: `{{ i18n "key" }}` in templates; `{{ i18n "nested.key" }}` for nested keys

## Entry Points

**Hugo Build Entry:**
- Location: `hugo/config.toml`
- Triggers: `npm run build:hugo` (or `dev:hugo`)
- Responsibilities: Defines site title, languages, menus, publish dir (`../dist`), and minification

**SolidJS Island Entry:**
- Location: `app/index.tsx`
- Triggers: `npm run build:solid` via Vite; runtime mount on `DOMContentLoaded`
- Responsibilities: Renders `<App>` wrapped in `<CookieProvider>` into `#cookie-consent` DOM node

**Tailwind Entry:**
- Location: `hugo/assets/css/tailwind.css`
- Triggers: `npm run build:tailwind` or `dev:tailwind`
- Responsibilities: Defines design tokens (`--color-accent`, `--color-sunset`), custom component classes (`.base-grid`, `.link-strikethrough`, `.center--horizontal-vertical`), and typography overrides

**Page-Level TS Entry:**
- Location: `hugo/assets/ts/index.ts`
- Triggers: Hugo `js.Build` during build; `defer` script load at runtime
- Responsibilities: Scroll-to-top button wiring, scroll indicator animation using `motion`

## Error Handling

**Strategy:** No centralised error handling. Each layer fails independently.

**Patterns:**
- SolidJS context: `useCookieContext` throws `Error` if consumed outside `CookieProvider`
- Cookie parsing: `getCookie` returns `undefined` on miss; `App` defaults to `{ analytics_storage: false, ad_storage: false }`
- Hugo build: Template errors surface as build-time failures stopping deployment

## Cross-Cutting Concerns

**Logging:** No application logging. `console.log` used only in commented-out Vite plugin code.
**Validation:** Zod is installed as a dependency but not currently used in any source file.
**Authentication:** None. Public portfolio site with no user accounts.
**Accessibility:** `prefers-reduced-motion` checked in both `index.ts` and `glossary.ts`; animations disabled globally via CSS `@media (prefers-reduced-motion: reduce)`. Skip-to-content link in `baseof.html`. ARIA attributes set dynamically by `glossary.ts`.
**Internationalisation:** Hugo i18n for template strings; content files carry `.cs.` / `.en.` locale suffixes; Czech language (`cs`) is configured but commented out in menu; cookie consent island uses `html[lang]` attribute to select language.

---

*Architecture analysis: 2026-03-28*
