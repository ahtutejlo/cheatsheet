# Phase 6: Search and Filter - Research

**Researched:** 2026-03-22
**Domain:** Client-side search (Pagefind) + tag filtering for static Astro site
**Confidence:** HIGH

## Summary

Phase 6 adds two features to the interview cheatsheet: full-text search across all 195 bilingual flashcards (SRCH-01) and tag-based filtering within section views (SRCH-02). These are distinct implementations: search uses Pagefind (a static search library that indexes built HTML), while tag filtering is client-side DOM manipulation since it operates within a single section page.

The site generates 14 section pages (7 sections x 2 locales) where all questions for a section are rendered together. Pagefind handles multilingual search automatically via the `<html lang>` attribute -- UA pages get a UA index, EN pages get an EN index. The `astro-pagefind` integration (v1.8.5) handles build-time index generation seamlessly.

Tag filtering requires rendering tag badges on flashcards (the `tags` field already exists in content schema with ~130 unique tags across 195 questions) and adding JavaScript to show/hide flashcards when a tag is clicked. This is purely client-side: no new pages, no Pagefind involvement.

**Primary recommendation:** Use `astro-pagefind` integration for search with `data-pagefind-body` on main content areas. Implement tag filtering as vanilla JS DOM filtering within section pages. Keep these as two separate features with distinct UI entry points.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SRCH-01 | Full-text search across all questions and answers using Pagefind | Pagefind indexes rendered HTML at build time; `astro-pagefind` integration provides Search component; multilingual works via `lang` attribute on `<html>`; sub-results with anchor IDs enable linking to individual questions |
| SRCH-02 | Tag-based filtering of questions | Schema already has `tags: z.array(z.string()).default([])` field; 195 questions have ~130 unique tags; client-side JS filtering within section pages by toggling visibility |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro-pagefind | 1.8.5 | Astro integration for Pagefind | Handles index generation at build time, provides Search component, zero-config with Astro |
| pagefind | 1.4.0 | Static search engine (peer dep) | Industry standard for static site search, tiny bundles (~300KB compressed index for small sites), no server needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @pagefind/default-ui | 1.4.0 | Pre-built search UI | Comes with astro-pagefind; provides styled search input, results display, filtering UI |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pagefind | Fuse.js | Fuse.js loads entire dataset client-side (all 195 questions = large JSON); Pagefind loads only matching chunks |
| Pagefind | Lunr.js | Same issue as Fuse.js; also unmaintained since 2020 |
| Client-side tag filter | Pagefind filters | Pagefind filters are cross-site, but SRCH-02 needs per-section filtering with instant toggle; DOM filtering is simpler and faster |

**Installation:**
```bash
npm install astro-pagefind
```

## Architecture Patterns

### What Changes in the Build

```
astro.config.mjs
  └── integrations: [pagefind()]    # NEW: runs pagefind after build

src/
  ├── components/
  │   ├── Flashcard.astro           # MODIFY: add tags display, data-pagefind attrs
  │   ├── FlashcardList.astro       # MODIFY: add tag filter state/logic
  │   ├── Header.astro              # MODIFY: add search button/link
  │   ├── SearchPage.astro          # NEW: search UI page component
  │   └── TagBadge.astro            # NEW: clickable tag badge component
  ├── pages/
  │   ├── [locale]/
  │   │   ├── search.astro          # NEW: dedicated search page
  │   │   └── [section]/index.astro # MODIFY: pass tags to FlashcardList
  │   └── ...
  └── layouts/
      └── BaseLayout.astro          # MODIFY: add data-pagefind-body to content
```

### Pattern 1: Pagefind Integration Setup

**What:** Add astro-pagefind to the Astro config and mark indexable content.
**When to use:** One-time setup.

```typescript
// astro.config.mjs
import pagefind from "astro-pagefind";

export default defineConfig({
  site: 'https://ahtutejlo.github.io',
  base: '/cheatsheet',
  integrations: [pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
  // ...
});
```

### Pattern 2: Content Indexing with data-pagefind-body

**What:** Mark the main content area so Pagefind only indexes question/answer content, not navigation or headers.
**When to use:** On every section page.

```astro
<!-- In section page [section]/index.astro -->
<main data-pagefind-body class="mx-auto max-w-4xl px-4 py-8">
  <!-- questions rendered here -->
</main>
```

### Pattern 3: Multilingual Search (Automatic)

**What:** Pagefind automatically creates separate indices per language based on `<html lang>`.
**When to use:** Already works because BaseLayout sets `<html lang={locale}>`.
**Key detail:** When user opens search on `/ua/search`, Pagefind loads the UA index. On `/en/search`, the EN index. No extra config needed.

### Pattern 4: Search Page with astro-pagefind Component

**What:** A dedicated search page using the built-in Search component.
**When to use:** For SRCH-01.

```astro
---
// src/pages/[locale]/search.astro
import Search from "astro-pagefind/components/Search";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/Header.astro";
import { t, type Locale, locales } from "../../i18n/utils";

export function getStaticPaths() {
  return locales.map(locale => ({ params: { locale } }));
}

const { locale } = Astro.params as { locale: Locale };
---
<BaseLayout title={`${t(locale, 'search.title')} - ${t(locale, 'site.title')}`} locale={locale}>
  <Header locale={locale} />
  <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <h1 class="text-2xl font-bold mb-6">{t(locale, 'search.title')}</h1>
    <Search id="search" className="pagefind-ui"
      uiOptions={{
        showSubResults: true,
        showImages: false,
        resetStyles: false,
      }}
    />
  </main>
</BaseLayout>
```

### Pattern 5: Client-Side Tag Filtering

**What:** Clicking a tag badge on a flashcard filters the section view to show only questions with that tag.
**When to use:** For SRCH-02 on section pages.

```html
<!-- Tag badge (clickable) -->
<button class="tag-filter" data-tag="concurrency">concurrency</button>

<script>
  // Filter logic: show/hide flashcards based on selected tag
  document.querySelectorAll('.tag-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tag = (e.currentTarget as HTMLElement).dataset.tag;
      const activeTag = document.querySelector('.tag-filter.active');

      // Toggle: if same tag clicked, clear filter
      if (activeTag?.dataset.tag === tag) {
        clearFilter();
        return;
      }

      // Apply filter
      document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('active'));
      (e.currentTarget as HTMLElement).classList.add('active');

      document.querySelectorAll('.flashcard').forEach(card => {
        const cardTags = (card as HTMLElement).dataset.tags?.split(',') || [];
        (card as HTMLElement).style.display = cardTags.includes(tag!) ? '' : 'none';
      });

      // Hide empty group headers
      document.querySelectorAll('[data-type-group]').forEach(group => {
        const visible = group.querySelectorAll('.flashcard:not([style*="display: none"])');
        (group as HTMLElement).style.display = visible.length ? '' : 'none';
      });
    });
  });

  function clearFilter() {
    document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.flashcard').forEach(card => {
      (card as HTMLElement).style.display = '';
    });
    document.querySelectorAll('[data-type-group]').forEach(group => {
      (group as HTMLElement).style.display = '';
    });
  }
</script>
```

### Anti-Patterns to Avoid
- **Loading all question data as JSON for search:** Pagefind's whole point is chunked loading. Don't build a custom search index.
- **Using Pagefind for tag filtering:** SRCH-02 is per-section, instant toggle. Pagefind is cross-site search -- different UX patterns.
- **Creating individual pages per question for Pagefind:** 195 individual pages would bloat the build. Sub-results with anchor links achieve the same goal.
- **Forgetting data-pagefind-ignore on navigation/headers:** Would pollute search results with "Back to sections" text and nav items.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full-text search index | Custom inverted index in JS | Pagefind | Handles stemming, relevance ranking, chunked loading, multilingual support |
| Search UI | Custom search input + results display | @pagefind/default-ui via astro-pagefind | Handles debouncing, loading states, result highlighting, keyboard navigation |
| Build-time index generation | Custom post-build script | astro-pagefind integration | Hooks into Astro build lifecycle automatically |

**Key insight:** Pagefind is specifically designed for static sites with no server. It generates a search index at build time and loads only the chunks needed for each query. Building a custom alternative would require loading all content client-side.

## Common Pitfalls

### Pitfall 1: Pagefind Not Running in Dev Mode
**What goes wrong:** Search works in production but shows no results in `astro dev`.
**Why it happens:** Pagefind indexes the built output (`dist/`). In dev mode, there is no built output.
**How to avoid:** Run `npm run build` first, then `npm run preview` to test search. Document this in dev workflow. The astro-pagefind integration may show a "search not available in dev" message.
**Warning signs:** Empty search results during development.

### Pitfall 2: Indexing Navigation and UI Chrome
**What goes wrong:** Search results include "Back to sections", section titles, nav text.
**Why it happens:** Pagefind indexes the entire `<body>` by default.
**How to avoid:** Add `data-pagefind-body` to `<main>` content area. Add `data-pagefind-ignore` to header, navigation, type group headers.
**Warning signs:** Search for common words returns every page.

### Pitfall 3: Base Path Breaking Pagefind Assets
**What goes wrong:** Pagefind UI loads but search returns no results or JS errors.
**Why it happens:** Site uses `base: '/cheatsheet'`. Pagefind needs to know where its index files are relative to the site root.
**How to avoid:** The `astro-pagefind` integration should handle this via Astro's base config. Verify after setup that the pagefind bundle path includes `/cheatsheet/pagefind/`.
**Warning signs:** 404 errors for pagefind.js or pagefind index files in browser console.

### Pitfall 4: Tag Filter Not Accounting for Type Groups
**What goes wrong:** Filtering by tag hides all questions in a type group but the group header (Basic, Deep, etc.) remains visible.
**Why it happens:** Group headers are separate from flashcard elements.
**How to avoid:** When filtering, also check each type group and hide it if all its flashcards are hidden.
**Warning signs:** Empty sections with headers visible after tag filter applied.

### Pitfall 5: Pagefind CSS Conflicting with Tailwind
**What goes wrong:** Pagefind default UI looks broken or inconsistent with site design.
**Why it happens:** Pagefind ships its own CSS which may conflict with Tailwind reset/base styles.
**How to avoid:** Use `resetStyles: false` in uiOptions and apply custom styles using Pagefind CSS variables: `--pagefind-ui-primary`, `--pagefind-ui-background`, `--pagefind-ui-border`, `--pagefind-ui-scale`. Adapt to match site's light/dark theme.
**Warning signs:** Search UI looks different from rest of site.

### Pitfall 6: Hidden (collapsed) Flashcard Answers Not Indexed
**What goes wrong:** Search only finds questions, not answers.
**Why it happens:** Answers are inside `<details>` elements which are collapsed by default. However, Pagefind indexes HTML content regardless of CSS visibility -- `<details>` content IS in the DOM and WILL be indexed.
**How to avoid:** This is actually NOT a problem. Pagefind indexes DOM content, not what's visually visible. The `<details>` content is in the HTML source and will be indexed. No special handling needed.
**Warning signs:** N/A -- this should work out of the box.

## Code Examples

### Adding Search Link to Header

```astro
<!-- In Header.astro, add search icon/link next to locale switcher -->
<a href={localePath(locale, 'search')}
   class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
   aria-label={t(locale, 'search.label')}>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</a>
```

### Pagefind CSS Variables for Dark Mode

```css
/* Pagefind UI theme integration */
:root {
  --pagefind-ui-primary: #3b82f6;
  --pagefind-ui-text: #111827;
  --pagefind-ui-background: #ffffff;
  --pagefind-ui-border: #e5e7eb;
  --pagefind-ui-tag: #f3f4f6;
  --pagefind-ui-border-width: 1px;
  --pagefind-ui-border-radius: 8px;
  --pagefind-ui-scale: 1;
  --pagefind-ui-font: inherit;
}

html.dark {
  --pagefind-ui-primary: #60a5fa;
  --pagefind-ui-text: #f3f4f6;
  --pagefind-ui-background: #111827;
  --pagefind-ui-border: #374151;
  --pagefind-ui-tag: #1f2937;
}
```

### Tag Badge Component

```astro
---
// TagBadge.astro
interface Props {
  tag: string;
}
const { tag } = Astro.props;
---
<button
  class="tag-filter inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
         bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700
         dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300
         transition-colors cursor-pointer"
  data-tag={tag}
>
  {tag}
</button>
```

### Passing Tags to Flashcard for data-tags Attribute

```astro
<!-- In section page, add tags to question data -->
const questionData = sectionQuestions.map(q => ({
  slug: q.id.split('/').pop() || q.id,
  question: (q.data as any)[questionKey],
  answer: (q.data as any)[answerKey],
  type: q.data.type || 'basic',
  tags: q.data.tags || [],
}));
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side search (load all data) | Static search (Pagefind) | 2022+ | Tiny bundles, no server, works at scale |
| Algolia/ElasticSearch for static sites | Pagefind | 2022+ | No external service, free, privacy-friendly |
| Custom filter UI libraries | Vanilla JS DOM filtering | Always | For simple in-page filtering, no library needed |

**Deprecated/outdated:**
- Lunr.js: Last updated 2020, replaced by Pagefind for static sites
- Algolia DocSearch: Still works but requires external service; overkill for 195 questions

## Open Questions

1. **Search results linking to individual questions**
   - What we know: Pagefind sub-results split on headings with IDs. Flashcards use `<details id={slug}>` not headings.
   - What's unclear: Whether Pagefind can link to `<details>` elements by ID or only heading elements.
   - Recommendation: Test with current markup first. If sub-results don't link to individual questions, add hidden `<h3 id={slug} data-pagefind-ignore>` before each flashcard as split points. Alternatively, accept section-level results (users land on the right section page and can Ctrl+F).

2. **Tag filter UX: clear filter mechanism**
   - What we know: Clicking a tag should filter. Need a way to clear the filter.
   - What's unclear: Best UX -- click same tag again to toggle off? Dedicated "clear filter" button? Both?
   - Recommendation: Implement both -- clicking active tag clears it, plus a visible "clear filter" / "show all" button when filter is active.

3. **Search page route with getStaticPaths**
   - What we know: Need `/ua/search` and `/en/search` pages.
   - What's unclear: Whether astro-pagefind's Search component needs special handling for the base path `/cheatsheet`.
   - Recommendation: Test after initial setup; the integration should handle base path from astro.config.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (verifies build succeeds with pagefind) |
| Full suite command | `npm run build && npm run preview` (manual verification) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SRCH-01 | Search finds questions/answers in selected language | smoke (manual) | `npm run build` (verifies pagefind index generated) | N/A |
| SRCH-02 | Tag click filters section to matching questions | smoke (manual) | `npm run build` (verifies build with tag UI) | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (verifies no build errors)
- **Per wave merge:** `npm run build && npm run preview` + manual search test
- **Phase gate:** Build succeeds, search page renders, tag filter toggles questions

### Wave 0 Gaps
- [ ] No automated test framework exists -- this phase is UI-focused and best validated by build success + manual verification
- [ ] Build script should be verified to include pagefind index generation after astro-pagefind integration is added

*(Note: Given the static site nature and UI-focused requirements, automated testing adds minimal value. Build success is the primary automated check. Manual verification of search results and tag filtering is the appropriate validation approach.)*

## Sources

### Primary (HIGH confidence)
- [Pagefind Official Docs](https://pagefind.app/docs/) - indexing, multilingual, filtering, UI configuration
- [Pagefind Multilingual Docs](https://pagefind.app/docs/multilingual/) - automatic lang detection from `<html lang>`
- [Pagefind Filtering Docs](https://pagefind.app/docs/filtering/) - data-pagefind-filter attribute usage
- [Pagefind Sub-Results Docs](https://pagefind.app/docs/sub-results/) - splitting pages into multiple results
- [Pagefind UI Docs](https://pagefind.app/docs/ui/) - CSS variables, uiOptions configuration
- npm registry - pagefind 1.4.0, astro-pagefind 1.8.5 (verified 2026-03-22)

### Secondary (MEDIUM confidence)
- [astro-pagefind GitHub README](https://github.com/shishkin/astro-pagefind) - integration setup, Search component usage
- [astro-pagefind npm](https://www.npmjs.com/package/astro-pagefind) - version 1.8.5, published ~4 months ago

### Tertiary (LOW confidence)
- Astro 6 compatibility with astro-pagefind - not explicitly documented but likely compatible given recent maintenance (flagged as blocker in STATE.md, verify during implementation)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Pagefind is the explicitly stated requirement; astro-pagefind is the standard integration
- Architecture: HIGH - Pagefind indexing model is well-documented; tag filtering is straightforward DOM manipulation
- Pitfalls: HIGH - base path issues and dev mode behavior are well-known Pagefind patterns
- Astro 6 compat: MEDIUM - astro-pagefind v1.8.5 was published recently but no explicit Astro 6 support statement found

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (Pagefind is stable, slow-moving project)
