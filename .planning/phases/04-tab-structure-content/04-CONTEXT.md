# Phase 4: Tab Structure & Content - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the 4-tab navigation strip inside the terminal window and scaffold realistic placeholder content stored in Hugo shortcodes. Basic click-to-switch tab behavior is included. URL hash sync, smooth transitions, and sub-tab interactivity are Phase 5. Status bar pagination counter stays static until Phase 5.

This phase also folds in the pending todo: add an H1 page heading and tagline above the terminal frame.

</domain>

<decisions>
## Implementation Decisions

### H1 Intro (folded todo)
- **D-01:** Add an H1 "How I AI" heading and a short tagline/description above the terminal frame in the dark-themed page body. Use existing dark theme tokens (`--color-text`, `--color-text-muted`). Fit within the 12-column grid — same column span as the terminal frame (`col-start-2 col-end-12` mobile, `md:col-start-3 md:col-end-11` desktop).

### Tab Strip
- **D-02:** Tabs sit in a dedicated row between the title bar and the content area — not inside the title bar, not inside the scrollable content. Title bar (`~/how-i-ai` + dots) remains unchanged.
- **D-03:** Active tab is indicated by an accent orange (`#ff4309`) bottom border/underline. Inactive tabs have no background or underline — purely typographic with muted color.
- **D-04:** Tab strip architecture must support optional nested sub-tabs within a panel (the HTML/shortcode structure accommodates it), but Phase 4 placeholder content does not use sub-tabs. Sub-tab interactivity is Phase 5 scope.

### Content Storage
- **D-05:** Tab content stored as Hugo shortcodes in `hugo/content/how-i-ai/_index.en.html`. Each tab wrapped in a custom `{{< tab >}}` shortcode with `id` and `label` attributes. The shortcode and its template are created as part of this phase.
- **D-06:** All tab panels must be rendered in the DOM at page load (not lazy-loaded). JavaScript shows/hides panels via CSS (e.g., toggling a class or `display`). This ensures all tab content is present in the HTML source for search indexability.

### Tab Interactivity (Phase 4 scope)
- **D-07:** Basic click-to-switch implemented in vanilla TypeScript (no SolidJS). Clicking a tab shows its panel and hides the others. No URL hash sync, no smooth transitions — those are Phase 5.
- **D-08:** Status bar `[1/4]` pagination counter stays hardcoded/static in Phase 4. Dynamic counter update deferred to Phase 5.

### Placeholder Content
- **D-09:** Each of the 4 tabs (My Stack, Setup, Workflow, Tips) is scaffolded with realistic structure: a section heading, a few sub-section headings (`H2`/`H3`), and short placeholder items or descriptions. Content reflects the eventual shape of real content — not just "coming soon" text.

### Claude's Discretion
- Exact height and padding of the tab strip row
- Font style of tab labels (monospace to match terminal aesthetic, or sans-serif Gilroy for readability)
- Spacing between tab labels
- Inactive tab text color (e.g., `--color-text-muted` or slightly lighter)
- Exact shortcode HTML output structure (div with data-tab-id, ARIA roles for tablist/tab/tabpanel)
- Whether the tab strip is a separate partial or inline in `terminal-frame.html`
- Exact placeholder text content for each tab

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Terminal Chrome (current state)
- `hugo/layouts/partials/terminal-frame.html` — Terminal chrome partial; tab strip row and H1 intro are added here or via a new partial called from here

### Styles
- `hugo/assets/css/tailwind.css` — `[data-theme="terminal"]` block with CSS custom properties (`--color-bg`, `--color-bg-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`); `.base-grid` utility; responsive patterns

### Content
- `hugo/content/how-i-ai/_index.en.html` — Current placeholder content; will be replaced with `{{< tab >}}` shortcodes

### Layout
- `hugo/layouts/how-i-ai/list.html` — Calls `terminal-frame.html` partial; renders `.Content` inside the scrollable area
- `hugo/layouts/how-i-ai/baseof.html` — Section-specific base layout with `[data-theme="terminal"]` on body

### TypeScript
- `hugo/assets/ts/index.ts` — Existing TS entry point; tab switching logic can be added here or in a new module following established patterns

### Requirements
- `.planning/REQUIREMENTS.md` — TABS-01, CONT-01, CONT-02 define acceptance criteria for this phase

### Pending Todo (folded)
- `.planning/todos/pending/2026-03-30-add-h1-title-and-description-above-terminal-frame.md` — H1 + tagline todo, now in scope

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `--color-accent` (#ff4309): already used for status bar `[1/4]` orange glow — reuse for active tab underline
- `--color-text-muted`: use for inactive tab label color
- `--color-border`: use for tab strip bottom border separator
- `.base-grid` + `col-start-2 col-end-12 md:col-start-3 md:col-end-11`: established column span pattern from Phase 3, apply to H1 intro wrapper

### Established Patterns
- Hugo partials: terminal chrome is a single `terminal-frame.html` — tab strip can be inline or a new partial called from it
- Vanilla TS: `hugo/assets/ts/index.ts` handles DOM interaction (scroll-to-top button, scroll animation) — tab switching follows the same `querySelector` / `addEventListener` pattern
- Responsive: Tailwind breakpoint prefixes (`md:`) inline on HTML elements — follow same pattern for tab strip mobile behavior
- Dark theme tokens: always use CSS custom properties (`var(--color-*)`) rather than hardcoded hex for themed colors

### Integration Points
- `terminal-frame.html`: insert tab strip row between title bar div and content area div
- Content area `<div class="flex-1 overflow-y-auto">`: this is where tab panels render (replacing bare `{{ .Content }}` with panel containers)
- `hugo/assets/ts/index.ts` or a new TS module: add tab click handler that toggles active state and shows/hides panels

</code_context>

<specifics>
## Specific Ideas

- Active tab: bottom border in accent orange `#ff4309` (consistent with status bar's orange glow for `1/4`)
- SEO requirement: all tab panel HTML must be in the DOM on page load — JS toggles visibility only (no dynamic HTML injection per tab)
- Sub-tab architecture: shortcode or HTML structure should have a clear extension point for a nested tab list in the future, even if unused in Phase 4 content
- H1 position: above the terminal frame card, within the same base-grid layout; below the site header

</specifics>

<deferred>
## Deferred Ideas

- Sub-tab interactivity — HTML supports it, switching behavior goes into Phase 5
- Status bar `[1/4]` dynamic counter — Phase 5
- URL hash sync — Phase 5 (TABS-02)
- Smooth tab transition animation — Phase 5 (TABS-03)
- Animated `Thinking...` ellipsis in status bar — noted in Phase 2, still deferred

### Reviewed Todos (not folded)
- None — the only matched todo (H1 title above terminal frame) was folded into scope.

</deferred>

---

*Phase: 04-tab-structure-content*
*Context gathered: 2026-03-30*
