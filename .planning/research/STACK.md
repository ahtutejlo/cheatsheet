# Technology Stack: v1.1 Advanced Questions

**Project:** Interview Cheatsheet v1.1
**Researched:** 2026-03-21
**Scope:** Stack changes needed for 90 advanced bilingual questions across 6 sections
**Confidence:** HIGH

## Executive Assessment

The existing stack requires **no new frameworks and one new package** (`astro-pagefind`). Advanced questions use the identical content format as v1.0 -- YAML frontmatter with bilingual fields rendered through `marked` + `shiki`. The work is 90% content authoring and 10% minor configuration changes.

## Current Stack (Validated -- DO NOT CHANGE)

| Technology | Installed Version | Purpose |
|------------|-------------------|---------|
| Astro | 6.0.7 | Static site generator, content collections |
| Tailwind CSS | 4.2.2 | Styling with `@tailwindcss/typography` |
| Shiki | 4.0.2 | Syntax highlighting (dual-theme) |
| Marked | 17.0.4 | Markdown-to-HTML for frontmatter answers |
| GitHub Actions | N/A | CI/CD on push to main |
| GitHub Pages | N/A | Static hosting at `/cheatsheet` base path |

## Required Changes

### 1. Add Shiki Languages (config change only, zero new deps)

**File to change:** `src/lib/markdown.ts` line with `langs` array in `createHighlighter()`

**Current langs:** `['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile']`

| Language to Add | Why | Priority |
|-----------------|-----|----------|
| `solidity` | Blockchain section already has Solidity code blocks silently falling to plain text. Known tech debt from v1.0 (documented in PROJECT.md). | MUST -- fixes existing bug |
| `python` | Automation QA advanced questions will include Selenium/pytest/Robot Framework examples. Python is the dominant test automation language. | MUST -- needed for new content |
| `groovy` | Automation QA practical tasks may reference Spock framework or Gradle build scripts. | SHOULD -- add when content needs it |
| `xml` | Maven pom.xml in Java practical tasks, possible Kubernetes XML manifests. | SHOULD -- add when content needs it |
| `kotlin` | Some Java advanced questions may contrast with Kotlin approaches. | COULD -- add when content needs it |

**Updated config:**

```typescript
langs: ['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile', 'solidity', 'python'],
```

**Why this is safe:** Shiki runs at build time only (SSG). Adding 2 languages adds ~50ms to build. No runtime cost. Unsupported languages already have a fallback to plain `<pre>` in the existing `renderMarkdown()` function.

### 2. Pagefind for Full-Text Search (one new package)

**Package:** `astro-pagefind`

```bash
npm install astro-pagefind
```

**Why `astro-pagefind` (not raw Pagefind CLI):**
- Auto-runs indexing after `astro build` -- no separate CLI step or post-build script
- Provides `<Search />` Astro component ready for templates
- Handles `/cheatsheet` base path automatically via Astro config
- Standard in the Astro ecosystem (Starlight uses Pagefind by default)

**Why not Fuse.js:** Fuse.js loads the entire content JSON into browser memory upfront. With 195 questions (105 existing + 90 new), each with bilingual answers, that is significant payload. Pagefind indexes at build time and loads only needed search chunks on demand.

**Integration points:**
- Add `pagefind()` to `integrations` array in `astro.config.mjs`
- Add `data-pagefind-body` to question content containers in section page template
- Add `data-pagefind-ignore` to navigation/UI chrome
- Both UA and EN answer text gets indexed (users search in their preferred language)

**Configuration:**

```javascript
// astro.config.mjs
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://ahtutejlo.github.io',
  base: '/cheatsheet',
  integrations: [pagefind()],
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

**Confidence:** HIGH -- Pagefind is the standard static search solution for Astro. Well-documented, actively maintained.

### 3. Content Schema Extension (config change only)

**File to change:** `src/content.config.ts`

Add a `type` field to distinguish question categories:

```typescript
schema: z.object({
  ua_question: z.string(),
  en_question: z.string(),
  ua_answer: z.string(),
  en_answer: z.string(),
  section: z.string(),
  order: z.number(),
  tags: z.array(z.string()).default([]),
  type: z.enum(['basic', 'deep', 'trick', 'practical']).default('basic'),
}),
```

**Why `default('basic')`:** All 105 existing questions get `basic` type automatically without editing their files. Only new v1.1 questions need the `type` field explicitly.

### 4. Tag Filtering UI (NO new dependencies)

Tags already exist in the content schema and in question frontmatter. Filtering needs only client-side DOM manipulation.

**Why no library:** Each section page has at most ~30 questions. Filtering by exact tag match is a `forEach` + `classList.toggle` operation. Adding a library (List.js, Fuse.js) for this is over-engineering.

**Implementation:** Vanilla JS in a `<script>` tag on the section page template. Reads tag data from `data-tags` attributes on question elements.

## What NOT to Add

| Technology | Why Not |
|------------|---------|
| **MDX / `@astrojs/mdx`** | Answers live in YAML frontmatter strings, not Markdown body. MDX components cannot be used inside frontmatter values. The existing `marked` renderer handles all formatting needs. |
| **React / Vue / Svelte** | No interactive UI components needed. Flashcard is native `<details>/<summary>`. Tag filtering is vanilla JS. Search uses Pagefind's own widget. |
| **Fuse.js / Lunr.js** | Pagefind is better for static sites (build-time indexing, chunked loading vs. full JSON in memory). |
| **Testing framework** | Out of scope for a content milestone. 567 LOC with no business logic. Content correctness is validated by the Zod schema at build time. |
| **i18n library** | Bilingual content uses co-located UA/EN fields per question. No runtime translation needed. |
| **Icon library** | Question type badges need 3-4 visual indicators. Inline SVG, emoji, or Unicode symbols suffice. |
| **sharp / image optimization** | No images in interview questions. All content is text and code. |
| **Prettier / ESLint** | Nice to have but out of scope for a content milestone. Add in a separate dev tooling PR if desired. |

## Version Compatibility

| Dependency | Version | Compatible With |
|------------|---------|-----------------|
| `astro-pagefind` | ^1.6+ | Astro 5-6. Verify Astro 6 support before installing (check npm page or GitHub issues). |
| `shiki` | 4.0.2 (existing) | `solidity` and `python` are built-in supported languages in Shiki 4.x. No separate grammar packages needed. |
| `marked` | 17.0.4 (existing) | No changes needed. Custom renderer in `src/lib/markdown.ts` handles all advanced question formatting. |

## Installation Summary

```bash
# Only new package
npm install astro-pagefind
```

That is it. Everything else is configuration changes to existing files.

## Sources

- Project source: `src/lib/markdown.ts`, `src/content.config.ts`, `astro.config.mjs`, `package.json` -- read directly
- PROJECT.md known tech debt: Solidity syntax highlighting missing
- [astro-pagefind GitHub](https://github.com/shishkin/astro-pagefind) -- Astro integration for Pagefind
- [Pagefind official site](https://pagefind.app/) -- static search architecture and multilingual support
- [Astro Starlight uses Pagefind](https://starlight.astro.build/guides/site-search/) -- validates Pagefind as the standard Astro search solution
- Shiki 4.x language support: `solidity` and `python` are included in the default grammar bundle
