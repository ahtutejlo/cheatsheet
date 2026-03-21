---
phase: 4
slug: infrastructure-and-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (Astro build serves as primary validation) |
| **Config file** | none — build-time validation via `npx astro build` |
| **Quick run command** | `npx astro build` |
| **Full suite command** | `npx astro build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro build`
- **After every plan wave:** Run `npx astro build && npx astro preview`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | INFRA-01 | build-validation | `npx astro build` | n/a (build-time) | ⬜ pending |
| 04-01-02 | 01 | 1 | INFRA-02 | build + manual | `npx astro build` then inspect HTML | n/a | ⬜ pending |
| 04-02-01 | 02 | 2 | UI-01 | manual + grep | `grep -r 'bg-blue-100\|bg-amber-100\|bg-green-100' dist/` | n/a | ⬜ pending |
| 04-02-02 | 02 | 2 | UI-02 | manual | Visual inspection after build | n/a | ⬜ pending |
| 04-02-03 | 02 | 2 | UI-03 | manual + grep | `grep -r 'type-count' dist/` | n/a | ⬜ pending |
| 04-01-03 | 01 | 1 | INFRA-03 | smoke | `test -f CONTENT_CONVENTIONS.md` | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Astro build validates:
- Content schema (Zod) at build time
- Template rendering (missing props, undefined variables)
- No formal test framework needed for this phase

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Solidity/Python syntax highlighting renders with colors | INFRA-02 | Visual quality check — build success doesn't guarantee correct colors | Build, open a page with solidity/python code, verify colored tokens |
| Type badge displays correct color and label | UI-01 | Visual design verification | Build, open a flashcard with non-basic type, verify badge appearance |
| Questions grouped correctly on section page | UI-02 | Layout verification | Build, open section page, verify group order: Basic > Deep > Trick > Practical |
| Type count summary visible | UI-03 | Visual verification | Build, open section page, verify count per type is shown |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
