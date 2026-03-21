---
phase: 04-infrastructure-and-ui
plan: 01
subsystem: infra
tags: [zod, shiki, i18n, astro, content-schema]

requires:
  - phase: none
    provides: existing Astro content collections schema
provides:
  - Question type enum field in content schema (basic/deep/trick/practical)
  - Solidity and Python syntax highlighting via Shiki
  - i18n keys for type badges and group labels (UA + EN)
  - Content conventions document for Phase 5 content generation
affects: [04-02, 05-content-generation]

tech-stack:
  added: []
  patterns: [zod-enum-with-default-for-backward-compat]

key-files:
  created: [CONTENT_CONVENTIONS.md]
  modified: [src/content.config.ts, src/lib/markdown.ts, src/i18n/ui.ts]

key-decisions:
  - "No new dependencies needed - solidity and python already bundled in shiki"
  - "type field uses .default('basic') for zero-migration backward compatibility"

patterns-established:
  - "Zod .default() pattern for additive schema fields: add field with default, all existing content passes unchanged"
  - "Content conventions doc as single source of truth for question structure"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03]

duration: 1min
completed: 2026-03-21
---

# Phase 4 Plan 01: Infrastructure Foundation Summary

**Question type enum in Zod schema with basic default, solidity/python Shiki highlighting, 7 i18n keys in both locales, and content conventions document**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-21T16:52:01Z
- **Completed:** 2026-03-21T16:53:21Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Added `type` enum field to question schema with backward-compatible default -- all 105 existing questions build without errors
- Enabled solidity and python syntax highlighting in Shiki highlighter
- Added 7 i18n keys (type labels + group labels) to both UA and EN locales
- Created comprehensive content conventions document defining structure for all 4 question types

## Task Commits

Each task was committed atomically:

1. **Task 1: Add type field to schema, Shiki languages, and i18n keys** - `9276660` (feat)
2. **Task 2: Create content conventions document** - `00e321a` (feat)

## Files Created/Modified
- `src/content.config.ts` - Added type enum field with default('basic')
- `src/lib/markdown.ts` - Added solidity and python to Shiki langs array
- `src/i18n/ui.ts` - Added 7 i18n keys to both UA and EN locale objects
- `CONTENT_CONVENTIONS.md` - Content structure guide for all 4 question types

## Decisions Made
None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Schema type field is live and validated at build time -- Plan 02 can query it for badge/grouping UI
- i18n keys ready for TypeBadge component and group headers
- Content conventions ready for Phase 5 content generation

## Self-Check: PASSED

All 4 files verified present. Both task commits (9276660, 00e321a) verified in git log.

---
*Phase: 04-infrastructure-and-ui*
*Completed: 2026-03-21*
