---
Created: 02-04-2026
tags: type/todo, project/website, feature/nav
---

# Logo Drawing Animation - Asset Requirements

## What you need

- [ ] Full name/wordmark as an SVG with **stroke paths** (not filled shapes)
- [ ] Each letter should be a single open path that follows the natural writing stroke order
- [ ] Strokes should have consistent stroke-width (adjust to taste, ~2-4px at final size)
- [ ] Keep each letter as a separate `<path>` element so they can be animated sequentially
- [ ] No fills on the text paths - only strokes

## How to create it

1. Open Illustrator, Figma, or Inkscape
2. Write out the full name using the Pen tool, tracing each letter as you would write it by hand
3. Use a single continuous stroke per letter where possible (lifts between letters are fine)
4. Export as SVG, ensuring paths are not expanded/outlined into filled shapes
5. Clean up: remove unnecessary groups, give each letter path a meaningful id (e.g., `id="letter-j"`)

## Technical notes

- The animation uses `stroke-dasharray` and `stroke-dashoffset` CSS properties
- Each path's total length is measured with `getTotalLength()`, then animated from fully hidden to fully visible
- Sequential letter animation is done by staggering the delay per path
- This pairs well with the sumi-e direction planned for nav phase 2
