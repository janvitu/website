# Right-Side Dot Navigation with Glossary-Style Reveal

**Date:** 2026-04-02
**Branch:** feat/new-nav
**Phase:** 1 (JS-powered reveal, no a11y enhancements yet)

## Overview

Replace the current visible right-side navigation with a minimal dot-based nav in the 12th grid column. Dots are always visible; hovering or touching the column triggers a full-screen frosted overlay with nav labels revealed next to their dots using staggered animation (matching the about page glossary effect).

## Layout

The header remains `fixed`, full viewport height, using `grid-cols-12`.

The entire nav lives in `col-start-12 col-end-13` inside a single container (`data-nav-toggle`):

```
┌─────────────────────────────────┬──────┐
│                                 │ Logo │  <- top
│                                 │      │
│                                 │  ·   │
│         (main content)          │  ·   │  <- dots, vertically centered
│                                 │  ●   │  <- active dot (accent)
│                                 │  ·   │
│                                 │      │
│                                 │      │  <- bottom (reserved for future)
└─────────────────────────────────┴──────┘
```

### Desktop (md+): On hover of the column

```
┌─────────────────────────────────┬──────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ Logo │
│ ░░░░░░░░░░ frosted glass ░░░░░░│      │
│ ░░░░░░░░░░░░░░░░░░░░░░░░ About ● ·   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ Work · ·   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░ Blog ● ●   │
│ ░░░░░░░░░░░░░░░░░░░░░░ Contact · ·   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│      │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│      │
└─────────────────────────────────┴──────┘
```

Labels appear to the left of each dot, sliding in from the right. Dots remain visible in their column position.

### Mobile (<md): On touch of the column

```
┌──────────────────────────────────────┐
│ ░░░░░░░░░░░░░░ Logo ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░ About ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░ Work ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░ Blog ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░ Contact ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────┘
```

On mobile, the frosted overlay covers everything including the dots. The overlay contains the logo at the top (centered) and nav links centered on screen. The dots and the column's logo are hidden behind the overlay.

## HTML Structure

### header.html

```html
<header
	class="fixed inset-x-0 bottom-0 top-0 z-[1000] grid w-full grid-cols-12 pointer-events-none"
>
	<!-- Nav overlay (frosted backdrop) -->
	<div
		data-nav-overlay
		class="fixed inset-0 bg-white/60 backdrop-blur-xs z-[1099] opacity-0 pointer-events-none flex flex-col items-center"
	>
		<!-- Mobile-only: logo + centered nav inside overlay -->
		<div class="md:hidden flex flex-col h-full w-full items-center">
			<div class="w-2/3 min-w-[20px] max-w-[56px] pt-5 fill-neutral-800">
				<a href="{{ ($.Site.GetPage `/`).RelPermalink }}" aria-label="Home">
					{{ partial "svg/Logo.svg" }}
				</a>
			</div>
			<nav
				class="flex-1 flex items-center justify-center"
				aria-label="Mobile navigation"
			>
				<ul class="flex flex-col gap-6 items-center">
					{{ range .Site.Menus.main }} {{ if ne .Params.hidden "true" }}
					<li>
						<a
							href="{{ .URL }}"
							class="nav-label-mobile text-base font-semibold text-neutral-800 whitespace-nowrap"
							{{
							if
							eq
							$.Page.RelPermalink
							.URL
							}}aria-current="page"
							{{
							end
							}}
						>
							{{ .Name }}
						</a>
					</li>
					{{ end }} {{ end }}
				</ul>
			</nav>
		</div>
	</div>

	<!-- Nav column - entire trigger zone -->
	<div
		data-nav-toggle
		class="col-start-12 col-end-13 flex flex-col h-full z-[1100] pointer-events-auto"
	>
		<!-- Logo (top) -->
		<div
			class="w-2/3 min-w-[20px] max-w-[56px] place-self-center pt-5 fill-neutral-800 transition-colors duration-150 hover:fill-accent"
		>
			<a href="{{ ($.Site.GetPage `/`).RelPermalink }}" aria-label="Home">
				{{ partial "svg/Logo.svg" }}
			</a>
		</div>

		<!-- Navigation (centered) -->
		<nav
			class="flex-1 flex items-center justify-center"
			aria-label="Main navigation"
		>
			<ul class="flex flex-col gap-6 items-end">
				{{ range .Site.Menus.main }} {{ if ne .Params.hidden "true" }}
				<li class="flex items-center gap-4">
					<a
						href="{{ .URL }}"
						class="nav-label text-base font-semibold text-neutral-800 md:text-2xl whitespace-nowrap"
						{{
						if
						eq
						$.Page.RelPermalink
						.URL
						}}aria-current="page"
						{{
						end
						}}
					>
						{{ .Name }}
					</a>
					<span
						class="nav-dot{{ if eq $.Page.RelPermalink .URL }} nav-dot--active{{ end }}"
					></span>
				</li>
				{{ end }} {{ end }}
			</ul>
		</nav>

		<!-- Bottom spacer (reserved for future social links) -->
		<div class="pb-5"></div>
	</div>
</header>
```

## Dot Styling

In `tailwind.css`:

```css
.nav-dot {
	@apply block w-1.5 h-1.5 rounded-full bg-neutral-500 flex-shrink-0;
	outline: 2px solid transparent;
	outline-offset: 3px;
	transition: outline-color 0.15s ease;
}

.nav-dot::after {
	content: "";
	@apply absolute inset-[-5px] rounded-full border border-neutral-300;
}

/* Use relative positioning for the ring */
.nav-dot {
	@apply relative;
}

.nav-dot--active {
	@apply bg-accent;
}

.nav-dot--active::after {
	@apply border-accent;
}
```

## Animation (navigation.ts)

New file: `hugo/assets/ts/navigation.ts`

### Behavior

1. **On DOMContentLoaded:**

   - Query `data-nav-toggle`, `data-nav-overlay`, and all `.nav-label` elements
   - Hide all `.nav-label` elements (set `opacity: 0`, `pointer-events: none`)
   - Check viewport width to determine mobile vs desktop behavior

2. **On mouseenter / touchstart of `data-nav-toggle`:**

   - Overlay: animate `opacity` 0 -> 1 over 200ms
   - **Desktop (md+):** Labels animate `opacity` 0 -> 1 and `translateX` 10px -> 0, in-place next to dots, duration 300ms, stagger 50ms, easeOut
   - **Mobile (<md):** Overlay z-index sits above dots (covers them). A separate centered nav list inside the overlay animates in (`opacity` 0 -> 1, `translateY` 10px -> 0, stagger 50ms). The dot column's nav is hidden.
   - Set `pointer-events: auto` on overlay

3. **On mouseleave / touchend of `data-nav-toggle`:**
   - Overlay: animate `opacity` 1 -> 0 over 200ms
   - Labels: reset to hidden state after overlay fade completes
   - Set `pointer-events: none` on overlay

### Responsive strategy

- The overlay (`data-nav-overlay`) contains a **centered nav clone** (visible only on mobile via `md:hidden`) with the same links, styled as a centered vertical list
- The in-column labels (next to dots) use `hidden md:block` so they only appear on desktop
- JS checks `window.matchMedia("(min-width: 768px)")` to decide which set of labels to animate
- On mobile, the overlay's z-index is above the dot column so the frosted glass covers everything

### Dependencies

- `motion` library (already used by glossary.ts) - `animate` and `stagger` functions

### Pattern

Mirrors `glossary.ts` structure:

- Same Motion API usage
- Same `prefers-reduced-motion` check
- Same enter/leave pattern

## Files Changed

| File                                | Change                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `hugo/layouts/partials/header.html` | Rewrite nav structure with dots, overlay, data attributes                                                                |
| `hugo/assets/ts/navigation.ts`      | New file - hover/touch reveal animation                                                                                  |
| `hugo/assets/css/tailwind.css`      | Add `.nav-dot` and `.nav-dot--active` styles                                                                             |
| `hugo/layouts/_default/baseof.html` | Add `<script>` tag for navigation.ts via Hugo's `resources.Get` pipeline (same pattern as glossary.ts on the about page) |

## Out of Scope

- A11y enhancements (no-JS fallback, focus-within, ARIA) - planned as follow-up
- Social links in bottom section
- Logo drawing animation (separate task, see `docs/logo-drawing-animation-todo.md`)
- Sumi-e style animations (phase 2)
- Non-fullscreen overlay on desktop (future refinement)
