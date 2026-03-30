# Phase 3: Responsive Chrome - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-03-30
**Mode:** Discuss (advisor mode with research agents)

---

## Areas Selected

User selected all 4 gray areas:
- Grid layout on mobile
- Status bar on mobile
- Title bar on mobile
- Height on mobile

---

## Q&A Log

### Grid Layout on Mobile

**Q:** Which areas do you want to discuss? (with note field for grid layout)

**A (note):** `col-start-2 col-end-12` — leave 1 column of content on each side

**Decision:** Mobile grid = `col-start-2 col-end-12`, desktop stays `col-start-3 col-end-11`

---

### Status Bar on Mobile

**Research summary presented:**
- Option 1: Hide model text, keep ● claude-code + 1/4 (recommended)
- Option 2: Abbreviate right to "Opus · …"
- Option 3: Left section only (● claude-code, lose pagination)

**Q:** What should the status bar show on mobile (375px)?

**A:** Hide model text, keep ● + 1/4 (Recommended)

**Decision:** Status bar on mobile shows `● claude-code` (left) + `1/4` in accent orange (right). Model text hidden.

---

### Title Bar on Mobile

**Research summary presented:**
- Option 1: Hide dots on mobile, centered path (recommended for TERM-03 "simplified")
- Option 2: Keep as-is (layout fits at 249px inner width)
- Option 3: Path only, no dots, no spacer

**Q:** Title bar on mobile: keep, simplify, or minimal?

**A (Other):** "Keep dots and make path aligned to the right"

**Decision:** Traffic-light dots stay at all widths. On mobile: `justify-between` layout — dots left, path right. Drop the centering spacer. On desktop: keep existing centered layout.

---

### Height on Mobile

**Research summary presented:**
- Option 1: Drop height on mobile, min-height only (recommended for no brittle calc)
- Option 2: svh with mobile offset override (stable, no dvh jank)
- Option 3: Keep dvh calc with @media override (fragile)

**Q:** How should terminal height behave on mobile?

**A (Other):** "Keep the terminal to fit into the viewport but do not make it 100vh"

**Decision:** Preserve viewport-filling terminal height on mobile. Use `svh` not `dvh`. Exact mobile offset is Claude's discretion. Terminal should be visible without scrolling past it, but header/footer remain accessible.

---

## Decisions Summary

| # | Area | Decision |
|---|------|----------|
| D-01 | Grid | col-start-2 col-end-12 on mobile |
| D-02 | Status bar | Hide model text on mobile, keep ● + 1/4 |
| D-03 | Status bar | Accent orange 1/4 preserved at all widths |
| D-04 | Title bar | Dots stay, path right-aligned on mobile (justify-between) |
| D-05 | Title bar | Height + padding unchanged |
| D-06 | Height | Viewport-filling but not 100dvh |
| D-07 | Height | Use svh on mobile, dvh stays on desktop |
| D-08 | Height | min-height: 65vh fallback stays |
