---
phase: 04-infrastructure-and-ui
plan: 02
subsystem: ui
tags: [astro, tailwind, i18n, components, type-badges, grouping]

# Dependency graph
requires:
  - phase: 04-infrastructure-and-ui/01
    provides: "type field in content schema and i18n keys for type/group labels"
provides:
  - "TypeBadge component for colored type pill badges"
  - "Updated Flashcard with optional type badge rendering"
  - "Updated FlashcardList with type and locale prop forwarding"
  - "Section page with type grouping, group headers, and type count summary"
affects: [05-content-population]

# Tech tracking
tech-stack:
  added: []
  patterns: ["conditional badge rendering for non-basic types", "type-based question grouping with TYPE_ORDER constant", "colored dot type count summary"]

key-files:
  created:
    - src/components/TypeBadge.astro
  modified:
    - src/components/Flashcard.astro
    - src/components/FlashcardList.astro
    - src/pages/[locale]/[section]/index.astro

key-decisions:
  - "Color maps moved to frontmatter to avoid TypeScript in Astro template expressions"
  - "Group headers only render when multiple type groups exist (single-group backward compat)"
  - "Type count dots only render when multiple types present"

patterns-established:
  - "TypeBadge pattern: conditional render via type !== 'basic' check"
  - "Grouped rendering: TYPE_ORDER constant defines display order, filter empty groups"

requirements-completed: [UI-01, UI-02, UI-03]

# Metrics
duration: 2min
completed: 2026-03-21
---

# Phase 04 Plan 02: Type Badges and Question Grouping Summary

**TypeBadge component with colored pills (blue/amber/green), section page type grouping with labeled headers, and colored-dot type count summary**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-21T16:55:15Z
- **Completed:** 2026-03-21T16:57:42Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created TypeBadge component with three color schemes (deep=blue, trick=amber, practical=green) plus dark mode variants
- Updated Flashcard to conditionally render type badge for non-basic questions
- Refactored section page to group questions by type with labeled headers and count indicators
- Added colored-dot type count summary below section heading (only when multiple types exist)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TypeBadge and update Flashcard and FlashcardList components** - `1071a8a` (feat)
2. **Task 2: Add type grouping and count summary to section page** - `8f92900` (feat)

## Files Created/Modified
- `src/components/TypeBadge.astro` - Colored pill badge for deep/trick/practical question types
- `src/components/Flashcard.astro` - Added optional type badge rendering and locale prop
- `src/components/FlashcardList.astro` - Added type and locale prop forwarding to Flashcard
- `src/pages/[locale]/[section]/index.astro` - Type grouping, group headers, and colored-dot count summary

## Decisions Made
- Moved color map declarations (dotColors, textColors) from Astro template expressions to frontmatter script section because TypeScript generic types (Record<string, string>) are not valid inside Astro template JSX expressions
- Group headers and type count dots only render when multiple type groups exist, preserving current appearance for all-basic sections

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Moved Record type declarations out of template**
- **Found during:** Task 2 (section page grouping)
- **Issue:** Plan placed `const dotColors: Record<string, string>` inside template map callback; Astro/esbuild cannot parse TypeScript generics in template expressions
- **Fix:** Moved dotColors and textColors to frontmatter section, simplified template to reference them
- **Files modified:** src/pages/[locale]/[section]/index.astro
- **Verification:** `npx astro build` exits 0
- **Committed in:** 8f92900 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor code placement change for build compatibility. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All UI components for type-aware question system are ready
- Phase 05 content population can now create questions with type field and they will render with badges and grouping
- Existing 105 basic questions continue to render identically (no badges, no group headers)

---
*Phase: 04-infrastructure-and-ui*
*Completed: 2026-03-21*

## Self-Check: PASSED
