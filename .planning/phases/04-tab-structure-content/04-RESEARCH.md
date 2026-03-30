# Phase 4: Tab Structure & Content - Research

**Researched:** 2026-03-30
**Domain:** Hugo shortcodes, vanilla TypeScript tab switching, Tailwind CSS ARIA tab pattern
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Add an H1 "How I AI" heading and short tagline above the terminal frame. Use `--color-text` / `--color-text-muted`. Column span: `col-start-2 col-end-12` mobile, `md:col-start-3 md:col-end-11` desktop.
- **D-02:** Tabs sit in a dedicated row between the title bar and the content area. Title bar unchanged.
- **D-03:** Active tab: accent orange (`#ff4309`) bottom border/underline. Inactive tabs: no background, no underline, muted text only.
- **D-04:** Tab strip HTML structure must accommodate optional nested sub-tabs (extension point), but Phase 4 placeholder content does NOT use sub-tabs.
- **D-05:** Tab content stored in `hugo/content/how-i-ai/_index.en.html` as custom `{{< tab >}}` shortcodes with `id` and `label` attributes. Shortcode template created this phase.
- **D-06:** All tab panels rendered in DOM at page load. JS shows/hides via CSS class or `display`. No lazy loading.
- **D-07:** Basic click-to-switch in vanilla TypeScript. No URL hash sync, no transitions (Phase 5).
- **D-08:** Status bar `[1/4]` pagination counter stays hardcoded/static. Dynamic counter is Phase 5.
- **D-09:** Each tab scaffolded with realistic structure: section heading, sub-section headings (H2/H3), short placeholder items. Not just "coming soon" text.

### Claude's Discretion

- Exact height and padding of the tab strip row
- Font style of tab labels (monospace to match terminal aesthetic, or sans-serif Gilroy for readability)
- Spacing between tab labels
- Inactive tab text color (`--color-text-muted` or slightly lighter)
- Exact shortcode HTML output structure (div with data-tab-id, ARIA roles for tablist/tab/tabpanel)
- Whether tab strip is a separate partial or inline in `terminal-frame.html`
- Exact placeholder text content for each tab

### Deferred Ideas (OUT OF SCOPE)

- Sub-tab interactivity (Phase 5)
- Status bar `[1/4]` dynamic counter (Phase 5)
- URL hash sync / TABS-02 (Phase 5)
- Smooth tab transition animation / TABS-03 (Phase 5)
- Animated `Thinking...` ellipsis in status bar

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TABS-01 | 4 tabs: My Stack, Setup, Workflow, Tips - click to switch content | Vanilla TS click handler + CSS show/hide pattern documented below |
| CONT-01 | Placeholder content scaffolded for all 4 tabs | Hugo shortcode inner content pattern; content outline per tab documented below |
| CONT-02 | Content stored in Hugo content file (future-proof, not hardcoded in layout) | Hugo paired shortcode in `_index.en.html`; `{{ .Inner }}` in shortcode template documented below |

</phase_requirements>

---

## Summary

Phase 4 introduces the 4-tab strip inside the existing terminal frame, plus an H1 intro above it. The work spans four concerns: (1) a new `tab` Hugo shortcode that wraps each tab's content in `_index.en.html`, (2) rendering all four panels into the DOM and wiring a tablist/tab/tabpanel ARIA structure in `terminal-frame.html`, (3) a vanilla TypeScript click handler that toggles active state, and (4) the H1 + tagline block above the terminal.

All four concerns are low-risk: Hugo paired shortcodes are well-understood, vanilla TS tab switching is a documented pattern, and the existing design tokens cover all visual requirements. The only mild complexity is the shortcode HTML output needing to satisfy both the ARIA tabpanel role and the future sub-tab extension point simultaneously - a decision within Claude's discretion.

**Primary recommendation:** Use a single paired shortcode `{{< tab id="..." label="..." >}}...{{< /tab >}}` that emits a `<div role="tabpanel" id="panel-{id}" aria-labelledby="tab-{id}" class="tab-panel hidden">{{ .Inner }}</div>`. The tablist is rendered statically in `terminal-frame.html` by iterating `$.Page.Params` or via a separate data structure, or rendered directly as static HTML since tab labels are fixed. Static HTML for the tab buttons in `terminal-frame.html` is the simplest approach given 4 fixed tabs.

## Project Constraints (from CLAUDE.md)

These directives apply to all code produced in this phase:

- Tech stack: Hugo templates + Tailwind CSS + vanilla TypeScript only. No SolidJS, no additional JS frameworks.
- Dark theme: scoped to `[data-theme="terminal"]` - never modify global styles.
- Always use CSS custom properties (`var(--color-*)`) for themed colors, never hardcoded hex inside layout/template files.
- Tailwind utility classes inline on elements (not `className=`); use `md:` breakpoint prefix for responsive.
- Follow established patterns: `querySelector` / `addEventListener` in TS; named exports for utilities.
- No `console.log` in production source.
- Use `data-` attributes for JS targeting.
- ARIA roles required: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`.
- Prettier formatting: tabs for indentation, double quotes, trailing commas.
- Hugo template comments: `{{/* comment */}}`.

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| Hugo | v0.159.0+extended | SSG, shortcode processing, template rendering | Project standard |
| Tailwind CSS | 4.1.x | Utility CSS for tab strip layout and visibility toggle | Project standard |
| TypeScript | 5.8.x | Click handler for tab switching | Project standard |

### No New Dependencies

This phase adds zero new packages. All tooling is already installed.

**Build verification:**
```bash
cd /Users/janvitu/Code/Projects/website && npm run build
```

## Architecture Patterns

### Recommended Project Structure Changes

```
hugo/
├── layouts/
│   ├── shortcodes/
│   │   └── tab.html              # NEW: paired shortcode template
│   └── partials/
│       └── terminal-frame.html   # MODIFIED: add H1 intro block + tab strip row + tabpanel rendering
├── content/
│   └── how-i-ai/
│       └── _index.en.html        # MODIFIED: replace placeholder with {{< tab >}} shortcodes
└── assets/
    └── ts/
        └── tabs.ts               # NEW: tab switching module (or inline in index.ts)
```

### Pattern 1: Hugo Paired Shortcode with `.Inner`

Hugo shortcodes can be paired (opening + closing tags). The content between them is accessed via `.Inner` in the shortcode template. Named parameters are accessed via `.Get "param"`.

**Content file usage (`_index.en.html`):**
```html
{{< tab id="my-stack" label="My Stack" >}}
<h2>My Stack</h2>
<h3>AI Models</h3>
<p>Claude Opus 4 for complex reasoning...</p>
{{< /tab >}}

{{< tab id="setup" label="Setup" >}}
<h2>Setup</h2>
...
{{< /tab >}}
```

**Shortcode template (`hugo/layouts/shortcodes/tab.html`):**
```html
<div
  role="tabpanel"
  id="panel-{{ .Get "id" }}"
  aria-labelledby="tab-{{ .Get "id" }}"
  class="tab-panel"
  data-tab-id="{{ .Get "id" }}"
  hidden
>
  {{ .Inner }}
</div>
```

**Key behavior:**
- Hugo renders ALL shortcodes at build time -- all panels are in the DOM.
- `hidden` attribute (not `display:none` class) is the most accessible default for non-active panels. JS removes `hidden` from the active panel and sets it on others.
- Alternatively use a CSS class `is-hidden` with `display: none` and toggle that -- both approaches are valid. The `hidden` attribute is simpler (no CSS needed).

**Confidence:** HIGH - documented Hugo behavior, consistent with v0.159.0.

### Pattern 2: Static Tab Button List in `terminal-frame.html`

Since there are exactly 4 fixed tabs, the tablist can be static HTML -- no Hugo range loop needed. This avoids the complexity of passing tab metadata from the content file to a partial.

**Tab strip row (insert between title bar and content area in `terminal-frame.html`):**
```html
{{/* Tab strip */}}
<div
  role="tablist"
  aria-label="How I AI sections"
  class="flex shrink-0"
  style="border-bottom: 1px solid var(--color-border); padding: 0 16px;"
>
  <button
    role="tab"
    id="tab-my-stack"
    aria-controls="panel-my-stack"
    aria-selected="true"
    class="tab-button"
    data-tab="my-stack"
    style="padding: 10px 16px 10px 0; font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; background: none; border: none; cursor: pointer; color: var(--color-text); border-bottom: 2px solid var(--color-accent);"
  >My Stack</button>
  <button
    role="tab"
    id="tab-setup"
    aria-controls="panel-setup"
    aria-selected="false"
    class="tab-button"
    data-tab="setup"
    style="padding: 10px 16px; font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; background: none; border: none; cursor: pointer; color: var(--color-text-muted); border-bottom: 2px solid transparent;"
  >Setup</button>
  {{/* ... Workflow, Tips ... */}}
</div>
```

**Note on font choice:** Monospace is recommended (matches terminal aesthetic and existing title bar + status bar typography). This is within Claude's discretion -- monospace is the natural pick for terminal chrome.

**Confidence:** HIGH - standard HTML tablist pattern.

### Pattern 3: Vanilla TypeScript Tab Switching

Following the established project pattern in `index.ts` (querySelector + addEventListener):

**New module `hugo/assets/ts/tabs.ts`:**
```typescript
export const initTabs = (): void => {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>("[role='tab']");
  const tabPanels = document.querySelectorAll<HTMLDivElement>("[role='tabpanel']");

  if (tabButtons.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");

      // Deactivate all tabs
      tabButtons.forEach((btn) => {
        btn.setAttribute("aria-selected", "false");
        btn.style.color = "var(--color-text-muted)";
        btn.style.borderBottomColor = "transparent";
      });

      // Hide all panels
      tabPanels.forEach((panel) => {
        panel.hidden = true;
      });

      // Activate clicked tab
      button.setAttribute("aria-selected", "true");
      button.style.color = "var(--color-text)";
      button.style.borderBottomColor = "var(--color-accent)";

      // Show target panel
      const targetPanel = document.getElementById(`panel-${targetId}`);
      if (targetPanel) {
        targetPanel.hidden = false;
      }
    });
  });
};
```

**Called from `index.ts`:**
```typescript
import { initTabs } from "./tabs";

document.addEventListener("DOMContentLoaded", () => {
  // ... existing code ...
  initTabs();
});
```

**Confidence:** HIGH - matches established project pattern exactly.

**Alternative (inline in index.ts):** Valid if the team prefers not to add a new file. The module is cleaner given `index.ts` is already multi-concern.

### Pattern 4: H1 Intro Block Above Terminal Frame

The H1 + tagline lives in `terminal-frame.html` BEFORE the `<div class="base-grid pt-12 ...">` terminal frame block, or it can be a new partial called from `list.html`. Simplest: add it inline in `terminal-frame.html` since both elements share the same page context.

```html
{{/* H1 page intro - above terminal frame */}}
<div class="base-grid pt-16 md:pt-24">
  <div class="col-start-2 col-end-12 md:col-start-3 md:col-end-11">
    <h1 style="color: var(--color-text); font-size: clamp(2rem, 5vw, 4rem);">How I AI</h1>
    <p class="mt-3" style="color: var(--color-text-muted); font-size: 1.125rem;">
      A living knowledge base - tools, setup, workflow, and learnings from daily AI-assisted product work.
    </p>
  </div>
</div>
```

**Note:** The existing `_index.en.html` currently contains an H1 inside the `.Content` block (inside the scrollable terminal). That H1 must be removed when the tab shortcodes replace it. The new H1 lives outside the terminal, rendered by the partial.

**Confidence:** HIGH - identical pattern to existing base-grid column spans used in Phase 3.

### Pattern 5: Placeholder Content Structure Per Tab

Each tab has realistic scaffolded content (D-09). Recommended structure:

**My Stack tab:**
- H2: AI Models
- Items: Claude Opus 4 (complex reasoning), Claude Sonnet (drafting, iteration), Cursor (code)
- H2: Integrations
- Items: Claude Code, n8n (automation), Notion (knowledge)

**Setup tab:**
- H2: Environment
- Items: MacBook Pro, terminal-first workflow
- H2: Key Tools
- Items: Claude Code CLI, Cursor IDE, n8n self-hosted
- H2: Configuration
- Short note about dotfiles / settings

**Workflow tab:**
- H2: Daily Loop
- Items: morning context briefing, PM artifact drafts, spec review
- H2: Recurring Patterns
- Items: prompt patterns for PRDs, user story refinement, retro synthesis

**Tips tab:**
- H2: What Works
- Items: give Claude full context, treat it as a senior collaborator
- H2: What Doesn't
- Items: one-shot complex specs, skipping review

Content should use `<h2>`, `<h3>`, `<p>`, `<ul>/<li>` tags -- basic HTML, no Markdown (content file is `.html`).

### Anti-Patterns to Avoid

- **Lazy-loading tab content via JS:** Violates D-06. All panels must be in the DOM at load. SEO requirement.
- **Using JavaScript to generate tab button HTML:** Tab buttons should be in static HTML so they work without JS (graceful degradation) and are crawlable.
- **Hardcoding hex colors in layout files:** Always use `var(--color-*)` tokens. The only exception is the traffic light dots (already hardcoded per Phase 2 decision).
- **Adding `display:none` via Tailwind class for hidden panels instead of `hidden` attribute:** The `hidden` HTML attribute is simpler and semantic. If `hidden` is overridden by other styles (e.g., `display:flex` on the panel), switch to a CSS class -- but the `hidden` attribute is the correct default.
- **Putting tab switching logic inside the shortcode template:** Shortcodes render server-side. All interactivity is in TypeScript.
- **Creating a `single.html` layout:** The `/how-i-ai` section uses `_index.en.html` (list content file) rendered by `list.html`. No `single.html` is needed or appropriate.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Tab panel show/hide | Custom CSS visibility system | HTML `hidden` attribute + JS toggle | Semantic, accessible, zero CSS needed |
| Tab ARIA | Custom data attributes only | Standard `role="tablist/tab/tabpanel"` + `aria-selected/controls/labelledby` | WCAG 2.1 compliance, screen reader support |
| Content storage | Hardcoded HTML in layout template | Hugo shortcode in content file | Future-proof editing without touching layouts |
| Font stack | New font import | `ui-monospace, 'SF Mono', Menlo, monospace` (already in terminal chrome) | Already established in title bar + status bar |

**Key insight:** The tab pattern is a well-known HTML/ARIA primitive. Build it exactly once with proper semantics rather than inventing a custom visibility system.

## Common Pitfalls

### Pitfall 1: Content File is `.html`, Not `.md`

**What goes wrong:** Markdown syntax (`##`, `**bold**`) inside `_index.en.html` is not processed by Hugo's Markdown renderer. It renders as raw text.
**Why it happens:** Hugo determines the content renderer by file extension. `.html` files skip Markdown processing.
**How to avoid:** Use HTML tags (`<h2>`, `<strong>`, `<ul>`) inside shortcode inner content in `_index.en.html`.
**Warning signs:** Heading hashes appear literally on the page.

### Pitfall 2: `{{ .Inner }}` Renders Raw HTML Unescaped

**What goes wrong:** If the shortcode template uses `{{ .Inner }}` and the inner content contains angle brackets, Hugo may escape them in some contexts.
**Why it happens:** Hugo's template engine HTML-escapes by default.
**How to avoid:** Use `{{ .Inner | safeHTML }}` in the shortcode template to prevent double-escaping HTML content.
**Warning signs:** `&lt;h2&gt;` appears in rendered output instead of actual heading elements.

### Pitfall 3: First Tab Not Active on Page Load

**What goes wrong:** Page loads with all panels hidden (all have `hidden` attribute), no panel is visible.
**Why it happens:** If JS initializes before DOM is ready, or if the initial active state is set only by JS.
**How to avoid:** The first tab panel should NOT have the `hidden` attribute in the shortcode output. Either: (a) the shortcode template conditionally omits `hidden` based on a parameter (e.g., `{{< tab id="my-stack" label="My Stack" active="true" >}}`), or (b) the TypeScript `initTabs()` function removes `hidden` from the first panel immediately after querying all panels.
**Warning signs:** Blank content area on page load; all tabs appear unselected.

### Pitfall 4: Tab Strip Causes Terminal Frame Height Overflow

**What goes wrong:** Adding a tab strip row increases total chrome height, causing the terminal content area to overflow or the status bar to be pushed off-screen.
**Why it happens:** `--terminal-height` is calculated as `calc(100dvh - 80px - 128px - 96px)` -- it assumes a fixed amount of chrome. Adding the tab strip row (height ~40px) reduces the available scrollable area but doesn't affect the outer terminal height calculation.
**How to avoid:** The tab strip row uses `shrink-0` (already established pattern for title bar and status bar) and the content area uses `flex-1 overflow-y-auto`. Since the outer terminal height is fixed, the flex layout naturally absorbs the additional row. No height calculation changes needed.
**Warning signs:** Status bar disappears or scrollable content area height is too small.

### Pitfall 5: H1 in Content File Conflicts with New H1 Above Terminal

**What goes wrong:** Two H1 elements on the page -- the existing one inside `_index.en.html` (inside scrollable terminal content) and the new one above the terminal frame.
**Why it happens:** `_index.en.html` currently has `<h1 class="text-4xl...">How I AI</h1>` at line 6.
**How to avoid:** Remove the H1 from `_index.en.html` entirely when replacing its content with `{{< tab >}}` shortcodes. The page-level H1 is the one above the terminal.
**Warning signs:** Duplicate "How I AI" headings; accessibility validators flag two H1 elements.

## Code Examples

### Shortcode Template with `.Inner` and `safeHTML`

```html
{{/* hugo/layouts/shortcodes/tab.html */}}
<div
  role="tabpanel"
  id="panel-{{ .Get "id" }}"
  aria-labelledby="tab-{{ .Get "id" }}"
  class="tab-panel"
  data-tab-id="{{ .Get "id" }}"
  {{- if not (.Get "active") }} hidden{{ end }}
>
  {{ .Inner | safeHTML }}
</div>
```

### Tab Initialization with First-Panel Default

```typescript
// hugo/assets/ts/tabs.ts
export const initTabs = (): void => {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>("[role='tab']");
  const tabPanels = document.querySelectorAll<HTMLDivElement>("[role='tabpanel']");

  if (tabButtons.length === 0) return;

  // Ensure first tab is active on load (defensive - shortcode should handle this too)
  const firstPanel = tabPanels[0];
  if (firstPanel) firstPanel.hidden = false;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");

      tabButtons.forEach((btn) => {
        btn.setAttribute("aria-selected", "false");
        // Style reset handled via CSS class or inline style
      });
      tabPanels.forEach((panel) => {
        panel.hidden = true;
      });

      button.setAttribute("aria-selected", "true");
      const targetPanel = document.getElementById(`panel-${targetId}`);
      if (targetPanel) targetPanel.hidden = false;
    });
  });
};
```

### Import in `index.ts`

```typescript
import { scrollToTop } from "./utils";
import { animate } from "motion";
import { initTabs } from "./tabs";

document.addEventListener("DOMContentLoaded", () => {
  // ... existing scrollToTop and scrollIndicator code ...
  initTabs();
});
```

## Environment Availability

Step 2.6: No new external dependencies. Hugo, Node.js, and pnpm are already confirmed available (Hugo v0.159.0+extended, Node v23.6.0). No new tools required.

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | None (Hugo static site - no JS test framework present) |
| Config file | none |
| Quick run command | `npm run build` (Hugo build - catches template errors, shortcode errors, TS compile errors) |
| Full suite command | `npm run build` |

No automated test infrastructure exists in this project. Hugo's build step IS the test: it catches malformed templates, undefined shortcode parameters, TypeScript compilation errors, and produces the final HTML.

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| TABS-01 | 4 tabs visible and clickable; click switches active panel | smoke (manual browser check) | `npm run build` (build passes) | N/A |
| CONT-01 | All 4 tab panels contain non-blank placeholder content | build | `npm run build` (Hugo errors if shortcode malformed) | N/A |
| CONT-02 | Content sourced from `_index.en.html`, not hardcoded in layout | code review | `grep -n "My Stack" hugo/layouts/` should return 0 matches | N/A |

### Sampling Rate

- **Per task commit:** `npm run build`
- **Per wave merge:** `npm run build`
- **Phase gate:** Build passes green + manual browser verification of tab switching before `/gsd:verify-work`

### Wave 0 Gaps

None - no test framework to set up. Build toolchain is already in place. Manual browser verification is the acceptance gate for UI behavior.

## Open Questions

1. **Active tab indicator implementation: CSS border vs inline style**
   - What we know: D-03 specifies accent orange underline for active tab. The Tailwind token `--color-accent` is available.
   - What's unclear: Whether to use a Tailwind utility class for the active border (cleaner) or inline style (consistent with existing terminal chrome patterns which use inline styles throughout).
   - Recommendation: Use inline styles for consistency with the existing terminal chrome - all chrome elements in `terminal-frame.html` use inline styles. The active state CSS can be toggled by the TS module by setting `button.style.borderBottomColor`.

2. **Tab strip border vs separator line**
   - What we know: D-02 places tabs between title bar and content. The existing title bar has `border-bottom: 1px solid var(--color-border)`.
   - What's unclear: Whether the tab strip row itself needs a border-bottom separator, or whether the active tab's bottom border provides sufficient visual separation from the content area.
   - Recommendation: Add `border-bottom: 1px solid var(--color-border)` on the tablist container. The active tab's 2px accent border will visually "merge" with this separator, creating the standard browser-tab visual metaphor.

## Sources

### Primary (HIGH confidence)

- Hugo v0.159.0 official shortcode documentation - shortcode inner content, `.Inner`, `.Get`, paired shortcode syntax
- Hugo v0.159.0 - `.Inner | safeHTML` for unescaped HTML inner content
- Existing codebase: `hugo/layouts/shortcodes/linkStrike.html` - established shortcode pattern with `.Get`
- Existing codebase: `hugo/assets/ts/index.ts` - established `querySelector`/`addEventListener`/`DOMContentLoaded` pattern
- Existing codebase: `hugo/assets/css/tailwind.css` - all CSS custom properties verified directly
- Existing codebase: `hugo/layouts/partials/terminal-frame.html` - current DOM structure, flex layout, shrink-0 pattern

### Secondary (MEDIUM confidence)

- WAI-ARIA Authoring Practices Guide - Tab pattern: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby` - standard ARIA tab semantics

### Tertiary (LOW confidence)

- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all tools verified in repo
- Architecture: HIGH - Hugo shortcode pattern verified from existing `linkStrike.html`; TS pattern verified from `index.ts`
- Pitfalls: HIGH - sourced from direct code inspection of current state (H1 duplicate, `.html` file extension, flex layout)
- ARIA semantics: MEDIUM - standard web practice, not verified against Context7

**Research date:** 2026-03-30
**Valid until:** 2026-05-30 (stable stack, no fast-moving dependencies)
