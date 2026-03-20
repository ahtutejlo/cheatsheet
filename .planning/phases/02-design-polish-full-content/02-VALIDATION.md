---
phase: 2
slug: design-polish-full-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — build-time validation only |
| **Config file** | astro.config.mjs (Zod content schemas) |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm preview`
- **Before `/gsd:verify-work`:** Full build must be green + manual dark/light verification
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | DSGN-02 | smoke | `pnpm build` | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | DSGN-01 | smoke | `pnpm build` | N/A | ⬜ pending |
| 02-02-01 | 02 | 2 | CORE-05 | smoke | `pnpm build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. `pnpm build` catches content schema errors via Zod validation. No test framework installation needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark/light toggle works | DSGN-02 | Visual behavior, theme persistence | Toggle button, verify colors change; refresh page, verify theme persists; change OS preference, verify first-visit respects it |
| Modern design polish | DSGN-01 | Aesthetic quality is subjective | Check accent colors, hover transitions, animations render smoothly |
| System preference detection | DSGN-02 | Requires OS-level setting change | Clear localStorage, change OS to dark mode, load page — should be dark |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
