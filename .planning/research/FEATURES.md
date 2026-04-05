# Features Research: Terminal-Styled Knowledge Base Page

## Table Stakes (Must Have)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Dark theme scoped to page | Low | CSS custom properties on wrapper |
| Terminal window chrome (title bar + status bar) | Low | Pure CSS decorative elements |
| Tabbed content sections | Medium | 4 tabs with content switching |
| Keyboard navigation for tabs | Low | Arrow keys + ARIA roles |
| Responsive layout | Medium | Terminal should work on mobile too |
| Navigation link from main site | Low | New nav item in Hugo config |
| Background grid preserved | Low | Override grid colors in dark scope |
| Monospace typography for terminal elements | Low | System monospace already available |
| Placeholder content for all tabs | Low | Scaffolded content structure |

## Differentiators (Nice to Have)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Animated status bar (typing indicator, model switching) | Medium | CSS animations, subtle terminal feel |
| Nav button with LED/diode indicator | Low | Small CSS dot with glow effect |
| Smooth tab transitions | Low | CSS opacity/transform transitions |
| Syntax-highlighted code blocks within tips | Medium | Hugo built-in syntax highlighting works |
| "Last updated" timestamp per tab | Low | Hugo data or frontmatter |
| Copy-to-clipboard on code snippets | Low | Small TS utility |

## Anti-Features (Do NOT Build)

| Feature | Why Not |
|---------|---------|
| Real terminal emulation | Visual aesthetic only - not a functional terminal |
| Command input / interactive shell | Adds complexity, confuses purpose |
| Dark mode toggle for whole site | Scope creep - dark is only for this page |
| CMS / admin panel for content | Content lives in Hugo templates, edited manually |
| Comments / reactions | Static page, no backend |
| Search within page | 4 tabs is simple enough to browse |
| Animated typing effect for content | Gimmicky, slows down reading |

## Dependencies Between Features

- Terminal chrome depends on dark theme (meaningless on light background)
- Tab content depends on tab switching JS
- Keyboard nav depends on proper ARIA tab structure
- Status bar content depends on terminal chrome
- Nav LED indicator is independent of the page itself
