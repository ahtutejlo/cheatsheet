# Phase 3: Internationalization - Research

**Researched:** 2026-03-21
**Domain:** i18n for Astro static site (UA/EN language toggle)
**Confidence:** HIGH

## Summary

The project already has a comprehensive i18n infrastructure built during Phase 1. All content files store bilingual data (ua_question/en_question/ua_answer/en_answer), all pages use `[locale]` dynamic routing (generating both `/ua/` and `/en/` paths), UI translation strings exist in `src/i18n/ui.ts`, and section metadata is bilingual in `src/i18n/sections.ts`. Helper functions `t()`, `localePath()`, and `getLangFromUrl()` are in place and actively used by all components.

The primary gap is the absence of a **visible language toggle** in the Header component. Currently, users can only switch languages by manually editing the URL. The Header contains a theme toggle button but no language switcher. Adding the toggle and persisting the language preference in localStorage completes the i18n feature.

**Primary recommendation:** Add a UA/EN toggle button to the Header component that navigates between locale routes, and add localStorage persistence with redirect-on-load for returning users.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| I18N-01 | Language toggle UA/EN visible on all pages | Header component needs a language switch button next to theme toggle. Routes already exist for both locales. |
| I18N-02 | Each question available in both UA and EN | Already implemented -- content files have ua_question/en_question/ua_answer/en_answer fields. Pages already select correct locale fields via `${locale}_question` key pattern. |
| I18N-03 | UI elements (navigation, buttons) translated | Already implemented -- `src/i18n/ui.ts` has all UI strings, components use `t(locale, key)`. Section metadata translated in `src/i18n/sections.ts`. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^6.0.7 | Static site framework with `[locale]` routing | Already in use, generates both /ua/ and /en/ pages |
| tailwindcss | ^4.2.2 | Styling for toggle button | Already in use throughout |

### Supporting
No additional libraries needed. The i18n system is hand-built and minimal (3 files in `src/i18n/`). This is appropriate for a two-language static site -- no i18n library needed.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-built i18n utils | astro-i18next / paraglide | Massive overkill for 2 locales with co-located content. The existing `t()` + `localePath()` system is sufficient. |
| Client-side navigation | Full page reload via href | Static site -- full page loads are fine. Astro prefetch handles perceived performance. |

**Installation:** No new packages needed.

## Architecture Patterns

### Existing i18n Architecture (DO NOT CHANGE)
```
src/
  i18n/
    ui.ts          # UI translation strings (ua/en)
    sections.ts    # Section metadata translations
    utils.ts       # t(), localePath(), getLangFromUrl()
  pages/
    index.astro              # Redirect to /ua/
    [locale]/
      index.astro            # Home (generates /ua/ and /en/)
      [section]/
        index.astro          # Section page (generates /ua/qa/ and /en/qa/ etc.)
  content/
    questions/
      {section}/
        {question}.md        # Co-located: ua_question + en_question + ua_answer + en_answer
```

### Pattern 1: Language Toggle in Header
**What:** A button/link pair in the Header that switches between UA and EN by navigating to the equivalent page in the other locale.
**When to use:** On every page -- Header is already included on all pages.
**Example:**
```astro
---
// In Header.astro -- compute the opposite locale path
import { t, localePath, type Locale, locales } from '../i18n/utils';

interface Props {
  locale: Locale;
  currentPath?: string; // e.g., "qa" for section pages
}

const { locale, currentPath } = Astro.props;
const otherLocale: Locale = locale === 'ua' ? 'en' : 'ua';
const switchUrl = localePath(otherLocale, currentPath);
---
<a href={switchUrl} class="...">
  {otherLocale.toUpperCase()}
</a>
```

### Pattern 2: Language Persistence via localStorage
**What:** Store language preference in localStorage when user explicitly toggles. On root page load, redirect to stored locale instead of default (ua).
**When to use:** Root redirect page (`src/pages/index.astro`) reads localStorage.
**Example:**
```html
<!-- In src/pages/index.astro -->
<script is:inline>
  (function() {
    var lang = localStorage.getItem('locale') || 'ua';
    var base = '%%BASE%%'; // replaced at build time
    window.location.replace(base + lang + '/');
  })();
</script>
```

### Pattern 3: Passing Current Path to Header
**What:** Each page must tell the Header what the current section/path is so the language toggle can construct the correct URL.
**When to use:** Section pages pass their section slug; home page passes nothing.
**Example:**
```astro
<!-- In [locale]/[section]/index.astro -->
<Header locale={locale} currentPath={section} />

<!-- In [locale]/index.astro -->
<Header locale={locale} />
```

### Anti-Patterns to Avoid
- **Client-side locale switching without navigation:** This is a static site. Each locale has its own pre-built HTML. Do NOT try to swap content client-side -- navigate to the other locale's URL.
- **Storing translations in JavaScript bundles:** Translations are already in Astro components rendered at build time. Keep it that way.
- **Adding i18n middleware or SSR:** The site is fully static. Language switching is navigation between pre-built pages.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| i18n framework | Custom translation loading/pluralization | Existing `src/i18n/ui.ts` + `t()` function | Already built, works for 2 locales |
| Locale routing | Custom URL rewriting | Existing `[locale]` dynamic routes in Astro | Already generates /ua/ and /en/ paths |
| Content localization | Parallel file system | Existing co-located frontmatter (ua_question/en_question) | Already implemented, prevents drift |

**Key insight:** Almost everything is already built. The phase is primarily about adding a toggle button and persistence -- not building i18n infrastructure.

## Common Pitfalls

### Pitfall 1: Toggle URL loses current page context
**What goes wrong:** Language toggle links to `/en/` instead of `/en/qa/` when user is on `/ua/qa/`.
**Why it happens:** Header doesn't know the current section path.
**How to avoid:** Pass `currentPath` prop to Header from each page. Construct toggle URL using `localePath(otherLocale, currentPath)`.
**Warning signs:** Clicking language toggle always goes to home page.

### Pitfall 2: localStorage redirect loop
**What goes wrong:** User visits `/cheatsheet/` -> redirected to `/cheatsheet/en/` -> somehow redirected again.
**Why it happens:** Bad redirect logic or meta refresh conflicts with JS redirect.
**How to avoid:** Use ONLY the JavaScript redirect in index.astro (replace meta refresh). Use `window.location.replace()` not `window.location.href` to avoid back button issues.
**Warning signs:** Flash of redirect page, browser back button broken.

### Pitfall 3: Language toggle on root redirect page
**What goes wrong:** Root page (`/cheatsheet/`) has no language toggle because it's just a redirect.
**Why it happens:** Root page is not a real page -- it redirects immediately.
**How to avoid:** This is fine -- root page should redirect, not show UI. Toggle only needed on actual content pages.

### Pitfall 4: Forgetting to set localStorage on toggle click
**What goes wrong:** User switches to EN, navigates around, then revisits root URL and gets UA again.
**Why it happens:** Toggle navigates but doesn't persist the choice.
**How to avoid:** Set `localStorage.setItem('locale', otherLocale)` when rendering the toggle link, OR use a click handler. Simplest: use an onclick handler on the toggle link.

### Pitfall 5: BASE_URL handling in toggle URLs
**What goes wrong:** Toggle link goes to `/en/` instead of `/cheatsheet/en/`.
**Why it happens:** Forgot to use `localePath()` which handles BASE_URL.
**How to avoid:** Always use the existing `localePath()` helper. Never construct locale URLs manually.

## Code Examples

### Language Toggle Button (Header.astro addition)
```astro
---
// Added props
interface Props {
  locale: Locale;
  currentPath?: string;
}

const { locale, currentPath } = Astro.props;
const otherLocale: Locale = locale === 'ua' ? 'en' : 'ua';
const switchUrl = localePath(otherLocale, currentPath);
---
<!-- Add next to theme toggle button -->
<a
  href={switchUrl}
  class="rounded-lg px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
  data-locale-switch={otherLocale}
>
  {otherLocale.toUpperCase()}
</a>

<script>
  // Persist locale choice when clicking language toggle
  document.querySelector('[data-locale-switch]')?.addEventListener('click', (e) => {
    const target = e.currentTarget as HTMLAnchorElement;
    localStorage.setItem('locale', target.dataset.localeSwitch || 'ua');
  });
</script>
```

### Root Redirect with Persistence (index.astro replacement)
```astro
---
// Root URL redirects to stored locale preference or default (ua)
---
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <script is:inline define:vars={{ baseUrl: import.meta.env.BASE_URL.replace(/\/?$/, '/') }}>
      (function() {
        var locale = localStorage.getItem('locale') || 'ua';
        if (locale !== 'ua' && locale !== 'en') locale = 'ua';
        window.location.replace(baseUrl + locale + '/');
      })();
    </script>
    <!-- Fallback for no-JS -->
    <noscript>
      <meta http-equiv="refresh" content="0;url=ua/" />
    </noscript>
  </head>
  <body></body>
</html>
```

### Updated UI Strings (if new keys needed)
```typescript
// src/i18n/ui.ts -- add language toggle label
export const ui = {
  ua: {
    // ... existing keys ...
    'lang.switch': 'EN',
    'lang.label': 'Switch to English',
  },
  en: {
    // ... existing keys ...
    'lang.switch': 'UA',
    'lang.label': 'Переключити на українську',
  },
} as const;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Meta refresh redirect | JS redirect with localStorage | Phase 3 | Enables locale persistence |
| Manual URL editing for language | Visible toggle button | Phase 3 | Core deliverable of this phase |

**Already current:**
- Co-located bilingual content in frontmatter (established Phase 1)
- Dynamic `[locale]` routing (established Phase 1)
- UI translation system via `t()` function (established Phase 1)

## Open Questions

1. **Toggle button design: text link vs icon vs dropdown**
   - What we know: Only 2 locales (UA/EN), so a simple text toggle is sufficient
   - Recommendation: Use a text link showing the OTHER locale (e.g., when on UA, show "EN"). Simple, clear, no ambiguity. No dropdown needed for 2 options.

2. **Should the toggle show a flag icon?**
   - What we know: Flag emojis render inconsistently across platforms. Ukraine flag is politically sensitive in some contexts.
   - Recommendation: Use text only ("UA" / "EN"). Simpler, accessible, no platform inconsistencies.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework configured) |
| Config file | none |
| Quick run command | `npm run build && npm run preview` |
| Full suite command | `npm run build` (build succeeding validates static generation) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| I18N-01 | Language toggle visible on all pages | manual | `npm run build` (build validates pages generate) | N/A |
| I18N-02 | Content shows in selected language | manual | `npm run build` (both locale pages generated) | N/A |
| I18N-03 | UI elements translated | manual | `npm run build` | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` -- ensures no build errors
- **Per wave merge:** `npm run build && npm run preview` -- visual verification
- **Phase gate:** Build succeeds + manual verification of all 4 success criteria

### Wave 0 Gaps
None -- no automated test framework exists in the project, and the scope of changes is small enough (1 component modification, 1 page modification) that manual verification is appropriate. Adding a test framework for 2-3 file changes would be over-engineering.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all source files in src/i18n/, src/pages/, src/components/, src/layouts/
- Existing content schema in src/content.config.ts confirming bilingual frontmatter structure
- Existing i18n utilities confirming localePath(), t(), getLangFromUrl() availability

### Secondary (MEDIUM confidence)
- Astro static site generation patterns for [locale] routing (confirmed by existing implementation)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries needed, everything already installed
- Architecture: HIGH - existing i18n infrastructure thoroughly analyzed, gap is minimal
- Pitfalls: HIGH - pitfalls derived from direct code analysis of existing patterns (BASE_URL handling, localePath usage)

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable -- no external dependencies changing)
