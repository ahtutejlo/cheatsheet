# Project Research Summary

**Project:** Interview Q&A Cheatsheet (Flashcard Site)
**Domain:** Static interview Q&A / flashcard site with bilingual content (UA/EN), client-side search, and tag filtering
**Researched:** 2026-03-20
**Confidence:** HIGH

## Executive Summary

This is a content-driven static site — a category where Astro 6 is now the clear expert recommendation over Next.js or Gatsby. The site's value is entirely in its content and interaction model (click-to-reveal flashcards), not server-side logic, so a zero-JS-by-default static site generator is the correct architectural choice. The Astro + Tailwind CSS 4 + Pagefind stack is well-validated for exactly this use case: Astro's Content Collections provide schema-validated Markdown pipelines, Pagefind delivers build-time search indexing with native multilingual support, and Tailwind 4's CSS-native configuration enables modern theming with minimal overhead. The tech choices are stable, current (all released within the past 12 months), and highly compatible with each other.

The recommended approach is to build in content-first layers: define the Markdown schema and content structure before writing a single component. Every other decision — routing, search, tag filtering, language switching — flows from the content structure. The architecture is simple and well-understood: everything renders at build time to static HTML, with only three small client-side behaviors needed (flashcard reveal, tag filter, and search). The main architectural risk is treating these as independent features rather than recognizing that frontmatter schema and file structure decisions made in Phase 1 directly constrain what search and i18n can do in later phases.

The two critical risks are both content-structure risks, not technical risks. First: translation drift, where UA and EN content versions silently diverge because there is no enforcement mechanism. This must be solved structurally in Phase 1 (either co-located content or CI checks) before content generation begins. Second: frontmatter schema inconsistency from AI-generated content, which causes silent build failures and broken tag filtering. Both risks are easily prevented with upfront schema definition and CI validation, and catastrophically expensive to fix retroactively across hundreds of files. A search-specific risk also exists: Pagefind (not FlexSearch) should be used because FlexSearch has known broken Cyrillic support, a non-negotiable concern for a Ukrainian-language site.

## Key Findings

### Recommended Stack

Astro 6 (released March 10, 2026) is purpose-built for content-driven static sites and wins over all alternatives for this use case. Its Content Collections feature provides Zod-validated frontmatter schemas, type-safe queries, and automatic TypeScript type generation — exactly the content pipeline this project needs. Built-in i18n routing handles locale-prefixed URLs (`/ua/qa/`, `/en/java/`) without any external library. Tailwind CSS 4 removes the JS configuration file entirely, using CSS `@theme` directives instead, which pairs cleanly with Astro's zero-JS default. Pagefind, not FlexSearch or Lunr, is the correct search choice: it indexes at build time, produces per-language chunked indexes, has native Cyrillic support via `<html lang>` detection, and requires zero infrastructure.

**Core technologies:**
- **Astro 6.x:** Static site framework — Content Collections, built-in i18n routing, zero JS by default, Vite dev server
- **Tailwind CSS 4.x:** Styling and dark mode — CSS-native @theme config, dark: variant, 5x faster builds than v3
- **Pagefind 1.x:** Full-text search — build-time indexing, per-language indexes, Cyrillic support, zero backend
- **TypeScript 5.x:** Type safety — Content Collections generate types from Zod schemas automatically
- **Node.js 22+:** Runtime — required by Astro 6 (18/20 dropped)
- **pnpm:** Package manager — preferred by Astro ecosystem, faster than npm

**Critical version constraint:** Astro 6 requires Node.js 22+. Astro 6 uses Zod 4 (breaking change from Astro 5's Zod 3). The `astro-pagefind` integration (v1.8.5) compatibility with Astro 6 should be verified early — it is likely compatible but was last published ~6 months ago.

### Expected Features

The core MVP is simpler than it might seem: section pages with click-to-reveal flashcards, rendered from Markdown, with syntax-highlighted code blocks and mobile-responsive layout. Everything else is an enhancement. The UA/EN language toggle and full-text search are P2 — valuable differentiators but not launch blockers. The primary competitive advantage of this site is bilingual content (no major competitor serves Ukrainian-speaking developers) combined with modern design polish.

**Must have (table stakes):**
- Section/category browsing — users expect topic organization
- Click-to-reveal flashcard interaction — the entire value proposition; active recall over passive reading
- Mobile-responsive layout — 50%+ of study tool users are on phones
- Syntax-highlighted code blocks — technical Q&A is unusable without this
- Fast page loads — inherent to static sites if done correctly
- Shareable/permalink URLs per section — minimum deep-linking requirement
- Dark/light mode — modern baseline expectation, low implementation cost

**Should have (differentiators):**
- UA/EN language toggle — serves underserved Ukrainian developer audience; no major competitor has this
- Full-text search — add once question count makes browsing insufficient (20+ questions per section)
- Tag-based cross-section filtering — allows concept-based study across topics
- Anchor links to individual questions — enables sharing specific Q&As
- Expand all / Collapse all — review mode convenience

**Defer to v2+:**
- Print-friendly CSS — low demand, add if requested
- localStorage "reviewed" markers — only if users want progress tracking
- PWA offline support — only if mobile usage data justifies it
- Quiz/multiple-choice mode — out of scope; pedagogically weaker than flashcards anyway

### Architecture Approach

The architecture has three clear layers that map directly to implementation phases. The content layer (Markdown files + schema) is build-time only. The build pipeline (Astro SSG + Pagefind indexing) produces static HTML and search index files. The presentation layer delivers near-zero client-side JavaScript: only three small interactive behaviors exist (flashcard reveal, client-side tag filtering, and Pagefind search). This "build everything, ship HTML" pattern is the correct approach for this domain — it provides fast loads, SEO compatibility, and no runtime infrastructure to maintain.

**Major components:**
1. **Content Collections (src/content/questions/{locale}/{section}/)** — schema-validated Markdown files; one file per question; locale-parallel structure (`ua/` mirrors `en/`)
2. **Astro Page Routes (src/pages/[locale]/)** — static path generation for home, section, tag, and search pages; locale routing via built-in Astro i18n
3. **Flashcard Component** — `<details>/<summary>` HTML elements as no-JS base; CSS animation for reveal; accessible by default
4. **Pagefind Search** — post-build indexing of `dist/`; separate index per language; Pagefind UI component via `astro-pagefind` integration
5. **Client-Side Tag Filter** — `data-tags` attributes on rendered cards; vanilla JS show/hide; no framework needed
6. **i18n UI Strings (src/i18n/)** — simple TS key-value object for interface labels; Astro built-in routing for URL structure; no i18next or similar needed for two languages

### Critical Pitfalls

1. **Translation drift (content going out of sync between UA and EN)** — Prevent structurally: decide between co-located content (single file with both languages) vs. parallel files with mandatory CI checks that validate both locales have matching question files. This decision must be made in Phase 1 before any content is generated. Recovery cost is HIGH.

2. **Frontmatter schema inconsistency from AI-generated content** — Define a strict Zod schema in `content.config.ts` before generating any content. Run schema validation in CI as a required check on every content PR. Use a single canonical example file as the template for all AI generation prompts. Recovery cost is HIGH (migration across 200+ files).

3. **FlexSearch broken Cyrillic support** — Do not use FlexSearch for this project. Use Pagefind instead. Pagefind handles Cyrillic natively via `<html lang>` detection and creates separate per-language indexes automatically. This is the primary reason to prefer Pagefind over FlexSearch for a bilingual UA/EN site.

4. **Inaccessible flashcard interaction** — Use native `<details>/<summary>` HTML as the base implementation. This provides keyboard navigation, screen reader support, and accessible expand/collapse behavior for free, with no custom ARIA required. Avoid custom `display: none/block` toggle patterns.

5. **Tag taxonomy sprawl** — Define a controlled tag vocabulary (max 8-12 tags per section) in a single source file before content generation. Enforce at build time: reject content files using undefined tags. Normalize all tags to lowercase-kebab-case in the schema.

## Implications for Roadmap

Based on combined research, the architecture file's build order maps directly to a logical phase structure. The key insight from pitfalls research is that Phase 1 decisions (schema, file structure, tag vocabulary, CI validation) are load-bearing for everything downstream. Do not rush through Phase 1.

### Phase 1: Content Foundation and Core Flashcard UI

**Rationale:** Content structure decisions made here constrain every subsequent phase. Schema, file naming, locale organization, tag vocabulary, and CI validation must be locked before content generation begins. The flashcard interaction is the core product feature — it must work correctly (accessible, mobile-friendly) from the start.
**Delivers:** Working flashcard site with 3-4 sections of sample content in both languages; validated content pipeline; CI checks for schema and translation parity
**Addresses:** Section browsing, click-to-reveal interaction, syntax highlighting, mobile responsiveness, dark/light mode, clean typography
**Avoids:** Translation drift (Pitfall 1), frontmatter schema drift (Pitfall 4), inaccessible flashcard interaction (Pitfall 5), tag sprawl (Pitfall 6), dark mode breaking code blocks (Pitfall 7)
**Research flag:** Standard patterns — well-documented Astro Content Collections setup; no phase research needed

### Phase 2: Navigation, i18n, and Language Switching

**Rationale:** Locale-aware routing and the language toggle depend on Phase 1's content structure. Building this phase second ensures the URL schema (`/ua/qa/`, `/en/java/`) is correct before adding navigation between them.
**Delivers:** Working UA/EN language toggle; locale-prefixed URLs; i18n UI strings for all interface elements; language switcher component
**Addresses:** UA/EN language toggle (key differentiator), shareable URLs per section
**Avoids:** Language toggle state loss (Pitfall 9 — preserve URL anchors and scroll position during language switch)
**Research flag:** Standard patterns — Astro built-in i18n routing is well-documented; no phase research needed

### Phase 3: Search Integration

**Rationale:** Search requires rendered content to index, which exists after Phase 1-2. Pagefind runs as a post-build step against `dist/`. Search is a P2 feature but should be built before content volume grows large enough to require it.
**Delivers:** Full-text search across all sections in both languages; separate UA and EN indexes; search results UI
**Addresses:** Full-text search (P2 must-have once content grows), anchor links to individual questions (search results link to specific cards)
**Avoids:** Search index bloat (Pitfall 2 — Pagefind loads index chunks on-demand, not all at once), FlexSearch Cyrillic failure (Pitfall 3 — using Pagefind instead)
**Research flag:** Verify `astro-pagefind` v1.8.5 compatibility with Astro 6 before starting this phase. If incompatible, fall back to manual Pagefind CLI integration.

### Phase 4: Discovery and Tag Filtering

**Rationale:** Tag filtering depends on tags being defined (Phase 1) and content being rendered (Phase 1-2). Building after search ensures the full discovery layer (search + filter) ships together.
**Delivers:** Tag filter UI on section pages; tag index page; cross-section tag browsing; "expand all / collapse all" toggle
**Addresses:** Tag-based cross-section filtering, keyboard navigation, anchor links to questions
**Avoids:** Tag sprawl (tags already controlled from Phase 1); client-side tag filtering via `data-tags` attributes (no extra pages generated at build time)
**Research flag:** Standard patterns — client-side tag filtering is simple vanilla JS; no phase research needed

### Phase 5: Content Expansion and Performance Polish

**Rationale:** Once the feature set is complete, scale content to full coverage and validate performance under realistic load. Section pages with 40+ cards need DOM optimization.
**Delivers:** Full content coverage across all 7 sections in both languages; Lighthouse performance score 90+ on section pages; print-friendly CSS if requested
**Addresses:** Performance optimization for content-heavy pages, mobile refinement, visual polish
**Avoids:** Content-heavy page performance issues (Pitfall 8 — lazy render answer content, `content-visibility: auto`), CI content validation gaps (Pitfall 10)
**Research flag:** Standard patterns — performance optimization with well-known Lighthouse metrics; no phase research needed

### Phase Ordering Rationale

- **Schema before content:** Every pitfall with HIGH recovery cost (translation drift, frontmatter drift) is rooted in skipping schema definition. The schema must precede content generation.
- **Content before navigation:** Astro's `getStaticPaths()` needs content to generate routes; locale routing needs content to switch between.
- **Content before search:** Pagefind indexes rendered HTML; search cannot exist before pages do.
- **Content before tag filtering:** Tag filter shows/hides cards that must already be rendered.
- **Grouping i18n with routing (Phase 2):** Language switching and URL structure are tightly coupled in Astro's i18n system; they should be built together.
- **Deferring performance optimization (Phase 5):** Performance tuning for content-heavy pages requires representative content volume; premature optimization before content scale is known is wasteful.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Search):** Verify `astro-pagefind` v1.8.5 compatibility with Astro 6 before planning. If it does not support Astro 6, the integration approach changes (manual Pagefind CLI post-build script). This is a known medium-confidence gap from STACK.md.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Astro Content Collections, Tailwind 4 dark mode, `<details>/<summary>` flashcard — all have official documentation and established patterns
- **Phase 2:** Astro built-in i18n routing — fully documented in Astro 6 docs with recipes
- **Phase 4:** Client-side tag filtering — vanilla JS, no framework needed, well-understood pattern
- **Phase 5:** Lighthouse optimization, `content-visibility` CSS — standard web performance patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro 6 verified (March 2026), Tailwind 4.1 verified stable, Pagefind multilingual support verified in official docs. One gap: astro-pagefind v1.8.5 Astro 6 compatibility unverified. |
| Features | HIGH | Competitor analysis done (IT Flashcards, devhints.io, Tech Interview Handbook). MVP scope clear. Anti-features well-reasoned (avoid quiz mode, accounts, SRS). |
| Architecture | HIGH | All patterns are Astro-native. Content Collections, getStaticPaths, Pagefind post-build indexing — all documented. File structure is locale-first with clear rationale. |
| Pitfalls | HIGH | Top pitfalls sourced from official GitHub issues (FlexSearch Cyrillic), Astro docs, accessibility standards (USWDS), and NNG. Recovery costs assessed. |

**Overall confidence:** HIGH

### Gaps to Address

- **astro-pagefind Astro 6 compatibility:** Verify in Phase 3 planning before committing to the integration approach. If incompatible, use manual `pagefind --site dist/` CLI invocation in the build script (documented on Pagefind official site). This is a low-risk gap — Pagefind itself is fully compatible with any static output.
- **Co-located vs. parallel file content structure:** The pitfalls research recommends co-located content (single file with both languages) as strongly preferable to prevent translation drift. ARCHITECTURE.md assumes parallel files. This is the one architectural decision requiring explicit team input before Phase 1 begins. The tradeoff: co-located is drift-proof but slightly harder to query; parallel files are easier to browse but require CI enforcement. Recommend co-located content with a frontmatter structure containing both languages.
- **Content volume per section at launch:** FEATURES.md suggests 15-20 questions per section for MVP. Performance optimization (Phase 5) is calibrated for 40+ cards per section. The implementation approach for flashcard rendering should support both scales without refactoring (use `<details>/<summary>` which is already performant at both scales).

## Sources

### Primary (HIGH confidence)
- [Astro 6.0 release blog](https://astro.build/blog/astro-6/) — features, breaking changes, Node 22 requirement
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — Zod schemas, type safety, getCollection API
- [Astro i18n routing docs](https://docs.astro.build/en/guides/internationalization/) — built-in multilingual support, locale routing
- [Pagefind official site](https://pagefind.app/) — static search architecture, multilingual support
- [Pagefind multilingual docs](https://pagefind.app/docs/multilingual/) — automatic language detection, per-language indexing
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-native config, performance improvements
- [Accessible Accordion patterns - Aditus](https://www.aditus.io/patterns/accordion/) — details/summary, ARIA patterns
- [USWDS Accordion accessibility tests](https://designsystem.digital.gov/components/accordion/accessibility-tests/) — keyboard navigation, screen reader behavior

### Secondary (MEDIUM confidence)
- [Astro 6 beta announcement (InfoQ)](https://www.infoq.com/news/2026/02/astro-v6-beta-cloudflare/) — Vite Environment API confirmation
- [Evil Martians - Client-side Search in Astro](https://evilmartians.com/chronicles/how-to-add-fast-client-side-search-to-astro-static-sites) — Pagefind integration patterns
- [NNG - Taxonomy 101](https://www.nngroup.com/articles/taxonomy-101/) — tag vocabulary governance
- [astro-pagefind npm](https://www.npmjs.com/package/astro-pagefind) — v1.8.5, Astro 5-6 compatibility

### Tertiary (needs validation)
- [FlexSearch Cyrillic issue #51](https://github.com/nextapps-de/flexsearch/issues/51) — confirms broken Cyrillic support; used as rationale to choose Pagefind over FlexSearch

---
*Research completed: 2026-03-20*
*Ready for roadmap: yes*
