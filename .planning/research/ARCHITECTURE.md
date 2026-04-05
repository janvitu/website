# Architecture Research: Terminal Page Integration

## Component Breakdown

### 1. Hugo Content & Layout

**New files needed:**
- `hugo/content/how-i-ai/_index.en.html` - Page content with tab data
- `hugo/layouts/how-i-ai/list.html` - Page layout template (like existing `about/list.html`)

**Why separate layout:** The dark theme and terminal structure need a distinct layout. Reusing `_default/baseof.html` as the base keeps header/footer/grid, while the section layout handles terminal-specific structure.

### 2. Dark Theme Styles

**Where:** `hugo/assets/css/tailwind.css` (extend existing file)

Add scoped CSS custom properties for the dark theme. The page layout adds `data-theme="terminal"` to a wrapper or the body class.

### 3. Tab System (TypeScript)

**Where:** `hugo/assets/ts/how-i-ai-tabs.ts`

Small module compiled via Hugo's `js.Build`. Handles:
- Tab click switching
- Keyboard navigation (arrow keys)
- ARIA attribute updates
- URL hash sync (optional - allows linking to specific tabs)

### 4. Terminal Chrome (Partials)

**Where:** `hugo/layouts/partials/terminal/` directory

- `window.html` - Outer terminal frame (title bar + content slot + status bar)
- `titlebar.html` - Dots + title text
- `statusbar.html` - Left/right status items

### 5. Navigation Update

**Where:** `hugo/config.toml` (add menu item) + `hugo/layouts/partials/header.html` (style the special nav button)

The nav item needs a different visual treatment (button with LED indicator) compared to other nav links.

## Data Flow

```
config.toml (menu) → header.html (nav with LED button)
                          ↓
content/how-i-ai/_index.en.html (tab content data)
                          ↓
layouts/how-i-ai/list.html (page structure)
    ├── partials/terminal/window.html (chrome)
    │   ├── partials/terminal/titlebar.html
    │   └── partials/terminal/statusbar.html
    ├── tab buttons (from content)
    └── tab panels (from content)
                          ↓
assets/ts/how-i-ai-tabs.ts (interactivity)
assets/css/tailwind.css (dark theme scope)
```

## Build Order (Phase Dependencies)

1. **Foundation first:** Dark theme CSS + terminal chrome partials (no JS needed yet)
2. **Page structure:** Content file + layout template using the partials
3. **Interactivity:** Tab switching TypeScript
4. **Navigation:** Nav button with LED indicator
5. **Content:** Scaffold placeholder content for all 4 tabs
6. **Polish:** Transitions, responsive tweaks, accessibility audit

Foundation and navigation are independent and could be built in parallel. Page structure depends on foundation. Tabs depend on page structure.
