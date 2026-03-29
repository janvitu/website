---
phase: 1
slug: dark-theme-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None -- Hugo static site, no JS test framework present |
| **Config file** | None |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` + manual visual check at `http://localhost:1313/how-i-ai` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + visual check at `http://localhost:1313/how-i-ai`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | THEME-01 | smoke + manual | `npm run build` | N/A -- manual | ⬜ pending |
| 01-01-02 | 01 | 1 | THEME-02 | manual visual | `npm run build` + inspect DevTools | N/A -- manual | ⬜ pending |
| 01-01-03 | 01 | 1 | THEME-03 | manual a11y | `npm run build` + keyboard tab test | N/A -- manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework setup needed -- `npm run build` serves as the automated gate, and manual visual verification is the acceptance method.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark background on `/how-i-ai`, light on all other pages | THEME-01 | Visual comparison requires browser | 1. Navigate to `/how-i-ai` -- background should be `#1a1a1a`. 2. Navigate to `/about` -- background should be light (`neutral-100`). |
| Grid lines visible but subtle on dark background | THEME-02 | Visual subtlety check | 1. Navigate to `/how-i-ai`. 2. Inspect grid lines -- should be `#3a3a3a` (visible but not dominant). |
| Focus ring visible when tabbing on dark page | THEME-03 | Keyboard interaction check | 1. Navigate to `/how-i-ai`. 2. Press Tab to cycle through interactive elements. 3. Focus ring should be white (`#ffffff`) 2px outline. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
