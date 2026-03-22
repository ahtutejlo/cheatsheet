# Search Modal — Design Spec

## Overview

Replace the current search link in the Header (which points to a non-existent `/[locale]/search` page) with a modal overlay. Uses Pagefind JS API directly (not the default UI component) for full control over result rendering.

## User Flow

1. User clicks the magnifying glass icon in the Header
2. Modal overlay opens with a dimmed backdrop, input field is auto-focused
3. User types a query → results appear after 300ms debounce
4. Each result shows: question title + section name with emoji
5. User clicks a result → navigates to the section page with anchor scroll to the specific flashcard
6. Modal closes on: result click, Escape key, or clicking the backdrop

## Architecture

### New Component: `src/components/SearchModal.astro`

Renders the modal markup (hidden by default) and contains all search logic in a `<script>` tag.

**Markup structure:**
```
#search-overlay (fixed inset-0, bg-black/40, hidden)
  └── #search-modal (centered card, max-w-xl, rounded-xl)
      ├── .search-input-wrapper (flex row: magnifying glass SVG + <input>)
      └── #search-results (scrollable list, max-h-80)
          ├── .search-result-item (link: question title + section label)
          └── #search-empty (no-results message, hidden)
```

**Script responsibilities:**
- Lazy-load Pagefind on first modal open: `await import(import.meta.env.BASE_URL + 'pagefind/pagefind.js')` (base-path-aware)
- Debounced search (300ms) via `pagefind.search(query)` → `result.data()` for each hit
- Render results as `<a>` elements linking to section page with `#{slug}` anchor (matches existing Flashcard `id={slug}`)
- Section name and emoji: embedded as `data-pagefind-meta` attributes on section pages, available via `result.meta` at search time (requires adding `data-pagefind-meta="section_name:..., section_icon:..."` to section page `<main>`)
- All result URLs constructed via base-path-aware logic (using `import.meta.env.BASE_URL`)
- Close modal on Escape, backdrop click, or result click

**States:**
| State | Condition | Display |
|-------|-----------|---------|
| Initial | Modal just opened, input empty | Placeholder text: "Почніть вводити для пошуку" |
| Loading | Search in progress | (no explicit spinner — results replace naturally) |
| Results | Matches found | Scrollable list of result items |
| No results | Query entered, zero matches | "Нічого не знайдено" message |

### Modified: `src/components/Header.astro`

- Change search `<a>` link to `<button id="search-button">`
- Keep same styling (rounded-lg p-2, magnifying glass SVG)
- Remove `href` to search page

### Modified: `src/layouts/BaseLayout.astro`

- Include `<SearchModal />` component (renders once per page)

### Modified: `src/pages/[locale]/[section]/index.astro`

- Add `data-pagefind-meta="section_name:{name}, section_icon:{icon}"` to `<main>` element so Pagefind indexes section metadata for display in search results

### Note: No search page exists

The Header currently links to `/[locale]/search` but this page was never committed. The link will be replaced by the search button — no file deletion needed.

### No changes needed:

- `src/i18n/ui.ts` — existing keys (`search.label`, `search.placeholder`, `search.noResults`) are reused
- `src/styles/global.css` — Pagefind CSS variables stay (used by Pagefind internally), but the default Pagefind UI CSS is no longer loaded
- `astro.config.mjs` — `pagefind()` integration stays for index generation

## Result Item Format

Each search result displays:
- **Line 1:** Question title (bold, text-sm) — extracted from Pagefind result metadata
- **Line 2:** Section emoji + section name (text-xs, muted color) — from Pagefind `result.meta.section_icon` and `result.meta.section_name`

Link target: `{BASE_URL}{locale}/{section}/#{slug}` (matches existing Flashcard component `id={slug}`)

## Styling

- Modal: Tailwind utility classes, dark mode via `dark:` variants
- Backdrop: `bg-black/40` (light) / `bg-black/60` (dark)
- Modal card: `bg-white dark:bg-gray-800`, `rounded-xl`, `shadow-2xl`
- Input: no border, large text, magnifying glass icon prefix
- Results: hover state `bg-blue-50 dark:bg-gray-700`, first result highlighted
- Max results height: `max-h-80` with `overflow-y-auto`
- Responsive: `mx-4 sm:mx-auto`, `max-w-xl`, modal vertically offset from top (`mt-[20vh]`)

## i18n

Uses existing translation keys via `t(locale, key)` passed as data attributes or inline:
- `search.placeholder` → input placeholder
- `search.noResults` → empty state message
- `search.label` → button aria-label

The locale is passed to SearchModal as a prop to construct correct result URLs.

## Edge Cases

- **Pagefind not built yet (dev mode):** `astro-pagefind` serves pagefind files in dev via middleware, so search works in dev after first build
- **Slow network/large index:** Pagefind loads index chunks on demand, results appear progressively
- **Many results:** Scrollable container with max-height; Pagefind returns ranked results, we show all
- **Body scroll lock:** When modal is open, `document.body.style.overflow = 'hidden'` prevents background scroll
- **Focus trap:** Not strictly needed for a search modal — Escape closes it
- **Keyboard navigation:** Out of scope for this iteration — results are navigable by mouse/touch only
