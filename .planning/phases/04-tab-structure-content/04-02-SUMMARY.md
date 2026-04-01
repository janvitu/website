---
phase: 04-tab-structure-content
plan: "02"
subsystem: how-i-ai-page
tags:
  - type/execute
  - phase/04
  - feature/tabs
  - feature/typescript
dependency_graph:
  requires:
    - 04-01 (tab DOM structure -- tablist, role=tab buttons, role=tabpanel panels)
  provides:
    - Click-to-switch tab behavior (TABS-01 interactive part)
  affects:
    - hugo/assets/ts/tabs.ts
    - hugo/assets/ts/index.ts
tech_stack:
  added: []
  patterns:
    - Vanilla TS module with named export (no default exports per project convention)
    - querySelectorAll with ARIA role selectors
    - hidden attribute toggle for panel visibility
    - Inline style manipulation for active/inactive tab visual state
key_files:
  created:
    - hugo/assets/ts/tabs.ts
  modified:
    - hugo/assets/ts/index.ts
decisions:
  - "initTabs uses querySelectorAll with ARIA role selectors -- ties JS to semantic HTML, not class names"
  - "Defensive first-panel activation on load -- belt-and-suspenders with shortcode active=true"
  - "No URL hash sync, no transitions -- deferred to Phase 5 per D-07"
requirements-completed: [TABS-01]
metrics:
  duration: 5min
  completed_date: "2026-04-01"
  tasks_completed: 2
  files_changed: 2
---

# Phase 4 Plan 02: Tab Switching TypeScript Module Summary

**One-liner:** Vanilla TS initTabs module wired into index.ts -- click-to-switch tabs with ARIA state and inline style updates.

## What Was Built

Two files deliver the interactive tab behavior:

1. **`hugo/assets/ts/tabs.ts`** (new) - Exported `initTabs` function that:
   - Queries all `[role='tab']` buttons and `[role='tabpanel']` divs via `querySelectorAll`
   - On load: defensively sets first tab active (aria-selected=true, accent border, full-color text) and ensures first panel is visible
   - On click: deactivates all tabs (aria-selected=false, muted text, transparent border), hides all panels, then activates the clicked tab and shows its matching panel via `getElementById("panel-" + data-tab)`
   - Returns early if no tab buttons found (graceful on non-tab pages)
   - No console.log calls; tab/double-quote/trailing-comma style per project Prettier config

2. **`hugo/assets/ts/index.ts`** (modified) - Added `import { initTabs } from "./tabs"` and `initTabs()` call at the end of the `DOMContentLoaded` callback. No existing code restructured.

## Decisions Made

- **ARIA role selectors**: `querySelectorAll("[role='tab']")` ties JS to semantic HTML rather than class names. If classes change for styling reasons, JS still works.
- **Defensive first-panel init**: Redundant with shortcode `active="true"` but protects against edge cases where shortcode attribute is accidentally removed.
- **No hash sync / no transitions**: Explicitly deferred to Phase 5 per plan decision D-07.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- The `1/4` status bar pagination is hardcoded and not wired to the active tab. Pre-existing from Phase 02, out of scope for this plan. Will be addressed in a future phase if needed.

## Self-Check: PASSED

Files verified:
- hugo/assets/ts/tabs.ts: EXISTS, contains `export const initTabs`, `querySelectorAll`, `[role='tab']`, `[role='tabpanel']`, aria-selected, style.color, style.borderBottomColor, hidden toggle
- hugo/assets/ts/index.ts: EXISTS, contains `import { initTabs } from "./tabs"`, `initTabs()` inside DOMContentLoaded

Commits verified:
- daa34cb: feat(04-02): add initTabs module and wire into index.ts

Build: npm run build passes in 75ms, 34 pages.

## Human Verification: APPROVED

Task 2 browser verification was approved by the human. Confirmed:
- H1 "How I AI" heading and tagline visible above terminal frame
- No duplicate H1 inside terminal content area
- 4 tab buttons (My Stack, Setup, Workflow, Tips) visible in the tab strip
- Tab strip sits between title bar and content area
- "My Stack" tab active on page load with accent orange underline
- Clicking each tab shows its panel and hides the others
- Each tab has realistic placeholder content
- Status bar `1/4` remains visible at bottom
- Keyboard navigation through tabs works
- Mobile layout does not overflow horizontally

## Next Phase Readiness

Phase 4 is complete. Phase 5 (Tab Interactivity) can begin:
- URL hash sync on tab change
- Direct hash URL loading the correct tab
- Smooth CSS transitions on panel change

The DOM structure (ARIA roles, data-tab attributes, panel IDs) is in place. Phase 5 only needs to extend the existing `initTabs` logic.
