# Stack Research: Dark Terminal UI Page

## Recommended Approach

### Scoped Dark Theme (High Confidence)

**Pattern:** CSS custom properties scoped to a page-level class or data attribute.

```css
/* In tailwind.css - scope dark theme to this page */
[data-theme="terminal"] {
  --color-bg: #1a1a1a;
  --color-bg-surface: #252525;
  --color-border: #3a3a3a;
  --color-text: #e0e0e0;
  --color-text-muted: #888;
  --color-accent: #ff4309; /* keep existing accent */
}
```

**Why:** Hugo renders this page with a `data-theme="terminal"` attribute on the body or a wrapper div. All dark styles cascade from this scope. No global theme pollution. The existing light pages are untouched.

**Alternative rejected:** Tailwind `dark:` variant - requires site-wide dark mode toggle infrastructure. Overkill for one page.

### Tab Switching (High Confidence)

**Pattern:** Vanilla TypeScript with Hugo's `js.Build` pipeline (matches existing TS compilation pattern).

```typescript
// hugo/assets/ts/how-i-ai-tabs.ts
document.querySelectorAll('[data-tab]').forEach(tab => {
  tab.addEventListener('click', () => { /* switch active tab + panel */ });
});
```

**Why:** Tab switching is simple show/hide. No reactive state needed. SolidJS would be overkill. Hugo already compiles TS via `js.Build` (see existing `hugo/assets/ts/` files).

**Keyboard support:** Arrow keys for tab navigation, Enter/Space to activate. Use `role="tablist"`, `role="tab"`, `role="tabpanel"` ARIA pattern.

### Terminal Chrome (High Confidence)

**Pattern:** Pure CSS with Tailwind utilities. No library needed.

Components:
- **Title bar:** Flex row with three dot circles (red/yellow/green or muted), centered title text in monospace
- **Content area:** Dark background, border, subtle inner shadow
- **Status bar:** Flex row with left/right alignment, monospace text, green dot indicator

**Why:** Terminal chrome is purely decorative CSS. The dots, borders, and layout are trivial with Tailwind + a few custom classes.

### Grid Background on Dark (Medium Confidence)

The existing `grid.html` partial uses `border-neutral-300` for grid lines. On the dark page, these need to become subtle dark lines (`border-neutral-700` or similar).

**Approach:** Override grid line color within the `[data-theme="terminal"]` scope. The grid partial itself doesn't need to change - just add a CSS override.

### What NOT to Use

- **SolidJS for tabs** - overkill, adds bundle weight for trivial interaction
- **Tailwind dark mode** - site-wide mechanism for a single-page need
- **CSS-in-JS / styled-components** - not in the stack, don't introduce
- **Third-party terminal emulator libs (xterm.js, etc.)** - visual aesthetic only, not a real terminal
- **iframe embedding** - breaks accessibility and SEO
