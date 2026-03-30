# Phase 4: Tab Structure & Content - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 04-tab-structure-content
**Areas discussed:** Tab strip placement, Content storage format, Status bar sync, Placeholder content depth, Sub-tabs, SEO friendliness

---

## Folded Todo

**Todo:** Add H1 title and description above terminal frame
**Decision:** Folded into Phase 4 scope — naturally pairs with content scaffolding work

---

## Tab Strip Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Below title bar | Separate row between title bar and content area; title bar unchanged | ✓ |
| Replace title bar | Tabs replace the title bar row; `~/how-i-ai` path disappears | |
| Sticky inside content area | Tabs are sticky within the scrollable content area | |

**User's choice:** Below title bar
**Notes:** Title bar (`~/how-i-ai` + colored dots) stays unchanged. Tab strip is a new distinct row.

---

## Active Tab Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Accent underline | Orange (#ff4309) bottom border on active tab | ✓ |
| Background highlight | Lighter surface background behind active tab | |
| Bold + accent text | Active label turns orange and bolder | |

**User's choice:** Accent underline (orange #ff4309)
**Notes:** Consistent with status bar's orange glow for `[1/4]`.

---

## Content Storage Format

| Option | Description | Selected |
|--------|-------------|----------|
| Hugo shortcodes | `{{< tab id="..." label="..." >}}` wrapping content in `_index.en.html` | ✓ |
| Structured front matter | YAML tabs array in frontmatter, layout reads `.Params.tabs` | |
| Hugo data file | `hugo/data/how-i-ai.json`, layout reads `site.Data` | |

**User's choice:** Hugo shortcodes
**Notes:** Editing content means editing the HTML file — no template changes needed.

---

## Status Bar Sync

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — update in Phase 4 | TS already added for switching; counter update is trivial extra | |
| Static until Phase 5 | Keep `[1/4]` hardcoded; Phase 5 handles all interactivity | ✓ |

**User's choice:** Static until Phase 5
**Notes:** Clean scope boundary — Phase 4 = structure, Phase 5 = full interactivity.

---

## Placeholder Content Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Realistic structure | Section headers + short placeholder items per tab | ✓ |
| Minimal placeholders | Just H2 + "Content coming soon" per tab | |

**User's choice:** Realistic structure
**Notes:** Each tab gets meaningful skeleton that reflects the eventual real content shape.

---

## Sub-tabs

| Option | Description | Selected |
|--------|-------------|----------|
| Design for it, don't implement | HTML/shortcode structure supports optional nested tabs; placeholder content doesn't use them; Phase 5 handles interactivity | ✓ |
| Defer entirely | Phase 4 as-designed; sub-tabs in future phase after content is defined | |

**User's choice:** Design for it, don't implement yet
**Notes:** User raised this mid-discussion. Doesn't know which tabs will need sub-tabs yet. Architecture should accommodate it without requiring it.

---

## SEO Friendliness

| Option | Description | Selected |
|--------|-------------|----------|
| Important — all content indexable | All tab panels in DOM at page load; JS toggles visibility only | ✓ |
| Not critical | JS-driven tab switching fine as-is | |

**User's choice:** All content indexable
**Notes:** All tab panel HTML rendered in source; no lazy-loading or DOM injection per tab.

---

## Claude's Discretion

- Tab strip height, padding, font style (mono vs Gilroy)
- Inactive tab text color
- Shortcode HTML output structure (ARIA roles, data attributes)
- Whether tab strip is inline in `terminal-frame.html` or a new partial
- Exact placeholder text per tab

## Deferred Ideas

- Sub-tab interactivity → Phase 5
- Status bar dynamic counter → Phase 5
- URL hash sync → Phase 5
- Smooth tab transitions → Phase 5
- Animated `Thinking...` in status bar → future polish phase
