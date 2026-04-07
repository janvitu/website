<!-- GSD:project-start source:PROJECT.md -->

## Project

**How I AI**

A new page on Jan's personal website at `/how-i-ai` - a living knowledge base about how he uses AI in his product management workflow. Dark-themed with a terminal window aesthetic, featuring tabbed sections for tools, setup, workflow, and tips. Designed to be continuously updated as his AI usage evolves.

**Core Value:** A single, well-organized place to share and maintain my evolving AI workflow - tools, setup, process, and learnings.

### Constraints

- **Tech stack**: Hugo templates + Tailwind CSS + vanilla TypeScript (match existing patterns)
- **Design**: Must use existing Gilroy font, accent color, and grid system
- **Dark theme**: Scoped to this page only - rest of site stays light
- **Performance**: No additional JS frameworks - use Hugo templates + vanilla TS for tab switching
- **Accessibility**: Keyboard navigation for tabs, proper ARIA roles
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- HTML (Go Templating via Hugo) - Hugo layout templates in `hugo/layouts/`
- TypeScript 5.8.x - Hugo vanilla TS in `hugo/assets/ts/`, SolidJS app in `app/`
- CSS - Static styles in `hugo/static/css/`, Tailwind compiled to `hugo/assets/css/tw.css`
- Markdown - Content files in `hugo/content/`
- TOML - Hugo site configuration in `hugo/config.toml`

## Runtime

- Node.js v23.6.0 (no lockfile version requirement enforced; no `.nvmrc` or `.node-version`)
- pnpm (lockfileVersion 9.0)
- Lockfile: `pnpm-lock.yaml` present and committed

## Frameworks

- Hugo v0.159.0+extended - Static site generator (SSG), builds from `hugo/` into `dist/`
- SolidJS 1.9.x - Reactive UI micro-app for cookie consent, compiled separately by Vite, mounted into Hugo pages
- Vite 6.3.x - Bundles the SolidJS cookie consent app (`app/`), outputs to `app/dist/`
- vite-plugin-solid 2.11.x - Enables JSX/TSX compilation for SolidJS in Vite
- Tailwind CSS 4.1.x - Utility CSS; input: `hugo/assets/css/tailwind.css`, output: `hugo/assets/css/tw.css`
- @tailwindcss/cli 4.1.x - CLI runner for Tailwind (separate from PostCSS pipeline)
- @tailwindcss/typography 0.5.x - Plugin for prose styling; configured in `tailwind.config.js`
- concurrently 9.1.x - Runs Tailwind watcher and Hugo server in parallel during dev
- PostCSS 8.5.x + postcss-cli 11.x - Available but Tailwind CSS 4 primarily uses its own pipeline
- prettier 3.5.x - Code formatting; plugins: `prettier-plugin-go-template`, `prettier-plugin-tailwindcss`
- motion 12.16.x - Animation library (Motion One), used in `hugo/assets/ts/index.ts` for scroll indicator animations
- zod 3.25.x - Schema validation; present in dependencies (used in cookie consent app)
- @netlify/functions 4.1.4 - Serverless functions SDK; `netlify.toml` points `functions="functions/"` but no `functions/` directory exists in the repo (referenced via `.netlify/v1/functions/`)

## Key Dependencies

- `solid-js` 1.9.x - The entire cookie consent UI (`app/`) is a SolidJS reactive application
- `motion` 12.16.x - Used for scroll indicator bounce animation in `hugo/assets/ts/index.ts`
- `zod` 3.25.x - Validation within cookie consent app
- `@netlify/functions` 4.1.4 - Netlify serverless function runtime adapter (no active functions authored yet)

## Configuration

- `vite.config.ts` - Vite config; root set to `app/`, target `esnext`, SolidJS plugin
- `tailwind.config.js` - Tailwind content globs: `./hugo/**/*.{html,md,svg,tsx,ts}`; typography plugin
- `tsconfig.json` - Strict TypeScript, `jsxImportSource: "solid-js"`, targets ESNext
- `tsconfig.node.json` - Node-specific TS config (build tooling)
- `hugo/config.toml` - Hugo site config: title, language (`en`), timezone (`Europe/Prague`), menus, minify output
- `netlify.toml` - Build command: `npm run build`, publish dir: `dist`, functions dir: `functions/`
- No `.env` file present in repo; no environment variables required for local development
- No secrets infrastructure detected (no env var loading, no config referencing secrets)

## Build Outputs

- Hugo builds to `dist/` (configured in `hugo/config.toml` as `publishDir = "../dist"`)
- Vite SolidJS build to `app/dist/` (manually synced to Hugo assets - currently commented out in `vite.config.ts`)
- Tailwind compiles to `hugo/assets/css/tw.css` (fingerprinted by Hugo at build time)
- Hugo processes `hugo/assets/ts/index.ts` via `js.Build` into a fingerprinted JS bundle

## Platform Requirements

- Node.js (v23.6.0 used locally; no enforced minimum)
- Hugo v0.159.0+extended (required for `js.Build` and asset fingerprinting)
- pnpm for package management
- Netlify (static hosting + optional serverless functions)
- Build command: `npm run build` (runs Tailwind minification then Hugo build)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- SolidJS components: PascalCase (e.g., `CookieBanner.tsx`, `CookieDialog.tsx`)
- Utility modules: PascalCase for the file name (e.g., `Cookies.ts`)
- Hugo partials: PascalCase directories, kebab-case for some files (e.g., `CookieConsent/`, `articlePreview.html`)
- TypeScript index barrel files: `index.ts` or `index.tsx` in component directories (e.g., `app/src/components/Buttons/index.ts`, `app/src/components/Switch/index.tsx`)
- Hugo layout directories: PascalCase for shared partials subdirs (`Sections/`, `CookieConsent/`), lowercase for page-specific dirs (`blog/`, `contact/`, `nav/`)
- camelCase for all function and variable names: `scrollToTop`, `copyContent`, `setCookie`, `getCookie`, `setConsentCookies`, `wrapWordsInSpans`
- Handler functions prefixed with `on` or `handle`: `onEnter`, `onLeave`, `handleToggle`
- camelCase throughout: `prefersReducedMotion`, `scrollIndicator`, `wordSpans`, `consetCookie`
- Boolean signals named as noun+state: `consentDialog`, `consetFilled` (note: typo in the codebase - `conset` instead of `consent`)
- PascalCase type aliases with `Type` suffix for context types: `consentType`, `consentContextType`
- PascalCase for component prop types with `Props` suffix: `ButtonProps`, `SlideProps`, `SlideRouter`, `CookieKindDetailProps`, `SwitchProps`
- Exported types use `export type`: `export type LangData`, `export type SwitchProps`
- All components are named exports (arrow functions), never default exports: `export const CookieBanner = ...`
- PascalCase component names matching their file names
- BEM-style modifier pattern with double dash for variants: `.link-strikethrough`, `.link-strikethrough--active`, `.text-strikethrough--interactive`
- Custom utility classes in `hugo/assets/css/tailwind.css` use kebab-case
- Tailwind utility classes used inline via `class=` (not `className=`)

## Code Style

- Tool: Prettier
- Config: `/.prettierrc` (root), `/hugo/.prettierrc` (Hugo templates)
- Tabs for indentation (`useTabs: true`), `tabWidth: 2`
- Double quotes for strings (`singleQuote: false`)
- Trailing commas everywhere (`trailingComma: "all"`)
- Hugo `.html` templates use `prettier-plugin-go-template` parser
- `strict: true` in `tsconfig.json`
- Target: `ESNext`, module resolution: `node`
- `isolatedModules: true`
- `noEmit: true` (Vite handles compilation)
- No ESLint - Prettier only

## Import Organization

- Root alias: `app/` maps to the `app/` directory (configured via `tsconfig.json` `paths: { "*": ["*"] }`)
- Example: `import { LangData } from "app/app"` in `app/src/components/Dialog/Slide.tsx`
- Used in `app/src/components/Buttons/index.ts` to re-export both button components
- Pattern: named re-exports only, no default exports

## Error Handling

- Context guard in custom hooks - throws `Error` if context is missing:
- Optional chaining for DOM queries: `scrollToTopButton?.addEventListener(...)`, `node.parentNode?.replaceChild(...)`
- Loose type suppression when integrating with browser globals: `// @ts-ignore` for `gtag()` in `app/src/utils/Cookies.ts`
- File-level `// @ts-nocheck` used in `app/src/context/cookieProvider.tsx` (avoid adding more of these)
- Some component props typed as `any` in `CookieBanner.tsx`, `CookieDialog.tsx`, `Consent`, `About`, `DialogButtons` - this is a known quality gap, not a pattern to follow

## Logging

- No `console.log` calls in production source
- Single `console.log` in a commented-out Vite plugin in `vite.config.ts`

## Comments

- Grouping CSS sections: `/* COMPONENTS */` comment blocks in `tailwind.css`
- Explaining non-obvious logic: `// Stop the animation once the indicator scrolls out of view` in `hugo/assets/ts/index.ts`
- Suppressing type errors: inline `// @ts-ignore` with implicit rationale
- Hugo template comments: `{{/* comment */}}` for Go template notes
- Not used - no JSDoc annotations anywhere in the source

## Function Design

## Module Design

- Named exports only - no default exports anywhere in `app/src/`
- Hugo TypeScript files (`hugo/assets/ts/`) use named exports for utilities, no exports for side-effect entry modules (`index.ts`, `glossary.ts`)
- Used only at `app/src/components/Buttons/index.ts`
- Keep barrel files to re-export only, no logic

## Hugo Template Conventions

- All user-facing strings use `{{ i18n "key" }}` with a `| default "fallback"` for safety
- Translation keys in dot-notation: `"footer.scrolltotop"`, `"lang-switch.label"`
- Translation files: `hugo/i18n/en.json`, `hugo/i18n/cs.json`
- Partials called with context: `{{ partial "name.html" . }}`
- Sub-data passed as dict: `{{ partial "name.html" (dict "context" . "isFirst" true) }}`
- SVG icons rendered inline via partials: `{{ partial "svg/Logo.svg" }}`
- Custom `data-` attributes used for JS targeting: `data-glosary-toggle`, `data-glosary-title`, `data-glosary`
- IDs for unique elements: `id="cookie-banner"`, `id="scrolltotop"`, `id="scroll-indication"`
- `aria-label` on all navigation landmarks
- `aria-current="page"` on active nav links
- `aria-hidden="true"` on decorative SVGs
- `role="button"` + `tabindex="0"` added dynamically when interactive non-button elements are needed
- `focus-visible:outline` classes applied consistently to interactive elements
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern Overview

- Hugo static site generator handles all page rendering and routing
- SolidJS micro-app compiled separately handles the cookie consent UI island
- Tailwind CSS compiled as an asset pipeline step, consumed by Hugo
- TypeScript scripts compiled by Hugo's `js.Build` pipeline at build time
- No server-side logic; deployment to Netlify static hosting with optional Netlify Functions

## Layers

- Purpose: Source of truth for page content and metadata
- Location: `hugo/content/`
- Contains: Markdown (`.md`) and HTML content files, organized by section (blog, about, contact, work)
- Depends on: Nothing
- Used by: Hugo layout templates
- Purpose: HTML structure for all pages and partials
- Location: `hugo/layouts/`
- Contains: Go template `.html` files - base layout, page-type layouts, reusable partials, SVG icons, shortcodes
- Depends on: Content layer, i18n strings, site data, static assets
- Used by: Hugo build process to render final HTML
- Purpose: TypeScript interactivity scripts and CSS compiled at build time
- Location: `hugo/assets/ts/`, `hugo/assets/css/`
- Contains: TypeScript modules (`index.ts`, `glossary.ts`, `selector.ts`, `utils.ts`) compiled by Hugo `js.Build`; Tailwind CSS source (`tailwind.css`) compiled by Tailwind CLI
- Depends on: `motion` library (imported from node_modules)
- Used by: Layout templates via Hugo asset pipeline with fingerprinting
- Purpose: Cookie consent banner and settings dialog as a reactive SolidJS application
- Location: `app/`
- Contains: SolidJS components, context provider, data, and cookie utilities
- Depends on: `solid-js`, `motion`, `zod` (installed via pnpm)
- Used by: Built separately via Vite; output JS file is manually copied to `hugo/assets/js/CookieBanner/` and then served via Hugo
- Purpose: All UI strings for Hugo templates
- Location: `hugo/i18n/`
- Contains: `en.json`, `cs.json`
- Depends on: Nothing
- Used by: Layout templates via `{{ i18n "key" }}`
- Purpose: Structured data referenced by templates
- Location: `hugo/data/`
- Contains: `process.json` (Czech), `process.en.json` (English) - process step cards used on homepage
- Depends on: Nothing
- Used by: `hugo/layouts/partials/process.html`

## Data Flow

- SolidJS `createContext` + `createSignal` in `app/src/context/cookieProvider.tsx` manages cookie consent state across the island
- Hugo pages carry no client-side shared state; each page is stateless after render

## Key Abstractions

- Purpose: Reusable template fragments injected into layouts
- Examples: `hugo/layouts/partials/header.html`, `hugo/layouts/partials/footer.html`, `hugo/layouts/partials/head.html`, `hugo/layouts/partials/process.html`
- Pattern: `{{ partial "name.html" . }}` - always pass the current page context (`.`)
- Purpose: Inline SVG icons embedded via partial system for easy theming
- Examples: `hugo/layouts/partials/svg/Logo.svg`, `hugo/layouts/partials/svg/ArrowRight.svg`
- Pattern: `{{ partial "svg/Name.svg" }}` - no context needed
- Purpose: 12-column CSS grid applied via `.base-grid` utility class, used throughout page layouts
- Examples: All major layouts use `class="base-grid"` or `class="grid grid-cols-12"`
- Pattern: Content columns declared explicitly, e.g. `col-start-3 col-end-12`
- Purpose: Shared reactive state for cookie consent across the island
- Examples: `app/src/context/cookieProvider.tsx` - `CookieProvider`, `useCookieContext`
- Pattern: Wrap in `<CookieProvider>` at root, consume via `useCookieContext()` hook in any child
- Purpose: All display text in Hugo templates
- Examples: `hugo/i18n/en.json`, `hugo/i18n/cs.json`
- Pattern: `{{ i18n "key" }}` in templates; `{{ i18n "nested.key" }}` for nested keys

## Entry Points

- Location: `hugo/config.toml`
- Triggers: `npm run build:hugo` (or `dev:hugo`)
- Responsibilities: Defines site title, languages, menus, publish dir (`../dist`), and minification
- Location: `app/index.tsx`
- Triggers: `npm run build:solid` via Vite; runtime mount on `DOMContentLoaded`
- Responsibilities: Renders `<App>` wrapped in `<CookieProvider>` into `#cookie-consent` DOM node
- Location: `hugo/assets/css/tailwind.css`
- Triggers: `npm run build:tailwind` or `dev:tailwind`
- Responsibilities: Defines design tokens (`--color-accent`, `--color-sunset`), custom component classes (`.base-grid`, `.link-strikethrough`, `.center--horizontal-vertical`), and typography overrides
- Location: `hugo/assets/ts/index.ts`
- Triggers: Hugo `js.Build` during build; `defer` script load at runtime
- Responsibilities: Scroll-to-top button wiring, scroll indicator animation using `motion`

## Error Handling

- SolidJS context: `useCookieContext` throws `Error` if consumed outside `CookieProvider`
- Cookie parsing: `getCookie` returns `undefined` on miss; `App` defaults to `{ analytics_storage: false, ad_storage: false }`
- Hugo build: Template errors surface as build-time failures stopping deployment

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.

<!-- GSD:profile-end -->
