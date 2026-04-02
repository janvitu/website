---
Created: 02-04-2026
tags: type/todo, project/website, feature/nav
---

# iOS Safari - Nav overlay doesn't cover status/home bar areas

## Problem

On iOS Safari, the frosted glass nav overlay (`fixed inset-0`) does not extend behind the status bar (top) and home indicator bar (bottom). This leaves a visible gap where the page background shows through instead of the overlay.

## What was tried

- `viewport-fit=cover` + `env(safe-area-inset-*)` negative offsets - did not work
- Brute force `top: -100px; bottom: -100px` on the fixed overlay - did not work
- `theme-color` meta tag swapped via JS on nav open/close - did not work

## Possible avenues to explore

- PWA/standalone mode may give more control over these areas
- Investigate if this is solvable at all in Safari's in-browser mode vs. added-to-homescreen mode
- Check if newer iOS versions have changed behavior
- Consider matching the overlay color to the page background so the gap is less noticeable
