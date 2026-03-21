---
phase: 03-internationalization
verified: 2026-03-21T16:00:00Z
status: human_needed
score: 4/4 must-haves verified
re_verification: false
human_verification:
  - test: "Visit root URL, verify redirect to /ua/ on first visit (no localStorage set)"
    expected: "Browser lands on /cheatsheet/ua/ without a flash of wrong locale"
    why_human: "localStorage state can't be tested statically; requires live browser"
  - test: "Click 'EN' toggle on any UA page, then close the tab and reopen the root URL"
    expected: "Root redirect sends user to /en/ on second visit, demonstrating persistence"
    why_human: "Requires live browser interaction with localStorage read/write cycle"
  - test: "Navigate to a section page (e.g. /ua/qa/), click the locale toggle"
    expected: "Browser navigates to /en/qa/ — same section, not the home page"
    why_human: "Requires live navigation to confirm URL routing, not just static markup"
  - test: "Verify all UI strings display in the selected language on both locales"
    expected: "Home title, subtitle, section labels, back link, flashcard button all translate correctly"
    why_human: "Requires visual inspection of rendered pages in both locales"
---

# Phase 03: Internationalization Verification Report

**Phase Goal:** Add language toggle UI and locale persistence — users can switch between UA and EN without editing URLs, and their preference persists across visits.
**Verified:** 2026-03-21T16:00:00Z
**Status:** human_needed (all automated checks passed; 4 items need live browser testing)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can click a language toggle on any page to switch between UA and EN | VERIFIED | `Header.astro` renders `<a data-locale-switch={otherLocale}>` with computed `switchUrl = localePath(otherLocale, currentPath)` — present on every page that includes `<Header>` |
| 2 | Switching language on a section page navigates to the same section in the other language (not home) | VERIFIED | `src/pages/[locale]/[section]/index.astro` line 50: `<Header locale={locale} currentPath={section} />`; `localePath('en', 'qa')` resolves to `/cheatsheet/en/qa` |
| 3 | All UI elements display in the selected language | VERIFIED | `src/i18n/ui.ts` contains full key sets for both `ua` and `en` (13 keys each); Header, section pages, and flashcard components all call `t(locale, key)` |
| 4 | Language preference persists: returning to root URL redirects to last chosen language | VERIFIED | `src/pages/index.astro` reads `localStorage.getItem('locale')`, validates it, and calls `window.location.replace(baseUrl + locale + '/')` — locale is written on every toggle click via the `[data-locale-switch]` listener in `Header.astro` |

**Score: 4/4 truths verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/Header.astro` | Language toggle link next to theme toggle | VERIFIED | Contains `data-locale-switch={otherLocale}` (line 23), `localePath(otherLocale, currentPath)` (line 11/21), and `localStorage.setItem('locale', ...)` in script (line 60) |
| `src/i18n/ui.ts` | Language toggle UI strings | VERIFIED | Contains `'lang.switch': 'EN'` (ua block, line 14) and `'lang.switch': 'UA'` (en block, line 29); `'lang.label'` keys also present for both locales |
| `src/pages/index.astro` | Root redirect with localStorage persistence | VERIFIED | Contains `localStorage.getItem('locale')` (line 11), `window.location.replace(...)` (line 13), `define:vars={{ baseUrl: ... }}` (line 9), and `<noscript>` fallback (lines 16-18) |
| `src/pages/[locale]/[section]/index.astro` | Passes currentPath to Header | VERIFIED | Line 50: `<Header locale={locale} currentPath={section} />` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/components/Header.astro` | `src/i18n/utils.ts` | `localePath(otherLocale, currentPath)` for toggle URL | WIRED | Line 2: `import { t, localePath, type Locale } from '../i18n/utils'`; line 11: `const switchUrl = localePath(otherLocale, currentPath)` |
| `src/pages/[locale]/[section]/index.astro` | `src/components/Header.astro` | `currentPath={section}` prop passing | WIRED | Line 50: `<Header locale={locale} currentPath={section} />` — section slug flows directly from route params |
| `src/pages/index.astro` | localStorage | JS reads locale preference before redirect | WIRED | `localStorage.getItem('locale')` in inline IIFE; write-side is the click listener in `Header.astro` line 58-61 |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| I18N-01 | 03-01-PLAN.md | Перемикач мови UA/EN на всіх сторінках (UA/EN language toggle on all pages) | SATISFIED | `<a data-locale-switch>` rendered by `Header.astro` which is included on every locale page; toggle link is substantive, not a stub |
| I18N-02 | 03-01-PLAN.md | Кожне питання має версію українською та англійською (Each question has UA and EN versions) | SATISFIED | Pre-existing from Phase 1; content collection entries provide `ua_question`/`ua_answer` and `en_question`/`en_answer` fields; section page maps them by locale |
| I18N-03 | 03-01-PLAN.md | UI елементи (навігація, кнопки) перекладені на обидві мови (UI elements translated to both languages) | SATISFIED | `src/i18n/ui.ts` carries 13 keys for both `ua` and `en`; all UI-facing components call `t(locale, key)` — no hardcoded strings found in locale pages |

No orphaned requirements: all three I18N IDs declared in PLAN frontmatter are accounted for and map to requirements that REQUIREMENTS.md shows as complete.

---

### Anti-Patterns Found

None. No TODO/FIXME/PLACEHOLDER comments, no empty return stubs, no console-log-only handlers found in the four modified files.

---

### Human Verification Required

#### 1. First-visit root redirect

**Test:** Clear localStorage (or open private tab), visit the root URL (e.g. `http://localhost:4321/cheatsheet/`)
**Expected:** Redirected to `/cheatsheet/ua/` — Ukrainian home page loads
**Why human:** localStorage state is runtime-only; static analysis cannot simulate an empty-localStorage browser visit

#### 2. Locale persistence across tabs

**Test:** Click "EN" toggle on any page, close the tab, open a new tab and revisit the root URL
**Expected:** Redirected to `/cheatsheet/en/` — persistence survived the tab close
**Why human:** Requires a live browser write/read cycle across page navigations

#### 3. Section-aware locale switch

**Test:** Navigate to any section page (e.g. `/ua/qa/`), click the "EN" toggle
**Expected:** Browser navigates to `/en/qa/`, not to `/en/`
**Why human:** Requires live routing to confirm the `currentPath` prop produces the correct destination URL

#### 4. Full UI translation on both locales

**Test:** Browse a few pages in UA, then switch to EN and verify all visible strings (title, subtitle, back link, "Show answer" button, section names) are in English
**Expected:** No Ukrainian strings appear on EN pages and vice versa
**Why human:** Requires visual inspection of rendered HTML; static grep can confirm keys exist but not that every render path calls `t()`

---

### Gaps Summary

No gaps. All four must-have truths are satisfied by substantive, wired implementations. Both task commits (`badca1b`, `f91e144`) exist in the repository and touch exactly the files listed in the SUMMARY. The remaining four items above are routine post-implementation smoke tests that require a running browser and are not defects in the code.

---

_Verified: 2026-03-21T16:00:00Z_
_Verifier: Claude (gsd-verifier)_
