---
phase: 01-dark-theme-foundation
plan: "01"
subsystem: ui
tags: [hugo, tailwind, css, dark-theme, layout]

# Dependency graph
requires: []
provides:
  - Hugo section layout for /how-i-ai with data-theme="terminal" on body
  - Dark theme CSS custom properties scoped to [data-theme="terminal"]
  - Dark grid line override (#3a3a3a)
  - White 2px focus-visible ring for accessibility on dark background
  - /how-i-ai route available in build output
affects: [02-terminal-chrome, 03-tab-navigation, 04-content-structure]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dark theme scoping via data-theme attribute on body element, never touching global selectors"
    - "Section-specific baseof.html in hugo/layouts/{section}/ overrides _default/baseof.html via Hugo lookup order"

key-files:
  created:
    - hugo/layouts/how-i-ai/baseof.html
    - hugo/layouts/how-i-ai/list.html
    - hugo/content/how-i-ai/_index.en.html
  modified:
    - hugo/assets/css/tailwind.css

key-decisions:
  - "Dark theme scoped to [data-theme=terminal] on body - no global style changes"
  - "Hugo section layout lookup (how-i-ai/baseof.html) eliminates need for any Hugo config changes"
  - "CSS specificity (0,1,0) for attribute selector beats body element selector (0,0,1) ensuring dark background overrides bg-neutral-100"

patterns-established:
  - "Section override pattern: copy _default/baseof.html into hugo/layouts/{section}/baseof.html and add single attribute"
  - "Dark theme CSS: append [data-theme] blocks above @media (prefers-reduced-motion) in tailwind.css"

requirements-completed: [THEME-01, THEME-02, THEME-03]

# Metrics
duration: 35min
completed: 2026-03-29
---

# Phase 01 Plan 01: Dark Theme Foundation Summary

**Scoped dark theme (#1a1a1a background, #3a3a3a grid lines, white focus ring) for /how-i-ai via Hugo section layout override and [data-theme="terminal"] CSS selector - zero global style changes, human-verified**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-03-29T09:00:00Z
- **Completed:** 2026-03-29T09:19:24Z
- **Tasks:** 3 of 3 complete
- **Files modified:** 4

## Accomplishments

- Created Hugo section layout (how-i-ai/baseof.html) with data-theme="terminal" on body - zero config changes needed
- Added dark theme CSS block to tailwind.css with 5 custom properties, grid line override, and white focus ring
- /how-i-ai route built and available in dist/ with dark theme attribute in rendered HTML
- Human-verified: /how-i-ai renders dark (#1a1a1a), /about stays light (neutral-100), no theme bleed

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hugo layout and content files for /how-i-ai** - `475cb63` (feat)
2. **Task 2: Add dark theme CSS custom properties and overrides to tailwind.css** - `2d1fe9b` (feat)
3. **Task 3: Verify dark theme renders correctly** - checkpoint:human-verify (approved, no code commit)

## Files Created/Modified

- `hugo/layouts/how-i-ai/baseof.html` - Section baseof with data-theme="terminal" on body, all partials preserved
- `hugo/layouts/how-i-ai/list.html` - Minimal section list template
- `hugo/content/how-i-ai/_index.en.html` - Placeholder content with How I AI heading
- `hugo/assets/css/tailwind.css` - Added [data-theme="terminal"] dark theme block (lines 71-90)

## Decisions Made

- Copied _default/baseof.html exactly, changing only the body tag - preserves all partials (grid, header, footer, contactSide, skip-to-content, JS build)
- CSS appended above @media (prefers-reduced-motion) block for logical reading order: components, dark theme, reduced motion
- Inline font-size override on h1 (2.25rem) to bypass the global clamp() rule designed for hero sections

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

- `hugo/content/how-i-ai/_index.en.html` - Contains placeholder text "Terminal interface loading -- content coming in Phase 4." This is intentional per the plan; Phase 4 will populate actual content.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Dark theme foundation in place; Phase 02 (terminal chrome) can add header/status bar within the [data-theme="terminal"] scope
- CSS custom properties (--color-bg, --color-bg-surface, --color-border, --color-text, --color-text-muted) available for use in subsequent phases
- /how-i-ai route exists and renders correctly

## Self-Check: PASSED

- `dist/how-i-ai/index.html` - FOUND
- `data-theme=terminal` in dist output - FOUND (Hugo minifies attribute quotes, valid HTML)
- `[data-theme="terminal"]` in tailwind.css - FOUND (3 occurrences)
- `hugo/layouts/_default/baseof.html` - NOT modified (confirmed via git diff)
- `hugo/layouts/partials/grid.html` - NOT modified (confirmed via git diff)
- `npm run build` - PASSED (exit code 0, 36 pages)

---
*Phase: 01-dark-theme-foundation*
*Completed: 2026-03-29*
