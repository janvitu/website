---
phase: 4
slug: tab-structure-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (Hugo static site — no JS test framework) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Build must pass green + manual browser verification of tab switching
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-XX-01 | TBD | 1 | TABS-01 | smoke | `npm run build` | N/A | ⬜ pending |
| 4-XX-02 | TBD | 1 | CONT-01 | build | `npm run build` | N/A | ⬜ pending |
| 4-XX-03 | TBD | 1 | CONT-02 | code review | `grep -rn "My Stack" hugo/layouts/ \| wc -l` (expect 0) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*None — existing build toolchain is already in place. No test framework to install.*

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Clicking a tab shows its panel and hides others | TABS-01 | No JS test framework; UI interaction only verifiable in browser | Open `/how-i-ai`, click each of the 4 tabs, verify only the clicked panel is visible |
| Tab strip renders between title bar and content | TABS-01 | Visual layout — not detectable via build | Inspect page in browser: tab strip appears below `[how-i-ai ~]$` title bar |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
