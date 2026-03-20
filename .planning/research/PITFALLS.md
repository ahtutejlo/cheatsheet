# Pitfalls Research

**Domain:** Interview Q&A cheatsheet static site (flashcard-style, Markdown content, UA/EN i18n, client-side search, tag filtering)
**Researched:** 2026-03-20
**Confidence:** HIGH (most pitfalls are well-documented in static site and i18n communities)

## Critical Pitfalls

### Pitfall 1: Translation Drift -- UA/EN Content Going Out of Sync

**What goes wrong:**
Ukrainian and English versions of the same question diverge silently. A question gets updated in one language but not the other. New questions get added to one language only. Over time, the two language versions become different products with different content coverage.

**Why it happens:**
Markdown-based bilingual content has no built-in mechanism to detect when one language version changes without updating the other. AI-generated content makes this worse because bulk generation in one language is easy, but keeping the other in sync requires deliberate effort. Git diffs show file changes but not cross-language consistency.

**How to avoid:**
- Store both languages in the same Markdown file (e.g., frontmatter with `question_ua`, `question_en`, `answer_ua`, `answer_en`) rather than separate files per language. This makes it structurally impossible to update one without seeing the other.
- If using separate files per language, implement a build-time validation script that compares file lists and frontmatter `lastUpdated` timestamps across locales.
- Add a CI check that flags any PR where a content file is modified in one locale directory but not the corresponding file in the other.

**Warning signs:**
- Sections have different question counts between UA and EN
- PRs that touch content files in only one language directory
- Users reporting "this question exists in Ukrainian but not English"

**Phase to address:**
Phase 1 (Content Structure). The file format decision must be made before any content is written. Retrofitting from separate files to co-located content is a painful migration.

---

### Pitfall 2: Client-Side Search Index Bloat with Bilingual Content

**What goes wrong:**
The search index JSON file that gets shipped to the browser becomes massive because it contains the full text of every question and answer in both languages. With 7 sections, each having 30-50 questions with multi-paragraph answers in two languages, the index can easily exceed 2-3 MB. Users on mobile or slow connections experience a sluggish or unusable search.

**Why it happens:**
Most client-side search tutorials show indexing small blogs with short posts. Interview Q&A content is dense -- answers include code examples, explanations, and lists. Doubling it for two languages makes the problem acute. Developers test on localhost with instant loads and never notice.

**How to avoid:**
- Pre-build the search index at build time (not runtime in the browser). Both FlexSearch and Lunr support serialized pre-built indexes.
- Create separate indexes per language. Only load the index for the currently active language.
- Index only questions and truncated answer previews (first 200 chars), not full answer text. Use the index for finding matches, then show the full content from the page.
- Lazy-load the search index on first interaction with the search input, not on page load.
- Set a budget: if the index exceeds 500KB per language, revisit what is being indexed.

**Warning signs:**
- Search index JSON file growing beyond 500KB per language
- Noticeable delay (>500ms) when performing first search
- Lighthouse performance score drops after adding search
- Testing only on fast connections / powerful devices

**Phase to address:**
Phase 2 (Search Implementation). But the content structure from Phase 1 must support efficient index generation -- extracting question text separately from answer text.

---

### Pitfall 3: FlexSearch Cyrillic/Ukrainian Text Handling Broken by Default

**What goes wrong:**
FlexSearch's default character encoding is Latin-centric. Ukrainian (Cyrillic) text returns zero results when searched. The documented workaround (`encode: false, split: /\s+/`) fixes Cyrillic but breaks Latin search, making mixed-language content (e.g., "Docker" in a Ukrainian answer) unsearchable.

**Why it happens:**
FlexSearch's built-in charsets (LatinBalance, LatinAdvanced, etc.) normalize characters to ASCII equivalents, which destroys Cyrillic characters. This is a known open issue (GitHub issues #51, #182) without an official resolution.

**How to avoid:**
- Use separate FlexSearch instances per language with different configurations: Latin charset for EN index, `encode: false` with custom tokenizer for UA index.
- Switch the active search instance based on the current language toggle.
- For the UA index, use a custom encoder function that handles Cyrillic properly while preserving Latin technical terms (class names, tool names) that appear in Ukrainian answers.
- Test search with Ukrainian characters (including special letters like i, yi, ye) from day one.
- Alternative: evaluate Orama (formerly Lyra) which has better multilingual support out of the box, or MiniSearch which handles Unicode more gracefully.

**Warning signs:**
- Search returns results in English but not Ukrainian
- Technical terms in Ukrainian answers (like "Kubernetes", "Docker") not found when searching in UA mode
- Search works in dev but not after build (encoding differences)

**Phase to address:**
Phase 2 (Search Implementation). Requires a proof-of-concept with Ukrainian text before committing to a search library. This is a potential blocker that should be validated early.

---

### Pitfall 4: Markdown Frontmatter Schema Drift Breaking Builds Silently

**What goes wrong:**
As AI generates content for 7+ sections, frontmatter fields become inconsistent: one file uses `tags: [docker, containers]`, another uses `tags: "docker, containers"`, another omits tags entirely. One file has `section: "QA"`, another has `category: "QA"`. The site builds but pages are missing from indexes, tags do not work, or sections show wrong content.

**Why it happens:**
Without schema validation, Markdown frontmatter is freeform YAML. AI-generated content is particularly prone to inconsistency across generation sessions. There is no compiler to catch "wrong field name" in frontmatter. The site generator silently ignores unknown fields.

**How to avoid:**
- Define a strict frontmatter schema (using Zod, Astro content collections, or a custom validator) before generating any content.
- Run schema validation in CI -- every PR with content changes must pass validation.
- Create a content template file that AI prompts reference to ensure consistent structure.
- Use a single canonical example file as the "source of truth" for frontmatter format.

**Warning signs:**
- Questions appearing in the wrong section or not appearing at all
- Tag filter showing unexpected or duplicate tags (e.g., "Docker" and "docker" as separate tags)
- Build succeeds but pages are empty or have missing metadata

**Phase to address:**
Phase 1 (Content Structure). The schema must exist before content generation begins. Retrofitting schema validation onto 200+ existing files is tedious.

---

### Pitfall 5: Accordion/Flashcard Answer Reveal Inaccessible and Janky on Mobile

**What goes wrong:**
The click-to-reveal answer pattern (core UX of the entire site) is implemented as a simple div toggle without proper accessibility or animation. Screen readers cannot navigate it. Keyboard users cannot toggle answers. On mobile, the tap target is too small, the expand animation causes layout shift that scrolls the question out of view, and long answers push subsequent cards far down the page.

**Why it happens:**
Developers implement the simplest possible show/hide toggle (`display: none` to `display: block`) and move on. Accessibility (ARIA attributes, keyboard handling) and mobile UX (scroll anchoring, animation performance) are treated as polish rather than core functionality.

**How to avoid:**
- Use the native HTML `<details>`/`<summary>` elements as the base. They provide keyboard navigation and screen reader support for free. Style them with CSS.
- If custom implementation is needed: use `<button>` for the question header, `aria-expanded`, `aria-controls`, proper `role` attributes. Support Enter/Space to toggle, Tab to navigate between cards.
- For animations, use `max-height` transitions or the View Transitions API rather than `display` toggle. Use `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` after expanding to prevent the question from scrolling off screen.
- Set minimum tap target of 44x44px on mobile for the toggle area.
- Test with 50+ cards on a single page on a real phone -- not just desktop Chrome.

**Warning signs:**
- Cannot navigate cards using Tab key
- Screen reader announces nothing when answer is revealed
- Opening a card on mobile causes jarring scroll jump
- Opening many cards makes the page sluggish (DOM thrashing)

**Phase to address:**
Phase 1 (Core UI). This is the primary interaction pattern of the entire site. Getting it wrong means the core product is broken.

---

## Moderate Pitfalls

### Pitfall 6: Tag Taxonomy Sprawl Making Filtering Useless

**What goes wrong:**
Without governance, tags proliferate: "docker", "Docker", "containers", "containerization", "container-orchestration" all exist as separate tags. The tag filter UI shows 100+ tags across 7 sections, overwhelming users. Tags lose their utility as a navigation mechanism.

**Why it happens:**
AI-generated content produces varied tagging. No controlled vocabulary is defined upfront. Each content generation session invents slightly different tags. Nobody audits the tag list as content grows.

**How to avoid:**
- Define a controlled tag vocabulary per section (max 8-12 tags per section) in a single `tags.yaml` or `tags.json` file. Content can only use tags from this list.
- Validate tags at build time -- reject any content file using an undefined tag.
- Normalize tags to lowercase-kebab-case in the schema.
- Show tags grouped by section in the UI, not as one flat list.

**Warning signs:**
- Tag filter showing more than 15 tags per section
- Near-duplicate tags appearing (singular/plural, case variants)
- Users ignoring the tag filter entirely

**Phase to address:**
Phase 1 (Content Structure) for the vocabulary definition. Phase 2 for the filter UI.

---

### Pitfall 7: Dark Mode as Afterthought Breaking Code Snippets and Content Readability

**What goes wrong:**
Dark mode is toggled globally but code syntax highlighting, Markdown-rendered HTML (tables, blockquotes, inline code), and any embedded images/diagrams are unreadable because their colors were only designed for light mode. White backgrounds on code blocks in dark mode, invisible text in tables, harsh contrast on inline code.

**Why it happens:**
Dark mode is implemented as a CSS variable swap on background and text colors. But Markdown-rendered content generates HTML that often has its own styling (syntax highlighter themes, table borders, blockquote styling) that does not respond to the theme variables.

**How to avoid:**
- Choose a syntax highlighting theme that has both light and dark variants (e.g., Shiki with dual themes). Configure theme switching at the highlighter level, not just CSS.
- Style all Markdown-generated HTML elements (tables, blockquotes, code, links) explicitly for both themes using CSS custom properties.
- Test every content type (plain text answer, code-heavy answer, table answer, list answer) in both themes before shipping.

**Warning signs:**
- Code blocks have white/light backgrounds in dark mode
- Table borders disappear in dark mode
- Inline code (`backtick text`) is unreadable in one mode

**Phase to address:**
Phase 1 (Core UI / Design System). Theme support must be baked into the component system, not bolted on later.

---

### Pitfall 8: Content-Heavy Pages Causing Poor Initial Load Performance

**What goes wrong:**
A section page loads all 40-50 flashcards at once, including full answer content (hidden but present in DOM). With code examples and long explanations, this means 100KB+ of HTML per section page. First Contentful Paint suffers. Mobile devices struggle with DOM size.

**Why it happens:**
The simplest implementation renders all cards in a single page load. Since answers are "hidden," developers assume they do not cost anything. But the DOM nodes exist, the HTML is parsed, and any syntax highlighting runs on all code blocks at load time.

**How to avoid:**
- Render answer content lazily -- only inject answer HTML into the DOM when the card is first opened. Store answers as data attributes or fetch them on demand.
- If a section has 30+ questions, implement pagination or "load more" (show 15, button to load next 15).
- Defer syntax highlighting to when the card is opened, not at page load.
- Use `content-visibility: auto` CSS property on answer containers for browser-level rendering optimization.

**Warning signs:**
- DOM node count exceeding 3000 on a section page
- Lighthouse flags "Avoid an excessive DOM size"
- Syntax highlighting library initializes on 50+ code blocks at page load
- Time to Interactive exceeding 3 seconds on mobile

**Phase to address:**
Phase 2 (Performance optimization). Build the lazy pattern into the card component early; retrofitting is harder.

---

## Minor Pitfalls

### Pitfall 9: Language Toggle Losing User Position and State

**What goes wrong:**
User is reading question #35 in the QA section in Ukrainian, switches to English, and gets sent back to the top of the page or to the section index. All expanded cards collapse. Their scroll position and reading context is lost.

**How to avoid:**
- Preserve the current route and card state when switching languages. Use URL-based card identifiers (anchors or query params) that are language-independent.
- Store expanded card state in URL hash or sessionStorage so language switch preserves it.
- Each question needs a stable ID that is the same across both languages.

**Phase to address:** Phase 2 (i18n implementation).

---

### Pitfall 10: No Content Validation in CI Leading to Broken Deploys

**What goes wrong:**
A Markdown file with broken YAML frontmatter, unclosed code blocks, or invalid tag references gets merged and the site either fails to build (best case) or builds with missing/broken content (worst case).

**How to avoid:**
- Add a CI step that validates all Markdown files: parse frontmatter, check required fields, validate tags against vocabulary, check for broken internal links.
- Use markdownlint for consistent Markdown formatting.
- Make validation a required check before merge.

**Phase to address:** Phase 1 (CI/CD setup).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Separate files per language instead of co-located content | Simpler file structure | Translation drift, sync maintenance nightmare | Never for this project size |
| Inlining all card content in page HTML | Simple rendering | DOM bloat, slow pages as content grows | MVP with <15 questions per section |
| Flat tag list without controlled vocabulary | Faster content generation | Tag sprawl, useless filtering | Never -- define vocabulary first |
| Single search index for both languages | Simpler search setup | Broken Cyrillic search or broken Latin search | Never -- split from the start |
| `display: none/block` for card toggle | Quick implementation | No animation, no accessibility, layout shifts | Only as initial prototype, replace before launch |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full-text answer content in search index | Search index > 1MB, slow first search | Index questions only, truncate answers | 100+ questions with code examples |
| All cards rendered in DOM at page load | High DOM count, slow TTI on mobile | Lazy render answers on expand | 30+ cards per section page |
| Syntax highlighting all code blocks at load | 2-3s JS execution on mobile | Highlight on card expand only | 10+ code blocks per page |
| Loading both language search indexes | Double bandwidth for search | Load only active language index | Always -- no scenario where both needed |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No "expand all / collapse all" button | Users must click 40 times to review all cards | Add bulk toggle, especially useful for review mode |
| Tag filter resets when navigating between sections | Users must re-select tags every time | Persist active tag filters in URL query params |
| Search results show only question text | Users cannot tell if the answer matches their need | Show highlighted match preview from answer text |
| No visual indicator of card count per tag | Users cannot gauge effort before filtering | Show count badges on tag chips |
| Language toggle not prominent enough | Users do not discover bilingual content exists | Place language toggle in header, visible on all pages |

## "Looks Done But Isn't" Checklist

- [ ] **Search:** Works with Ukrainian characters (not just Latin) -- test with Cyrillic queries
- [ ] **Search:** Handles technical terms in Ukrainian context (e.g., searching "Docker" while in UA mode)
- [ ] **Flashcards:** Keyboard accessible (Tab between cards, Enter/Space to toggle)
- [ ] **Flashcards:** Screen reader announces expanded/collapsed state
- [ ] **Dark mode:** Code blocks readable in both themes
- [ ] **Dark mode:** Tables, blockquotes, inline code all styled for both themes
- [ ] **i18n:** Every question exists in both languages (no orphaned translations)
- [ ] **Tags:** No duplicate/near-duplicate tags (case, plural, synonym variants)
- [ ] **Mobile:** Card expand does not scroll question out of viewport
- [ ] **Mobile:** Tap targets at least 44px for all interactive elements
- [ ] **Performance:** Section pages with 40+ cards load under 3s on 3G throttle
- [ ] **Content:** All frontmatter validates against the defined schema

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Translation drift (content out of sync) | HIGH | Audit all files, diff question lists per language, bulk-update missing translations. If using separate files, consider migrating to co-located format. |
| Search index bloat | MEDIUM | Rebuild index pipeline to separate question-only index. Requires changes to index generation and search result display. |
| FlexSearch Cyrillic failure | MEDIUM | Switch to separate instances per language or migrate to Orama/MiniSearch. Requires search module rewrite. |
| Frontmatter schema drift | HIGH | Write migration script to normalize all existing files. Manual review needed for ambiguous cases. More files = more pain. |
| Tag sprawl | MEDIUM | Define canonical vocabulary, write migration script to map existing tags to canonical ones. Requires content review. |
| Inaccessible flashcards | LOW | Replace custom toggle with `<details>`/`<summary>` or add proper ARIA. Mostly CSS and attribute changes. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Translation drift | Phase 1: Content Structure | CI check confirms both languages present for every question |
| Search index bloat | Phase 2: Search | Index file size under 500KB per language, search latency under 300ms |
| FlexSearch Cyrillic | Phase 2: Search | Automated test searching Ukrainian text returns correct results |
| Frontmatter schema drift | Phase 1: Content Structure | CI schema validation passes on every content PR |
| Accordion accessibility | Phase 1: Core UI | Lighthouse accessibility audit scores 95+, manual keyboard test passes |
| Tag sprawl | Phase 1: Content Structure | Build fails if content uses tag not in controlled vocabulary |
| Dark mode content | Phase 1: Design System | Visual regression tests for code blocks and tables in both themes |
| Page performance | Phase 2: Optimization | Lighthouse performance score 90+ on section page with 40 cards |
| Language toggle state loss | Phase 2: i18n | Manual test: switch language mid-page, verify position preserved |
| CI content validation | Phase 1: CI/CD | Intentionally break a content file, verify CI catches it |

## Sources

- [FlexSearch Cyrillic support issue #51](https://github.com/nextapps-de/flexsearch/issues/51)
- [FlexSearch Cyrillic & Latin mixed search issue #182](https://github.com/nextapps-de/flexsearch/issues/182)
- [FlexSearch documentation](https://github.com/nextapps-de/flexsearch)
- [Lunr.js pre-building indexes](https://lunrjs.com/guides/index_prebuilding.html)
- [Accessible Accordion patterns - Aditus](https://www.aditus.io/patterns/accordion/)
- [Accordion accessibility tests - USWDS](https://designsystem.digital.gov/components/accordion/accessibility-tests/)
- [i18n translation drift management - i18n-state-manager](https://tasknotes.dev/development/i18n-state-manager/)
- [Missing translations in i18next - Locize](https://www.locize.com/blog/missing-translations/)
- [Taxonomy 101 - Nielsen Norman Group](https://www.nngroup.com/articles/taxonomy-101/)
- [Validating YAML frontmatter with JSONSchema](https://ndumas.com/2023/06/validating-yaml-frontmatter-with-jsonschema/)
- [Markdown frontmatter validation - Astro docs](https://docs.astro.build/en/reference/errors/markdown-content-schema-validation-error/)
- [Search UX for static sites - Tyler Crosse](https://www.tylercrosse.com/ideas/search-part1-research-and-ux/)

---
*Pitfalls research for: Interview Q&A cheatsheet static site*
*Researched: 2026-03-20*
