# Requirements: How I AI

**Defined:** 2026-03-29
**Core Value:** A single, well-organized place to share and maintain my evolving AI workflow - tools, setup, process, and learnings.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Dark Theme

- [ ] **THEME-01**: Page has scoped dark color scheme via CSS custom properties on `[data-theme="terminal"]`
- [ ] **THEME-02**: Background grid lines visible but subtle on dark background
- [ ] **THEME-03**: Focus indicators visible on dark background (accent color or white outline)

### Terminal Chrome

- [ ] **TERM-01**: Title bar with colored dots (red/yellow/green) and page title in monospace
- [ ] **TERM-02**: Status bar at bottom showing Claude AI model info with green indicator
- [ ] **TERM-03**: Terminal frame responsive on mobile (simplified chrome on small screens)
- [ ] **TERM-04**: Subtle background glow behind terminal window

### Tab System

- [ ] **TABS-01**: 4 tabs: My Stack, Setup, Workflow, Tips - click to switch content
- [ ] **TABS-02**: URL hash sync (e.g. `/how-i-ai#setup` links directly to tab)
- [ ] **TABS-03**: Smooth CSS transitions when switching tabs

### Navigation

- [ ] **NAV-01**: `/how-i-ai` page accessible from main site navigation
- [ ] **NAV-02**: Nav item styled as distinct button (not standard link-strikethrough)
- [ ] **NAV-03**: LED/diode indicator dot with subtle glow on nav button

### Content

- [ ] **CONT-01**: Placeholder content scaffolded for all 4 tabs
- [ ] **CONT-02**: Content stored in Hugo content file (future-proof, not hardcoded in layout)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Expansion

- **CONT-03**: Article-style resources section (longer-form content beyond tabs)
- **CONT-04**: "Last updated" timestamp per tab
- **CONT-05**: Code blocks with syntax highlighting within tips

### Interactivity

- **TABS-04**: Keyboard navigation for tabs (arrow keys + ARIA tablist roles)
- **TERM-05**: Animated typing indicator in status bar

### Multi-language

- **I18N-01**: Czech translation of page content

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real terminal emulation | Visual aesthetic only - not a functional terminal |
| Command input / interactive shell | Adds complexity, confuses purpose |
| Site-wide dark mode toggle | Dark is only for this page |
| CMS / admin panel | Content lives in Hugo templates, edited manually |
| Comments / reactions | Static page, no backend |
| Search within page | 4 tabs is simple enough to browse |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | - | Pending |
| THEME-02 | - | Pending |
| THEME-03 | - | Pending |
| TERM-01 | - | Pending |
| TERM-02 | - | Pending |
| TERM-03 | - | Pending |
| TERM-04 | - | Pending |
| TABS-01 | - | Pending |
| TABS-02 | - | Pending |
| TABS-03 | - | Pending |
| NAV-01 | - | Pending |
| NAV-02 | - | Pending |
| NAV-03 | - | Pending |
| CONT-01 | - | Pending |
| CONT-02 | - | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 0
- Unmapped: 15

---
*Requirements defined: 2026-03-29*
*Last updated: 2026-03-29 after initial definition*
