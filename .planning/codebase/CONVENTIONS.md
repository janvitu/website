# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

**Files:**
- SolidJS components: PascalCase (e.g., `CookieBanner.tsx`, `CookieDialog.tsx`)
- Utility modules: PascalCase for the file name (e.g., `Cookies.ts`)
- Hugo partials: PascalCase directories, kebab-case for some files (e.g., `CookieConsent/`, `articlePreview.html`)
- TypeScript index barrel files: `index.ts` or `index.tsx` in component directories (e.g., `app/src/components/Buttons/index.ts`, `app/src/components/Switch/index.tsx`)
- Hugo layout directories: PascalCase for shared partials subdirs (`Sections/`, `CookieConsent/`), lowercase for page-specific dirs (`blog/`, `contact/`, `nav/`)

**Functions:**
- camelCase for all function and variable names: `scrollToTop`, `copyContent`, `setCookie`, `getCookie`, `setConsentCookies`, `wrapWordsInSpans`
- Handler functions prefixed with `on` or `handle`: `onEnter`, `onLeave`, `handleToggle`

**Variables:**
- camelCase throughout: `prefersReducedMotion`, `scrollIndicator`, `wordSpans`, `consetCookie`
- Boolean signals named as noun+state: `consentDialog`, `consetFilled` (note: typo in the codebase - `conset` instead of `consent`)

**Types:**
- PascalCase type aliases with `Type` suffix for context types: `consentType`, `consentContextType`
- PascalCase for component prop types with `Props` suffix: `ButtonProps`, `SlideProps`, `SlideRouter`, `CookieKindDetailProps`, `SwitchProps`
- Exported types use `export type`: `export type LangData`, `export type SwitchProps`

**SolidJS Components:**
- All components are named exports (arrow functions), never default exports: `export const CookieBanner = ...`
- PascalCase component names matching their file names

**CSS Classes:**
- BEM-style modifier pattern with double dash for variants: `.link-strikethrough`, `.link-strikethrough--active`, `.text-strikethrough--interactive`
- Custom utility classes in `hugo/assets/css/tailwind.css` use kebab-case
- Tailwind utility classes used inline via `class=` (not `className=`)

## Code Style

**Formatting:**
- Tool: Prettier
- Config: `/.prettierrc` (root), `/hugo/.prettierrc` (Hugo templates)
- Tabs for indentation (`useTabs: true`), `tabWidth: 2`
- Double quotes for strings (`singleQuote: false`)
- Trailing commas everywhere (`trailingComma: "all"`)
- Hugo `.html` templates use `prettier-plugin-go-template` parser

**TypeScript:**
- `strict: true` in `tsconfig.json`
- Target: `ESNext`, module resolution: `node`
- `isolatedModules: true`
- `noEmit: true` (Vite handles compilation)
- No ESLint - Prettier only

## Import Organization

**Order (SolidJS files):**
1. External/framework imports (`solid-js`, `motion`)
2. Internal absolute imports using path alias (`app/app`, `app/src/...`)
3. Relative imports (`./`, `../`)

**Path Aliases:**
- Root alias: `app/` maps to the `app/` directory (configured via `tsconfig.json` `paths: { "*": ["*"] }`)
- Example: `import { LangData } from "app/app"` in `app/src/components/Dialog/Slide.tsx`

**Barrel Files:**
- Used in `app/src/components/Buttons/index.ts` to re-export both button components
- Pattern: named re-exports only, no default exports

## Error Handling

**Patterns:**
- Context guard in custom hooks - throws `Error` if context is missing:
  ```typescript
  // app/src/context/cookieProvider.tsx
  if (!context) {
    throw new Error("useCookieContext: cannot find a CookieContext");
  }
  ```
- Optional chaining for DOM queries: `scrollToTopButton?.addEventListener(...)`, `node.parentNode?.replaceChild(...)`
- Loose type suppression when integrating with browser globals: `// @ts-ignore` for `gtag()` in `app/src/utils/Cookies.ts`
- File-level `// @ts-nocheck` used in `app/src/context/cookieProvider.tsx` (avoid adding more of these)
- Some component props typed as `any` in `CookieBanner.tsx`, `CookieDialog.tsx`, `Consent`, `About`, `DialogButtons` - this is a known quality gap, not a pattern to follow

## Logging

**Framework:** None - no logging library in use

**Patterns:**
- No `console.log` calls in production source
- Single `console.log` in a commented-out Vite plugin in `vite.config.ts`

## Comments

**When to Comment:**
- Grouping CSS sections: `/* COMPONENTS */` comment blocks in `tailwind.css`
- Explaining non-obvious logic: `// Stop the animation once the indicator scrolls out of view` in `hugo/assets/ts/index.ts`
- Suppressing type errors: inline `// @ts-ignore` with implicit rationale
- Hugo template comments: `{{/* comment */}}` for Go template notes

**JSDoc/TSDoc:**
- Not used - no JSDoc annotations anywhere in the source

## Function Design

**Size:** Small, single-purpose functions. Largest are event handler closures (~15-20 lines each) in `hugo/assets/ts/glossary.ts`.

**Parameters:** Destructured props objects for components, named parameters for utilities. Default parameter values used sparingly (`isDisabled = false` in `app/src/components/Switch/index.tsx`).

**Return Values:** Components return JSX. Utility functions return typed values or `undefined`. `getCookie` returns `string | undefined`.

## Module Design

**Exports:**
- Named exports only - no default exports anywhere in `app/src/`
- Hugo TypeScript files (`hugo/assets/ts/`) use named exports for utilities, no exports for side-effect entry modules (`index.ts`, `glossary.ts`)

**Barrel Files:**
- Used only at `app/src/components/Buttons/index.ts`
- Keep barrel files to re-export only, no logic

## Hugo Template Conventions

**i18n:**
- All user-facing strings use `{{ i18n "key" }}` with a `| default "fallback"` for safety
- Translation keys in dot-notation: `"footer.scrolltotop"`, `"lang-switch.label"`
- Translation files: `hugo/i18n/en.json`, `hugo/i18n/cs.json`

**Partials:**
- Partials called with context: `{{ partial "name.html" . }}`
- Sub-data passed as dict: `{{ partial "name.html" (dict "context" . "isFirst" true) }}`
- SVG icons rendered inline via partials: `{{ partial "svg/Logo.svg" }}`

**Data attributes for JS hooks:**
- Custom `data-` attributes used for JS targeting: `data-glosary-toggle`, `data-glosary-title`, `data-glosary`
- IDs for unique elements: `id="cookie-banner"`, `id="scrolltotop"`, `id="scroll-indication"`

**Accessibility:**
- `aria-label` on all navigation landmarks
- `aria-current="page"` on active nav links
- `aria-hidden="true"` on decorative SVGs
- `role="button"` + `tabindex="0"` added dynamically when interactive non-button elements are needed
- `focus-visible:outline` classes applied consistently to interactive elements

---

*Convention analysis: 2026-03-28*
