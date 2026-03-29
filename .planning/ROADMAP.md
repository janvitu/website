# Roadmap: How I AI

## Overview

Six focused phases deliver a dark-themed `/how-i-ai` page with terminal window aesthetic on Jan's personal Hugo site. The work flows from foundational CSS theming, through the visual terminal chrome, into interactive tab switching, and finishes with the distinctive navigation entry. Each phase delivers a verifiable capability before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Dark Theme Foundation** - Scoped CSS custom properties establish the dark terminal context
- [ ] **Phase 2: Terminal Chrome** - Title bar, status bar, and glow make the page look like a terminal window
- [ ] **Phase 3: Responsive Chrome** - Terminal layout holds up on mobile with simplified chrome
- [ ] **Phase 4: Tab Structure & Content** - Four-tab skeleton with placeholder content stored in Hugo
- [ ] **Phase 5: Tab Interactivity** - Click-to-switch tabs with URL hash sync and smooth transitions
- [ ] **Phase 6: Navigation Entry** - Accessible nav link styled as a distinctive LED button

## Phase Details

### Phase 1: Dark Theme Foundation
**Goal**: The `/how-i-ai` page renders in a dark color scheme scoped only to that page, with the background grid visible and focus indicators accessible
**Depends on**: Nothing (first phase)
**Requirements**: THEME-01, THEME-02, THEME-03
**Success Criteria** (what must be TRUE):
  1. Visiting `/how-i-ai` shows a dark background; all other pages remain light
  2. The background grid lines are visible (subtle but present) on the dark background
  3. Focused interactive elements show a visible focus ring (accent color or white outline)
  4. No global CSS variables or Tailwind globals are modified - dark styles live under `[data-theme="terminal"]`
**Plans**: TBD
**UI hint**: yes

### Phase 2: Terminal Chrome
**Goal**: The page is visually framed as a terminal window with a title bar (colored dots + monospace title) and a status bar (Claude model info + green indicator) separated by a subtle glow
**Depends on**: Phase 1
**Requirements**: TERM-01, TERM-02, TERM-04
**Success Criteria** (what must be TRUE):
  1. A title bar is visible at the top of the terminal frame with red/yellow/green dots and a monospace page title
  2. A status bar is visible at the bottom showing "claude" and model information with a green indicator dot
  3. A subtle background glow is visible behind the terminal window
**Plans**: TBD
**UI hint**: yes

### Phase 3: Responsive Chrome
**Goal**: The terminal window chrome degrades gracefully on mobile - the page is usable and the layout does not break on small screens
**Depends on**: Phase 2
**Requirements**: TERM-03
**Success Criteria** (what must be TRUE):
  1. On a mobile viewport the terminal frame is visible and readable without horizontal overflow
  2. The chrome (title bar, status bar) simplifies on small screens - either condensed or reduced in detail
  3. The layout passes a visual check at 375px width (iPhone SE)
**Plans**: TBD
**UI hint**: yes

### Phase 4: Tab Structure & Content
**Goal**: The terminal window contains four tabs (My Stack, Setup, Workflow, Tips) with scaffolded placeholder content, stored in a Hugo content file for future editability
**Depends on**: Phase 3
**Requirements**: TABS-01, CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. Four tabs are visible and labeled: My Stack, Setup, Workflow, Tips
  2. Clicking a tab shows its panel and hides the others (basic switching works)
  3. Each tab panel contains placeholder content (not blank)
  4. Content is sourced from a Hugo content file, not hardcoded in the layout template
**Plans**: TBD
**UI hint**: yes

### Phase 5: Tab Interactivity
**Goal**: Tab switching is smooth and linkable - URL hash updates on tab change, direct hash URLs load the correct tab, and transitions feel polished
**Depends on**: Phase 4
**Requirements**: TABS-02, TABS-03
**Success Criteria** (what must be TRUE):
  1. Clicking a tab updates the URL hash (e.g., `/how-i-ai#setup`) without a page reload
  2. Navigating directly to `/how-i-ai#workflow` opens the Workflow tab on load
  3. Tab content changes with a smooth CSS transition (no abrupt flash)
**Plans**: TBD
**UI hint**: yes

### Phase 6: Navigation Entry
**Goal**: The `/how-i-ai` page is accessible from the site's main navigation via a visually distinct button with an LED indicator dot
**Depends on**: Phase 5
**Requirements**: NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. A link to `/how-i-ai` appears in the site's main navigation on every page
  2. The nav item is styled as a button, distinct from the standard link-strikethrough nav items
  3. A small LED/diode indicator dot with a subtle glow is visible on the nav button
  4. Keyboard users can reach and activate the nav item
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dark Theme Foundation | 0/? | Not started | - |
| 2. Terminal Chrome | 0/? | Not started | - |
| 3. Responsive Chrome | 0/? | Not started | - |
| 4. Tab Structure & Content | 0/? | Not started | - |
| 5. Tab Interactivity | 0/? | Not started | - |
| 6. Navigation Entry | 0/? | Not started | - |
