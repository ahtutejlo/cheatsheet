---
phase: 5
slug: content-generation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build (Zod schema validation) |
| **Config file** | `src/content.config.ts` |
| **Quick run command** | `pnpm build 2>&1 | head -50` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build 2>&1 | head -50`
- **After every plan wave:** Run `pnpm build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | CONT-01,02,03 | build | `pnpm build` | ✅ | ⬜ pending |
| 05-02-01 | 02 | 1 | CONT-04,05,06 | build | `pnpm build` | ✅ | ⬜ pending |
| 05-03-01 | 03 | 1 | CONT-07,08,09 | build | `pnpm build` | ✅ | ⬜ pending |
| 05-04-01 | 04 | 2 | CONT-10,11,12 | build | `pnpm build` | ✅ | ⬜ pending |
| 05-05-01 | 05 | 2 | CONT-13,14,15 | build | `pnpm build` | ✅ | ⬜ pending |
| 05-06-01 | 06 | 2 | CONT-16,17,18 | build | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No additional test framework needed.

The Zod schema in `content.config.ts` validates all required fields at build time.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Bilingual quality consistency | ALL | Content quality requires human judgment | Spot-check 2-3 questions per section: UA text reads naturally, not word-for-word translation |
| Trick "Trap:" callout correctness | CONT-02,05,08,11,14,17 | Content correctness | Verify each trap describes a real misconception |
| Practical Scenario realism | CONT-03,06,09,12,15,18 | Content quality | Verify scenarios are realistic production situations |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
