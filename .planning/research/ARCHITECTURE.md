# Architecture Research

**Domain:** Static Q&A / Flashcard / Interview Cheatsheet Site
**Researched:** 2026-03-20
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Content Layer (Build-time)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Markdown     │  │  Content      │  │  i18n Translation    │   │
│  │  Files (Q&A)  │  │  Config/Schema│  │  Strings (UI)        │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
├─────────┴─────────────────┴──────────────────────┴───────────────┤
│                     Build Pipeline (Astro SSG)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Content      │  │  Page         │  │  Search Index        │   │
│  │  Collections  │  │  Generation   │  │  (Pagefind)          │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
├─────────┴─────────────────┴──────────────────────┴───────────────┤
│                     Presentation Layer (Client)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  Home     │  │  Section  │  │  Search   │  │  Flashcard   │    │
│  │  Page     │  │  Pages    │  │  UI       │  │  Interaction │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Markdown Files | Store all Q&A content with frontmatter metadata | `src/content/questions/{locale}/{section}/` with YAML frontmatter |
| Content Config | Define schema, validate frontmatter, type-check | `src/content.config.ts` using Zod schemas (Astro 5+ pattern) |
| i18n UI Strings | Translate interface labels, buttons, navigation | JSON/TS files in `src/i18n/` keyed by locale |
| Content Collections | Query, filter, and sort questions at build time | Astro `getCollection()` with glob loader |
| Page Generation | Produce static HTML pages from content + templates | Astro page routes with `getStaticPaths()` |
| Search Index | Build full-text search index at build time | Pagefind post-build indexing |
| Flashcard Interaction | Toggle answer visibility on click/tap | Minimal client-side JS (vanilla or Astro island) |
| Tag Filtering | Filter questions by tag on section pages | Client-side filtering with CSS/JS, no framework needed |

## Recommended Project Structure

```
/
├── src/
│   ├── content/
│   │   └── questions/
│   │       ├── ua/
│   │       │   ├── qa/
│   │       │   │   ├── what-is-testing.md
│   │       │   │   └── test-levels.md
│   │       │   ├── java/
│   │       │   ├── kubernetes/
│   │       │   ├── docker/
│   │       │   ├── sql/
│   │       │   ├── automation-qa/
│   │       │   └── blockchain/
│   │       └── en/
│   │           ├── qa/
│   │           ├── java/
│   │           └── ...
│   ├── content.config.ts          # Collection schema definition
│   ├── pages/
│   │   ├── index.astro            # Redirects to default locale
│   │   ├── [locale]/
│   │   │   ├── index.astro        # Home: section list
│   │   │   ├── [section]/
│   │   │   │   └── index.astro    # Section: flashcard list
│   │   │   ├── tags/
│   │   │   │   └── [tag].astro    # Tag filter page
│   │   │   └── search.astro       # Search results page
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, head, dark mode
│   │   └── SectionLayout.astro    # Section page wrapper
│   ├── components/
│   │   ├── Flashcard.astro        # Single Q&A card (click-to-reveal)
│   │   ├── FlashcardList.astro    # List of cards with tag filter
│   │   ├── SearchBox.astro        # Pagefind search widget
│   │   ├── LanguageSwitcher.astro # UA/EN toggle
│   │   ├── TagCloud.astro         # Tag filter controls
│   │   ├── SectionCard.astro      # Section preview on home page
│   │   ├── Header.astro           # Site header with nav
│   │   └── ThemeToggle.astro      # Dark/light mode switch
│   ├── i18n/
│   │   ├── ui.ts                  # UI string translations {ua: {...}, en: {...}}
│   │   └── utils.ts               # getLocale(), t() helper functions
│   └── styles/
│       └── global.css             # Tailwind/global styles
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

### Structure Rationale

- **`src/content/questions/{locale}/{section}/`:** Locale-first organization mirrors URL structure (`/ua/qa/`, `/en/java/`). Each markdown file is one question. This makes content authoring simple: add a `.md` file, push, site updates. Locale-first (not section-first) because Astro's content collection filtering works cleanly with path segments, and it maps directly to the routing pattern.
- **`src/pages/[locale]/`:** Dynamic locale routing. Astro's built-in i18n routing handles locale detection and URL prefixing. `getStaticPaths()` generates pages for each locale.
- **`src/i18n/`:** Separates UI strings from content. Content lives in markdown, interface text (button labels, section names, navigation) lives in code. Simple key-value object, no heavy i18n library needed for two languages.
- **`src/components/`:** Astro components (`.astro`) render to zero JS by default. Only Flashcard interaction and tag filtering need client-side JS, which can be done with a `<script>` tag or a tiny island.

## Architectural Patterns

### Pattern 1: Content-as-Files (One File Per Question)

**What:** Each question is a separate markdown file with structured frontmatter. This is the atomic unit of content.
**When to use:** Always. This is the foundational pattern for the entire site.
**Trade-offs:** More files to manage (hundreds eventually), but each file is simple, independently editable, and git-diffable. Easier for AI-generated content workflows than multi-question files.

**Frontmatter schema:**
```markdown
---
question: "What is regression testing?"
section: "qa"
tags: ["testing-types", "fundamentals"]
order: 5
---

Regression testing is re-running previously passed tests after code changes
to ensure existing functionality still works correctly...
```

**Why one-file-per-question (not all questions in one file):**
- Each question gets its own URL anchor for deep linking
- Individual files are easier to generate/review with AI
- Git history tracks per-question changes
- Content collection queries can filter/sort at the file level

### Pattern 2: Locale-Parallel Content

**What:** Matching markdown files exist in `ua/` and `en/` with the same filename. The filename (slug) is the shared identifier across locales.
**When to use:** For all Q&A content. The file `ua/qa/what-is-testing.md` and `en/qa/what-is-testing.md` are the same question in different languages.
**Trade-offs:** Risk of content drift (one locale updated, other not). Mitigate by tracking which files lack a translation pair.

**Implementation:**
```typescript
// content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    question: z.string(),
    section: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().optional(),
  }),
});

export const collections = { questions };
```

```typescript
// Querying by locale and section
const allQuestions = await getCollection('questions');
const uaJavaQuestions = allQuestions
  .filter(q => q.id.startsWith('ua/java/'))
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
```

### Pattern 3: Zero-JS Flashcard with Progressive Enhancement

**What:** Flashcards use HTML `<details>/<summary>` for no-JS baseline, enhanced with CSS animations and optional JS for richer interaction.
**When to use:** For the core flashcard reveal interaction.
**Trade-offs:** `<details>` gives accessibility and works without JS. Custom JS adds smooth animations and state tracking (how many revealed).

```html
<!-- Flashcard.astro -->
<div class="flashcard" data-tags={tags.join(',')}>
  <details>
    <summary class="flashcard-question">
      {question}
    </summary>
    <div class="flashcard-answer">
      <Content />  <!-- Rendered markdown answer -->
    </div>
  </details>
</div>

<style>
  .flashcard-answer {
    animation: slideDown 0.2s ease-out;
  }
</style>
```

### Pattern 4: Client-Side Tag Filtering (No Rebuild Required)

**What:** All questions for a section are rendered into the HTML at build time. Tag filtering happens client-side by showing/hiding elements based on `data-tags` attributes.
**When to use:** For tag filtering on section pages.
**Trade-offs:** Slightly larger initial HTML (all questions rendered), but avoids needing separate pages per tag combination. For expected scale (50-200 questions per section) this is fine.

```javascript
// Inline script on section page
document.querySelectorAll('[data-tag-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.tagFilter;
    document.querySelectorAll('.flashcard').forEach(card => {
      const tags = card.dataset.tags.split(',');
      card.hidden = tag !== 'all' && !tags.includes(tag);
    });
  });
});
```

## Data Flow

### Build-Time Content Flow

```
Markdown Files (.md)
    |
    v
Astro Content Collections (content.config.ts validates schema)
    |
    v
getCollection('questions') --> filter by locale/section
    |
    v
Page Templates (getStaticPaths generates all routes)
    |
    v
Static HTML Output (dist/)
    |
    v
Pagefind indexes dist/ --> generates search index files
    |
    v
Deploy (dist/ to GitHub Pages / Vercel / Netlify)
```

### Runtime User Flows

```
1. BROWSE FLOW:
   Home (/{locale}/) --> Click section --> Section page (/{locale}/{section}/)
   --> See all flashcards --> Click card --> Answer revealed

2. SEARCH FLOW:
   Any page --> Type in search box --> Pagefind queries local index
   --> Results displayed --> Click result --> Navigate to section + anchor

3. FILTER FLOW:
   Section page --> Click tag --> Client-side JS shows/hides cards
   --> Only matching cards visible

4. LANGUAGE SWITCH:
   Any page --> Click UA/EN toggle --> Navigate to same page in other locale
   (e.g., /ua/java/ <-> /en/java/)
```

### Key Data Flows

1. **Content to Page:** Markdown -> Content Collection (validated) -> `getCollection()` -> Astro template -> Static HTML. All at build time. Zero runtime data fetching.
2. **Search Indexing:** Static HTML (post-build) -> Pagefind CLI indexes -> JSON search index chunks. Loaded on-demand when user types a query.
3. **Language Switching:** Current URL path parsed -> locale segment swapped -> navigate. No state to transfer, pages are independent.
4. **Tag Filtering:** All cards rendered in HTML with `data-tags` -> JS reads attributes -> toggles `hidden` -> instant client-side filter.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 50-200 questions (launch) | Single build, all questions on section pages. No pagination needed. |
| 200-1000 questions | Consider pagination on section pages (20-30 cards per page). Pagefind handles search fine at this scale. |
| 1000+ questions | Split content into sub-sections. Consider lazy-loading card answers. Pagefind scales to 10k+ pages without issue. |

### Scaling Priorities

1. **First bottleneck: Build time.** At 1000+ markdown files, Astro build may slow. Mitigation: Astro's incremental builds, or content chunking. Not a concern until well past 500 questions.
2. **Second bottleneck: Page weight on large sections.** If a section has 200+ questions all rendered, the HTML may be heavy. Mitigation: pagination or virtual scrolling. Not needed at launch.

## Anti-Patterns

### Anti-Pattern 1: Multi-Question Markdown Files

**What people do:** Put all questions for a section in one giant markdown file with headings as separators.
**Why it's wrong:** Impossible to query individual questions, no per-question metadata (tags, order), hard to maintain, no independent linking, harder AI content generation.
**Do this instead:** One markdown file per question with structured frontmatter.

### Anti-Pattern 2: Client-Side Rendering for Content

**What people do:** Store questions in JSON and render them with React/Vue at runtime.
**Why it's wrong:** Defeats the purpose of a static site. No SEO, no progressive enhancement, slower initial load, more JS to maintain.
**Do this instead:** Render all content at build time to static HTML. Use JS only for interactions (reveal, filter, search).

### Anti-Pattern 3: Heavy i18n Library for Two Languages

**What people do:** Pull in `i18next` or similar for just UA/EN.
**Why it's wrong:** Over-engineered for two locales. Adds bundle size and complexity.
**Do this instead:** Simple TS object with UI strings per locale. Astro's built-in i18n routing handles URL structure. Content translations are just parallel files.

### Anti-Pattern 4: Server-Side Search

**What people do:** Try to add Algolia or a search API for a static site.
**Why it's wrong:** Adds external dependency, potential cost, and complexity. Pagefind does the same thing with zero infrastructure.
**Do this instead:** Pagefind indexes at build time, runs entirely client-side, free, fast, and works offline.

### Anti-Pattern 5: Separate Tag Pages Generated at Build Time

**What people do:** Generate a static page for every tag combination.
**Why it's wrong:** Combinatorial explosion of pages. Slow builds. At 20 tags across 7 sections and 2 locales, that is 280+ extra pages.
**Do this instead:** Client-side tag filtering on section pages. All content is already in the HTML.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages / Vercel / Netlify | Git push triggers build + deploy | Use GitHub Actions or platform's built-in Astro adapter |
| Pagefind | Post-build CLI step | Runs `pagefind --site dist/` after Astro build. Astro integration (`astro-pagefind`) handles this automatically |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Content -> Build | Content Collections API (`getCollection`) | Schema validation catches errors at build time |
| Build -> Search | File system (Pagefind reads `dist/` HTML) | Pagefind is a post-build step, not integrated into Astro's pipeline |
| Locale Content <-> Locale UI | Shared filename slug acts as join key | `ua/qa/what-is-testing.md` links to `en/qa/what-is-testing.md` by filename |
| Section Page <-> Tag Filter | DOM attributes (`data-tags`) | No state management, pure DOM manipulation |
| Flashcard Component <-> Answer | HTML `<details>` element | Native browser behavior, no framework needed |

## Build Order (Dependencies)

This defines what must be built first and what depends on what:

```
Phase 1: Content Foundation
  - Content schema (content.config.ts)
  - Markdown file structure + sample content
  - i18n utility functions
  Dependencies: None. This is the base.

Phase 2: Core Pages
  - BaseLayout (HTML shell, head, styles)
  - Home page (section listing)
  - Section page (question listing)
  - Flashcard component (click-to-reveal)
  Dependencies: Phase 1 (needs content to render)

Phase 3: Navigation & i18n
  - Language switcher component
  - Locale-aware routing ([locale] parameter)
  - UI string translations
  Dependencies: Phase 2 (needs pages to switch between)

Phase 4: Discovery Features
  - Tag cloud component + client-side filtering
  - Pagefind search integration
  Dependencies: Phase 2 (needs rendered content to index/filter)

Phase 5: Polish
  - Dark mode toggle
  - Animations (flashcard reveal, page transitions)
  - Mobile responsiveness refinement
  - Design accents and visual polish
  Dependencies: Phase 2-4 (enhances existing components)
```

## Sources

- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)
- [Astro Project Structure Docs](https://docs.astro.build/en/basics/project-structure/)
- [Astro i18n Routing Docs](https://docs.astro.build/en/guides/internationalization/)
- [Astro i18n Recipe](https://docs.astro.build/en/recipes/i18n/)
- [Pagefind - Static Search](https://pagefind.app/)
- [astro-pagefind Integration](https://github.com/shishkin/astro-pagefind)
- [Astro Starlight Site Search](https://starlight.astro.build/guides/site-search/)
- [Astro i18n Configuration Guide](https://eastondev.com/blog/en/posts/dev/20251202-astro-i18n-guide/)
- [Evil Martians - Client-side Search in Astro](https://evilmartians.com/chronicles/how-to-add-fast-client-side-search-to-astro-static-sites)

---
*Architecture research for: Static Interview Q&A Cheatsheet Site*
*Researched: 2026-03-20*
