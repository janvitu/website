# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- HTML (Go Templating via Hugo) - Hugo layout templates in `hugo/layouts/`
- TypeScript 5.8.x - Hugo vanilla TS in `hugo/assets/ts/`, SolidJS app in `app/`
- CSS - Static styles in `hugo/static/css/`, Tailwind compiled to `hugo/assets/css/tw.css`
- Markdown - Content files in `hugo/content/`

**Secondary:**
- TOML - Hugo site configuration in `hugo/config.toml`

## Runtime

**Environment:**
- Node.js v23.6.0 (no lockfile version requirement enforced; no `.nvmrc` or `.node-version`)

**Package Manager:**
- pnpm (lockfileVersion 9.0)
- Lockfile: `pnpm-lock.yaml` present and committed

## Frameworks

**Core:**
- Hugo v0.159.0+extended - Static site generator (SSG), builds from `hugo/` into `dist/`
- SolidJS 1.9.x - Reactive UI micro-app for cookie consent, compiled separately by Vite, mounted into Hugo pages

**Build/Dev:**
- Vite 6.3.x - Bundles the SolidJS cookie consent app (`app/`), outputs to `app/dist/`
- vite-plugin-solid 2.11.x - Enables JSX/TSX compilation for SolidJS in Vite
- Tailwind CSS 4.1.x - Utility CSS; input: `hugo/assets/css/tailwind.css`, output: `hugo/assets/css/tw.css`
- @tailwindcss/cli 4.1.x - CLI runner for Tailwind (separate from PostCSS pipeline)
- @tailwindcss/typography 0.5.x - Plugin for prose styling; configured in `tailwind.config.js`
- concurrently 9.1.x - Runs Tailwind watcher and Hugo server in parallel during dev
- PostCSS 8.5.x + postcss-cli 11.x - Available but Tailwind CSS 4 primarily uses its own pipeline
- prettier 3.5.x - Code formatting; plugins: `prettier-plugin-go-template`, `prettier-plugin-tailwindcss`

**Animation:**
- motion 12.16.x - Animation library (Motion One), used in `hugo/assets/ts/index.ts` for scroll indicator animations

**Validation:**
- zod 3.25.x - Schema validation; present in dependencies (used in cookie consent app)

**Netlify Functions:**
- @netlify/functions 4.1.4 - Serverless functions SDK; `netlify.toml` points `functions="functions/"` but no `functions/` directory exists in the repo (referenced via `.netlify/v1/functions/`)

## Key Dependencies

**Critical:**
- `solid-js` 1.9.x - The entire cookie consent UI (`app/`) is a SolidJS reactive application
- `motion` 12.16.x - Used for scroll indicator bounce animation in `hugo/assets/ts/index.ts`
- `zod` 3.25.x - Validation within cookie consent app

**Infrastructure:**
- `@netlify/functions` 4.1.4 - Netlify serverless function runtime adapter (no active functions authored yet)

## Configuration

**Build:**
- `vite.config.ts` - Vite config; root set to `app/`, target `esnext`, SolidJS plugin
- `tailwind.config.js` - Tailwind content globs: `./hugo/**/*.{html,md,svg,tsx,ts}`; typography plugin
- `tsconfig.json` - Strict TypeScript, `jsxImportSource: "solid-js"`, targets ESNext
- `tsconfig.node.json` - Node-specific TS config (build tooling)
- `hugo/config.toml` - Hugo site config: title, language (`en`), timezone (`Europe/Prague`), menus, minify output
- `netlify.toml` - Build command: `npm run build`, publish dir: `dist`, functions dir: `functions/`

**Environment:**
- No `.env` file present in repo; no environment variables required for local development
- No secrets infrastructure detected (no env var loading, no config referencing secrets)

## Build Outputs

- Hugo builds to `dist/` (configured in `hugo/config.toml` as `publishDir = "../dist"`)
- Vite SolidJS build to `app/dist/` (manually synced to Hugo assets - currently commented out in `vite.config.ts`)
- Tailwind compiles to `hugo/assets/css/tw.css` (fingerprinted by Hugo at build time)
- Hugo processes `hugo/assets/ts/index.ts` via `js.Build` into a fingerprinted JS bundle

## Platform Requirements

**Development:**
- Node.js (v23.6.0 used locally; no enforced minimum)
- Hugo v0.159.0+extended (required for `js.Build` and asset fingerprinting)
- pnpm for package management

**Production:**
- Netlify (static hosting + optional serverless functions)
- Build command: `npm run build` (runs Tailwind minification then Hugo build)

---

*Stack analysis: 2026-03-28*
