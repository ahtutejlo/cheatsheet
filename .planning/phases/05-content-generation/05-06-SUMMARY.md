---
phase: 05-content-generation
plan: 06
subsystem: content
tags: [sql, bilingual, markdown, astro-content-collections]

requires:
  - phase: 04-infrastructure
    provides: "type field in content schema, TypeBadge component, CONTENT_CONVENTIONS.md"
provides:
  - "15 advanced SQL questions (5 deep, 5 trick, 5 practical)"
  - "SQL section expanded from 15 to 30 total questions"
affects: [06-search-filter]

tech-stack:
  added: []
  patterns: [deep-question-pattern, trick-trap-callout, practical-scenario-approach-solution]

key-files:
  created:
    - src/content/questions/sql/btree-index-internals.md
    - src/content/questions/sql/mvcc-transaction-isolation.md
    - src/content/questions/sql/query-optimizer-cost-estimation.md
    - src/content/questions/sql/wal-crash-recovery.md
    - src/content/questions/sql/lock-escalation-mechanics.md
    - src/content/questions/sql/null-comparisons-aggregations-trap.md
    - src/content/questions/sql/group-by-non-aggregated-trap.md
    - src/content/questions/sql/between-dates-inclusive-trap.md
    - src/content/questions/sql/correlated-subquery-performance-trap.md
    - src/content/questions/sql/distinct-vs-group-by-trap.md
    - src/content/questions/sql/optimize-slow-join-scenario.md
    - src/content/questions/sql/audit-logging-schema-scenario.md
    - src/content/questions/sql/soft-delete-referential-integrity-scenario.md
    - src/content/questions/sql/concurrent-updates-deadlocks-scenario.md
    - src/content/questions/sql/zero-downtime-migration-scenario.md
  modified: []

key-decisions:
  - "Used PostgreSQL-centric examples with MySQL/SQL Server comparison notes where relevant"

patterns-established:
  - "SQL deep questions: concept + internals + code + interview relevance"
  - "SQL trick questions: Trap callout + explanation + demo code + misconception origin"
  - "SQL practical questions: Scenario + Approach (numbered) + Solution (multi-step SQL)"

requirements-completed: [CONT-16, CONT-17, CONT-18]

duration: 6min
completed: 2026-03-22
---

# Phase 05 Plan 06: SQL Advanced Questions Summary

**15 bilingual SQL questions covering B-tree internals, MVCC, query optimization, NULL traps, GROUP BY pitfalls, deadlock prevention, and zero-downtime migrations**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-22T13:08:40Z
- **Completed:** 2026-03-22T13:14:58Z
- **Tasks:** 1
- **Files created:** 15

## Accomplishments
- 5 deep-technical questions covering B-tree index structure, MVCC transaction isolation, query optimizer cost estimation, WAL crash recovery, and lock escalation mechanics
- 5 trick questions addressing NULL comparison traps, GROUP BY non-aggregated columns, BETWEEN with dates, correlated subquery performance myths, and DISTINCT vs GROUP BY equivalence
- 5 practical scenario questions for JOIN optimization, audit logging design, soft delete with referential integrity, deadlock prevention, and zero-downtime schema migrations
- SQL section expanded from 15 basic to 30 total questions; pnpm build passes clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 15 SQL advanced question files** - `f8a5c05` (feat)

## Files Created
- `src/content/questions/sql/btree-index-internals.md` - B-tree structure, O(log n) lookups, clustered vs non-clustered
- `src/content/questions/sql/mvcc-transaction-isolation.md` - MVCC snapshots, READ COMMITTED vs REPEATABLE READ
- `src/content/questions/sql/query-optimizer-cost-estimation.md` - Cost-based optimization, statistics, join algorithms
- `src/content/questions/sql/wal-crash-recovery.md` - Write-Ahead Logging, checkpoints, PITR
- `src/content/questions/sql/lock-escalation-mechanics.md` - Row vs table locks, deadlock detection, advisory locks
- `src/content/questions/sql/null-comparisons-aggregations-trap.md` - NULL = NULL trap, COUNT(*) vs COUNT(col)
- `src/content/questions/sql/group-by-non-aggregated-trap.md` - MySQL ONLY_FULL_GROUP_BY vs PostgreSQL strict mode
- `src/content/questions/sql/between-dates-inclusive-trap.md` - BETWEEN inclusive boundaries with timestamps
- `src/content/questions/sql/correlated-subquery-performance-trap.md` - EXISTS vs JOIN for semi-joins
- `src/content/questions/sql/distinct-vs-group-by-trap.md` - Equivalence for deduplication
- `src/content/questions/sql/optimize-slow-join-scenario.md` - EXPLAIN ANALYZE, covering index, materialized view
- `src/content/questions/sql/audit-logging-schema-scenario.md` - Generic trigger, JSONB diff storage
- `src/content/questions/sql/soft-delete-referential-integrity-scenario.md` - Partial unique indexes, cascade triggers
- `src/content/questions/sql/concurrent-updates-deadlocks-scenario.md` - Lock ordering, SKIP LOCKED, retry logic
- `src/content/questions/sql/zero-downtime-migration-scenario.md` - Batch backfill, NOT VALID constraint, VALIDATE

## Decisions Made
- Used PostgreSQL-centric examples as the primary dialect, with MySQL/SQL Server comparison notes where behavior differs (e.g., MVCC implementation, lock escalation, ONLY_FULL_GROUP_BY)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 6 content generation plans complete (QA, Java, Kubernetes, Blockchain, Docker, SQL)
- 90 new advanced questions created across all sections
- Ready for Phase 6 (search and filter)

## Self-Check: PASSED

All 15 files verified present. Commit f8a5c05 verified in git log.

---
*Phase: 05-content-generation*
*Completed: 2026-03-22*
