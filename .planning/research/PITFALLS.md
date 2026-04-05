# Pitfalls Research: Dark Terminal Page on Hugo Site

## 1. Dark Theme Bleeding Into Other Pages

**Risk:** High
**Warning signs:** Global CSS overrides that affect light-themed pages, Tailwind utilities that don't respect scope.
**Prevention:** Always scope dark styles under `[data-theme="terminal"]`. Never modify global color variables. Test by navigating between the dark page and light pages.
**Phase:** Foundation (Phase 1)

## 2. Background Grid Invisible or Clashing on Dark

**Risk:** Medium
**Warning signs:** Grid lines using hardcoded `border-neutral-300` become invisible on dark background, or look jarring.
**Prevention:** Override grid line colors within the dark theme scope. Use `border-neutral-700` or `border-neutral-800` for subtle dark grid lines. Test grid visibility at different viewport sizes.
**Phase:** Foundation (Phase 1)

## 3. Tab Accessibility Failures

**Risk:** Medium
**Warning signs:** Tabs not navigable by keyboard, screen readers can't identify tab structure, focus indicators invisible on dark background.
**Prevention:** Use proper ARIA tablist/tab/tabpanel pattern from the start. Ensure focus rings are visible on dark backgrounds (use accent color or white outline). Test with keyboard-only navigation.
**Phase:** Tab system (Phase 2-3)

## 4. Terminal Chrome Breaking on Mobile

**Risk:** Medium
**Warning signs:** Title bar dots + text overflow on small screens, status bar text wraps awkwardly, terminal borders look cramped.
**Prevention:** Design mobile-first. On very small screens, simplify the chrome (hide dots, stack status bar items). Test at 320px width minimum.
**Phase:** Foundation + Polish

## 5. Navigation Button Looking Out of Place

**Risk:** Low-Medium
**Warning signs:** LED/diode button clashes with existing link-strikethrough nav style, feels bolted-on rather than intentional.
**Prevention:** Keep the button insanely simple as specified. Use the existing accent color for the LED dot. Ensure it aligns with the nav grid. Test alongside existing nav items at all breakpoints.
**Phase:** Navigation

## 6. Content Structure Not Future-Proof

**Risk:** Low
**Warning signs:** Tab content hardcoded in layout template, making it painful to add new tabs or convert to article format later.
**Prevention:** Store tab content in the content file (Hugo front matter or content sections), not in the layout. Layout should iterate over tabs dynamically. This makes adding tabs or changing structure easy.
**Phase:** Page structure

## 7. Monospace Font Performance

**Risk:** Low
**Warning signs:** Loading a custom monospace font adds weight, FOUT on terminal text.
**Prevention:** Stick with system monospace stack (already defined in Tailwind). No custom monospace font needed - system fonts look great and load instantly.
**Phase:** Foundation
