---
phase: 1
slug: content-foundation-and-core-flashcard-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (e2e) + Astro build validation (schema errors fail build) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | INFR-01 | build | `pnpm build` | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | INFR-02 | manual | Check `.github/workflows/deploy.yml` exists | Wave 0 | ⬜ pending |
| 01-01-03 | 01 | 1 | INFR-03 | build | `pnpm build` | N/A | ⬜ pending |
| 01-01-04 | 01 | 1 | CORE-06 | build | `pnpm build` (Zod rejects invalid frontmatter) | N/A | ⬜ pending |
| 01-02-01 | 02 | 2 | CORE-01 | e2e | `pnpm playwright test tests/home.spec.ts` | Wave 0 | ⬜ pending |
| 01-02-02 | 02 | 2 | CORE-02 | e2e | `pnpm playwright test tests/section.spec.ts` | Wave 0 | ⬜ pending |
| 01-02-03 | 02 | 2 | CORE-03 | e2e | `pnpm playwright test tests/flashcard.spec.ts` | Wave 0 | ⬜ pending |
| 01-02-04 | 02 | 2 | CORE-04 | e2e | `pnpm playwright test tests/flashcard.spec.ts` | Wave 0 | ⬜ pending |
| 01-02-05 | 02 | 2 | CORE-07 | e2e | `pnpm playwright test tests/anchor.spec.ts` | Wave 0 | ⬜ pending |
| 01-02-06 | 02 | 2 | DSGN-03 | e2e | `pnpm playwright test tests/responsive.spec.ts` | Wave 0 | ⬜ pending |
| 01-02-07 | 02 | 2 | DSGN-04 | manual | Visual inspection | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `playwright.config.ts` — Playwright configuration
- [ ] `tests/home.spec.ts` — Home page smoke test
- [ ] `tests/section.spec.ts` — Section page smoke test
- [ ] `tests/flashcard.spec.ts` — Flashcard interaction test
- [ ] `tests/anchor.spec.ts` — Anchor link navigation test
- [ ] `tests/responsive.spec.ts` — Mobile viewport test
- [ ] Framework install: `pnpm add -D @playwright/test && pnpm playwright install`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Typography is readable for technical content | DSGN-04 | Subjective visual quality | Inspect code blocks at 320px, 768px, 1024px viewports; verify font size ≥14px, line-height ≥1.5, no overflow |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
