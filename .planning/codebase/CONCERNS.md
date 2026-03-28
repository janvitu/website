# Codebase Concerns

**Analysis Date:** 2026-03-28

## Tech Debt

**SolidJS cookie app is not integrated with Hugo build:**
- Issue: The Vite build step (`npm run build:solid`) produces `app/dist/assets/index-*.js`, but this file is never referenced in any Hugo layout template. The `syncToHugo` Vite plugin that would copy the built JS into `hugo/assets/js/CookieBanner/` is commented out in `vite.config.ts`. No Hugo template includes the built SolidJS bundle.
- Files: `vite.config.ts`, `hugo/layouts/_default/baseof.html`, `hugo/layouts/partials/CookieConsent/CookieBanner.html`
- Impact: The cookie consent UI (SolidJS app in `app/`) does not appear on the live site. The cookie banner mount point (`#cookie-consent`) is never rendered in any Hugo template. The `CookieBanner.html` partial renders only an empty `<div id="cookie-banner">` that nothing targets.
- Fix approach: Uncomment and fix the `syncToHugo` Vite plugin, include the resulting JS file via Hugo's resource pipeline in `baseof.html`, and render the `#cookie-consent` container in a layout.

**`CookieDialog.html` partial is dead code (old prototype):**
- Issue: `hugo/layouts/partials/CookieConsent/CookieDialog.html` is a standalone HTML prototype with hardcoded Czech-only strings, lorem ipsum placeholder text, and no JS interactivity. It is never included by any layout.
- Files: `hugo/layouts/partials/CookieConsent/CookieDialog.html`
- Impact: None at runtime, but causes confusion about which cookie dialog implementation is authoritative.
- Fix approach: Delete the file or rename it with a `_draft` prefix to make its status explicit.

**`work/list.html` is entirely commented out:**
- Issue: `hugo/layouts/work/list.html` contains the entire work listing implementation wrapped in Hugo block comments (`{{/* */}}`), rendering the `/work/` route an empty page.
- Files: `hugo/layouts/work/list.html`
- Impact: The work list page renders no content. Any navigation to `/work/` shows a blank page.
- Fix approach: Either uncomment and update the template to match the current design system, or remove the route from navigation while deciding on the Work section direction.

**`blog/list.html` is also entirely commented out:**
- Issue: `hugo/layouts/blog/list.html` is identical to the work list situation - all content is inside Hugo comments. The blog listing page renders empty.
- Files: `hugo/layouts/blog/list.html`
- Impact: `/blog/` renders no content. Blog category nav and article preview partials (`articlePreview.html`, `blogCategoryNav.html`) exist but are unreachable from the listing page.
- Fix approach: Same as work list - restore or formally retire the section.

**Two duplicate `process` data sources:**
- Issue: Process section data exists in both `hugo/data/process.json` (bilingual, used in production) and `hugo/data/process.en.json` (English only, appears to be an older or alternative file). The `process.html` partial reads from `process.json`. The `.en.json` file is unused but inconsistent.
- Files: `hugo/data/process.json`, `hugo/data/process.en.json`
- Impact: Confusion about the canonical data source; `process.en.json` content diverges slightly from `process.json` (different QA step description).
- Fix approach: Delete `hugo/data/process.en.json`.

**`package-lock.json` and `package.json` listed as npm dependencies:**
- Issue: `package.json` has two nonsensical entries in `dependencies`: `"package-lock.json": "^1.0.0"` and `"package.json": "^2.0.1"`. These are not real packages and appear to have been accidentally committed.
- Files: `package.json`
- Impact: `npm install` resolves these from npm registry (they happen to exist as real packages, which is a coincidence that could produce unexpected code). Bloats `node_modules`.
- Fix approach: Remove both entries from `dependencies`.

**`@ts-nocheck` disables all TypeScript checks in `cookieProvider.tsx`:**
- Issue: `app/src/context/cookieProvider.tsx` has `//@ts-nocheck` at line 1, suppressing all type errors in the file. Additionally, `app/app.tsx` uses `// @ts-ignore` on line 17 to suppress a type error when indexing `consentData` with the runtime `lang` string.
- Files: `app/src/context/cookieProvider.tsx`, `app/app.tsx`
- Impact: Type errors in the cookie context go undetected. The `@ts-ignore` in `app.tsx` masks the need for a proper type guard when accessing language data.
- Fix approach: Remove `@ts-nocheck` from `cookieProvider.tsx`, add proper types (the types are already defined in the file). In `app.tsx`, replace the `@ts-ignore` with a type-safe language lookup using the `consentData` keys.

**Widespread use of `any` types in SolidJS components:**
- Issue: Most component props are typed as `any`: `CookieDialog`, `CookieBanner`, `About`, `Consent`, `DialogButtons` all use `({ prop }: any)` destructuring.
- Files: `app/src/CookieDialog.tsx`, `app/src/CookieBanner.tsx`, `app/src/components/Dialog/Routes/about.tsx`, `app/src/components/Dialog/Routes/consent.tsx`, `app/src/components/Dialog/DialogButtons.tsx`
- Impact: Type safety is non-existent for the cookie consent UI components. Prop changes won't be caught at compile time.
- Fix approach: Define proper prop interfaces using the existing `LangData` type from `app/app.tsx`.

**`copyContent` utility is exported but never wired up:**
- Issue: `hugo/assets/ts/utils.ts` exports `copyContent` which uses `navigator.clipboard` to copy `innerHTML`, but this function is never imported or called anywhere in Hugo TypeScript. The contact page has a `#copyitem` element but its click event is never attached.
- Files: `hugo/assets/ts/utils.ts`, `hugo/content/contact/_index.en.html`, `hugo/content/contact/_index.cs.html`
- Impact: Clicking the email address on the contact page does nothing (the "click to copy" affordance is broken).
- Fix approach: Import `copyContent` in `index.ts` and wire it to `document.getElementById("copyitem")`.

**Netlify `[dev]` config has a typo:**
- Issue: `netlify.toml` has `comand = "npm run dev"` (missing the `m` in `command`) in the `[dev]` block.
- Files: `netlify.toml`
- Impact: `netlify dev` will not start the dev server correctly using the configured command.
- Fix approach: Correct `comand` to `command`.

**`tailwind.config.js` uses Tailwind v3 API with Tailwind v4:**
- Issue: The project uses Tailwind CSS v4 (configured via `@import "tailwindcss"` in `hugo/assets/css/tailwind.css`) but `tailwind.config.js` uses the v3 CommonJS `module.exports` format with `content`, `theme.extend`, and `plugins` keys. In Tailwind v4, configuration is done via CSS `@theme` and `@plugin` directives, not via a JS config file.
- Files: `tailwind.config.js`, `hugo/assets/css/tailwind.css`
- Impact: The `zIndex` extensions in `tailwind.config.js` and `content` paths may silently not apply depending on how the CLI resolves config. The `@tailwindcss/typography` plugin is declared in the JS config but the v4 plugin loading path differs.
- Fix approach: Migrate configuration fully to `hugo/assets/css/tailwind.css` using `@theme` for custom values and `@plugin "@tailwindcss/typography"` for the plugin.

**Czech language support is commented out everywhere:**
- Issue: `hugo/config.toml` has the entire `[languages.cs]` block commented out. Czech content files exist (`_index.cs.html`, `index.cs.md`) and Czech i18n strings are maintained in `hugo/i18n/cs.json`, but the site cannot serve any Czech routes because the language is disabled.
- Files: `hugo/config.toml`, `hugo/layouts/partials/nav/langSwitch.html`
- Impact: All Czech content is built but unreachable. The language switcher partial still contains logic for Czech links, creating dead UI. The `dist/cs/` output directory is likely generated from previous builds but the language is disabled in the current config.
- Fix approach: Either uncomment the Czech language config to re-enable it, or formally remove all Czech content files and delete the `dist/cs/` output to keep the codebase consistent.

## Known Bugs

**"click to copy" email on contact page is non-functional:**
- Symptoms: Clicking `jan@underliner.studio` on `/contact/` and `/cs/contact/` does nothing despite the "(click to copy)" hint text.
- Files: `hugo/content/contact/_index.en.html`, `hugo/content/contact/_index.cs.html`, `hugo/assets/ts/utils.ts`
- Trigger: Any user clicking the email address on the contact page.
- Workaround: Users must manually select and copy the email text.

**Cookie consent UI never appears on the site:**
- Symptoms: No cookie banner or consent dialog is shown to site visitors.
- Files: `app/index.tsx`, `vite.config.ts`, `hugo/layouts/_default/baseof.html`
- Trigger: Every page load.
- Workaround: None for end users.

## Security Considerations

**No Content Security Policy headers:**
- Risk: The site has no CSP headers configured. No `netlify.toml` `[[headers]]` block exists.
- Files: `netlify.toml`
- Current mitigation: None.
- Recommendations: Add a CSP header via Netlify headers config, at minimum restricting `script-src` to `self` and the trusted CDN for the Motion library.

**Cookie consent bypasses without GDPR mechanism:**
- Risk: Because the cookie consent UI is not actually active (see above), no consent is collected before any third-party scripts could run. If analytics or ad scripts are added, they would fire without consent.
- Files: `app/src/utils/Cookies.ts`, `hugo/layouts/_default/baseof.html`
- Current mitigation: There are currently no analytics or ad scripts in the Hugo templates, so no data is collected.
- Recommendations: Fix the SolidJS integration before adding any tracking scripts.

**`gtag` called via `// @ts-ignore` without null guard:**
- Risk: `app/src/utils/Cookies.ts` calls `gtag(...)` at line 41 with `// @ts-ignore`, assuming `gtag` is globally available. If `gtag` is not loaded (which is the current state - no Google Tag Manager script exists in the templates), this will throw a runtime `ReferenceError`.
- Files: `app/src/utils/Cookies.ts`
- Current mitigation: The `setConsentCookies` function is only reachable via the cookie dialog, which is itself not mounted. So this never executes.
- Recommendations: Add a `typeof gtag !== "undefined"` guard before calling it.

## Performance Bottlenecks

**All 20 Gilroy font weights loaded via `fonts.css`:**
- Problem: `hugo/static/css/fonts-styles/gilroy-font.css` likely declares all font weight variants as `@font-face` rules. Only Regular and Black are preloaded in `imports.html`, but if the CSS declares all 20 woff2 files, the browser may download unused weights.
- Files: `hugo/static/css/fonts-styles/gilroy-font.css`, `hugo/layouts/partials/head/imports.html`
- Cause: The full Gilroy family (20 woff2 files) is present in `hugo/static/fonts/Gilroy/`.
- Improvement path: Audit `fonts.css` to ensure only the actually-used weights (Regular, Bold, Black, SemiBold based on Tailwind usage) have `@font-face` declarations. Remove unused font weight files from `/static/fonts/Gilroy/`.

**`dist/index.html` contains a `livereload.js` script tag:**
- Problem: The committed `dist/index.html` was built from a development server run (`hugo server -D`), so it contains `<script src="/livereload.js?...">`. This suggests the `dist/` directory in the repo was generated during dev mode, not a production build.
- Files: `dist/index.html`
- Cause: `hugo server -D` was used instead of `hugo` (production build) when generating the committed dist output.
- Improvement path: Regenerate `dist/` with `npm run build` before commits, or add `dist/` to `.gitignore` and rely on the Netlify build step.

## Fragile Areas

**`glossary.ts` assumes non-null DOM elements:**
- Files: `hugo/assets/ts/glossary.ts`
- Why fragile: At lines 47-48, `glossaryContent.style.opacity` and `title.setAttribute(...)` are called without null checks after the querySelector calls. If the expected DOM structure (`[data-glosary-title]>span` and `[data-glosary]`) is not present, this throws a TypeError at runtime.
- Safe modification: Always add null guards (`if (!title || !glossaryContent) return`) after querySelector calls before accessing properties.
- Test coverage: No tests exist.

**SolidJS app mounts against `root!` with non-null assertion:**
- Files: `app/index.tsx`
- Why fragile: `render(() => ..., root!)` uses a TypeScript non-null assertion on `document.getElementById("cookie-consent")`. If the mount point does not exist in the HTML (which is the current state in production), `render` receives `null` and throws a runtime error silently in the browser.
- Safe modification: Add a guard: `if (!root) return;` before calling `render`.
- Test coverage: No tests exist.

**`process.html` uses `{{ partial (.icon) }}` for dynamic partial resolution:**
- Files: `hugo/layouts/partials/process.html`
- Why fragile: The `{{ partial (.icon) }}` call at line 20 uses the icon field value from the data JSON as a partial path directly. If a `data/process.json` entry has a typo in its `icon` field (e.g., `svg/Missing.svg` instead of a valid partial), Hugo will throw a build error.
- Safe modification: Use `{{ partial (printf "svg/%s" .icon) }}` with validation, or enforce the icon field as an enum.
- Test coverage: No tests.

## Missing Critical Features

**No contact form:**
- Problem: `hugo/i18n/en.json` and `hugo/i18n/cs.json` both contain full form field translations (`form.name`, `form.email`, `form.message`, etc.), and a Netlify functions directory exists (`.netlify/v1/functions/`), but no contact form exists in any layout or content file. The contact page only shows an email address.
- Blocks: Users cannot submit project inquiries through the site.

**No analytics implementation:**
- Problem: The cookie consent system implements gtag consent mode, but there is no Google Analytics or Tag Manager script in any Hugo layout. The consent infrastructure has no analytics to gate.
- Blocks: No visitor data is collected.

## Test Coverage Gaps

**No tests whatsoever:**
- What's not tested: Everything - cookie utility functions, SolidJS components, Hugo template rendering, TypeScript utilities.
- Files: Entire `app/src/`, `hugo/assets/ts/`
- Risk: Any regression in cookie handling, glossary animation, or UI components goes undetected.
- Priority: Medium - the site is small, but cookie consent logic (consent storage, gtag integration) is correctness-sensitive.

---

*Concerns audit: 2026-03-28*
