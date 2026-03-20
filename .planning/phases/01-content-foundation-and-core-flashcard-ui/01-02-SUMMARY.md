---
phase: 01-content-foundation-and-core-flashcard-ui
plan: 02
subsystem: ui
tags: [astro, tailwind, i18n, responsive, layout]

requires:
  - phase: 01-01
    provides: content schema and question markdown files
provides:
  - i18n utilities (locale detection, translation lookup, section metadata)
  - BaseLayout with responsive viewport and global CSS
  - Header component with site navigation
  - SectionCard component for home page section listing
  - Home page at /[locale]/ with section cards and question counts
  - Root redirect to /ua/
affects: [01-03, phase-02, phase-03]

tech-stack:
  added: [tailwindcss]
  patterns: [i18n-via-static-paths, locale-aware-components, meta-refresh-redirect]

key-files:
  created:
    - src/i18n/ui.ts
    - src/i18n/sections.ts
    - src/i18n/utils.ts
    - src/layouts/BaseLayout.astro
    - src/components/Header.astro
    - src/components/SectionCard.astro
    - src/pages/[locale]/index.astro
  modified:
    - src/pages/index.astro
    - src/styles/global.css
    - package.json

key-decisions:
  - "Meta refresh redirect instead of Astro.redirect() for static mode base path compatibility"
  - "Tailwind CSS v4 @plugin directive for typography instead of @import"
  - "BASE_URL trailing slash normalization pattern for consistent path construction"

patterns-established:
  - "i18n pattern: getStaticPaths returns locales array, components receive locale as prop"
  - "localePath() helper for all internal links with base URL handling"
  - "Section metadata separate from content schema for display-only data (icons, descriptions)"

requirements-completed: [CORE-01, DSGN-03, DSGN-04]

duration: 4min
completed: 2026-03-20
---

# Phase 01 Plan 02: Layout and Home Page Summary

**Responsive home page at /ua/ and /en/ listing 3 sections (QA, Java, Docker) with question counts, i18n utilities, and BaseLayout with Tailwind CSS**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-20T01:04:19Z
- **Completed:** 2026-03-20T01:08:34Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- i18n system with UI translations, section metadata, and utility functions for UA/EN locales
- Responsive home page showing 3 sections with correct question counts (3 each) from content collection
- BaseLayout with proper HTML lang attribute, viewport meta, and antialiased typography
- Root URL redirect to /ua/ default locale

## Task Commits

Each task was committed atomically:

1. **Task 1: Create i18n utilities and section metadata** - `82196c6` (feat)
2. **Task 2: Create BaseLayout, Header, SectionCard, and home page** - `faf5506` (feat)

## Files Created/Modified
- `src/i18n/ui.ts` - UI string translations for UA and EN
- `src/i18n/sections.ts` - Section display metadata (name, description, icon) per locale
- `src/i18n/utils.ts` - getLangFromUrl, t(), localePath() helpers
- `src/layouts/BaseLayout.astro` - HTML shell with global CSS, viewport meta, lang attribute
- `src/components/Header.astro` - Site header with navigation link
- `src/components/SectionCard.astro` - Section preview card with hover effects
- `src/pages/index.astro` - Root redirect to /ua/ via meta refresh
- `src/pages/[locale]/index.astro` - Home page with section grid from content collection
- `src/styles/global.css` - Fixed @tailwindcss/typography to use @plugin directive
- `package.json` - Added tailwindcss as dependency

## Decisions Made
- Used meta refresh redirect instead of Astro.redirect() because static mode with base path produces malformed URLs
- Changed @import to @plugin for @tailwindcss/typography (v0.5 is a JS plugin, not CSS-importable in Tailwind v4)
- Normalize BASE_URL trailing slash before path concatenation to avoid /cheatsheetua/ malformation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing tailwindcss dependency**
- **Found during:** Task 2 (build verification)
- **Issue:** tailwindcss package not in node_modules, @import "tailwindcss" in global.css failing
- **Fix:** Ran `pnpm add tailwindcss`
- **Files modified:** package.json, pnpm-lock.yaml
- **Verification:** Build passes
- **Committed in:** faf5506 (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed @tailwindcss/typography import syntax for Tailwind v4**
- **Found during:** Task 2 (build verification)
- **Issue:** @import "@tailwindcss/typography" fails because v0.5 is a JS plugin, not a CSS module
- **Fix:** Changed to @plugin "@tailwindcss/typography" (Tailwind v4 syntax)
- **Files modified:** src/styles/global.css
- **Verification:** Build passes
- **Committed in:** faf5506 (Task 2 commit)

**3. [Rule 1 - Bug] Fixed BASE_URL trailing slash in redirect and favicon**
- **Found during:** Task 2 (build verification)
- **Issue:** import.meta.env.BASE_URL returns "/cheatsheet" without trailing slash, concatenation produces "/cheatsheetua/" and "/cheatsheetfavicon.svg"
- **Fix:** Normalize BASE_URL with .replace(/\/?$/, '/') before concatenation
- **Files modified:** src/pages/index.astro, src/layouts/BaseLayout.astro
- **Verification:** Built output shows correct /cheatsheet/ua/ and /cheatsheet/favicon.svg URLs
- **Committed in:** faf5506 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All auto-fixes necessary for build to succeed and URLs to be correct. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Home page complete, ready for Plan 03 (flashcard UI and section detail pages)
- i18n utilities established for use in all future components
- Content collection query pattern established (getCollection + filter by section)

## Self-Check: PASSED

All 8 created files verified present. Both task commits (82196c6, faf5506) verified in git log.

---
*Phase: 01-content-foundation-and-core-flashcard-ui*
*Completed: 2026-03-20*
