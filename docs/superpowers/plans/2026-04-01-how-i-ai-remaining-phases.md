# How I AI -- Remaining Phases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the `/how-i-ai` page by wiring up tab switching, adding URL hash sync with smooth transitions, and creating a distinctive LED-style navigation entry.

**Architecture:** Three sequential phases remaining. Phase 4-02 creates `tabs.ts` for basic click-to-switch. Phase 5 extends it with `hashchange` listeners and CSS opacity transitions on tab panels. Phase 6 adds a menu entry in `hugo/config.toml` and a custom nav partial for the LED button. All vanilla TypeScript -- no frameworks.

**Tech Stack:** Hugo templates, Tailwind CSS 4, vanilla TypeScript (compiled by Hugo `js.Build`), CSS custom properties scoped to `[data-theme="terminal"]`.

---

## File Structure

### Files to Create
| File | Responsibility |
|------|---------------|
| `hugo/assets/ts/tabs.ts` | Tab switching logic: click handlers, hash sync, transitions |
| `hugo/layouts/partials/nav/how-i-ai-button.html` | LED-style nav button partial for the how-i-ai link |

### Files to Modify
| File | Changes |
|------|---------|
| `hugo/assets/ts/index.ts` | Import and call `initTabs()` |
| `hugo/assets/css/tailwind.css` | Add tab panel transition styles + LED button styles |
| `hugo/layouts/partials/terminal-frame.html` | Add transition classes to content area |
| `hugo/layouts/partials/header.html` | Render LED button after standard nav items |
| `hugo/config.toml` | Add how-i-ai menu entry |

---

## Task 1: Create `tabs.ts` with basic tab switching

**Files:**
- Create: `hugo/assets/ts/tabs.ts`
- Modify: `hugo/assets/ts/index.ts`

- [ ] **Step 1: Write `tabs.ts` with the `initTabs` function**

Create `hugo/assets/ts/tabs.ts`:

```typescript
export const initTabs = (): void => {
	const tabButtons =
		document.querySelectorAll<HTMLButtonElement>("[role='tab']");
	const tabPanels =
		document.querySelectorAll<HTMLDivElement>("[role='tabpanel']");

	if (tabButtons.length === 0) return;

	const activateTab = (targetId: string): void => {
		tabButtons.forEach((btn) => {
			const isTarget = btn.getAttribute("data-tab") === targetId;
			btn.setAttribute("aria-selected", isTarget ? "true" : "false");
			btn.style.color = isTarget
				? "var(--color-text)"
				: "var(--color-text-muted)";
			btn.style.borderBottomColor = isTarget
				? "var(--color-accent)"
				: "transparent";
		});

		tabPanels.forEach((panel) => {
			panel.hidden = panel.getAttribute("data-tab-id") !== targetId;
		});
	};

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const targetId = button.getAttribute("data-tab");
			if (!targetId) return;
			activateTab(targetId);
		});
	});
};
```

Key details:
- Named export (project convention -- no default exports)
- Uses `querySelectorAll` with ARIA role selectors to match the DOM contract from Phase 4-01
- `activateTab` extracted as inner function -- will be extended with hash sync in Task 3
- Active state: `color: var(--color-text)`, `borderBottomColor: var(--color-accent)`
- Inactive state: `color: var(--color-text-muted)`, `borderBottomColor: transparent`
- Toggles `hidden` attribute on panels (matches shortcode output)
- Early return if no tab buttons found (safe on non-tab pages)
- No `console.log` (project convention)
- Tab indentation, double quotes, trailing commas (Prettier config)

- [ ] **Step 2: Wire `initTabs` into `index.ts`**

In `hugo/assets/ts/index.ts`, add this import after the existing `import { animate } from "motion";` line:

```typescript
import { initTabs } from "./tabs";
```

Add this call at the end of the `DOMContentLoaded` callback body (after the observer block, before the closing `});`):

```typescript
	initTabs();
```

Do NOT restructure any existing code. Only add the import and the function call.

- [ ] **Step 3: Run the build to verify compilation**

Run: `npm run build`
Expected: Exit 0, no TypeScript compilation errors, "XX pages" built successfully.

- [ ] **Step 4: Commit**

```bash
git add hugo/assets/ts/tabs.ts hugo/assets/ts/index.ts
git commit -m "feat(tabs): add basic tab switching with vanilla TypeScript

Wire initTabs into DOMContentLoaded. Click any tab to show its panel
and hide the others. Visual state (accent border, text color) and
aria-selected attributes update on switch."
```

---

## Task 2: Verify tab switching works in the browser

**Files:** None (manual verification)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Hugo dev server starts at `http://localhost:1313`

- [ ] **Step 2: Open the page and verify tab switching**

Open `http://localhost:1313/how-i-ai` in a browser. Check:
1. "My Stack" tab is active by default (accent orange underline, bright text)
2. Click "Setup" -- Setup content appears, My Stack hides, Setup tab gets orange underline
3. Click "Workflow" -- Workflow content appears, Setup hides
4. Click "Tips" -- Tips content appears
5. Click "My Stack" -- returns to initial state
6. Each panel has real content (headings, lists), not blank
7. Status bar "1/4" still visible at bottom
8. Tab through all 4 buttons with keyboard Tab key -- all focusable

---

## Task 3: Add URL hash sync to tab switching

**Files:**
- Modify: `hugo/assets/ts/tabs.ts`

- [ ] **Step 1: Extend `activateTab` to update URL hash, and add hash-based activation on load**

Replace the contents of `hugo/assets/ts/tabs.ts` with:

```typescript
export const initTabs = (): void => {
	const tabButtons =
		document.querySelectorAll<HTMLButtonElement>("[role='tab']");
	const tabPanels =
		document.querySelectorAll<HTMLDivElement>("[role='tabpanel']");

	if (tabButtons.length === 0) return;

	const validIds = new Set(
		Array.from(tabButtons, (btn) => btn.getAttribute("data-tab")),
	);

	const activateTab = (targetId: string, updateHash = true): void => {
		tabButtons.forEach((btn) => {
			const isTarget = btn.getAttribute("data-tab") === targetId;
			btn.setAttribute("aria-selected", isTarget ? "true" : "false");
			btn.style.color = isTarget
				? "var(--color-text)"
				: "var(--color-text-muted)";
			btn.style.borderBottomColor = isTarget
				? "var(--color-accent)"
				: "transparent";
		});

		tabPanels.forEach((panel) => {
			panel.hidden = panel.getAttribute("data-tab-id") !== targetId;
		});

		if (updateHash) {
			history.replaceState(null, "", `#${targetId}`);
		}
	};

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const targetId = button.getAttribute("data-tab");
			if (!targetId) return;
			activateTab(targetId);
		});
	});

	// Activate tab from URL hash on load
	const hash = window.location.hash.slice(1);
	if (hash && validIds.has(hash)) {
		activateTab(hash, false);
	}

	// Listen for hash changes (back/forward navigation)
	window.addEventListener("hashchange", () => {
		const newHash = window.location.hash.slice(1);
		if (newHash && validIds.has(newHash)) {
			activateTab(newHash, false);
		}
	});
};
```

Key details:
- `validIds` set prevents activation of arbitrary hash values
- `history.replaceState` instead of `pushState` -- avoids polluting browser history with every tab click
- `updateHash` parameter: `false` when activating from hash (prevents redundant hash write)
- `hashchange` listener handles browser back/forward
- On load: if hash matches a valid tab ID, activate that tab instead of the default

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: Exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add hugo/assets/ts/tabs.ts
git commit -m "feat(tabs): add URL hash sync for direct tab linking

Clicking a tab updates the URL hash via replaceState. Loading
/how-i-ai#setup opens the Setup tab directly. Browser back/forward
navigates between tabs via hashchange listener."
```

---

## Task 4: Add smooth CSS transitions when switching tabs

**Files:**
- Modify: `hugo/assets/css/tailwind.css`
- Modify: `hugo/assets/ts/tabs.ts`

- [ ] **Step 1: Add tab panel transition CSS**

In `hugo/assets/css/tailwind.css`, add this block after the `[data-theme="terminal"] :focus-visible` block (before the `@media (prefers-reduced-motion: reduce)` block):

```css
/* TAB PANEL TRANSITIONS */
[data-theme="terminal"] [role="tabpanel"] {
	transition: opacity 0.15s ease-in-out;
}
[data-theme="terminal"] [role="tabpanel"][hidden] {
	display: none;
}
[data-theme="terminal"] [role="tabpanel"].tab-entering {
	opacity: 0;
}
```

Key details:
- Short 150ms fade-in -- fast enough to feel snappy, visible enough to soften the switch
- Hidden panels use `display: none` (matches existing `hidden` attribute behavior)
- `.tab-entering` class applied briefly by JS to trigger the fade-in from 0 to 1

- [ ] **Step 2: Update `tabs.ts` to trigger the fade-in animation**

In `hugo/assets/ts/tabs.ts`, update the `activateTab` function. Replace the `tabPanels.forEach` block:

```typescript
		tabPanels.forEach((panel) => {
			panel.hidden = panel.getAttribute("data-tab-id") !== targetId;
		});
```

With:

```typescript
		tabPanels.forEach((panel) => {
			if (panel.getAttribute("data-tab-id") === targetId) {
				panel.hidden = false;
				panel.classList.add("tab-entering");
				requestAnimationFrame(() => {
					panel.classList.remove("tab-entering");
				});
			} else {
				panel.hidden = true;
				panel.classList.remove("tab-entering");
			}
		});
```

Key details:
- `requestAnimationFrame` ensures the browser paints `opacity: 0` before removing the class triggers the CSS transition to `opacity: 1`
- Hidden panels are hidden immediately (no fade-out -- matches terminal tab behavior)
- The `.tab-entering` class is removed in the next frame, letting CSS `transition: opacity 0.15s` animate from 0 to 1

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: Exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add hugo/assets/css/tailwind.css hugo/assets/ts/tabs.ts
git commit -m "feat(tabs): add smooth opacity transition on tab switch

Tab panels fade in over 150ms via CSS transition. Uses
requestAnimationFrame to ensure the browser paints opacity:0 before
transitioning to opacity:1. Respects prefers-reduced-motion."
```

---

## Task 5: Verify tab interactivity in the browser

**Files:** None (manual verification)

- [ ] **Step 1: Start dev server and test hash sync**

Run: `npm run dev`

1. Open `http://localhost:1313/how-i-ai` -- "My Stack" tab is active, URL has no hash
2. Click "Setup" -- URL changes to `#setup`, Setup content fades in
3. Click "Workflow" -- URL changes to `#workflow`
4. Navigate directly to `http://localhost:1313/how-i-ai#tips` (new tab or refresh) -- Tips tab should be active on load
5. Use browser back button after clicking through tabs -- should navigate between tab states

- [ ] **Step 2: Test transition smoothness**

1. Click between tabs rapidly -- no content flash, no broken states
2. Transition is visible but fast (~150ms)
3. Open DevTools > Elements, check "Disable cache" + "Preserve log"
4. In DevTools > Rendering > check "Emulate CSS media feature prefers-reduced-motion: reduce" -- tab switch should be instant (no animation)

---

## Task 6: Add `how-i-ai` menu entry in Hugo config

**Files:**
- Modify: `hugo/config.toml`

- [ ] **Step 1: Add the menu entry**

In `hugo/config.toml`, add a new menu entry after the "Contact" entry (inside `[languages.en.menu]`):

```toml
      [[languages.en.menu.main]]
        identifier = "how-i-ai"
        name = "How I AI"
        url = "/how-i-ai/"
        weight = 5
        [languages.en.menu.main.params]
          style = "led-button"
```

Key details:
- `weight = 5` places it after Contact (weight 4)
- Custom param `style = "led-button"` lets the header template detect this item and render it differently
- The `name` uses the same "How I AI" title as the page

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: Exit 0, nav now includes the new item.

- [ ] **Step 3: Commit**

```bash
git add hugo/config.toml
git commit -m "feat(nav): add how-i-ai menu entry with led-button style param

Adds /how-i-ai/ to main navigation with weight 5 (after Contact).
Custom style param 'led-button' will be used by header partial to
render a distinctive button style."
```

---

## Task 7: Create the LED button nav partial

**Files:**
- Create: `hugo/layouts/partials/nav/how-i-ai-button.html`

- [ ] **Step 1: Create the LED button partial**

Create `hugo/layouts/partials/nav/how-i-ai-button.html`:

```html
{{/* LED-style navigation button for /how-i-ai */}}
<a
	href="{{ .URL }}"
	class="how-i-ai-nav-button inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
	style="border: 1px solid var(--color-accent, #ff4309); color: var(--color-accent, #ff4309);"
	{{ if eq $.Page.RelPermalink .URL }}aria-current="page"{{ end }}
>
	<span
		class="led-dot"
		style="width: 6px; height: 6px; border-radius: 50%; background-color: var(--color-accent, #ff4309); box-shadow: 0 0 4px rgba(255, 67, 9, 0.6), 0 0 8px rgba(255, 67, 9, 0.3); display: inline-block; flex-shrink: 0;"
		aria-hidden="true"
	></span>
	{{ .Name }}
</a>
```

Key details:
- `inline-flex items-center gap-2` for LED dot + text alignment
- Accent-colored border gives button feel without background (keeps it light/modern)
- LED dot: 6px circle with accent color + double box-shadow for glow effect
- `aria-hidden="true"` on decorative LED dot
- `aria-current="page"` when on the how-i-ai page
- Focus visible styles match existing site pattern
- `var(--color-accent, #ff4309)` with fallback for pages without theme vars
- `whitespace-nowrap` prevents text wrapping on smaller screens

- [ ] **Step 2: Verify the file was created**

Run: `grep -q 'led-dot' hugo/layouts/partials/nav/how-i-ai-button.html && echo "PASS" || echo "FAIL"`
Expected: PASS

---

## Task 8: Update `header.html` to render the LED button

**Files:**
- Modify: `hugo/layouts/partials/header.html`

- [ ] **Step 1: Add conditional rendering for LED-button style items**

In `hugo/layouts/partials/header.html`, replace the nav `<ul>` loop (lines 5-19):

```html
		<ul
			class="flex items-center gap-4 text-base font-semibold text-neutral-800 md:gap-10 md:text-2xl"
		>
			{{ range .Site.Menus.main }}
				{{ if ne .Params.hidden "true" }}
					{{ if eq .Params.style "led-button" }}
						<li>
							{{ partial "nav/how-i-ai-button.html" (dict "URL" .URL "Name" .Name "Page" $.Page) }}
						</li>
					{{ else }}
						<li>
							<a
								class="link-strikethrough {{ if eq $.Page.RelPermalink .URL }}link-strikethrough--active{{ end }} whitespace-nowrap"
								href="{{ .URL }}"
								{{ if eq $.Page.RelPermalink .URL }}aria-current="page"{{ end }}
							>
								{{ .Name }}
							</a>
						</li>
					{{ end }}
				{{ end }}
			{{ end }}
		</ul>
```

Key details:
- Items with `style = "led-button"` param render via the LED button partial
- All other items render exactly as before (no visual change to existing nav)
- Context dict passes `.URL`, `.Name`, and `$.Page` to the partial
- The `items-center` class is added to the `<ul>` to vertically center the LED button with the text links (LED button has different height due to padding/border)

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: Exit 0, no template errors.

- [ ] **Step 3: Commit**

```bash
git add hugo/layouts/partials/nav/how-i-ai-button.html hugo/layouts/partials/header.html
git commit -m "feat(nav): render LED-style button for how-i-ai nav item

Items with style='led-button' param render via a dedicated partial
with accent-colored border, LED indicator dot with glow, and proper
focus/aria attributes. Other nav items unchanged."
```

---

## Task 9: Add LED button CSS for hover and active-page states

**Files:**
- Modify: `hugo/assets/css/tailwind.css`

- [ ] **Step 1: Add LED button styles**

In `hugo/assets/css/tailwind.css`, add this block after the `/* COMPONENTS */` section (after `.link-strikethrough--active` and before `.center--horizontal-vertical`):

```css
.how-i-ai-nav-button:hover {
	background-color: rgba(255, 67, 9, 0.08);
}
.how-i-ai-nav-button:hover .led-dot {
	box-shadow: 0 0 6px rgba(255, 67, 9, 0.8), 0 0 12px rgba(255, 67, 9, 0.4);
}
.how-i-ai-nav-button[aria-current="page"] {
	background-color: rgba(255, 67, 9, 0.1);
}
```

Key details:
- Hover: subtle accent tint background + intensified LED glow
- Active page: slightly stronger accent tint (persistent)
- No color change on the text or border -- just background tint and glow intensity
- Uses `rgba` of the accent color for consistency

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: Exit 0.

- [ ] **Step 3: Commit**

```bash
git add hugo/assets/css/tailwind.css
git commit -m "feat(nav): add hover and active-page styles for LED nav button

Hover shows subtle accent tint background with intensified LED glow.
Active page state shows persistent accent tint."
```

---

## Task 10: Verify navigation entry in the browser

**Files:** None (manual verification)

- [ ] **Step 1: Test navigation on a non-how-i-ai page**

Run: `npm run dev`

1. Open `http://localhost:1313/about/` (or any non-how-i-ai page)
2. Nav should show: About, Contact, How I AI
3. "How I AI" should appear as a button with accent border and glowing LED dot
4. Hover over "How I AI" -- subtle background tint, brighter LED glow
5. About and Contact links should look exactly as before (strikethrough style)
6. Click "How I AI" -- navigates to `/how-i-ai/`

- [ ] **Step 2: Test navigation on the how-i-ai page**

1. On `/how-i-ai/` page, the "How I AI" nav button should have the active-page background tint
2. The LED dot should still glow
3. Other nav items (About, Contact) should show their normal dark text (even though the page is dark-themed, the header uses its own color scheme)

- [ ] **Step 3: Test keyboard accessibility**

1. Tab through the navigation -- "How I AI" button should receive focus
2. Focus ring should be visible (accent outline)
3. Press Enter on focused button -- navigates to `/how-i-ai/`

- [ ] **Step 4: Test mobile (375px)**

1. Open DevTools device toolbar at 375px
2. Nav items should not overflow -- check "How I AI" button still fits
3. If it overflows, the `whitespace-nowrap` + smaller `gap-4` should keep it compact

---

## Self-Review Checklist

### Spec Coverage

| Requirement | Task | Status |
|-------------|------|--------|
| TABS-01 (click to switch) | Task 1 | Covered -- `activateTab` toggles panels and visual state |
| TABS-02 (URL hash sync) | Task 3 | Covered -- `replaceState` + `hashchange` listener |
| TABS-03 (smooth transitions) | Task 4 | Covered -- CSS opacity transition 150ms |
| NAV-01 (accessible from nav) | Task 6 | Covered -- menu entry in config.toml |
| NAV-02 (distinct button style) | Tasks 7, 8 | Covered -- accent border + LED partial |
| NAV-03 (LED indicator dot) | Task 7 | Covered -- 6px dot with box-shadow glow |

### Placeholder Scan
- No "TBD", "TODO", "implement later" in any task
- All code blocks contain complete, copy-paste-ready code
- All commands include expected output

### Type Consistency
- `initTabs` -- same name in `tabs.ts` export and `index.ts` import
- `activateTab` -- internal function, consistent signature throughout
- `data-tab` attribute on buttons matched by `getAttribute("data-tab")` in JS
- `data-tab-id` attribute on panels matched by `getAttribute("data-tab-id")` in JS
- CSS class `.tab-entering` used in both `tailwind.css` and `tabs.ts`
- CSS class `.how-i-ai-nav-button` used in both `tailwind.css` and the button partial
- CSS class `.led-dot` used in both `tailwind.css` hover rule and the button partial
