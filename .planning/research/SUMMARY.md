# Research Summary: How I AI Page

## Recommended Stack

- **Dark theme:** CSS custom properties scoped via `[data-theme="terminal"]` - no Tailwind dark mode
- **Tab switching:** Vanilla TypeScript compiled via Hugo's `js.Build` pipeline
- **Terminal chrome:** Pure CSS/Tailwind - no libraries
- **Fonts:** System monospace stack (already available), Gilroy for headings
- **Grid:** Override existing grid partial colors within dark scope

## Table Stakes Features

1. Scoped dark theme (page only)
2. Terminal window chrome (title bar with dots, status bar with Claude/model info)
3. 4 tabbed sections: My Stack, Setup, Workflow, Tips
4. Keyboard-accessible tabs (ARIA tablist pattern)
5. Responsive layout (mobile-friendly terminal)
6. Nav entry with LED/diode indicator button
7. Background grid on dark background
8. Placeholder content scaffolded

## Key Differentiators

- LED indicator nav button (signals "new/different" content)
- Status bar showing AI model info (reinforces the AI theme)
- Smooth tab transitions

## Critical Pitfalls to Avoid

1. **Dark theme bleeding** - always scope under data attribute, never modify globals
2. **Grid invisible on dark** - override grid line colors in dark scope
3. **Tab a11y** - use ARIA tablist pattern from day one
4. **Mobile terminal chrome** - design mobile-first, simplify chrome on small screens

## Architecture

New files:
- `hugo/content/how-i-ai/_index.en.html` (content)
- `hugo/layouts/how-i-ai/list.html` (layout)
- `hugo/layouts/partials/terminal/*.html` (chrome partials)
- `hugo/assets/ts/how-i-ai-tabs.ts` (interactivity)
- Extend `hugo/assets/css/tailwind.css` (dark theme styles)
- Update `hugo/config.toml` (nav menu)
- Update `hugo/layouts/partials/header.html` (LED nav button)

## Build Order

1. Dark theme foundation + terminal chrome CSS
2. Page layout + content structure
3. Tab switching TypeScript
4. Navigation LED button
5. Scaffold all tab content
6. Polish (transitions, responsive, a11y)
