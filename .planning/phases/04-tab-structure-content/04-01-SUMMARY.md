---
phase: 04-tab-structure-content
plan: "01"
subsystem: how-i-ai-page
tags:
  - type/execute
  - phase/04
  - feature/tabs
  - feature/content
dependency_graph:
  requires:
    - 03-01 (terminal chrome partial)
  provides:
    - Tab DOM structure for JS tab switching (Plan 02)
    - H1 intro block above terminal frame
    - 4 tab panels with placeholder content
  affects:
    - hugo/layouts/partials/terminal-frame.html
    - hugo/content/how-i-ai/_index.en.html
    - hugo/layouts/shortcodes/tab.html
tech_stack:
  added:
    - Hugo shortcode (tab.html) -- paired shortcode with .Inner | safeHTML
  patterns:
    - Hugo paired shortcode with ARIA tabpanel role
    - Tab strip with native button elements and ARIA tablist
    - Content stored in Hugo content files (not hardcoded in layouts)
key_files:
  created:
    - hugo/layouts/shortcodes/tab.html
  modified:
    - hugo/content/how-i-ai/_index.en.html
    - hugo/layouts/partials/terminal-frame.html
decisions:
  - "Hugo shortcode uses .Inner | safeHTML to prevent HTML entity double-escaping in .html content files"
  - "H1 placed above terminal frame (not inside .Content) so it renders outside scrollable area"
  - "Tab strip uses native <button> elements (no role=button hack) for keyboard accessibility"
  - "Tab panels all in DOM at page load -- hidden attribute toggled by JS (not create/destroy)"
metrics:
  duration: 1min
  completed_date: "2026-04-01"
  tasks_completed: 3
  files_changed: 3
---

# Phase 4 Plan 01: Tab Structure and Content Skeleton Summary

**One-liner:** Hugo tab shortcode + 4 tabpanel panels with realistic content + tab strip row in terminal chrome, H1 above frame.

## What Was Built

Three files form the complete tab DOM skeleton:

1. **`hugo/layouts/shortcodes/tab.html`** - Paired shortcode that wraps inner HTML content in a `role="tabpanel"` div with ARIA attributes (`id`, `aria-labelledby`, `data-tab-id`) and conditional `hidden` attribute based on the `active` parameter.

2. **`hugo/content/how-i-ai/_index.en.html`** - Replaced placeholder H1/p with four `{{< tab >}}` shortcode invocations containing realistic placeholder content (My Stack, Setup, Workflow, Tips). First tab has `active="true"`. Old H1 removed to prevent duplicate heading.

3. **`hugo/layouts/partials/terminal-frame.html`** - Two additions:
   - H1 intro block before the terminal frame `base-grid` div, with `clamp(2rem, 5vw, 4rem)` typography and en-dash tagline
   - Tab strip `role="tablist"` div between title bar and content area, containing 4 `role="tab"` buttons with matching `aria-controls`, `data-tab`, and initial active/inactive visual state

## Decisions Made

- **`.Inner | safeHTML`**: Without `safeHTML`, Hugo escapes HTML entities inside shortcodes in `.html` files. Required to prevent `<strong>` rendering as `&lt;strong&gt;`.
- **H1 outside `.Content`**: Moving H1 before the terminal frame (not inside `_index.en.html`) ensures it renders at the page level, not inside the scrollable terminal content area. This satisfies D-01.
- **All panels in DOM at load**: `hidden` attribute on inactive panels (not `display:none` via class, not conditional rendering). This matches D-06 -- TypeScript simply toggles `hidden` rather than creating/destroying DOM.
- **Native `<button>` elements**: No `role="button"` on `<div>` -- proper semantic HTML provides keyboard and AT support without extra ARIA.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- Tab panel content is intentional placeholder content -- this is the final content structure per the plan scope. Content represents Jan's actual workflow accurately enough for Phase 4 purposes.
- The `1/4` status bar pagination is a visual stub (hardcoded, not wired to active tab). This is pre-existing from Phase 02 and out of scope for this plan.

## Self-Check: PASSED

Files verified:
- hugo/layouts/shortcodes/tab.html: EXISTS
- hugo/content/how-i-ai/_index.en.html: EXISTS, 4 tabs, no h1
- hugo/layouts/partials/terminal-frame.html: EXISTS, tablist, 4 role=tab, h1

Commits verified:
- 037c8eb: feat(04-01): create tab panel shortcode template
- fe64bfd: feat(04-01): replace placeholder with 4 tab shortcodes and content
- f7bb335: feat(04-01): add H1 intro block and 4-button tab strip to terminal frame

Build: npm run build passes in 65ms, 36 pages.
