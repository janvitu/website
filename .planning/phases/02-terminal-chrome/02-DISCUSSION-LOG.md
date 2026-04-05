# Phase 2: Terminal Chrome - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 02-terminal-chrome
**Areas discussed:** Title bar, Frame layout, Status bar

---

## Title Bar

| Option | Description | Selected |
|--------|-------------|----------|
| how-i-ai | Just the slug — minimal, clean terminal style | |
| jan@macbook: ~/how-i-ai | Full terminal path with username | |
| ~/how-i-ai | Path without username | ✓ |
| How I AI | Human-readable page title | |

**User's choice:** `~/how-i-ai` (user noted in "Other" that they want the tilde-path form)
**Notes:** User initially selected `how-i-ai` from options but clarified via notes they want `~/how-i-ai` specifically.

---

## Title Bar — Colored Dots

| Option | Description | Selected |
|--------|-------------|----------|
| macOS-style colors | Red #ff5f56, yellow #ffbd2e, green #27c93f | ✓ |
| Accent-colored dots | Site accent #ff4309 or single color | |

**User's choice:** macOS-style colors — decorative only, no functionality.

---

## Frame Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full page — replaces header/footer | Terminal window IS the page, full viewport | |
| Card within site — header/footer stay | Terminal frame as a card inside normal site layout | ✓ |

**User's choice:** Card within site. User noted card should start around col 3 or col 4.

---

## Frame Layout — Vertical Sizing

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed min-height, grows with content | min-h-[70vh], expands with content | |
| Full viewport height | Fixed height, content scrolls inside | ✓ |

**User's choice:** Full viewport height — fixed consistent height so terminal looks the same on every tab view. Content scrolls inside, status bar pinned at bottom.

---

## Frame Layout — Column Span

| Option | Description | Selected |
|--------|-------------|----------|
| col-start-3 col-end-11 | 2 columns breathing room each side | ✓ |
| col-start-2 col-end-12 | Near full-width, wider card | |
| col-start-4 col-end-10 | Narrower, very centered | |

**User's choice:** col-start-3 col-end-11.

---

## Status Bar — Pagination

| Option | Description | Selected |
|--------|-------------|----------|
| Dim hollow circles | ○ inactive, ● active (neon orange) | |
| Dim filled circles | Small gray dots, orange for active | |
| Numbered [1/4] | Text-based pagination counter | ✓ |

**User's choice:** Numbered `[1/4]` format. User noted dots are not scalable; numbered is clearer.
**Notes:** Neon orange (#ff4309) styling on the counter.

---

## Status Bar — Thinking... Animation

| Option | Description | Selected |
|--------|-------------|----------|
| Animated ellipsis | Cycling . / .. / ... via CSS animation | |
| Static text | Plain "Thinking..." with no animation | ✓ |

**User's choice:** Static text.

---

## Claude's Discretion

- Glow color and style (not selected as a discussion area — left to Claude)
- Card border style and border-radius
- Internal content area padding
- Exact height calculation
- Whether chrome goes in `list.html` directly or a new partial

## Deferred Ideas

- Animated ellipsis on "Thinking..." — user declined, could revisit in polish phase
- Glow design specifics — user skipped this discussion area
