# Phase 3: Responsive Chrome - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the terminal window chrome responsive — no horizontal overflow at 375px, simplified chrome on small screens, passes visual inspection at iPhone SE width. This phase touches `terminal-frame.html` and `tailwind.css` only. No new features, no tab logic, no content changes.

</domain>

<decisions>
## Implementation Decisions

### Grid Layout
- **D-01:** On mobile, terminal frame uses `col-start-2 col-end-12` (1 column of breathing room on each side). Desktop stays `col-start-3 col-end-11`. Tailwind breakpoint: `md:col-start-3 md:col-end-11` with mobile-first defaults.

### Status Bar (mobile)
- **D-02:** On mobile, hide the right-side model text ("Opus 4.6 · Thinking..."). Show only `● claude-code` (left) and `1/4` in accent orange (right). Use `hidden sm:inline` or `hidden md:flex` on the model text span — one class change.
- **D-03:** The accent-orange `1/4` pagination glyph is preserved at all widths — it's the primary orientation cue.

### Title Bar (mobile)
- **D-04:** Keep the traffic-light dots on mobile (they're a strong visual identity element). Change path text alignment from centered to right-aligned on mobile. On mobile: dots left, `~/how-i-ai` right (drop the invisible 56px spacer, use `justify-between` layout on mobile). On desktop: keep centered layout with spacer.
- **D-05:** Title bar height (40px) and padding (0 16px) unchanged across breakpoints.

### Height (mobile)
- **D-06:** Preserve the viewport-filling terminal height on mobile — the terminal should fit within the viewport (header + footer visible without scrolling). Do NOT use `100dvh` or fill to 100% viewport.
- **D-07:** Use `svh` units on mobile (not `dvh`) to avoid layout jank from browser address bar showing/hiding. Target approximately `80svh` on mobile — not filling the full viewport. Desktop retains current `calc(100dvh - 80px - 128px - 96px)` unchanged.
- **D-08:** `min-height: 65vh` fallback stays as a safety net.

### Wrapper Padding
- **D-09:** `padding-top: 96px; padding-bottom: 48px` on the base-grid wrapper — may need mobile reduction. Claude's discretion for exact mobile padding value. Should feel spacious but not waste vertical space.

### Claude's Discretion
- Exact `svh` offset for mobile terminal height calculation
- Whether to reduce base-grid wrapper padding on mobile (96px → Xpx)
- Tailwind breakpoint to use for all responsive overrides (`sm:` at 640px or `md:` at 768px) — pick the one that best represents "tablet and above"
- Whether to use a `@media` block in `tailwind.css` or Tailwind responsive prefix classes in the HTML

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Terminal Chrome (Phase 2 output)
- `hugo/layouts/partials/terminal-frame.html` — Current terminal chrome partial; all responsive changes apply here

### Styles
- `hugo/assets/css/tailwind.css` — `[data-theme="terminal"]` block with `--terminal-height` CSS custom property and `.terminal-glow` class; existing `@media (prefers-reduced-motion)` pattern shows how @media is used

### Layout
- `hugo/layouts/how-i-ai/baseof.html` — Section-specific base layout with `[data-theme="terminal"]` on body
- `hugo/layouts/how-i-ai/list.html` — Renders `terminal-frame.html` partial

### Requirements
- `.planning/REQUIREMENTS.md` — TERM-03 defines acceptance criteria: no horizontal overflow at 375px, simplified chrome on small screens

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `--terminal-height` CSS custom property under `[data-theme="terminal"]`: currently `calc(100dvh - 80px - 128px - 96px)` — override this at mobile breakpoint with an `svh`-based calc
- `.terminal-glow` class: position-relative wrapper for the glow pseudo-element — no changes needed for responsiveness
- Tailwind responsive prefixes already used site-wide (`sm:`, `md:`, `lg:`) — follow the same pattern

### Established Patterns
- Responsive layout: use Tailwind breakpoint prefixes inline (`col-start-2 md:col-start-3`) — matches site-wide convention
- Media queries in CSS: `@media (prefers-reduced-motion)` pattern in `tailwind.css` shows how @media blocks are structured if needed for CSS custom property overrides
- `base-grid` class with inline padding-top/padding-bottom: these are inline styles on the wrapper div in `terminal-frame.html`, not in CSS — can be made responsive via Tailwind or by adding a responsive CSS rule

### Integration Points
- All changes are isolated to `terminal-frame.html` (HTML/class changes) and `tailwind.css` (`--terminal-height` override at mobile breakpoint)
- No changes to `list.html`, `baseof.html`, or any other layout
- Status bar responsive: add `hidden md:inline` (or similar) to the model text span element in `terminal-frame.html`
- Title bar responsive: conditionally apply `justify-between` vs centered layout via Tailwind breakpoint classes

</code_context>

<specifics>
## Specific Ideas

- Grid breakpoint: `col-start-2 col-end-12` on mobile → `md:col-start-3 md:col-end-11` on desktop — Jan specified the exact mobile column values
- Status bar: "keep ● + 1/4, drop model text on mobile" — Jan confirmed this as the right trade-off (pagination is the primary orientation cue)
- Title bar: dots stay + path right-aligns on mobile, rather than removing dots. Specific: `justify-between` with dots left, path right on mobile; centered layout (existing) on desktop/md+
- Height: "fit into viewport but not 100vh" — terminal should be visible within one viewport load without scrolling, but header/footer remain visible

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-responsive-chrome*
*Context gathered: 2026-03-30*
