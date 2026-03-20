# Stack Research

**Domain:** Static interview Q&A cheatsheet site with flashcards, i18n, search, Markdown content
**Researched:** 2026-03-20
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 6.x (latest 6.0.5) | Static site framework | Purpose-built for content-driven static sites. Native Markdown/MDX support, Content Collections with Zod-validated frontmatter schemas, built-in i18n routing, zero JS by default (critical for a read-heavy Q&A site). Released March 10, 2026. Beating Next.js for content sites per community consensus. |
| Tailwind CSS | 4.x (latest 4.1) | Styling and dark mode | CSS-native configuration via @theme directives (no tailwind.config.js needed). Built-in dark mode via `dark:` variant. Up to 5x faster builds than v3. Design tokens in CSS, not JS. Perfect for rapid UI prototyping with consistent design. |
| Pagefind | 1.x (latest 1.1+) | Full-text search | Runs at build time, produces a static search index split into chunks. Zero backend, minimal bandwidth. Built-in multilingual support -- detects `<html lang>` and creates per-language indexes automatically. Stemming support for multiple languages. Free, no API keys. |
| TypeScript | 5.x | Type safety | Astro has first-class TypeScript support. Content Collections schemas generate types automatically via Zod. Catches frontmatter errors at build time. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro-pagefind | 1.8.x | Astro integration for Pagefind | Drop-in Pagefind component for Astro templates. Handles indexing as part of Astro build pipeline. Place last in integrations array. |
| @astrojs/mdx | latest (Astro 6 compatible) | MDX support in content collections | Only if you need interactive components inside Q&A content (code playgrounds, collapsible sections). Pure Markdown works without this -- start without it. |
| Zod | 4.x (bundled with Astro 6) | Schema validation | Validates frontmatter in Content Collections. Astro 6 upgraded to Zod 4. Ensures every question has required fields (title, tags, section, lang). |
| sharp | latest | Image optimization | Astro's built-in image optimization uses sharp. Install if you add diagrams/screenshots to answers. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Node.js 22+ | Runtime | Astro 6 dropped Node 18/20 support. Use Node 22 LTS. |
| pnpm | Package manager | Faster installs, strict dependency resolution, saves disk space. Astro ecosystem prefers pnpm. |
| Vite (bundled) | Dev server / bundler | Ships with Astro. Astro 6 uses Vite's Environment API for dev/prod parity. No separate config needed. |
| Prettier + prettier-plugin-astro | Code formatting | Consistent formatting for .astro files. |
| GitHub Pages or Netlify | Static hosting | Free tier. GitHub Pages integrates with repo directly. Netlify has better preview deploys. Either works -- pick based on workflow preference. |

## Installation

```bash
# Initialize Astro project
pnpm create astro@latest cheatsheet -- --template minimal

# Core dependencies (Astro 6 includes Tailwind via Vite)
pnpm add astro-pagefind

# Astro integrations
pnpm astro add tailwind

# Dev dependencies
pnpm add -D prettier prettier-plugin-astro @types/node
```

## Content Architecture (Stack-Driven)

Astro Content Collections define the data model. This is the core stack decision that shapes everything.

```
src/
  content/
    config.ts          # Zod schemas for questions
    questions/
      ua/
        qa/
          basics.md    # Frontmatter + Markdown answers
          automation.md
        java/
          oop.md
      en/
        qa/
          basics.md
        java/
          oop.md
  pages/
    [lang]/
      index.astro      # Home page per language
      [section]/
        index.astro    # Section page with flashcards
```

Content Collection schema (drives type safety):
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const questions = defineCollection({
  type: 'content',
  schema: z.object({
    section: z.string(),           // "qa", "java", "kubernetes"
    title: z.string(),             // Section display name
    lang: z.enum(['ua', 'en']),
    tags: z.array(z.string()),
    order: z.number().optional(),
  }),
});

export const collections = { questions };
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro 6 | Hugo | If build speed is critical at 10,000+ pages. Hugo is faster for massive sites but lacks component model and JS ecosystem integration. For < 1000 pages (this project), Astro wins on DX. |
| Astro 6 | Next.js (static export) | If you need server-side features later (auth, API routes). Overkill for a purely static content site -- ships unnecessary JS runtime. |
| Astro 6 | Eleventy (11ty) | If you want maximum simplicity with zero opinions. Less structured than Astro -- no built-in Content Collections, no component model. Worse DX for this use case. |
| Tailwind CSS 4 | Vanilla CSS / CSS Modules | If the team dislikes utility classes. Tailwind's dark mode, responsive utilities, and design consistency are worth the tradeoff for rapid prototyping. |
| Pagefind | Fuse.js | If you need fuzzy search over a small dataset (< 100 items). Fuse.js loads entire JSON index into browser memory -- bad for large content sites. Pagefind loads only needed chunks. |
| Pagefind | Algolia | If you need advanced search features (typo tolerance, faceting, analytics). Requires external service, API keys, and has usage limits on free tier. Pagefind is fully static, zero dependencies. |
| pnpm | npm | If team is unfamiliar with pnpm. npm works fine, just slower installs and more disk usage. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js | Ships client-side React runtime even for static pages. Massive JS bundle for a site that needs zero interactivity beyond click-to-reveal. | Astro (zero JS by default, islands for interactivity) |
| Gatsby | Effectively deprecated. Netlify acquired it, development stalled. GraphQL data layer is overkill for Markdown files. | Astro |
| i18next / react-i18next | Designed for React apps with runtime translation loading. This project has static content per language -- no runtime translation needed. | Astro built-in i18n routing + file-based language folders |
| Docusaurus | Opinionated toward documentation sites. Hard to customize for flashcard-style UI. Ships React bundle. | Astro |
| Lunr.js | Outdated, unmaintained. Requires loading entire index upfront. | Pagefind |
| CSS-in-JS (styled-components, emotion) | Runtime overhead, unnecessary complexity for a static site. | Tailwind CSS |
| tailwind.config.js | Tailwind v4 moved to CSS-native config via @theme. JS config is legacy. | @theme directive in CSS |
| Astro.glob() | Removed in Astro 6. Was the old way to load content. | Content Collections API (getCollection, getEntry) |

## Stack Patterns by Variant

**If you need interactive code examples in answers:**
- Add @astrojs/mdx integration
- Use Astro islands with a lightweight framework (Svelte preferred for smallest bundle)
- Because: MDX lets you embed components in Markdown; Astro islands hydrate only what needs JS

**If content grows beyond 500 questions:**
- Pagefind handles this natively (designed for 10,000+ pages)
- Consider adding tag-based filtering as static pages (one page per tag) rather than client-side filtering
- Because: Static generation scales better than client-side filtering for large datasets

**If you add user features later (bookmarks, progress tracking):**
- Use localStorage for client-side state (no backend needed)
- Astro islands with Preact (smallest React-compatible runtime) for interactive widgets
- Because: Keeps the site static while adding progressive enhancement

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Astro 6.x | Node.js 22+ | Node 18/20 dropped in Astro 6 |
| Astro 6.x | Zod 4.x | Breaking change from Astro 5 (Zod 3). Astro 6 bundles Zod 4. |
| Astro 6.x | Tailwind CSS 4.x | Via @astrojs/tailwind or Vite's built-in PostCSS |
| astro-pagefind 1.8.x | Astro 5-6 | Verify latest release supports Astro 6 -- may need update |
| Tailwind CSS 4.x | PostCSS (built-in) | No separate PostCSS config needed in Astro |

## Confidence Assessment

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Astro as framework | HIGH | Verified: Astro 6 released March 10, 2026. Purpose-built for content sites. Built-in i18n, Content Collections, zero JS. |
| Tailwind CSS 4 | HIGH | Verified: Stable since January 2025, v4.1 available. CSS-native config confirmed. |
| Pagefind for search | HIGH | Verified: Multilingual support confirmed in official docs. Static index, zero backend. astro-pagefind integration exists. |
| Content Collections for data | HIGH | Verified: Core Astro feature with Zod validation. Type-safe frontmatter. |
| Built-in i18n routing | HIGH | Verified: Astro docs confirm file-based language routing with helper functions. |
| astro-pagefind compatibility with Astro 6 | MEDIUM | Last published ~6 months ago (v1.8.5). Likely works but not explicitly verified for Astro 6. May need testing. |

## Sources

- [Astro 6.0 release blog](https://astro.build/blog/astro-6/) -- features, breaking changes, Node 22 requirement
- [Astro 6 beta announcement (InfoQ)](https://www.infoq.com/news/2026/02/astro-v6-beta-cloudflare/) -- Vite Environment API, Cloudflare support
- [Astro i18n routing docs](https://docs.astro.build/en/guides/internationalization/) -- built-in multilingual support
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) -- Zod schemas, type safety
- [Pagefind multilingual docs](https://pagefind.app/docs/multilingual/) -- automatic language detection, per-language indexing
- [Pagefind official site](https://pagefind.app/) -- static search architecture
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-native config, performance
- [astro-pagefind npm](https://www.npmjs.com/package/astro-pagefind) -- version 1.8.5
- [GitHub releases - Astro](https://github.com/withastro/astro/releases) -- version history

---
*Stack research for: Interview Q&A cheatsheet static site*
*Researched: 2026-03-20*
