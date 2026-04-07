# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hugo + Vite/Solid stack with a single Astro 5 project on `feat/astro-migration`, preserving all URLs and visuals, with Hugo remaining buildable until the final cutover.

**Architecture:** Astro 5 + `@astrojs/netlify` (`output: 'hybrid'`) + Tailwind 4 + Content Collections + Astro i18n routing (English active, Czech reserved). Vanilla TS scripts ported via `<script>` tags. No client framework islands. Cookie consent dropped entirely.

**Tech Stack:** Astro 5, `@astrojs/netlify`, Tailwind CSS 4, TypeScript strict, pnpm, Node 23.

**Branch policy:** All work stays on `feat/astro-migration`. No merging to `main` until the user has thoroughly examined the final output and approves.

**Spec:** `docs/superpowers/specs/2026-04-06-astro-migration-design.md`

---

## Ground Rules

- **Hugo must keep building** after every commit until Task 30 (cutover). Verify with `pnpm build:hugo` if you touch shared files.
- **Commit after every task.** Every task ends with a commit step.
- **Parity is the bar.** When porting visuals, build both stacks and compare in a browser before ticking the parity checklist.
- **No silent file deletions** until the cutover task. Hugo source is untouched.
- **Don't invent features.** This is a stack swap. If something looks broken in Hugo today, port it broken; fix in a follow-up.

---

## File Structure (target)

```
website/
├── astro.config.mjs                NEW
├── tailwind.config.js              MODIFIED (content globs)
├── tsconfig.json                   MODIFIED (extends astro/tsconfigs/strict)
├── package.json                    MODIFIED (add astro scripts, keep hugo)
├── netlify.toml                    MODIFIED at cutover only
├── public/                         NEW (favicons, robots, fonts, static images)
├── src/
│   ├── env.d.ts                    NEW
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── privacy-policy.astro
│   │   ├── how-i-ai/index.astro
│   │   ├── work/index.astro
│   │   ├── work/[slug].astro
│   │   ├── blog/index.astro
│   │   ├── blog/[slug].astro
│   │   └── 404.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── HowIAiLayout.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Head.astro
│   │   ├── HowIAiButton.astro
│   │   ├── LangSwitch.astro
│   │   ├── SelectedProjects.astro
│   │   ├── ContactFooter.astro
│   │   ├── ArticlePreview.astro
│   │   ├── BlogCategoryNav.astro
│   │   ├── ContactSide.astro
│   │   ├── Process.astro
│   │   ├── ReadingTime.astro
│   │   ├── TerminalFrame.astro
│   │   └── svg/
│   │       ├── Logo.astro
│   │       ├── ArrowRight.astro
│   │       ├── ArrowDownLeft.astro
│   │       ├── BinaryCheck.astro
│   │       ├── Checkmark.astro
│   │       ├── Chevron.astro
│   │       ├── CubesStacked.astro
│   │       ├── MagnifyingGlass.astro
│   │       ├── Progress.astro
│   │       ├── Shapes.astro
│   │       └── Timeline.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── blog/                   ported .md files
│   │   ├── work/                   ported .md files
│   │   └── pages/                  privacy-policy etc.
│   ├── data/
│   │   └── process.ts              ported from hugo/data/process*.json
│   ├── i18n/
│   │   ├── en.json                 copied from hugo/i18n/en.json
│   │   ├── cs.json                 copied from hugo/i18n/cs.json
│   │   ├── ui.ts                   typed translation map
│   │   └── getT.ts                 helper
│   ├── styles/
│   │   ├── global.css              ported from hugo/assets/css/tailwind.css
│   │   ├── fonts.css               ported from hugo/static/css/fonts.css
│   │   └── legacy.css              ported from hugo/static/css/style.css
│   └── scripts/
│       ├── scroll-indicator.ts     from hugo/assets/ts/index.ts
│       ├── glossary.ts             from hugo/assets/ts/glossary.ts
│       ├── tabs.ts                 from hugo/assets/ts/tabs.ts
│       ├── navigation.ts           from hugo/assets/ts/navigation.ts
│       └── utils.ts                from hugo/assets/ts/utils.ts
└── docs/superpowers/migration-parity.md   parity checklist
```

---

## Phase 0 — Foundation

### Task 1: Create parity checklist

**Files:**

- Create: `docs/superpowers/migration-parity.md`

- [ ] **Step 1: Write the checklist file**

```markdown
# Astro Migration Parity Checklist

For each route, build both stacks (`pnpm build:hugo`, `pnpm build:astro`), serve them locally, and visually compare. Tick only after side-by-side verification.

## Routes

- [ ] `/` (homepage)
- [ ] `/about/`
- [ ] `/contact/`
- [ ] `/privacy-policy/`
- [ ] `/how-i-ai/`
- [ ] `/work/`
- [ ] `/work/<each slug>/`
- [ ] `/blog/`
- [ ] `/blog/<each slug>/`
- [ ] `/404` page
- [ ] Favicons + meta tags
- [ ] Open Graph tags
- [ ] robots.txt / sitemap

## Cross-cutting

- [ ] Fonts load (Gilroy) and render identically
- [ ] Tailwind custom utilities (`.base-grid`, `.link-strikethrough`, `.center--horizontal-vertical`)
- [ ] Scroll-to-top button works
- [ ] Scroll indicator animation works
- [ ] Glossary tooltips work
- [ ] How-I-AI tab switching works (incl. URL hash sync)
- [ ] How-I-AI nav LED button visible on every page
- [ ] Lighthouse score parity (perf, a11y, SEO within 5 points)
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/migration-parity.md
git commit -m "docs: add migration parity checklist"
```

---

### Task 2: Install Astro and integrations

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml` (auto)

- [ ] **Step 1: Install dependencies**

```bash
pnpm add astro@^5 @astrojs/netlify@^6 @astrojs/check@latest
pnpm add -D @types/node
```

(Tailwind 4 is already installed. We'll wire it to Astro via the Vite plugin in Task 3.)

- [ ] **Step 2: Add scripts to `package.json`**

In the `"scripts"` block, ADD (do not remove existing Hugo/Vite scripts):

```json
"dev:astro": "astro dev",
"build:astro": "astro build",
"preview:astro": "astro preview",
"astro": "astro",
"check:astro": "astro check"
```

- [ ] **Step 3: Verify Hugo still builds**

```bash
pnpm build:hugo
```

Expected: Hugo build succeeds, `dist/` populated as before.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install astro 5 and netlify adapter"
```

---

### Task 3: Create `astro.config.mjs`

**Files:**

- Create: `astro.config.mjs`
- Create: `src/env.d.ts`

- [ ] **Step 1: Write `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	site: "https://janvitu.com",
	output: "hybrid",
	adapter: netlify(),
	trailingSlash: "always",
	build: {
		format: "directory",
	},
	i18n: {
		defaultLocale: "en",
		locales: ["en", "cs"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	outDir: "./dist-astro",
});
```

Note: Astro outputs to `./dist-astro` during migration so it doesn't collide with Hugo's `./dist`. The cutover task swaps this back to `./dist`.

- [ ] **Step 2: Write `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 3: Install Tailwind 4 Vite plugin**

```bash
pnpm add -D @tailwindcss/vite
```

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs src/env.d.ts package.json pnpm-lock.yaml
git commit -m "feat(astro): add astro config, hybrid output, i18n routing"
```

---

### Task 4: Update `tsconfig.json` for Astro

**Files:**

- Modify: `tsconfig.json`

- [ ] **Step 1: Replace `tsconfig.json` contents**

```json
{
	"extends": "astro/tsconfigs/strict",
	"compilerOptions": {
		"jsx": "preserve",
		"baseUrl": ".",
		"paths": {
			"~/*": ["src/*"]
		}
	},
	"include": ["src/**/*", "astro.config.mjs", ".astro/types.d.ts"],
	"exclude": ["dist", "dist-astro", "hugo", "app"]
}
```

- [ ] **Step 2: Verify type-check passes**

```bash
pnpm check:astro
```

Expected: 0 errors (no source files yet).

- [ ] **Step 3: Verify Hugo + Vite app still build**

```bash
pnpm build:hugo
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json
git commit -m "chore(ts): switch tsconfig to astro strict preset"
```

---

### Task 5: Update Tailwind content globs

**Files:**

- Modify: `tailwind.config.js`
- Create: `src/styles/global.css`

- [ ] **Step 1: Update `tailwind.config.js` `content` array**

Change the `content` field to include both Hugo and Astro sources during migration:

```js
content: [
  "./hugo/**/*.{html,md,svg,tsx,ts}",
  "./src/**/*.{astro,html,md,mdx,ts,tsx}",
],
```

- [ ] **Step 2: Create `src/styles/global.css`** with Tailwind 4 entry

```css
@import "tailwindcss";

/* Custom utilities and components ported in Task 6 */
```

- [ ] **Step 3: Verify Hugo build still works**

```bash
pnpm build:hugo
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js src/styles/global.css
git commit -m "chore(tw): expand content globs to src/, add astro entry css"
```

---

### Task 6: Port custom CSS verbatim

**Files:**

- Create: `src/styles/global.css` (append)
- Create: `src/styles/fonts.css`
- Create: `src/styles/legacy.css`

- [ ] **Step 1: Read source files**

Read these and copy their contents to the new locations:

- `hugo/assets/css/tailwind.css` → append everything BELOW the `@import "tailwindcss"` line into `src/styles/global.css`
- `hugo/static/css/fonts.css` → `src/styles/fonts.css`
- `hugo/static/css/style.css` → `src/styles/legacy.css`
- `hugo/static/css/fonts-styles/*` → `src/styles/fonts-styles/` (copy directory verbatim)

Use the Read tool for each file, then Write the contents to the new path. Do not modify CSS — copy verbatim.

- [ ] **Step 2: Wire fonts.css and legacy.css into global.css**

At the top of `src/styles/global.css`, BELOW the `@import "tailwindcss"` line:

```css
@import "./fonts.css";
@import "./legacy.css";
```

- [ ] **Step 3: Commit**

```bash
git add src/styles
git commit -m "feat(styles): port hugo custom css verbatim into src/styles"
```

---

### Task 7: Copy static assets to `public/`

**Files:**

- Create: `public/` with copied contents

- [ ] **Step 1: Copy non-CSS static files**

```bash
mkdir -p public
cp hugo/static/favicon.ico public/
cp hugo/static/favicon-16x16.png public/
cp hugo/static/favicon-32x32.png public/
cp hugo/static/apple-touch-icon.png public/
cp hugo/static/android-chrome-192x192.png public/
cp hugo/static/android-chrome-512x512.png public/
cp hugo/static/mstile-150x150.png public/
cp hugo/static/safari-pinned-tab.svg public/
cp hugo/static/browserconfig.xml public/
cp hugo/static/site.webmanifest public/
cp -R hugo/static/fonts public/fonts
cp -R hugo/static/images public/images
cp -R hugo/static/logos public/logos
```

- [ ] **Step 2: Verify**

```bash
ls public/
```

Expected: all files present.

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat(public): copy hugo static assets to public/"
```

---

## Phase 1 — i18n + base layout

### Task 8: Port i18n strings and create translator helper

**Files:**

- Create: `src/i18n/en.json`
- Create: `src/i18n/cs.json`
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/getT.ts`

- [ ] **Step 1: Copy translation files**

```bash
mkdir -p src/i18n
cp hugo/i18n/en.json src/i18n/en.json
cp hugo/i18n/cs.json src/i18n/cs.json
```

- [ ] **Step 2: Write `src/i18n/ui.ts`** (typed map)

```ts
import en from "./en.json";
import cs from "./cs.json";

export const ui = { en, cs } as const;
export type Locale = keyof typeof ui;
export const defaultLocale: Locale = "en";
export const enabledLocales: Locale[] = ["en"]; // czech reserved, not yet routed
```

- [ ] **Step 3: Write `src/i18n/getT.ts`**

```ts
import { ui, defaultLocale, type Locale } from "./ui";

type Dict = Record<string, unknown>;

function lookup(dict: Dict, key: string): string | undefined {
	const parts = key.split(".");
	let cur: unknown = dict;
	for (const p of parts) {
		if (cur && typeof cur === "object" && p in (cur as Dict)) {
			cur = (cur as Dict)[p];
		} else {
			return undefined;
		}
	}
	return typeof cur === "string" ? cur : undefined;
}

export function getT(locale: string | undefined) {
	const loc = (locale && locale in ui ? locale : defaultLocale) as Locale;
	const dict = ui[loc] as Dict;
	const fallback = ui[defaultLocale] as Dict;
	return function t(key: string, fallbackText?: string): string {
		return lookup(dict, key) ?? lookup(fallback, key) ?? fallbackText ?? key;
	};
}
```

- [ ] **Step 4: Type-check**

```bash
pnpm check:astro
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/i18n
git commit -m "feat(i18n): port translations and add getT helper"
```

---

### Task 9: Create `BaseLayout.astro`

**Files:**

- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Head.astro`

- [ ] **Step 1: Read Hugo `baseof.html` and `head` partials**

Read `hugo/layouts/_default/baseof.html`, `hugo/layouts/partials/head.html`, `hugo/layouts/partials/head/favicon.html`, `hugo/layouts/partials/head/imports.html`, `hugo/layouts/partials/head/og.html`, `hugo/layouts/partials/head/robots.html`. Note every `<meta>`, `<link>`, and asset reference.

- [ ] **Step 2: Write `src/components/Head.astro`**

```astro
---
import "../styles/global.css";

interface Props {
	title: string;
	description?: string;
	ogImage?: string;
	noindex?: boolean;
}

const {
	title,
	description = "",
	ogImage = "/images/og-default.png",
	noindex = false,
} = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>{title}</title>
	<meta name="description" content={description} />
	{noindex && <meta name="robots" content="noindex" />}
	<link rel="canonical" href={canonical} />

	<!-- Favicons -->
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
</head>
```

If you find additional meta tags in Hugo's head partials that aren't covered above, add them verbatim. Do not remove anything from Hugo's set.

- [ ] **Step 3: Write `src/layouts/BaseLayout.astro`**

```astro
---
import Head from "../components/Head.astro";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import HowIAiButton from "../components/HowIAiButton.astro";

interface Props {
	title: string;
	description?: string;
	ogImage?: string;
	bodyClass?: string;
}

const { title, description, ogImage, bodyClass = "" } = Astro.props;
const locale = Astro.currentLocale ?? "en";
---

<!doctype html>
<html lang={locale}>
	<Head title={title} description={description} ogImage={ogImage} />
	<body class={bodyClass}>
		<HowIAiButton />
		<Nav />
		<main>
			<slot />
		</main>
		<Footer />
	</body>
</html>
```

(`Nav`, `Footer`, `HowIAiButton` are stub components for now — Task 10.)

- [ ] **Step 4: Create stubs for Nav/Footer/HowIAiButton**

```astro
---
// src/components/Nav.astro
---

<nav>nav stub</nav>
```

```astro
---
// src/components/Footer.astro
---

<footer>footer stub</footer>
```

```astro
---
// src/components/HowIAiButton.astro
---

<a href="/how-i-ai/">How I AI</a>
```

- [ ] **Step 5: Type-check**

```bash
pnpm check:astro
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Head.astro src/components/Nav.astro src/components/Footer.astro src/components/HowIAiButton.astro
git commit -m "feat(layout): add BaseLayout, Head, and component stubs"
```

---

### Task 10: Port SVG icons as Astro components

**Files:**

- Create: `src/components/svg/*.astro` (one per file)

- [ ] **Step 1: For each SVG in `hugo/layouts/partials/svg/`**

For each of: `Logo.svg`, `ArrowRight.svg`, `ArrowDownLeft.svg`, `BinaryCheck.svg`, `Checkmark.svg`, `Chevron.svg`, `CubesStacked.svg`, `MagnifyingGlass.svg`, `Progress.svg`, `Shapes.svg`, `Timeline.svg`:

Read the file, then Write to `src/components/svg/<Name>.astro` as:

```astro
---
interface Props {
	class?: string;
}
const { class: className = "" } = Astro.props;
---

<!-- paste exact SVG markup, add class={className} to the root <svg> tag -->
```

- [ ] **Step 2: Type-check**

```bash
pnpm check:astro
```

- [ ] **Step 3: Commit**

```bash
git add src/components/svg
git commit -m "feat(svg): port hugo svg partials as astro components"
```

---

### Task 11: Implement real `Nav.astro`

**Files:**

- Modify: `src/components/Nav.astro`
- Create: `src/components/LangSwitch.astro`

- [ ] **Step 1: Read Hugo source**

Read `hugo/layouts/partials/header.html` and `hugo/layouts/partials/nav/langSwitch.html`. Note the link list, ARIA attributes, active state logic (`aria-current="page"`), and all classes.

- [ ] **Step 2: Write `src/components/Nav.astro`**

```astro
---
import { getT } from "../i18n/getT";
import Logo from "./svg/Logo.astro";
import LangSwitch from "./LangSwitch.astro";

const t = getT(Astro.currentLocale);
const path = Astro.url.pathname;

const links = [
	{ href: "/", key: "nav.home", label: "Home" },
	{ href: "/work/", key: "nav.work", label: "Work" },
	{ href: "/about/", key: "nav.about", label: "About" },
	{ href: "/contact/", key: "nav.contact", label: "Contact" },
];

function isActive(href: string) {
	if (href === "/") return path === "/";
	return path === href || path.startsWith(href);
}
---

<header aria-label="Main navigation">
	<a href="/" aria-label="Home">
		<Logo class="h-8 w-auto" />
	</a>
	<nav>
		<ul>
			{
				links.map((l) => (
					<li>
						<a
							href={l.href}
							aria-current={isActive(l.href) ? "page" : undefined}
							class={`link-strikethrough ${isActive(l.href) ? "link-strikethrough--active" : ""}`}
						>
							{t(l.key, l.label)}
						</a>
					</li>
				))
			}
		</ul>
	</nav>
	<LangSwitch />
</header>
```

If Hugo's header has additional structure (extra wrappers, mobile menu toggle), port them verbatim. Match all classes and ARIA attributes.

- [ ] **Step 3: Write `src/components/LangSwitch.astro`**

Port `hugo/layouts/partials/nav/langSwitch.html` verbatim. While Czech is unrouted, render the switch as a no-op (single English link) but keep the markup so layout matches.

```astro
---
// Czech routes are reserved but not yet emitted; render English only.
---

<div class="lang-switch" aria-label="Language">
	<span>EN</span>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/LangSwitch.astro
git commit -m "feat(nav): port header nav and lang switch from hugo"
```

---

### Task 12: Implement real `Footer.astro` and `HowIAiButton.astro`

**Files:**

- Modify: `src/components/Footer.astro`
- Modify: `src/components/HowIAiButton.astro`

- [ ] **Step 1: Read Hugo source**

Read `hugo/layouts/partials/footer.html` and `hugo/layouts/partials/nav/how-i-ai-button.html`.

- [ ] **Step 2: Port `Footer.astro`**

Translate Hugo template to Astro:

- Replace `{{ i18n "x" }}` with `{t("x", "fallback")}` after importing `getT`
- Replace `{{ partial "svg/Foo.svg" }}` with `<Foo />` (import from `./svg/Foo.astro`)
- Keep all classes, IDs, and `data-*` attributes byte-identical
- Keep `id="scrolltotop"` for the scroll-to-top button (consumed by `scroll-indicator.ts`)

- [ ] **Step 3: Port `HowIAiButton.astro`**

Same translation rules. Preserve every class, including the spinning conic-gradient border markup.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/components/HowIAiButton.astro
git commit -m "feat(footer,nav): port footer and How I AI LED button"
```

---

### Task 13: Port vanilla TS scripts

**Files:**

- Create: `src/scripts/scroll-indicator.ts`
- Create: `src/scripts/glossary.ts`
- Create: `src/scripts/tabs.ts`
- Create: `src/scripts/navigation.ts`
- Create: `src/scripts/utils.ts`

- [ ] **Step 1: Copy each TS file verbatim**

```bash
mkdir -p src/scripts
cp hugo/assets/ts/index.ts src/scripts/scroll-indicator.ts
cp hugo/assets/ts/glossary.ts src/scripts/glossary.ts
cp hugo/assets/ts/tabs.ts src/scripts/tabs.ts
cp hugo/assets/ts/navigation.ts src/scripts/navigation.ts
cp hugo/assets/ts/utils.ts src/scripts/utils.ts
```

(Skip `main.ts` if it's just a barrel — re-import its members directly where needed.)

- [ ] **Step 2: Wire scripts into `BaseLayout.astro`**

In `src/layouts/BaseLayout.astro`, ABOVE the closing `</body>` tag:

```astro
<script>
	import "../scripts/scroll-indicator.ts";
	import "../scripts/glossary.ts";
	import "../scripts/navigation.ts";
</script>
```

(Tab script is loaded only on `/how-i-ai/` — wired in Task 22.)

- [ ] **Step 3: Type-check**

```bash
pnpm check:astro
```

Fix any type errors that surface from strict mode (likely `motion` types or DOM null checks). Do not change behavior — just satisfy the compiler.

- [ ] **Step 4: Commit**

```bash
git add src/scripts src/layouts/BaseLayout.astro
git commit -m "feat(scripts): port vanilla ts and wire into BaseLayout"
```

---

## Phase 2 — Simple pages

### Task 14: Port `/` (homepage)

**Files:**

- Create: `src/pages/index.astro`
- Create: `src/components/SelectedProjects.astro`
- Create: `src/components/Process.astro`
- Create: `src/components/ContactFooter.astro`
- Create: `src/data/process.ts`

- [ ] **Step 1: Read Hugo sources**

Read `hugo/layouts/index.html`, `hugo/content/_index.en.html`, `hugo/layouts/partials/Sections/SelectedProjects.html`, `hugo/layouts/partials/Sections/contactFooter.html`, `hugo/layouts/partials/process.html`, `hugo/data/process.en.json`.

- [ ] **Step 2: Write `src/data/process.ts`**

Convert `hugo/data/process.en.json` to a typed export:

```ts
export interface ProcessStep {
	// fields from process.en.json
}
export const process: ProcessStep[] = [
	// copy entries verbatim
];
```

(If there's a `process.json` for Czech, also export `processCs`. Don't wire it yet.)

- [ ] **Step 3: Port the three section components**

For each of `SelectedProjects.astro`, `Process.astro`, `ContactFooter.astro`:

- Translate Hugo template to Astro
- Replace `{{ i18n "x" }}` → `{t("x", "fallback")}`
- Replace `{{ partial "svg/Foo.svg" }}` → `<Foo />` import
- Replace `{{ range .Site.Data.process }}` → `{process.map((step) => ...)}`
- Keep all classes/IDs identical

- [ ] **Step 4: Write `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SelectedProjects from "../components/SelectedProjects.astro";
import Process from "../components/Process.astro";
import ContactFooter from "../components/ContactFooter.astro";
import { getT } from "../i18n/getT";

const t = getT(Astro.currentLocale);
---

<BaseLayout
	title={t("home.title", "Jan Vitu")}
	description={t("home.description", "")}
>
	<!-- port hero from _index.en.html verbatim -->
	<SelectedProjects />
	<Process />
	<ContactFooter />
</BaseLayout>
```

The hero markup from `hugo/content/_index.en.html` is HTML — paste it directly into the slot, replacing any Hugo template syntax with Astro equivalents.

- [ ] **Step 5: Run dev server and visually compare**

```bash
pnpm dev:astro
```

In another terminal:

```bash
pnpm dev:hugo
```

Open both at their respective ports. Compare `/` side-by-side. Iterate on the Astro version until visually identical.

- [ ] **Step 6: Tick parity checklist**

Edit `docs/superpowers/migration-parity.md` and check `- [x]` for `/`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/components/SelectedProjects.astro src/components/Process.astro src/components/ContactFooter.astro src/data/process.ts docs/superpowers/migration-parity.md
git commit -m "feat(astro): port homepage with hero, projects, process, contact"
```

---

### Task 15: Port `/about/`

**Files:**

- Create: `src/pages/about.astro`

- [ ] **Step 1: Read Hugo source**

Read `hugo/layouts/about/list.html` and `hugo/content/about/_index.en.html`.

- [ ] **Step 2: Write `src/pages/about.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { getT } from "../i18n/getT";

const t = getT(Astro.currentLocale);
---

<BaseLayout title={t("about.title", "About")}>
	<!-- paste content from _index.en.html, converted to Astro -->
</BaseLayout>
```

- [ ] **Step 3: Visual parity check, then tick checklist**

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro docs/superpowers/migration-parity.md
git commit -m "feat(astro): port /about page"
```

---

### Task 16: Port `/contact/`

**Files:**

- Create: `src/pages/contact.astro`
- Create: `src/components/ContactSide.astro`

- [ ] **Step 1: Read Hugo source**

Read `hugo/layouts/contact/list.html`, `hugo/content/contact/_index.en.html`, `hugo/layouts/partials/contact/contactSide.html`.

- [ ] **Step 2: Port `ContactSide.astro` and `contact.astro`**

Same translation pattern as previous tasks.

- [ ] **Step 3: Visual parity check, tick checklist**

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro src/components/ContactSide.astro docs/superpowers/migration-parity.md
git commit -m "feat(astro): port /contact page"
```

---

### Task 17: Port `/privacy-policy/`

**Files:**

- Create: `src/pages/privacy-policy.astro`
- Create: `src/content/pages/privacy-policy.md`

- [ ] **Step 1: Copy markdown content**

```bash
mkdir -p src/content/pages
cp hugo/content/privacy-policy.en.md src/content/pages/privacy-policy.md
```

- [ ] **Step 2: Write `src/pages/privacy-policy.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { getEntry } from "astro:content";
const entry = await getEntry("pages", "privacy-policy");
const { Content } = await entry.render();
---

<BaseLayout title="Privacy Policy">
	<article class="prose">
		<Content />
	</article>
</BaseLayout>
```

(The `pages` collection is defined in Task 18.)

- [ ] **Step 3: Visual parity check, tick checklist**

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy-policy.astro src/content/pages
git commit -m "feat(astro): port /privacy-policy page"
```

---

### Task 18: Define content collections

**Files:**

- Create: `src/content/config.ts`

- [ ] **Step 1: Audit existing markdown frontmatter**

Read each `.md` in `hugo/content/blog/**` and `hugo/content/work/**` (if any). Note which fields appear in frontmatter and their types.

- [ ] **Step 2: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from "astro:content";

const pages = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string().optional(),
	}),
});

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional(),
		// add fields discovered in step 1
	}),
});

const work = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		date: z.coerce.date().optional(),
		description: z.string().optional(),
		// add fields discovered in step 1
	}),
});

export const collections = { pages, blog, work };
```

If any field is missing from your audit, add it now. Better to have an over-permissive schema than fail to build.

- [ ] **Step 3: Type-check**

```bash
pnpm check:astro
```

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts
git commit -m "feat(content): define pages, blog, work collections"
```

---

## Phase 3 — Collection-driven pages

### Task 19: Port `/work/`

**Files:**

- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[slug].astro`
- Create: `src/content/work/*.md` (copied)

- [ ] **Step 1: Copy work content**

```bash
mkdir -p src/content/work
# Copy any English markdown files from hugo/content/work/
# Use Read/Write or cp depending on what's there
```

If `hugo/content/work/` only contains `_index.en.html` (no individual entries), then there are no work detail pages — only a list. Adjust the plan: skip `[slug].astro` entirely.

- [ ] **Step 2: Read Hugo source**

Read `hugo/layouts/work/list.html`, `hugo/layouts/_default/single.html`, `hugo/content/work/_index.en.html`.

- [ ] **Step 3: Write `src/pages/work/index.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";
import { getT } from "../../i18n/getT";

const t = getT(Astro.currentLocale);
const entries = await getCollection("work", ({ data }) => !data.draft);
entries.sort((a, b) => +(b.data.date ?? 0) - +(a.data.date ?? 0));
---

<BaseLayout title={t("work.title", "Work")}>
	<!-- port _index.en.html intro markup here -->
	<ul>
		{
			entries.map((e) => (
				<li>
					<a href={`/work/${e.slug}/`}>{e.data.title}</a>
				</li>
			))
		}
	</ul>
</BaseLayout>
```

- [ ] **Step 4: Write `src/pages/work/[slug].astro` (if entries exist)**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
	const entries = await getCollection("work");
	return entries.map((entry) => ({
		params: { slug: entry.slug },
		props: { entry },
	}));
}

interface Props {
	entry: CollectionEntry<"work">;
}
const { entry } = Astro.props;
const { Content } = await entry.render();
---

<BaseLayout title={entry.data.title} description={entry.data.description}>
	<article class="prose">
		<h1>{entry.data.title}</h1>
		<Content />
	</article>
</BaseLayout>
```

- [ ] **Step 5: Visual parity check**

Compare `/work/` and each `/work/<slug>/` page. Tick the checklist.

- [ ] **Step 6: Commit**

```bash
git add src/pages/work src/content/work docs/superpowers/migration-parity.md
git commit -m "feat(astro): port /work index and detail pages"
```

---

### Task 20: Port `/blog/`

**Files:**

- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/components/ArticlePreview.astro`
- Create: `src/components/BlogCategoryNav.astro`
- Create: `src/components/ReadingTime.astro`
- Create: `src/content/blog/*.md` (copied)

- [ ] **Step 1: Copy English blog markdown**

```bash
mkdir -p src/content/blog
# For each .en.md or directory containing .en.md in hugo/content/blog/:
#   cp hugo/content/blog/cookie.en.md src/content/blog/cookie.md
#   cp hugo/content/blog/inp/index.en.md src/content/blog/inp.md
# Skip .cs.md files (czech is paused)
```

Note the rename pattern: `<name>.en.md` → `<name>.md`. For directory-bundle posts (`<name>/index.en.md`), flatten to `<name>.md` and copy any sibling assets to `public/blog/<name>/`.

- [ ] **Step 2: Read Hugo source**

Read `hugo/layouts/blog/list.html`, `hugo/layouts/_default/single.html`, `hugo/layouts/partials/blog/articlePreview.html`, `hugo/layouts/partials/blog/blogCategoryNav.html`, `hugo/layouts/partials/readingTime.html`.

- [ ] **Step 3: Port the three components**

`ArticlePreview.astro`, `BlogCategoryNav.astro`, `ReadingTime.astro` — same translation pattern. `ReadingTime` should compute from `entry.body.split(/\s+/).length / 200` (rounded up minutes).

- [ ] **Step 4: Write `src/pages/blog/index.astro`**

Same shape as `work/index.astro` but using `getCollection("blog")` and rendering `<ArticlePreview entry={...} />` for each.

- [ ] **Step 5: Write `src/pages/blog/[slug].astro`**

Same shape as `work/[slug].astro` but with blog-specific layout (article tags, reading time, prev/next).

- [ ] **Step 6: Visual parity check on `/blog/` and every `/blog/<slug>/`**

- [ ] **Step 7: Commit**

```bash
git add src/pages/blog src/content/blog src/components/ArticlePreview.astro src/components/BlogCategoryNav.astro src/components/ReadingTime.astro docs/superpowers/migration-parity.md
git commit -m "feat(astro): port /blog index, detail, and components"
```

---

### Task 21: Port `404.astro`

**Files:**

- Create: `src/pages/404.astro`

- [ ] **Step 1: Read `hugo/layouts/404.html`**

- [ ] **Step 2: Write `src/pages/404.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="404 Not Found">
	<!-- ported 404 markup -->
</BaseLayout>
```

- [ ] **Step 3: Tick checklist, commit**

```bash
git add src/pages/404.astro docs/superpowers/migration-parity.md
git commit -m "feat(astro): port 404 page"
```

---

## Phase 4 — How I AI

### Task 22: Port `/how-i-ai/`

**Files:**

- Create: `src/pages/how-i-ai/index.astro`
- Create: `src/layouts/HowIAiLayout.astro`
- Create: `src/components/TerminalFrame.astro`

- [ ] **Step 1: Read all How-I-AI sources**

Read:

- `hugo/layouts/how-i-ai/baseof.html`
- `hugo/layouts/how-i-ai/list.html`
- `hugo/content/how-i-ai/_index.en.html`
- `hugo/layouts/partials/terminal-frame.html`
- `hugo/assets/ts/tabs.ts`

This page has dark-theme scoping, terminal aesthetic, tabbed sections, and URL hash sync. The user explicitly chose to port as-is.

- [ ] **Step 2: Write `src/layouts/HowIAiLayout.astro`**

Mirrors `BaseLayout.astro` but with the dark-theme body class and any how-i-ai-specific head additions:

```astro
---
import Head from "../components/Head.astro";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import HowIAiButton from "../components/HowIAiButton.astro";

interface Props {
	title: string;
	description?: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en" class="dark">
	<Head title={title} description={description} />
	<body class="how-i-ai-theme">
		<HowIAiButton />
		<Nav />
		<main>
			<slot />
		</main>
		<Footer />
		<script>
			import "../scripts/tabs.ts";
		</script>
	</body>
</html>
```

If Hugo's `how-i-ai/baseof.html` has additional structural differences from the default base, port them verbatim.

- [ ] **Step 3: Port `TerminalFrame.astro`**

Translate `hugo/layouts/partials/terminal-frame.html` to Astro. Preserve every class.

- [ ] **Step 4: Write `src/pages/how-i-ai/index.astro`**

```astro
---
import HowIAiLayout from "../../layouts/HowIAiLayout.astro";
import TerminalFrame from "../../components/TerminalFrame.astro";
---

<HowIAiLayout title="How I AI">
	<!-- paste content from how-i-ai/list.html and _index.en.html, translated to astro -->
	<!-- preserve all data-* attributes (data-tab, data-tab-panel, etc.) for tabs.ts -->
</HowIAiLayout>
```

The tabs script reads `data-tab` and `data-tab-panel` attributes — they MUST be preserved exactly.

- [ ] **Step 5: Visual parity check**

Compare `/how-i-ai/` carefully:

- Tab clicks switch panels
- URL hash updates on tab switch
- Loading the page with `#tools` (or whichever) auto-selects that tab
- Dark theme is scoped (other pages remain light)
- LED nav button still visible

- [ ] **Step 6: Tick checklist, commit**

```bash
git add src/pages/how-i-ai src/layouts/HowIAiLayout.astro src/components/TerminalFrame.astro docs/superpowers/migration-parity.md
git commit -m "feat(astro): port /how-i-ai page with terminal frame and tabs"
```

---

### Task 23: Port shortcodes used in markdown

**Files:**

- Create: `src/components/markdown/LinkStrike.astro`
- Create: `src/components/markdown/Tab.astro`
- Possibly modify content `.md` → `.mdx`

- [ ] **Step 1: Audit shortcode usage**

Search for `{{< linkStrike` and `{{< tab` in `src/content/`:

```bash

```

Use Grep tool: pattern `\{\{<` in `src/content`. List every file that uses a shortcode.

- [ ] **Step 2: For each affected file**

- Rename `.md` → `.mdx`
- Add `import LinkStrike from "../../components/markdown/LinkStrike.astro";` (etc.) at the top
- Replace `{{< linkStrike "url" "text" >}}` with `<LinkStrike url="url">text</LinkStrike>`
- Replace `{{< tab name="x" >}}...{{< /tab >}}` similarly

- [ ] **Step 3: Port the components**

Read `hugo/layouts/shortcodes/linkStrike.html` and `hugo/layouts/shortcodes/tab.html`. Translate to Astro components in `src/components/markdown/`.

- [ ] **Step 4: Install MDX integration if needed**

```bash
pnpm add @astrojs/mdx
```

Add to `astro.config.mjs`:

```js
import mdx from "@astrojs/mdx";
// integrations: [mdx()]
```

- [ ] **Step 5: Re-verify affected pages**

- [ ] **Step 6: Commit**

```bash
git add src/components/markdown src/content astro.config.mjs package.json pnpm-lock.yaml
git commit -m "feat(astro): port hugo shortcodes as mdx components"
```

---

## Phase 5 — Verification

### Task 24: Full Astro build

**Files:**

- (none)

- [ ] **Step 1: Build**

```bash
pnpm build:astro
```

Expected: success, output in `dist-astro/`.

- [ ] **Step 2: Inspect output**

```bash
ls dist-astro
```

Expected: every route from the parity checklist has a corresponding `index.html`.

- [ ] **Step 3: Preview**

```bash
pnpm preview:astro
```

Walk through every URL one more time.

- [ ] **Step 4: Commit any fixes**

If you made fixes:

```bash
git add -A
git commit -m "fix(astro): address build/preview issues"
```

---

### Task 25: Lighthouse parity check

- [ ] **Step 1: Run Lighthouse on Hugo build**

Build Hugo, serve from a static server, run Lighthouse on every key route. Record scores in `docs/superpowers/migration-parity.md`.

- [ ] **Step 2: Run Lighthouse on Astro build**

Same routes, same conditions.

- [ ] **Step 3: Compare**

Astro should be within 5 points of Hugo on perf, a11y, SEO, and best-practices. If not, investigate (likely missing meta, oversized assets, render-blocking scripts).

- [ ] **Step 4: Tick the checklist row, commit**

```bash
git add docs/superpowers/migration-parity.md
git commit -m "docs: record lighthouse parity scores"
```

---

### Task 26: Confirm parity checklist is fully ticked

- [ ] **Step 1: Read `docs/superpowers/migration-parity.md`**

Every item must be checked. If anything is unchecked, go back and fix it. Do NOT proceed to cutover until 100% green.

---

## Phase 6 — Cutover (single PR's worth of work, but committed in steps)

### Task 27: Switch Astro output to `dist/`

**Files:**

- Modify: `astro.config.mjs`
- Modify: `.gitignore` (if needed)

- [ ] **Step 1: Change `outDir`**

In `astro.config.mjs`:

```js
// remove: outDir: "./dist-astro",
```

(Default is `./dist`.)

- [ ] **Step 2: Build**

```bash
rm -rf dist dist-astro
pnpm build:astro
ls dist
```

Expected: Astro output in `dist/`.

- [ ] **Step 3: Do NOT commit yet** — Hugo also writes to `dist/`. Continue to Task 28.

---

### Task 28: Update `netlify.toml` and `package.json`

**Files:**

- Modify: `netlify.toml`
- Modify: `package.json`

- [ ] **Step 1: Update `netlify.toml`**

Set `command = "pnpm build:astro"` and `publish = "dist"`. Keep `functions = "functions/"` if it was there before (no functions exist yet but the config is harmless).

- [ ] **Step 2: Update `package.json` `build` script**

Change `"build": "..."` to `"build": "pnpm build:astro"`.

- [ ] **Step 3: Test the production-equivalent build**

```bash
rm -rf dist
pnpm build
ls dist
```

Expected: Astro output, no Hugo invocation.

- [ ] **Step 4: Do NOT commit yet** — bundle into Task 30's cutover commit.

---

### Task 29: Delete Hugo and Vite/Solid app

**Files:**

- Delete: `hugo/`
- Delete: `app/`
- Delete: `vite.config.ts`
- Delete: `tsconfig.node.json`
- Modify: `package.json` (remove Hugo/Vite scripts and deps)
- Modify: `tailwind.config.js` (remove Hugo glob)

- [ ] **Step 1: Delete directories and files**

```bash
rm -rf hugo app
rm -f vite.config.ts tsconfig.node.json
```

- [ ] **Step 2: Remove Hugo/Vite scripts from `package.json`**

Remove: `dev:hugo`, `build:hugo`, `dev:tailwind`, `build:tailwind`, `dev`, `build:solid`, `dev:solid`, plus the old `build`. Keep the new `build`, `dev:astro`, `build:astro`, `preview:astro`, `astro`, `check:astro`. Add `"dev": "astro dev"`.

- [ ] **Step 3: Remove orphaned dependencies**

```bash
pnpm remove solid-js vite vite-plugin-solid concurrently postcss postcss-cli @tailwindcss/cli prettier-plugin-go-template
```

(Keep `prettier`, `prettier-plugin-tailwindcss`, `tailwindcss`, `@tailwindcss/typography`, `@tailwindcss/vite`, `motion`, `zod` if still used, `astro`, `@astrojs/netlify`, `@astrojs/check`, `@astrojs/mdx` if added.)

- [ ] **Step 4: Update `tailwind.config.js`**

Remove the `./hugo/**/*` line from `content`.

- [ ] **Step 5: Final build**

```bash
rm -rf dist node_modules
pnpm install
pnpm build
```

Expected: clean install, clean build, populated `dist/`.

- [ ] **Step 6: Type-check**

```bash
pnpm check:astro
```

Expected: 0 errors.

---

### Task 30: Cutover commit

- [ ] **Step 1: Stage everything from Tasks 27, 28, 29**

```bash
git add -A
git status
```

Expected staged changes:

- `astro.config.mjs` (outDir removed)
- `netlify.toml` (command + publish updated)
- `package.json` + `pnpm-lock.yaml` (scripts and deps cleaned)
- `tailwind.config.js` (hugo glob removed)
- `hugo/` deleted
- `app/` deleted
- `vite.config.ts` deleted
- `tsconfig.node.json` deleted

- [ ] **Step 2: Commit**

```bash
git commit -m "feat(astro): cutover — remove hugo and vite/solid app, ship astro build"
```

- [ ] **Step 3: Final smoke test**

```bash
pnpm build && pnpm preview:astro
```

Walk every URL one last time.

- [ ] **Step 4: Stop**

DO NOT push to `main`. DO NOT merge. The branch is now ready for the user's thorough examination. Report completion and wait for sign-off.

---

## Done Criteria

- All 30 tasks ticked
- `docs/superpowers/migration-parity.md` 100% green
- `pnpm build` produces a valid Astro site in `dist/`
- `hugo/`, `app/`, `vite.config.ts` no longer exist on the branch
- Branch `feat/astro-migration` is ahead of `main` by ~30 commits
- User has been notified that the migration is ready for review
- **No merge to main has occurred**
