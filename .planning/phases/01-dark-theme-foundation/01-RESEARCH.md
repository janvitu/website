# Phase 1: Dark Theme Foundation - Research

**Researched:** 2026-03-29
**Domain:** Hugo layout routing, Tailwind CSS 4 scoped theming, CSS custom properties
**Confidence:** HIGH

## Summary

Phase 1 establishes the CSS foundation for the `/how-i-ai` page dark theme. The work involves three distinct concerns: (1) creating a Hugo layout that applies `data-theme="terminal"` scoped to the new page wrapper, (2) adding CSS custom properties under the `[data-theme="terminal"]` selector in `tailwind.css`, and (3) overriding the background grid line color within that scope -- all without modifying any global styles.

The approach is well-supported by the existing stack. Hugo's section-level layout override system (`hugo/layouts/how-i-ai/list.html`) gives clean per-page control. Tailwind CSS 4 CSS custom properties on a scoped selector are plain CSS -- no special Tailwind feature is needed. The `body` background is set globally via `@apply bg-neutral-100` on `body`; this must be overridden within the page wrapper, not on `body` itself, because the dark scope is on a child `<div>`, not the `<body>` tag.

The grid partial (`grid.html`) is rendered from `baseof.html` at the body level, outside the page-specific wrapper. This means the CSS override for grid line color (`--color-border`) scoped to `[data-theme="terminal"]` will NOT automatically reach the grid partial -- because the grid `<div>` sits above the scoped wrapper in the DOM tree. This is the primary architectural challenge of Phase 1 and must be resolved in the plan.

**Primary recommendation:** Apply `data-theme="terminal"` to the `<body>` element conditionally (not a child wrapper), so the grid partial and all body descendants inherit the scope. Use a Hugo page param or section-specific baseof override to target only this page.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THEME-01 | Page has scoped dark color scheme via CSS custom properties on `[data-theme="terminal"]` | Hugo section layout + CSS custom properties block in tailwind.css |
| THEME-02 | Background grid lines visible but subtle on dark background | Grid partial uses `border-neutral-300`; must be overridden under `[data-theme="terminal"]` -- requires `[data-theme]` to be on `<body>` or an ancestor of the grid partial |
| THEME-03 | Focus indicators visible on dark background (accent color or white outline) | `focus-visible:outline-white` Tailwind classes; no JS required |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- Tech stack: Hugo templates + Tailwind CSS + vanilla TypeScript (match existing patterns)
- Design: Must use existing Gilroy font, accent color (`#ff4309`), and grid system
- Dark theme: Scoped to this page only -- rest of site stays light
- Performance: No additional JS frameworks
- Accessibility: Keyboard navigation for tabs, proper ARIA roles
- All dark styles must live under `[data-theme="terminal"]` -- never modify globals or Tailwind base layer
- Naming: camelCase functions/variables, PascalCase components, kebab-case CSS classes
- Indentation: tabs (`useTabs: true`), double quotes, trailing commas

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Hugo | v0.159.0+extended | Static site generator, layout routing, asset pipeline | Project standard; section layouts give per-page HTML structure control |
| Tailwind CSS | 4.1.12 | Utility CSS, custom properties, scoped theming | Project standard; `@theme` block + plain CSS selectors handle dark scope |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/cli | 4.1.12 | Compiles `tailwind.css` to `tw.css` | All CSS changes require re-run |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `data-theme` on `<body>` | `data-theme` on a child wrapper div | Child wrapper cannot cover the grid partial (which renders from baseof.html above main); body attribute is the only safe ancestor |
| Plain CSS in `tailwind.css` | Separate dark.css file | Separate file adds a network request; tailwind.css is the single compiled artifact |

**Installation:** No new packages required. All dependencies are present.

---

## Architecture Patterns

### Hugo Section Layout for Per-Page Scope

Hugo resolves layouts by section name. Creating `hugo/layouts/how-i-ai/list.html` makes Hugo use this layout for the `/how-i-ai` section. The content file is `hugo/content/how-i-ai/_index.en.html`.

Pattern used by all existing sections (`about/list.html`, `contact/list.html`):

```html
{{ define "main" }}
  {{ .Content }}
{{ end }}
```

### Critical: Where to Apply `data-theme="terminal"`

The grid partial is rendered in `baseof.html` at the body level, BEFORE `<main>`:

```html
<body class="overflow-x-hidden">
  {{ partial "grid.html" . }}       <!-- grid is here -->
  {{ partial "header.html" . }}
  <main id="main">
    {{ block "main" . }}            <!-- page content is here -->
    {{ end }}
  </main>
</body>
```

The `[data-theme="terminal"]` CSS override for grid lines only works if the attribute appears on `<body>` or on an element that is an ancestor of the grid partial's DOM node. A child wrapper inside `<main>` cannot reach `grid.html`.

**Verified approach:** Use Hugo's `{{ block }}` / `{{ define }}` system to conditionally add `data-theme="terminal"` to `<body>` in `baseof.html` via a page param, OR create a `how-i-ai`-specific `baseof.html` that renders `<body data-theme="terminal">`.

Hugo looks for `baseof.html` in section directories: `hugo/layouts/how-i-ai/baseof.html` takes precedence over `hugo/layouts/_default/baseof.html` for this section. This is the cleanest approach -- copy `_default/baseof.html` into `hugo/layouts/how-i-ai/baseof.html` and add `data-theme="terminal"` to `<body>`.

**Confidence:** HIGH -- verified by reading `baseof.html`, `grid.html`, and `_default/list.html` source.

### CSS Custom Properties in Tailwind CSS 4

Tailwind CSS 4 uses `@theme` for design tokens and plain CSS for everything else. The dark scope block is plain CSS -- no special Tailwind directive is required:

```css
/* In hugo/assets/css/tailwind.css */
[data-theme="terminal"] {
  --color-bg: #1a1a1a;
  --color-bg-surface: #252525;
  --color-border: #3a3a3a;
  --color-text: #e0e0e0;
  --color-text-muted: #888888;
  --color-accent: #ff4309;

  background-color: #1a1a1a;
  color: #e0e0e0;
}
```

Note: The existing `body { @apply bg-neutral-100; }` sets background on `body`. When `data-theme="terminal"` is on `<body>`, this rule in the dark scope block overrides it -- but the override must use a higher-specificity selector or `background-color` directly (not `@apply bg-neutral-100` in the base rule) since both target `body`. Using `background-color` directly in the `[data-theme="terminal"]` block has higher specificity than the `body` class rule and will override it correctly.

### Grid Line Color Override

The grid partial uses `border-neutral-300` which in Tailwind CSS 4 resolves to `--color-neutral-300` (approximately `oklch(87% 0 0)`, near `#d4d4d4`). Within `[data-theme="terminal"]`, override using:

```css
[data-theme="terminal"] .grid > div {
  border-color: #3a3a3a;
}
```

OR redefine the Tailwind CSS variable within the scope (Tailwind CSS 4 allows CSS variable override within any selector):

```css
[data-theme="terminal"] {
  --color-neutral-300: #3a3a3a;
}
```

**Caution:** Overriding `--color-neutral-300` within the scope affects ALL elements using that neutral shade inside the scope, not just grid lines. Prefer the more targeted `.grid > div` approach to avoid unintended side-effects in later phases.

**Confidence:** HIGH -- verified by reading the compiled Tailwind output (uses `--color-neutral-300`) and `grid.html` source.

### Focus Indicators on Dark Background

The existing `link-strikethrough` uses:

```css
@apply focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent;
```

For dark background, white outline is preferred. Since Phase 1 adds no interactive elements, the focus indicator CSS is established as a foundation for future phases. Add to the dark scope:

```css
[data-theme="terminal"] :focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
```

This provides a blanket override. Phase 2+ can override per-element as needed.

### Recommended File Structure (Phase 1 additions only)

```
hugo/
├── layouts/
│   └── how-i-ai/
│       ├── baseof.html          # NEW -- copy of _default/baseof.html with data-theme="terminal" on <body>
│       └── list.html            # NEW -- defines "main" block, renders .Content
├── assets/
│   └── css/
│       └── tailwind.css         # MODIFY -- add [data-theme="terminal"] block
└── content/
    └── how-i-ai/
        └── _index.en.html       # NEW -- minimal placeholder content
```

### Anti-Patterns to Avoid

- **Wrapping only `<main>` with `[data-theme]`:** The grid partial lives outside `<main>` in `baseof.html`; it won't receive the override.
- **Adding dark styles to `html` or global `body`:** Would affect all pages, violating the "scoped to this page only" constraint.
- **Using `@apply` with Tailwind utilities for the dark scope block:** Tailwind utilities reference `:root` variables; overriding at `[data-theme="terminal"]` level with plain CSS is simpler and more predictable.
- **Modifying `hugo/layouts/_default/baseof.html`:** Any change there affects the whole site. Create a section-specific baseof instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-page layout override | Custom Hugo hook or JS-based class toggle | Hugo's section-specific `baseof.html` | Hugo's built-in layout lookup handles this natively |
| Dark theme CSS variables | Hardcoded hex values scattered in Tailwind classes | CSS custom properties block under `[data-theme="terminal"]` | Centralizes all dark tokens, easier to adjust in later phases |
| Grid color override | New grid partial for dark page | CSS specificity override under `[data-theme="terminal"]` | Avoids duplication; single partial serves both themes |

---

## Common Pitfalls

### Pitfall 1: Grid partial outside scope ancestor

**What goes wrong:** Developer puts `data-theme="terminal"` on `<main>` or a child wrapper; grid lines remain light.
**Why it happens:** The grid partial is rendered from `baseof.html` above `<main>`, so it has no ancestor with the attribute.
**How to avoid:** Apply `data-theme="terminal"` to `<body>` via a section-specific `baseof.html`.
**Warning signs:** Dark background appears but grid lines are still `#d4d4d4` (near-white).

### Pitfall 2: Body background not overriding

**What goes wrong:** `body { @apply bg-neutral-100; }` stays applied because the dark scope rule has equal or lower specificity.
**Why it happens:** Both rules target the same element (`body`). CSS specificity: `[data-theme="terminal"]` (0,1,0) vs `body` (0,0,1) -- attribute selector wins. But if `bg-neutral-100` is set via an inline class on body, it will win.
**How to avoid:** The current codebase sets `@apply bg-neutral-100` on `body` in `tailwind.css` (not as an HTML class attribute). `[data-theme="terminal"] { background-color: #1a1a1a; }` has specificity (0,1,0) which beats the element selector `body` (0,0,1). This should work correctly.
**Warning signs:** Body shows neutral-100 background despite dark scope being set.

### Pitfall 3: Tailwind CSS not recompiled after tailwind.css edit

**What goes wrong:** CSS changes in `tailwind.css` are not visible in the browser.
**Why it happens:** Tailwind CLI watches `tailwind.css` but output is fingerprinted by Hugo; Hugo dev server must also be running.
**How to avoid:** Run `npm run dev` (runs `dev:tailwind` and `dev:hugo` via `concurrently`). Both watchers must be active.
**Warning signs:** New CSS properties not appearing in browser DevTools.

### Pitfall 4: Hugo content file not found

**What goes wrong:** `/how-i-ai` returns 404 or falls through to `_default` layout.
**Why it happens:** Content file naming in multilingual Hugo must match language code: `_index.en.html` for English.
**How to avoid:** Create `hugo/content/how-i-ai/_index.en.html` (not `_index.html`). Verify existing pattern: `hugo/content/about/_index.en.html` confirms the naming convention.
**Warning signs:** Hugo build log shows content file not matched, or page returns 404.

---

## Code Examples

### Section-specific baseof.html (verified pattern)

```html
{{/* hugo/layouts/how-i-ai/baseof.html */}}
<!DOCTYPE html>
<html lang="{{ .Site.Language }}">
	{{ partial "head.html" . }}
	<body class="overflow-x-hidden" data-theme="terminal">
		<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-neutral-800 focus:px-4 focus:py-2 focus:text-neutral-50">
			{{ i18n "skip-to-content" | default "Skip to content" }}
		</a>
		{{ partial "grid.html" . }}
		{{ partial "header.html" . }}
		{{ partial "contact/contactSide.html" . }}
		<main id="main">
			{{ block "main" . }}
				{{ .Content }}
			{{ end }}
		</main>
		{{ partial "footer.html" . }}

		{{ $indexJS := resources.Get "ts/index.ts" | js.Build "js/index.js" | fingerprint }} <script src="{{$indexJS.Permalink}}" defer></script>
	</body>
</html>
```

Source: Derived from `/Users/janvitu/Code/Projects/website/hugo/layouts/_default/baseof.html` -- verified by reading the file.

### Dark scope CSS block (tailwind.css addition)

```css
/* DARK THEME -- scoped to /how-i-ai terminal page only */
[data-theme="terminal"] {
	--color-bg: #1a1a1a;
	--color-bg-surface: #252525;
	--color-border: #3a3a3a;
	--color-text: #e0e0e0;
	--color-text-muted: #888888;

	background-color: #1a1a1a;
	color: #e0e0e0;
}

[data-theme="terminal"] .grid > div {
	border-color: #3a3a3a;
}

[data-theme="terminal"] :focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}
```

### Section list.html (minimal, verified pattern)

```html
{{/* hugo/layouts/how-i-ai/list.html */}}
{{ define "main" }}
	{{ .Content }}
{{ end }}
```

Source: Matches pattern in `hugo/layouts/about/list.html` and `hugo/layouts/contact/list.html` -- verified by reading both.

### Content file (placeholder)

```html
{{/* hugo/content/how-i-ai/_index.en.html */}}
---
title: "How I AI"
description: "How Jan Vítů uses AI in his product management workflow."
---

<div class="col-start-2 col-end-12 py-16">
	<h1 class="text-4xl font-semibold">How I AI</h1>
	<p class="mt-4 text-muted">Placeholder content — tab system coming in Phase 4.</p>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind `dark:` variant with `prefers-color-scheme` | `@custom-variant` for data-attribute scoping | Tailwind CSS v4 | Custom variant names (e.g., `terminal:`) possible, but plain CSS under selector is simpler for this use case |
| PostCSS pipeline for Tailwind | Tailwind CLI direct compile | Tailwind CSS v4 | Both available in the project; CLI is primary for this project |

**Note on `@custom-variant`:** Tailwind CSS 4 supports `@custom-variant terminal (&:where([data-theme=terminal], [data-theme=terminal] *))` which would enable `terminal:bg-black` utility classes. This phase does NOT need utility variants -- the dark scope is established via plain CSS custom properties block. `@custom-variant` becomes relevant if Phase 2+ authors utilities inside the scope.

---

## Open Questions

1. **Header nav on dark page**
   - What we know: The header is fixed, dark-text (`text-neutral-800`), and renders on the dark background.
   - What's unclear: Whether the header remains readable on dark background or requires adjustments.
   - Recommendation: Phase 1 establishes background only. If header contrast is insufficient, address in Phase 2 when the full terminal chrome is designed. Do not solve in Phase 1 -- TERM-01/02 requirements cover that work.

2. **`contactSide.html` partial on `/how-i-ai`**
   - What we know: `baseof.html` renders `{{ partial "contact/contactSide.html" . }}` globally.
   - What's unclear: Whether this side element is appropriate for the `/how-i-ai` page context.
   - Recommendation: Include it for now (copy it into how-i-ai/baseof.html as-is). If it causes visual issues, remove it from the section baseof in a later phase. Phase 1 scope is dark theme only.

---

## Environment Availability

Step 2.6: SKIPPED -- Phase 1 is a CSS and Hugo template change only. No external tools, services, or CLI utilities beyond the project's own build system. Hugo, Tailwind CLI, and Node.js are confirmed available from the CLAUDE.md stack declaration.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None -- Hugo static site, no JS test framework present |
| Config file | None |
| Quick run command | `npm run build` (build succeeds = green) |
| Full suite command | `npm run build` + manual visual check at `http://localhost:1313/how-i-ai` |

No automated test framework exists in this project. All project test files found were in `node_modules` (third-party). Testing for Hugo/CSS phases is manual visual verification plus build success.

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| THEME-01 | `/how-i-ai` renders dark background; other pages stay light | smoke + manual | `npm run build` (build green) + visual check | N/A -- manual |
| THEME-02 | Grid lines visible but subtle on dark background | manual visual | `npm run build` + inspect DevTools | N/A -- manual |
| THEME-03 | Focus ring visible on dark background when tabbing | manual a11y | `npm run build` + keyboard tab test | N/A -- manual |

### Sampling Rate

- **Per task commit:** `npm run build` (build must succeed with exit 0)
- **Per wave merge:** `npm run build` + visual check at `http://localhost:1313/how-i-ai`
- **Phase gate:** All three requirements visually verified before `/gsd:verify-work`

### Wave 0 Gaps

None -- no test infrastructure needs to be created. The build command serves as the automated gate. Manual visual verification is the acceptance test method for this project.

---

## Sources

### Primary (HIGH confidence)

- `/Users/janvitu/Code/Projects/website/hugo/layouts/_default/baseof.html` -- verified DOM structure and partial rendering order
- `/Users/janvitu/Code/Projects/website/hugo/layouts/partials/grid.html` -- verified grid uses `border-neutral-300` Tailwind class
- `/Users/janvitu/Code/Projects/website/hugo/assets/css/tailwind.css` -- verified existing CSS structure, `@apply bg-neutral-100` on body
- `/Users/janvitu/Code/Projects/website/hugo/layouts/about/list.html` and `contact/list.html` -- verified section layout pattern
- `/Users/janvitu/Code/Projects/website/hugo/layouts/partials/header.html` -- verified header uses `text-neutral-800`
- `/Users/janvitu/Code/Projects/website/hugo/config.toml` -- verified multilingual setup (English default)
- `/Users/janvitu/Code/Projects/website/hugo/content/about/_index.en.html` -- verified content file naming convention
- Compiled Tailwind output (`node_modules/.pnpm/...`) -- verified `--color-neutral-300` CSS variable in compiled output

### Secondary (MEDIUM confidence)

- `https://tailwindcss.com/docs/dark-mode` -- verified Tailwind CSS 4 `@custom-variant` support for data-attribute scoping

### Tertiary (LOW confidence)

- None.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all versions verified from package.json and installed node_modules
- Architecture: HIGH -- all key files read and cross-referenced; DOM structure verified
- Pitfalls: HIGH -- derived from direct code inspection, not speculation
- Test approach: HIGH -- no test framework present; confirmed by filesystem search

**Research date:** 2026-03-29
**Valid until:** 2026-04-29 (Tailwind 4.x stable; Hugo 0.159.x stable -- 30-day window)
