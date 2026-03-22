---
phase: 6
slug: search-and-filter
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — build verification only |
| **Config file** | none — no test framework needed |
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
| 6-01-01 | 01 | 1 | SRCH-01 | build | `npm run build` | ✅ | ⬜ pending |
| 6-01-02 | 01 | 1 | SRCH-01 | build | `npm run build` | ✅ | ⬜ pending |
| 6-02-01 | 02 | 1 | SRCH-02 | build | `npm run build` | ✅ | ⬜ pending |
| 6-02-02 | 02 | 1 | SRCH-02 | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Build verification (`npm run build`) is the primary automated check. No test framework installation needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Search finds questions in selected language | SRCH-01 | Requires browser interaction with Pagefind UI | 1. Build and preview site 2. Navigate to /ua/search 3. Type query matching a known question 4. Verify matching results appear 5. Repeat for /en/search |
| Tag click filters section questions | SRCH-02 | Requires browser interaction with DOM filtering | 1. Build and preview site 2. Navigate to a section page 3. Click a tag badge on a question 4. Verify only questions with that tag are visible 5. Click same tag again to clear filter |
| Search works across all 195 questions | SRCH-01 | Requires build-time index verification | 1. After build, verify pagefind index exists in dist/ 2. Search for terms from different sections 3. Verify results link to correct section pages |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
