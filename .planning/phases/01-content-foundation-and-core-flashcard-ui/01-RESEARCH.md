# Phase 1: Content Foundation and Core Flashcard UI - Research

**Researched:** 2026-03-20
**Domain:** Astro 6 static site setup, Markdown content pipeline, flashcard UI, CI/CD deployment
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield Astro 6 project setup that establishes the content foundation (schema, file structure, content pipeline) and delivers a working flashcard UI with responsive layout. The user decided on co-located content (single Markdown file per question with both UA and EN in frontmatter), which deviates from Astro's standard locale-parallel-directories pattern. This means the content collection schema must handle nested language objects in frontmatter, and page routes must extract the appropriate language fields at render time. The approach is sound and prevents translation drift structurally.

The core technical stack is well-established: Astro 6.0.7 with Content Collections (glob loader + Zod 4 schema), Tailwind CSS 4.2.2 via `@tailwindcss/vite`, Shiki dual-theme syntax highlighting, and `<details>/<summary>` HTML for accessible flashcards. Deployment uses GitHub Pages with the official `withastro/action` GitHub Action. All components have strong official documentation and are verified current.

The main architectural risk is the co-located content approach requiring a custom content-to-page mapping (no locale in file paths, language extracted from frontmatter fields instead). This is straightforward with Astro's `getCollection()` API but means the Phase 1 implementation defines the pattern all subsequent phases depend on. The schema and routing decisions made here are load-bearing.

**Primary recommendation:** Define the Zod schema and create 2-3 sample content files first, then build the page routes and components against that schema. Content structure before UI.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Co-located content**: both languages (UA/EN) stored in a single Markdown file per question, with language-specific fields in frontmatter
- Prevents translation drift -- no possibility of UA and EN versions silently diverging
- Structure: `src/content/questions/{section}/{question-slug}.md`
- Frontmatter contains `ua.question`, `ua.answer`, `en.question`, `en.answer` fields
- One file = one question (granular, easy to add/remove individual questions)
- Files grouped by section directory: `questions/qa/`, `questions/java/`, etc.
- Explicit `order` field in frontmatter controls display order within a section
- Ukrainian (ua) is the default language on first visit
- Root URL `/` redirects to `/ua/`

### Claude's Discretion
- Exact frontmatter schema fields beyond the decided ones (id, section, tags, order, ua/en content)
- Zod schema implementation details
- CI/CD platform choice (GitHub Pages / Vercel / Netlify)
- Flashcard visual design, animation style, and interaction details
- Home page layout and section card design
- Sample content: which sections to include and how many questions per section
- Deployment configuration

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFR-01 | Static site on Astro deployed to GitHub Pages/Vercel/Netlify | Astro 6.0.7 verified, GitHub Pages with `withastro/action@v5` documented |
| INFR-02 | CI/CD: git push auto-rebuilds and deploys | GitHub Actions workflow with official Astro action handles this |
| INFR-03 | Content pipeline: Markdown to HTML build-time generation | Astro Content Collections with glob loader + Zod schema + render() API |
| CORE-06 | Content stored in Markdown files with frontmatter metadata | Co-located content files with Zod-validated schema in content.config.ts |
| CORE-01 | Home page shows all sections with name and question count | getCollection() query grouped by section, count per group |
| CORE-02 | Section page shows list of flashcard questions | getCollection() filtered by section, sorted by order field |
| CORE-03 | Click/tap on flashcard reveals hidden answer with smooth animation | `<details>/<summary>` with CSS animation via `::details-content` or grid trick |
| CORE-04 | Answers support Markdown with syntax-highlighted code blocks | Shiki dual-theme config (light/dark), render() API for Markdown-to-HTML |
| CORE-07 | Anchor links to individual questions (bookmark/share) | URL hash based on question slug, scroll-to + highlight on load |
| DSGN-03 | Responsive layout (mobile 320px+) | Tailwind CSS 4 responsive utilities, mobile-first approach |
| DSGN-04 | Clean typography for technical content | Tailwind typography plugin or custom prose styles for Markdown output |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.0.7 | Static site framework | Content Collections with Zod validation, zero JS by default, built-in Markdown rendering with Shiki |
| Tailwind CSS | 4.2.2 | Styling and responsive layout | CSS-native @theme config, dark: variant, responsive utilities, no JS config file needed |
| @tailwindcss/vite | 4.2.2 | Vite plugin for Tailwind | Replaces deprecated @astrojs/tailwind integration; official Tailwind 4 approach |
| Shiki | 4.0.2 (bundled) | Syntax highlighting | Built into Astro, dual-theme support for light/dark mode, zero config needed |
| Zod | 4.x (bundled) | Schema validation | Bundled with Astro 6, used for Content Collection frontmatter validation |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | latest | Prose styling for Markdown output | Apply to rendered Markdown answers for consistent technical content typography |
| Node.js | 22+ (LTS) | Runtime | Required by Astro 6 (Node 18/20 dropped) |
| pnpm | latest | Package manager | Faster installs, Astro ecosystem standard |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GitHub Pages | Netlify/Vercel | Netlify has better preview deploys but GitHub Pages is simpler for a GitHub repo and free |
| @tailwindcss/typography | Custom prose CSS | Typography plugin is battle-tested for Markdown; hand-rolling prose styles is error-prone |
| `<details>/<summary>` | Custom div toggle | details/summary provides accessibility for free; custom toggle needs ARIA, keyboard handling |

**Installation:**
```bash
# Initialize Astro project
pnpm create astro@latest -- --template minimal

# Add Tailwind CSS 4 via Vite plugin
pnpm add @tailwindcss/vite @tailwindcss/typography

# Dev dependencies
pnpm add -D prettier prettier-plugin-astro
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  content/
    questions/
      qa/
        what-is-testing.md         # Co-located UA+EN content
        test-levels.md
      java/
        what-is-oop.md
      docker/
        what-is-docker.md
    content.config.ts              # Zod schema definition
  pages/
    index.astro                    # Redirect to /ua/
    [locale]/
      index.astro                  # Home: section list with counts
      [section]/
        index.astro                # Section: flashcard list
  layouts/
    BaseLayout.astro               # HTML shell, <head>, global styles
  components/
    Flashcard.astro                # Single Q&A card (details/summary)
    FlashcardList.astro            # List of cards for a section
    SectionCard.astro              # Section preview on home page
    Header.astro                   # Site header
  i18n/
    ui.ts                          # UI string translations {ua: {...}, en: {...}}
    sections.ts                    # Section display names per locale
    utils.ts                       # getLangFromUrl(), t() helpers
  styles/
    global.css                     # Tailwind import + custom styles
public/
  favicon.svg
astro.config.mjs
.github/
  workflows/
    deploy.yml                     # GitHub Actions deploy workflow
```

### Pattern 1: Co-Located Bilingual Content Schema

**What:** Single Markdown file per question with nested language objects in frontmatter. The Markdown body contains the UA answer (default language). The EN answer is in frontmatter as a string field.

**When to use:** All question content files.

**Schema design:**
```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    ua: z.object({
      question: z.string(),
      answer: z.string(),      // UA answer as string (supports Markdown)
    }),
    en: z.object({
      question: z.string(),
      answer: z.string(),      // EN answer as string (supports Markdown)
    }),
    section: z.string(),       // "qa", "java", "docker", etc.
    order: z.number(),         // Display order within section
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { questions };
```

**Content file example:**
```markdown
---
ua:
  question: "Що таке регресійне тестування?"
  answer: |
    Регресійне тестування — це повторне виконання раніше пройдених тестів
    після внесення змін у код, щоб переконатися, що існуюча функціональність
    працює коректно.

    ```java
    @Test
    void regressionTest() {
        assertEquals(expected, actual);
    }
    ```
en:
  question: "What is regression testing?"
  answer: |
    Regression testing is re-running previously passed tests after code changes
    to ensure existing functionality still works correctly.

    ```java
    @Test
    void regressionTest() {
        assertEquals(expected, actual);
    }
    ```
section: qa
order: 5
tags:
  - testing-types
  - fundamentals
---
```

**Key insight:** Since both answers are in frontmatter (not the Markdown body), we need to render them manually using Astro's Markdown rendering utilities or a lightweight Markdown-to-HTML library at build time. The Markdown body of the file is unused or could serve as a notes/metadata field. Alternatively, the body could be the UA answer and only EN goes in frontmatter -- this allows using the native `render()` API for one language.

**Recommended approach:** Use the Markdown body for the UA answer (default language) and put only the EN answer in frontmatter. This lets `render()` handle UA natively with full Shiki syntax highlighting. For EN answers in frontmatter, use a remark/rehype pipeline or a build-time Markdown processor.

**Revised schema:**
```typescript
const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    ua_question: z.string(),
    en_question: z.string(),
    en_answer: z.string(),       // EN answer as Markdown string in frontmatter
    section: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
  }),
});
```

```markdown
---
ua_question: "Що таке регресійне тестування?"
en_question: "What is regression testing?"
en_answer: |
  Regression testing is re-running previously passed tests...
section: qa
order: 5
tags: [testing-types, fundamentals]
---

Регресійне тестування — це повторне виконання раніше пройдених тестів...
```

**Trade-off:** The user decided on `ua.question`, `ua.answer`, `en.question`, `en.answer` in frontmatter. This is cleaner structurally but means both answers need manual Markdown rendering. The planner should decide which approach to use -- both are viable. If using all-in-frontmatter, a build-time Markdown processor (e.g., `marked` or importing `remark` directly) handles rendering.

### Pattern 2: Locale-Based Routing with Co-Located Content

**What:** Pages at `/{locale}/{section}/` query the same content collection but render the appropriate language fields.

**Implementation:**
```typescript
// src/pages/[locale]/[section]/index.astro
export async function getStaticPaths() {
  const questions = await getCollection('questions');
  const sections = [...new Set(questions.map(q => q.data.section))];
  const locales = ['ua', 'en'];

  return locales.flatMap(locale =>
    sections.map(section => ({
      params: { locale, section },
      props: {
        questions: questions
          .filter(q => q.data.section === section)
          .sort((a, b) => a.data.order - b.data.order),
        locale,
        section,
      },
    }))
  );
}
```

### Pattern 3: Accessible Flashcard with CSS Animation

**What:** HTML `<details>/<summary>` with CSS animation for smooth reveal.

**Implementation:**
```html
<!-- Flashcard.astro -->
<details class="flashcard group" id={slug}>
  <summary class="cursor-pointer select-none p-4 font-medium
                   hover:bg-gray-50 dark:hover:bg-gray-800
                   min-h-[44px] flex items-center">
    <span class="flex-1">{question}</span>
    <svg class="w-5 h-5 transition-transform group-open:rotate-180"
         viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
    </svg>
  </summary>
  <div class="flashcard-answer p-4 border-t border-gray-200
              dark:border-gray-700 prose dark:prose-invert max-w-none">
    <RenderedAnswer />
  </div>
</details>

<style>
  details .flashcard-answer {
    overflow: hidden;
    animation: slideDown 200ms ease-out;
  }
  @keyframes slideDown {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 1000px; }
  }
</style>
```

**Accessibility:** `<details>/<summary>` provides keyboard navigation (Tab to focus, Enter/Space to toggle) and screen reader announcements for free. No custom ARIA needed.

**Anchor links:** Each flashcard gets an `id` attribute matching its slug. On page load, check `window.location.hash`, open the matching details element, and scroll to it with a highlight animation.

### Anti-Patterns to Avoid

- **All-in-frontmatter without Markdown rendering:** If answers contain code blocks, they MUST be rendered as Markdown-to-HTML with syntax highlighting, not displayed as raw text.
- **Using the deprecated @astrojs/tailwind integration:** Use `@tailwindcss/vite` instead. The old integration is for Tailwind 3.
- **Using `Astro.glob()`:** Removed in Astro 6. Use Content Collections with `getCollection()`.
- **Storing multiple questions per file:** Makes individual linking, ordering, and querying impossible.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom highlight.js setup | Shiki (built into Astro) | Dual-theme support, zero config, all languages included |
| Markdown rendering | Custom parser | Astro render() or marked/remark | Edge cases in Markdown spec, code block handling, XSS prevention |
| Responsive layout | Custom media queries | Tailwind responsive utilities | Consistent breakpoints, mobile-first, well-tested |
| Accessible expand/collapse | Custom div toggle with JS | `<details>/<summary>` HTML | Keyboard, screen reader, focus management all free |
| CI/CD pipeline | Custom build scripts | `withastro/action@v5` | Official, maintained, handles caching and edge cases |
| Prose typography | Custom Markdown styles | @tailwindcss/typography | Handles tables, code blocks, lists, blockquotes, nested elements |

**Key insight:** Astro's built-in features (Content Collections, Shiki, render API) handle 90% of this phase's requirements. The only custom code needed is the co-located content schema, locale routing logic, and the anchor link scroll behavior.

## Common Pitfalls

### Pitfall 1: Markdown in Frontmatter Not Rendered
**What goes wrong:** Answers stored as frontmatter strings display as raw Markdown text (with `**bold**` and ``` ``` ``` visible) instead of rendered HTML.
**Why it happens:** Astro's `render()` only processes the Markdown body, not frontmatter string fields.
**How to avoid:** Either use a build-time Markdown processor (marked, remark) for frontmatter answer fields, or put the default-language answer in the Markdown body and use `render()` for it.
**Warning signs:** Code blocks showing as text, bold markers visible in answers.

### Pitfall 2: Shiki Dark Mode Not Working
**What goes wrong:** Code blocks look correct in light mode but have wrong colors or white background in dark mode.
**Why it happens:** Shiki dual themes output CSS variables (`--shiki-dark`, `--shiki-dark-bg`) but you need CSS rules to activate them for dark mode.
**How to avoid:** Add the dark mode CSS override in global styles:
```css
@media (prefers-color-scheme: dark) {
  .astro-code,
  .astro-code span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
  }
}
```
If using a class-based dark mode toggle (not just `prefers-color-scheme`), use `html.dark .astro-code` selector instead.

### Pitfall 3: Anchor Link Scroll Fails on Page Load
**What goes wrong:** Sharing a URL with `#question-slug` doesn't scroll to or open the correct flashcard.
**Why it happens:** The `<details>` element is closed by default, so the target element has zero height. The browser's native hash scroll may not work correctly with closed details elements.
**How to avoid:** Add a small client-side script that on `DOMContentLoaded` checks `location.hash`, finds the matching details element, opens it via `.open = true`, then calls `scrollIntoView()`.

### Pitfall 4: Frontmatter YAML Multiline String Gotchas
**What goes wrong:** Answers with code blocks in YAML frontmatter break parsing because of indentation or special characters.
**Why it happens:** YAML multiline strings (using `|`) require consistent indentation. Code blocks with varying indentation can break YAML parsing.
**How to avoid:** Use YAML literal block scalar (`|`) with proper indentation. Test schema validation catches parsing errors early. Consider using the Markdown body for the primary language answer to avoid YAML complexity.

### Pitfall 5: Missing Section Metadata
**What goes wrong:** Home page needs section display names, descriptions, and icons but this data doesn't exist anywhere.
**Why it happens:** Content files define questions, not sections. Section metadata (display name in UA/EN, description, icon, color) needs a separate source.
**How to avoid:** Create a section registry in `src/i18n/sections.ts` or a separate `sections` content collection with metadata per section.

## Code Examples

### Astro Config with Tailwind 4 and Shiki Dual Themes
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/cheatsheet',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
```

### Global CSS Setup
```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@tailwindcss/typography";

/* Dark mode for Shiki code blocks */
html.dark .astro-code,
html.dark .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

### GitHub Actions Deploy Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Anchor Link Handler
```javascript
// Inline script in section page
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (!hash) return;

  const target = document.querySelector(hash);
  if (!target) return;

  const details = target.closest('details') || target;
  if (details.tagName === 'DETAILS') {
    details.open = true;
  }

  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('highlight');
    setTimeout(() => target.classList.remove('highlight'), 2000);
  }, 100);
});
```

### Querying Co-Located Content by Section
```typescript
// In a page component
import { getCollection } from 'astro:content';

const allQuestions = await getCollection('questions');
const sections = [...new Set(allQuestions.map(q => q.data.section))];

// For home page: section list with counts
const sectionData = sections.map(section => ({
  slug: section,
  count: allQuestions.filter(q => q.data.section === section).length,
}));

// For section page: filtered and sorted questions
const sectionQuestions = allQuestions
  .filter(q => q.data.section === params.section)
  .sort((a, b) => a.data.order - b.data.order);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @astrojs/tailwind integration | @tailwindcss/vite plugin | Tailwind 4 (Jan 2025) | Must use Vite plugin, not Astro integration |
| tailwind.config.js | CSS @theme directives | Tailwind 4 (Jan 2025) | All config in CSS, no JS config file |
| Astro.glob() | Content Collections + glob loader | Astro 5 (Dec 2024) | Astro.glob() removed in Astro 6 |
| content/config.ts (type: 'content') | content.config.ts (loader: glob()) | Astro 5+ | New loader-based API, file at src/content.config.ts |
| Zod 3 | Zod 4 (bundled with Astro 6) | Astro 6 (Mar 2026) | Import from 'astro/zod', not 'zod' directly |
| Single Shiki theme | Dual themes (light/dark) | Shiki 1.0+ | CSS variables enable theme switching without re-rendering |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Deprecated. Use `@tailwindcss/vite` for Tailwind 4.
- `Astro.glob()`: Removed in Astro 6. Use `getCollection()`.
- `content/config.ts` with `type: 'content'`: Old pattern. Use `content.config.ts` with `loader: glob()`.

## Open Questions

1. **Markdown rendering for frontmatter answer fields**
   - What we know: Astro's `render()` only processes the Markdown body, not frontmatter strings. The user decided both UA and EN answers go in frontmatter.
   - What's unclear: Best approach for rendering Markdown strings from frontmatter with Shiki syntax highlighting at build time.
   - Recommendation: Either (a) use `marked` or `remark` + `rehype-shiki` to process frontmatter answers at build time, or (b) put UA answer in Markdown body (use `render()`) and only EN in frontmatter. Option (b) is simpler but slightly deviates from the clean `ua.answer`/`en.answer` symmetry. Planner should decide.

2. **Section metadata source**
   - What we know: Home page needs section display names (in UA/EN), descriptions, possibly icons.
   - What's unclear: Whether to use a separate content collection, a TypeScript config file, or derive names from directory structure.
   - Recommendation: Use a TypeScript config (`src/i18n/sections.ts`) with a record of section slugs to display metadata. Simple, type-safe, no additional content collection needed.

3. **Sample content scope**
   - What we know: Need enough content to validate the pipeline and UI. User discretion on which sections and how many questions.
   - Recommendation: 2-3 sections (qa, java, docker) with 3-5 questions each. Enough to test sorting, filtering, and responsive layout without excessive content creation effort.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (for e2e) + Astro build validation (schema errors fail build) |
| Config file | None -- Wave 0 |
| Quick run command | `pnpm build` (schema validation happens at build time) |
| Full suite command | `pnpm build && pnpm playwright test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFR-01 | Site builds and produces static output | build | `pnpm build` | N/A (build itself) |
| INFR-02 | Deploy workflow exists and is valid | manual | Check `.github/workflows/deploy.yml` exists | Wave 0 |
| INFR-03 | Markdown content renders to HTML | build | `pnpm build` (Content Collections validate) | N/A |
| CORE-06 | Content files pass schema validation | build | `pnpm build` (Zod rejects invalid frontmatter) | N/A |
| CORE-01 | Home page lists sections with counts | smoke/e2e | `playwright test tests/home.spec.ts` | Wave 0 |
| CORE-02 | Section page shows flashcard questions | smoke/e2e | `playwright test tests/section.spec.ts` | Wave 0 |
| CORE-03 | Flashcard click reveals answer | e2e | `playwright test tests/flashcard.spec.ts` | Wave 0 |
| CORE-04 | Answers render Markdown with syntax highlighting | e2e | `playwright test tests/flashcard.spec.ts` | Wave 0 |
| CORE-07 | Anchor links scroll to and open correct question | e2e | `playwright test tests/anchor.spec.ts` | Wave 0 |
| DSGN-03 | Responsive layout works at 320px | e2e | `playwright test tests/responsive.spec.ts` | Wave 0 |
| DSGN-04 | Typography is readable for technical content | manual-only | Visual inspection | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` (catches schema and content errors)
- **Per wave merge:** `pnpm build && pnpm playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `playwright.config.ts` -- Playwright configuration
- [ ] `tests/home.spec.ts` -- Home page smoke test
- [ ] `tests/section.spec.ts` -- Section page smoke test
- [ ] `tests/flashcard.spec.ts` -- Flashcard interaction test
- [ ] `tests/anchor.spec.ts` -- Anchor link navigation test
- [ ] `tests/responsive.spec.ts` -- Mobile viewport test
- [ ] Framework install: `pnpm add -D @playwright/test && pnpm playwright install`

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) -- glob loader, schema, getCollection, render API
- [Astro Syntax Highlighting docs](https://docs.astro.build/en/guides/syntax-highlighting/) -- Shiki dual themes, CSS variables
- [Astro Deploy to GitHub Pages docs](https://docs.astro.build/en/guides/deploy/github/) -- withastro/action, workflow config
- [Tailwind CSS installation with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) -- @tailwindcss/vite setup
- [MDN ::details-content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content) -- Baseline Sept 2025, all modern browsers
- npm registry: astro@6.0.7, tailwindcss@4.2.2, @tailwindcss/vite@4.2.2, shiki@4.0.2

### Secondary (MEDIUM confidence)
- [Astro + Tailwind v4 Setup Guide](https://tailkits.com/blog/astro-tailwind-setup/) -- Integration pattern confirmed
- [Shiki dual themes in Astro](https://amanhimself.dev/blog/dual-shiki-themes-with-astro/) -- CSS variable approach for dark mode
- [CSS-Tricks details/summary animation](https://css-tricks.com/how-to-animate-the-details-element/) -- Animation patterns
- [nerdy.dev details transitions](https://nerdy.dev/open-and-close-transitions-for-the-details-element) -- Modern CSS approach

### Tertiary (LOW confidence)
- Frontmatter Markdown rendering approach -- based on Astro API knowledge, not verified with a specific documented pattern for this co-located content approach

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry, official docs confirm patterns
- Architecture: HIGH for standard patterns, MEDIUM for co-located content approach (custom, not standard Astro i18n)
- Pitfalls: HIGH -- sourced from project research and official documentation

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable ecosystem, 30-day validity)
