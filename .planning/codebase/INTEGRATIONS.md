# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Analytics:**
- Google Tag Manager / gtag - Used for consent-based analytics tracking
  - Integration point: `app/src/utils/Cookies.ts` calls `gtag("consent", {...})` with `ad_storage` and `analytics_storage` grant/deny values
  - The `gtag` global is injected externally (expected to be loaded via a GTM script in the HTML, not bundled); called with `// @ts-ignore`
  - No GTM script tag found in Hugo layouts (likely loaded via Netlify or a manual HTML snippet not tracked in the repo)
  - Auth: None (client-side only)

## Data Storage

**Databases:**
- None detected

**File Storage:**
- Static assets served from `hugo/static/` (fonts, images, favicons, SVG logos)
- No cloud file storage (S3, Cloudinary, etc.)

**Caching:**
- Browser cookies only - consent state stored in `consent` cookie (180-day expiry, `SameSite=Strict`)
  - Set via `app/src/utils/Cookies.ts`
  - Cookie shape: `{ ad_storage: boolean, analytics_storage: boolean }`

## Authentication & Identity

**Auth Provider:**
- None - no user authentication system

## Cookie Consent & Privacy

**Cookie Consent UI:**
- Custom-built SolidJS micro-app in `app/`
- Manages `ad_storage` and `analytics_storage` consent signals
- Bridges to Google's `gtag` consent API via `app/src/utils/Cookies.ts`
- Consent banner and dialog rendered at `#cookie-consent` DOM mount point
- Cookie button trigger: `#cookie-f-button` DOM element (in Hugo layout)
- Cookie consent partials: `hugo/layouts/partials/CookieConsent/CookieBanner.html`, `hugo/layouts/partials/CookieConsent/CookieDialog.html`

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Bugsnag, etc.)

**Logs:**
- None - static site with no server-side logging

## CI/CD & Deployment

**Hosting:**
- Netlify
  - Config: `netlify.toml`
  - Publish directory: `dist/`
  - Dev target port: `1313` (Hugo dev server)
  - Functions directory configured as `functions/` (no functions authored yet)

**CI Pipeline:**
- Netlify CI (triggered on git push, runs `npm run build`)
- No GitHub Actions or other CI config detected

## Serverless Functions

**Status:** Configured but unused
- `netlify.toml` declares `functions="functions/"` for both dev and build
- `.netlify/v1/functions/` directory exists locally (Netlify CLI artifact, gitignored)
- No authored function files exist in the repository
- `@netlify/functions` 4.1.4 is installed as a dependency, ready for use

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected (contact form is email-link only: `jan@underliner.studio`)

## Fonts

**Self-hosted:**
- Gilroy font family served from `hugo/static/fonts/Gilroy/`
- Preloaded via `<link rel="preload">` in `hugo/layouts/partials/head/imports.html`
- No Google Fonts or other external font CDN

## Environment Configuration

**Required env vars:**
- None required for local development or production build
- No environment variables referenced in any source file

**Secrets location:**
- `.env` is gitignored but no `.env` file is present
- No secrets management system detected

---

*Integration audit: 2026-03-28*
