# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Interview Cheatsheet MVP

**Shipped:** 2026-03-21
**Phases:** 3 | **Plans:** 7

### What Was Built
- Static flashcard site with 105 bilingual questions across 7 tech interview sections
- Click-to-reveal UI with smooth animations, anchor links, syntax-highlighted code
- Dark/light mode with system detection and FOUC prevention
- UA/EN language toggle with localStorage persistence and section-aware switching
- CI/CD to GitHub Pages

### What Worked
- Co-located bilingual content (one file per question) prevented translation drift
- i18n-ready content structure from Phase 1 made Phase 3 a minimal addition (1 plan)
- Wave-based parallel execution across plans within each phase
- Native details/summary for flashcards eliminated JS dependency for core interaction
- Zod content schema caught malformed content at build time

### What Was Inefficient
- ROADMAP.md progress table wasn't updating plan checkboxes (all remained `[ ]` despite completion)
- Phase 1 VERIFICATION.md marked as `human_needed` for items that could have been auto-verified with a headless browser

### Patterns Established
- Flat frontmatter fields (ua_question, en_question) over nested YAML to avoid multiline parsing issues
- Singleton highlighter pattern for Shiki (reuse across pages)
- Inline script in `<head>` for FOUC-free theme loading
- `@custom-variant dark` with class-based selector for Tailwind CSS 4 dark mode
- `define:vars` for injecting build-time values into inline scripts

### Key Lessons
1. Plan content structure for i18n from day 1 even if i18n UI ships later — rework cost is very high
2. Shiki `langs` array must explicitly include every language used in content — silent fallback hides missing languages
3. localStorage is sufficient for simple preference persistence in static sites (theme, locale)

### Cost Observations
- Model mix: quality profile (opus executors, sonnet verifiers)
- Notable: Phase 3 was a single plan because i18n infrastructure was already in place

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 3 | 7 | Initial project, established content + i18n patterns |

### Top Lessons (Verified Across Milestones)

1. Plan content structure for extensibility from the start — rework is expensive
2. Silent fallbacks hide real gaps — prefer explicit errors during development
