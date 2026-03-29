# How I AI

## What This Is

A new page on Jan's personal website at `/how-i-ai` - a living knowledge base about how he uses AI in his product management workflow. Dark-themed with a terminal window aesthetic, featuring tabbed sections for tools, setup, workflow, and tips. Designed to be continuously updated as his AI usage evolves.

## Core Value

A single, well-organized place to share and maintain my evolving AI workflow - tools, setup, process, and learnings.

## Requirements

### Validated

- ✓ Hugo static site with 12-column grid layout - existing
- ✓ Tailwind CSS design system with accent color `#ff4309` - existing
- ✓ Navigation system with menu items - existing
- ✓ Background grid partial - existing
- ✓ Gilroy font family - existing
- ✓ Responsive design patterns - existing

### Validated

- ✓ Dark color scheme scoped to `/how-i-ai` only via `[data-theme="terminal"]` on `<body>` - Validated in Phase 1: Dark Theme Foundation
- ✓ Background grid preserved on dark theme (grid lines recolored to `#3a3a3a`) - Validated in Phase 1: Dark Theme Foundation
- ✓ Focus indicators accessible on dark background (white 2px outline) - Validated in Phase 1: Dark Theme Foundation

### Active

- ✓ Dark-themed `/how-i-ai` page with terminal window aesthetic - Validated in Phase 2: Terminal Chrome
- ✓ Terminal chrome: title bar at top, status bar at bottom showing "claude" and model info - Validated in Phase 2: Terminal Chrome
- [ ] Tabbed navigation with 4 tabs: My Stack, Setup, Workflow, Tips
- [ ] Tab content switching (click tabs to show different content)
- [ ] Scaffold placeholder content for all 4 tabs
- [ ] Navigation entry: distinctive button-style item with diode/LED indicator, modern and minimal
- [ ] Design fits within existing site's visual language (Gilroy font, accent color, grid system)
- [ ] Monospace typography elements for terminal feel
- [ ] Future-ready structure for adding article-style resources

### Out of Scope

- CMS or dynamic content management - content will be updated manually in Hugo templates
- Multi-language support for this page - English only for now
- Interactive terminal emulation - this is visual styling, not a real terminal
- User comments or feedback on the page - static content only
- Search within the page - tabs are sufficient navigation for current scope

## Context

- Existing Hugo + Tailwind site deployed on Netlify
- Site uses Gilroy (sans-serif) as primary font, system monospace for code
- 12-column grid system with background grid overlay partial
- Current nav items: About, Contact (Work and Blog commented out)
- SolidJS is available for interactive components (currently used for cookie consent)
- Accent color: `#ff4309` (orange/coral)
- Inspiration: Terminal/CLI aesthetic similar to bcherny's Claude Code tips page - tabbed interface within a terminal-styled window
- The page should feel like a different "mode" of the site (dark) while still belonging to it

## Constraints

- **Tech stack**: Hugo templates + Tailwind CSS + vanilla TypeScript (match existing patterns)
- **Design**: Must use existing Gilroy font, accent color, and grid system
- **Dark theme**: Scoped to this page only - rest of site stays light
- **Performance**: No additional JS frameworks - use Hugo templates + vanilla TS for tab switching
- **Accessibility**: Keyboard navigation for tabs, proper ARIA roles

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark theme scoped to page only | Rest of site is light, this page represents a different "mode" | `data-theme="terminal"` on `<body>` via section-specific baseof.html — confirmed Phase 1 |
| Vanilla TS for tabs (not SolidJS) | Simple tab switching doesn't need a reactive framework | - Pending Phase 5 |
| Terminal window aesthetic | Matches AI/dev tooling vibe, inspired by reference screenshot | `terminal-frame.html` partial with title bar, status bar, glow — confirmed Phase 2 |
| Nav button with diode indicator | Visually distinct from other nav items, signals "new/different" | - Pending Phase 6 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-29 — Phase 1 (Dark Theme Foundation) complete*
