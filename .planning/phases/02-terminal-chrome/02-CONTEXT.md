# Phase 2: Terminal Chrome - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the visual terminal window frame that wraps the page content: a title bar (colored dots + monospace path), a status bar (indicator + tool name + pagination + model info), and a subtle background glow behind the card. Tabs and their content come in Phase 4. This phase delivers the chrome only.

</domain>

<decisions>
## Implementation Decisions

### Title Bar
- **D-01:** Text shows `~/how-i-ai` in monospace — terminal path style, not full prompt, not page title
- **D-02:** Three colored dots in macOS style: red `#ff5f56`, yellow `#ffbd2e`, green `#27c93f` — decorative only, no functionality

### Status Bar
- **D-03:** Left section: green indicator dot + `claude-code`
- **D-04:** Center section: numbered tab pagination in `[1/4]` format (not dots — more scalable as tab count grows). Active tab is current, total is 4.
- **D-05:** Right section: `Opus 4.6 · Thinking...` as static text (no animation)
- **D-06:** Full status bar layout: `● claude-code   [1/4]   Opus 4.6 · Thinking...`
- **D-07:** The pagination counter `[1/4]` uses neon orange glow (accent #ff4309) to highlight it as the active element

### Frame Structure
- **D-08:** Terminal card sits inside the existing site layout — site header and footer remain visible on this page
- **D-09:** Column span: `col-start-3 col-end-11` on the 12-column base-grid
- **D-10:** Height: fixed/viewport-based so the terminal has consistent height on every view (no layout shift between tabs). Content area inside the frame is `overflow-y-auto` — scrolls within the card.
- **D-11:** Status bar is pinned to the bottom of the card at all times (not scrolling with content)

### Glow
- **D-12:** Subtle background glow behind the terminal card — implementation detail left to Claude's discretion. Should feel like a monitor backlight or subtle radiance, not a strong glow ring.

### Claude's Discretion
- Exact glow color (accent orange or neutral/dark — whichever reads best on the dark background)
- Border style and border-radius of the card
- Internal padding of the content area
- Exact vertical height calculation (e.g., `calc(100vh - header-height - footer-height)` or a fixed rem value)
- CSS implementation approach: whether to put chrome markup in `list.html` partial or a new `terminal-frame.html` partial

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dark Theme Foundation
- `hugo/assets/css/tailwind.css` — `[data-theme="terminal"]` block with established CSS custom properties (`--color-bg`, `--color-bg-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`)

### Existing Layout
- `hugo/layouts/how-i-ai/baseof.html` — Section-specific base layout; `[data-theme="terminal"]` on `<body>`, includes header, footer, grid partial
- `hugo/layouts/how-i-ai/list.html` — Currently just `{{ .Content }}` — this is where the terminal chrome wrapper should be added
- `hugo/content/how-i-ai/_index.en.html` — Current placeholder content; will sit inside the terminal frame's content area

### Grid System
- `hugo/assets/css/tailwind.css` — `.base-grid` utility class definition; 12-column layout pattern

### Requirements
- `.planning/REQUIREMENTS.md` — TERM-01, TERM-02, TERM-04 define exact acceptance criteria for this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `base-grid` class: 12-column grid wrapper — terminal card uses `col-start-3 col-end-11` inside it
- CSS custom properties under `[data-theme="terminal"]`: use `--color-bg-surface` for card background, `--color-border` for card border, `--color-accent` for orange glow/highlight elements

### Established Patterns
- Section-scoped theming: `[data-theme="terminal"]` on `<body>` gives full CSS scope — no need for additional wrappers to apply dark styles
- Hugo partials: new chrome markup should be a partial (`terminal-frame.html` or similar) called from `list.html`, not inline in the layout

### Integration Points
- `hugo/layouts/how-i-ai/list.html` is the insertion point — replace bare `{{ .Content }}` with the terminal frame wrapper that contains `{{ .Content }}` in its scrollable body area
- Status bar pagination `[1/4]` is Phase 2 scaffolding — Phase 5 (tab interactivity) will make this dynamic based on active tab

</code_context>

<specifics>
## Specific Ideas

- Status bar exact string: `● claude-code   [1/4]   Opus 4.6 · Thinking...` — Jan specified each component explicitly
- `~/how-i-ai` as title bar text — more terminal-authentic than just the slug or the page title
- The `[1/4]` pagination counter should have neon orange styling to stand out as the active indicator

</specifics>

<deferred>
## Deferred Ideas

- Glow design discussion deferred to Claude's discretion — user did not select it as a discussion area
- Animated `Thinking...` ellipsis — user chose static text for now; could be revisited in a future polish phase

</deferred>

---

*Phase: 02-terminal-chrome*
*Context gathered: 2026-03-29*
