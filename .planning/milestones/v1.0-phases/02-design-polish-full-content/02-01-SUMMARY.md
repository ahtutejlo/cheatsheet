---
phase: 02-design-polish-full-content
plan: 01
subsystem: ui
tags: [dark-mode, tailwind-css-4, theme-toggle, i18n, astro]

requires:
  - phase: 01-mvp-scaffold
    provides: base layout, header, section cards, flashcard components, i18n framework
provides:
  - dark/light mode toggle with FOUC prevention
  - accent color theme system via @theme
  - @custom-variant dark for Tailwind CSS 4
  - 7 registered sections (qa, java, docker, automation-qa, kubernetes, blockchain, sql)
  - i18n keys for theme toggle and empty section state
affects: [02-design-polish-full-content, 03-search-seo-pwa]

tech-stack:
  added: []
  patterns:
    - "@custom-variant dark (&:where(.dark, .dark *)) for class-based dark mode in Tailwind CSS 4"
    - "FOUC prevention via inline script reading localStorage before paint"
    - "@theme block for custom accent color tokens"

key-files:
  created: []
  modified:
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
    - src/components/Header.astro
    - src/components/SectionCard.astro
    - src/components/Flashcard.astro
    - src/pages/[locale]/index.astro
    - src/pages/[locale]/[section]/index.astro
    - src/i18n/sections.ts
    - src/i18n/ui.ts

key-decisions:
  - "Used @custom-variant dark with class-based selector for Tailwind CSS 4 dark mode"
  - "Inline script in head for FOUC prevention instead of CSS-only approach"

patterns-established:
  - "Dark mode: all components use dark: prefix variants with gray-700/800/900 palette"
  - "Theme persistence: localStorage 'theme' key with system preference fallback"
  - "Accent colors: --color-accent-50 through --color-accent-700 blue scale"

requirements-completed: [DSGN-01, DSGN-02]

duration: 2min
completed: 2026-03-21
---

# Phase 02 Plan 01: Dark Mode, Design Polish, and Section Registry Summary

**Class-based dark/light toggle with FOUC prevention, accent color system, hover transitions, and 7 sections registered with i18n keys**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-21T14:55:38Z
- **Completed:** 2026-03-21T14:57:58Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Dark/light mode toggle in header with sun/moon icons, persists via localStorage, respects system preference
- FOUC prevention inline script prevents flash of wrong theme on page load
- All components updated with dark: variant classes matching UI-SPEC color mapping
- Section cards have hover transitions with left accent strip (border-l-[3px])
- 4 new sections registered (automation-qa, kubernetes, blockchain, sql) bringing total to 7
- i18n keys added for theme toggle and empty section state in both UA and EN

## Task Commits

Each task was committed atomically:

1. **Task 1: Dark mode infrastructure and theme toggle** - `dbf8aaa` (feat)
2. **Task 2: Component dark mode variants, design polish, section registry, and i18n keys** - `7db7de5` (feat)

## Files Created/Modified
- `src/styles/global.css` - Added @custom-variant dark, @theme accent colors, removed @media prefers-color-scheme
- `src/layouts/BaseLayout.astro` - FOUC prevention inline script, dark body classes
- `src/components/Header.astro` - Theme toggle button with sun/moon SVG icons and toggle script
- `src/components/SectionCard.astro` - Dark mode variants, hover accent strip
- `src/components/Flashcard.astro` - Dark mode variants, prose-invert, dark Shiki override, text-base typography fix
- `src/pages/[locale]/index.astro` - Dark mode classes on headings
- `src/pages/[locale]/[section]/index.astro` - Dark mode classes on headings and links
- `src/i18n/sections.ts` - 4 new section entries (automation-qa, kubernetes, blockchain, sql)
- `src/i18n/ui.ts` - 3 new i18n keys per locale (theme.toggle, section.empty.title, section.empty.body)

## Decisions Made
- Used @custom-variant dark with class-based selector for Tailwind CSS 4 dark mode (consistent with research findings)
- Inline script in head for FOUC prevention reads localStorage before first paint
- Removed @media prefers-color-scheme Shiki block; all dark mode now via html.dark class only

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Dark mode infrastructure complete, all components themed
- 7 sections registered and ready for content population (Plan 02)
- Empty state i18n keys ready for empty section handling

## Self-Check: PASSED

All 9 modified files verified present. Both task commits (dbf8aaa, 7db7de5) verified in git log.

---
*Phase: 02-design-polish-full-content*
*Completed: 2026-03-21*
