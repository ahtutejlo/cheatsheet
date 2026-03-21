---
phase: 3
slug: internationalization
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing (no automated test framework configured) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run preview` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run preview`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | I18N-01 | manual | `npm run build` | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | I18N-01, I18N-03 | manual | `npm run build` | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | I18N-01 | manual | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

No automated test framework exists in the project, and the scope of changes is small enough (1 component modification, 1 page modification) that manual verification is appropriate.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Language toggle visible on all pages | I18N-01 | Visual UI element | Navigate to /ua/ and /en/ home + section pages, verify toggle present in header |
| Content shows in selected language | I18N-02 | Content translation verification | Click toggle on section page, verify questions/answers switch language |
| UI elements translated | I18N-03 | Visual verification of labels | Switch language, verify nav, buttons, headings change language |
| Language preference persists | I18N-01 | Browser state verification | Toggle to EN, navigate to root URL, verify redirects to /en/ |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
