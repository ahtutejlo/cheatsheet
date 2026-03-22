---
phase: 05-content-generation
plan: 05
subsystem: content
tags: [docker, bilingual, questions, deep, trick, practical]

requires:
  - phase: 04
    provides: "type field in Zod schema, TypeBadge component, content conventions"
provides:
  - "15 advanced Docker questions (5 deep, 5 trick, 5 practical)"
  - "Docker section expanded from 15 to 30 total questions"
affects: [06-search-filter]

tech-stack:
  added: []
  patterns: ["bilingual UA/EN content with YAML frontmatter"]

key-files:
  created:
    - src/content/questions/docker/union-filesystem-cow.md
    - src/content/questions/docker/cgroup-resource-isolation.md
    - src/content/questions/docker/container-networking-namespaces.md
    - src/content/questions/docker/image-layer-caching-algorithm.md
    - src/content/questions/docker/buildkit-parallel-builds.md
    - src/content/questions/docker/copy-vs-add-trap.md
    - src/content/questions/docker/entrypoint-cmd-interaction-trap.md
    - src/content/questions/docker/docker-stop-sigkill-trap.md
    - src/content/questions/docker/volume-mount-permissions-trap.md
    - src/content/questions/docker/dockerignore-gitignore-trap.md
    - src/content/questions/docker/reduce-image-size-scenario.md
    - src/content/questions/docker/debug-network-connectivity-scenario.md
    - src/content/questions/docker/multi-stage-java-scenario.md
    - src/content/questions/docker/health-checks-dependencies-scenario.md
    - src/content/questions/docker/logging-microservices-scenario.md
  modified: []

key-decisions:
  - "Used existing commit f8a5c05 which already contained all 15 Docker files"

patterns-established:
  - "Docker deep questions cover Linux kernel internals (OverlayFS, cgroups, namespaces)"
  - "Docker trick questions use > **Trap:** blockquote pattern per CONTENT_CONVENTIONS.md"
  - "Docker practical questions use Scenario/Approach/Solution structure"

requirements-completed: [CONT-13, CONT-14, CONT-15]

duration: 7min
completed: 2026-03-22
---

# Phase 05 Plan 05: Docker Advanced Questions Summary

**15 bilingual Docker questions covering container internals (OverlayFS, cgroups, namespaces), Dockerfile gotchas (COPY vs ADD, ENTRYPOINT/CMD), and production scenarios (image optimization, networking debug, health checks)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-22T13:08:39Z
- **Completed:** 2026-03-22T13:15:26Z
- **Tasks:** 1
- **Files created:** 15

## Accomplishments
- 5 deep-technical questions (order 16-20): union filesystem/CoW, cgroup resource isolation, container networking namespaces, image layer caching algorithm, BuildKit parallel builds
- 5 trick questions (order 21-25): COPY vs ADD, ENTRYPOINT/CMD interaction, docker stop signals, volume mount permissions, .dockerignore vs .gitignore
- 5 practical questions (order 26-30): reduce image size, debug network connectivity, multi-stage Java build, health checks with dependencies, centralized logging for microservices
- All questions bilingual UA/EN with identical code blocks
- Astro build passes with 30 Docker questions total

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 15 Docker advanced question files** - `f8a5c05` (feat)

## Files Created/Modified
- `src/content/questions/docker/union-filesystem-cow.md` - Deep: OverlayFS and copy-on-write mechanics
- `src/content/questions/docker/cgroup-resource-isolation.md` - Deep: Linux cgroups for CPU/memory limits
- `src/content/questions/docker/container-networking-namespaces.md` - Deep: Network namespaces, veth pairs, docker0 bridge
- `src/content/questions/docker/image-layer-caching-algorithm.md` - Deep: Cache hit rules and cascade invalidation
- `src/content/questions/docker/buildkit-parallel-builds.md` - Deep: DAG execution, cache mounts, build secrets
- `src/content/questions/docker/copy-vs-add-trap.md` - Trick: ADD auto-extracts tars, COPY does not
- `src/content/questions/docker/entrypoint-cmd-interaction-trap.md` - Trick: ENTRYPOINT + CMD work together
- `src/content/questions/docker/docker-stop-sigkill-trap.md` - Trick: SIGTERM first, SIGKILL after grace period
- `src/content/questions/docker/volume-mount-permissions-trap.md` - Trick: UID/GID mismatch on bind mounts
- `src/content/questions/docker/dockerignore-gitignore-trap.md` - Trick: Syntax differences from .gitignore
- `src/content/questions/docker/reduce-image-size-scenario.md` - Practical: 1.2GB to under 200MB with multi-stage
- `src/content/questions/docker/debug-network-connectivity-scenario.md` - Practical: Container network troubleshooting
- `src/content/questions/docker/multi-stage-java-scenario.md` - Practical: Spring Boot with Maven cache and layered JAR
- `src/content/questions/docker/health-checks-dependencies-scenario.md` - Practical: HEALTHCHECK + depends_on condition
- `src/content/questions/docker/logging-microservices-scenario.md` - Practical: Loki + Grafana centralized logging

## Decisions Made
None - followed plan as specified.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Docker section complete with 30 questions (15 basic + 15 advanced)
- Ready for Phase 6 (search and filter) when all content phases complete

## Self-Check: PASSED

All 15 content files verified present. Task commit f8a5c05 verified in git history.

---
*Phase: 05-content-generation*
*Completed: 2026-03-22*
