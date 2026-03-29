---
phase: 02-terminal-chrome
plan: 01
subsystem: ui
tags: [hugo, tailwind, terminal, dark-theme, css-custom-properties, accessibility]

# Dependency graph
requires:
  - phase: 01-dark-theme-foundation
    provides: "[data-theme=terminal] CSS block with --color-bg, --color-bg-surface, --color-border, --color-text, --color-text-muted, --color-accent variables and dark background styles"
provides:
  - "hugo/layouts/partials/terminal-frame.html -- terminal card wrapper with title bar (traffic light dots + ~/how-i-ai path), scrollable content area, and pinned status bar"
  - "Terminal chrome CSS in tailwind.css: .terminal-glow radial-gradient pseudo-element and --terminal-height custom property"
  - "list.html wired to call terminal-frame.html partial, dist/how-i-ai/index.html contains full chrome markup"
affects: [03-tab-navigation, 04-tab-content, 05-tab-switching]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Terminal chrome built as a single Hugo partial (terminal-frame.html) rather than three separate partials -- inline HTML judged more readable for this static chrome"
    - "Glow effect via ::before pseudo-element on .terminal-glow class, z-index: -1, radial-gradient at 6% opacity -- avoids extra wrapper div"
    - "--terminal-height CSS custom property uses calc(100dvh - 80px - 128px - 96px) to fill viewport between fixed header and footer"

key-files:
  created:
    - hugo/layouts/partials/terminal-frame.html
  modified:
    - hugo/assets/css/tailwind.css
    - hugo/layouts/how-i-ai/list.html
    - hugo/content/how-i-ai/_index.en.html

key-decisions:
  - "All chrome markup (title bar + status bar) kept in single terminal-frame.html partial -- collapsed from potential three-partial structure for readability"
  - "Traffic light dot colors hardcoded as hex (#ff5f56, #ffbd2e, #27c93f) per UI-SPEC, not as CSS variables -- these are macOS conventions, not design tokens"
  - "--terminal-height hardcoded as calc(100dvh - 80px - 128px - 96px) because header/footer heights are not declared as CSS variables in Phase 1 output"

patterns-established:
  - "Terminal chrome pattern: title bar (40px fixed) + scrollable content area (flex-1 overflow-y-auto) + status bar (36px fixed pinned bottom)"
  - "Chrome elements marked aria-hidden=true; outer card gets role=region + aria-label=Terminal window for screen reader accessibility"
  - "Content file (_index.en.html) contains only inner content -- no grid wrapper, no padding -- terminal-frame.html provides all structural layout"

requirements-completed: [TERM-01, TERM-02, TERM-04]

# Metrics
duration: ~35min
completed: 2026-03-29
---

# Phase 2 Plan 01: Terminal Chrome Summary

**macOS-style terminal chrome partial (title bar with red/yellow/green dots, scrollable content area, pinned status bar with claude-code + 1/4 pagination + Opus 4.6 model info) and warm radial glow behind the card**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-03-29T10:30:00Z
- **Completed:** 2026-03-29T11:05:00Z
- **Tasks:** 3 of 3 complete
- **Files modified:** 4

## Accomplishments

- Created `hugo/layouts/partials/terminal-frame.html` with complete terminal chrome: title bar (traffic light dots + ~/how-i-ai path centered in monospace), scrollable content area rendering `.Content`, pinned status bar (green indicator + claude-code, 1/4 in accent orange with text-shadow neon glow, Opus 4.6 model info)
- Added `.terminal-glow` CSS class with `::before` radial-gradient pseudo-element (rgba(255,67,9,0.06) at 80% x 60% ellipse) for subtle warm monitor-backlight glow behind the card
- Added `--terminal-height` CSS custom property (`calc(100dvh - 80px - 128px - 96px)`) keeping the card filling the viewport between header and footer
- Wired `terminal-frame.html` into `hugo/layouts/how-i-ai/list.html` and cleaned `_index.en.html` content file of its grid wrapper (terminal-frame provides all structural layout)
- Human visual verification passed: terminal card, title bar, status bar, and glow all confirmed correct; minor padding/min-height/pagination alignment tweaks applied post-review

## Task Commits

Each task was committed atomically:

1. **Task 1: Add terminal chrome CSS and create terminal-frame partial** - `618aa1e` (feat)
2. **Task 2: Wire terminal-frame partial into list.html and update content file** - `a0736ee` (feat)
3. **Task 3: Visual verification of terminal chrome** - `173476f` (fix) -- post-review tweaks: padding, min-height, pagination alignment

## Files Created/Modified

- `hugo/layouts/partials/terminal-frame.html` - New: terminal card wrapper with title bar, content area, and status bar chrome
- `hugo/assets/css/tailwind.css` - Added: .terminal-glow pseudo-element class and --terminal-height custom property inside [data-theme="terminal"]
- `hugo/layouts/how-i-ai/list.html` - Updated: now calls `{{ partial "terminal-frame.html" . }}` instead of bare `{{ .Content }}`
- `hugo/content/how-i-ai/_index.en.html` - Updated: removed base-grid wrapper div; content is now bare HTML to sit inside the terminal frame's padding

## Decisions Made

- Collapsed terminal chrome into a single partial (vs. three partials for title bar, content, status bar) -- inline HTML is more readable for this static markup with no conditional logic
- Hardcoded `--terminal-height` values because Phase 1 did not declare CSS variables for header/footer heights; header is fixed at top-[20px] with ~60px height = ~80px total, footer py-16 = 128px
- Traffic light dot colors are macOS conventions (#ff5f56, #ffbd2e, #27c93f) -- kept as hex, not mapped to CSS variables

## Deviations from Plan

None - plan executed exactly as written. Post-review fix commit (`173476f`) refined spacing and alignment after human visual verification; this is part of the checkpoint:human-verify flow, not an unplanned deviation.

## Issues Encountered

None - Hugo build succeeded on first attempt, all acceptance criteria passed. Human visual review approved with only minor cosmetic tweaks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Terminal frame partial is wired, building correctly, and visually verified
- Ready for Phase 3 (tab navigation scaffold)
- The content area currently renders the placeholder _index.en.html content; Phase 4 will replace this with tabbed content

---
*Phase: 02-terminal-chrome*
*Completed: 2026-03-29*
