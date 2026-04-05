---
created: 2026-03-30T09:08:28.314Z
title: Add H1 title and description above terminal frame
area: ui
files:
  - hugo/layouts/how-i-ai/single.html
  - hugo/layouts/partials/terminal-frame.html
---

## Problem

The `/how-i-ai` page jumps straight into the terminal frame with no page-level heading. Compared to blog pages on the site, it feels context-free — a visitor landing on the page has no immediate visual anchor telling them what they're looking at.

## Solution

Add an H1 "How I AI" and a short description/tagline below it, positioned above the terminal frame in the dark-themed page body. Should use the existing dark theme tokens (`--color-text`, `--color-text-muted`) and fit within the 12-column grid. Fold into Phase 4 (Tab Structure & Content) scope or plan as a small standalone task.
