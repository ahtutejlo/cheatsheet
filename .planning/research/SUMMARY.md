# Project Research Summary

**Project:** Interview Cheatsheet v1.1 — Advanced Questions
**Domain:** Static site content expansion with UI enhancements
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

Interview Cheatsheet v1.1 is a content-first milestone that expands an existing Astro 6 static site from 105 to 195 bilingual (UA/EN) interview questions by adding 15 advanced questions (5 deep-technical, 5 trick/gotcha, 5 practical) to each of 6 sections. The existing stack is nearly perfect for this task — one new package (`astro-pagefind`), two config changes (Shiki language additions, content schema `type` field), and minor component updates are the only technical changes required. The overwhelming majority of work is content authoring at scale.

The recommended approach is to execute in strict dependency order: schema and infrastructure changes first, then UI component updates in parallel with content generation, then verification. The critical architectural insight is that advanced questions are structurally identical to existing ones — the same `Flashcard.astro` component renders all types, and the glob loader auto-discovers new files without routing changes. This makes the integration low-risk compared to building entirely new content types from scratch.

The primary risks are not technical but operational: YAML syntax errors in AI-generated content will break the entire build (not just one file), order number collisions between existing (1-15) and new (16-30) questions produce unstable sort orders, and shipping 30 questions per section without UI grouping creates a UX cliff. All three risks are preventable with upfront conventions, per-batch build validation, and shipping content and UI changes together rather than sequentially.

## Key Findings

### Recommended Stack

The current stack requires no new frameworks. Astro 6 + Tailwind 4 + Shiki 4 + Marked 17 already handle everything needed for advanced question rendering. The one new dependency is `astro-pagefind` for full-text search, which is the standard Astro search solution (used by Astro Starlight) and handles the `/cheatsheet` base path automatically. Fuse.js and Lunr are explicitly ruled out — Pagefind's build-time indexing and chunked loading are far more appropriate than loading full content JSON into browser memory at 195 questions.

Config changes required in the existing stack:
- Add `solidity`, `python`, and `go` to the Shiki `langs` array in `src/lib/markdown.ts` — fixes existing tech debt (solidity already broken) and covers new advanced content languages
- Add `type` enum field to the Zod schema in `src/content.config.ts` with `.default('basic')` for zero-migration backward compatibility
- Add `pagefind()` to integrations in `astro.config.mjs` (stretch goal)

**Core technologies:**
- **Astro 6.0.7:** SSG + content collections — glob loader auto-discovers new `.md` files; no routing changes needed for new content
- **Shiki 4.0.2:** Build-time syntax highlighting — needs `solidity`, `gherkin`, `python`, `go` added to registered langs list
- **Marked 17.0.4:** Markdown-to-HTML rendering — no changes needed; handles multi-paragraph answers with code blocks already
- **`astro-pagefind` (new):** Full-text search — indexes both UA and EN content at build time, chunked loading avoids memory issues at 195 questions
- **Tailwind CSS 4.2.2:** Styling — badge pills and border accents for question types need ~10 lines of new conditional classes

### Expected Features

All research agrees on a two-tier feature structure: ship the type system and content together as the core deliverable, and treat search and filtering as high-value stretch goals.

**Must have (table stakes for v1.1):**
- `type` field in content schema (`basic | deep | trick | practical`) — prerequisite for all UI distinctions; add before any content generation
- Content conventions document — establishes "Trap:" callout pattern for trick questions and Scenario/Approach/Solution structure for practical tasks; must exist before content generation begins
- 90 new bilingual Markdown files (15 per section x 6 sections: automation-qa, java, kubernetes, blockchain, docker, sql)
- Question type badge in `Flashcard.astro` — colored pill showing deep/trick/practical
- Visual divider or grouping between basic (order 1-15) and advanced (order 16-30) questions on section pages

**Should have (low-effort differentiators):**
- Type-specific border accent colors (blue for deep, amber for trick, green for practical) — ~5 lines of Tailwind
- "Trap:" callout pattern enforced consistently across all 30 trick questions — content convention, zero code
- Structured practical task format (Scenario, Key considerations, Approach, Solution) — content convention, zero code

**Should have (medium-effort stretch goals):**
- Tag filter UI — schema already has tags, PROJECT.md marks as active requirement, vanilla JS implementation
- Pagefind full-text search — PROJECT.md marks as active requirement; value compounds as content grows

**Defer (v1.2+):**
- Keyboard navigation enhancements
- Print-friendly CSS
- Per-question difficulty ratings — explicitly anti-featured; subjective and creates maintenance burden
- Separate pages per question type — explicitly anti-featured; fragments the learning flow

### Architecture Approach

The architecture is additive, not transformative. The existing three-layer design (Content Layer -> Build Pipeline -> Presentation Layer) handles advanced questions without structural changes. New `.md` files drop into existing section directories, the glob loader picks them up automatically, Zod validates them, and `getCollection()` returns them alongside existing questions. No new pages, no new routes, no new data sources.

**Major components and their v1.1 changes:**
1. `src/content.config.ts` — add `type` enum field with `default('basic')`; zero migration cost for all 105 existing files
2. `src/lib/markdown.ts` — add `solidity`, `gherkin`, `python`, `go` to Shiki langs array; fixes existing silent highlighting failures
3. `src/components/Flashcard.astro` — add `type` prop, render badge with type-keyed Tailwind classes (~10 lines)
4. `src/components/FlashcardList.astro` — pass `type` through and insert basic/advanced divider (~5 lines)
5. `src/pages/[locale]/[section]/index.astro` — include `type` in question mapping (~1 line)
6. `src/content/questions/{section}/` — 90 new files using `deep-`, `trick-`, `practical-` filename prefixes

**Build order (hard dependency chain):**
Schema update (Step 1) -> UI components + Content generation in parallel (Step 2 and 3) -> Verification (Step 4)

The naming convention for new files is load-bearing: prefix all advanced question filenames with their type (`deep-hashmap-concurrency.md`, `trick-sql-null-comparison.md`, `practical-k8s-debugging.md`) to prevent filename collisions with existing basic questions that cover the same topics.

### Critical Pitfalls

1. **YAML frontmatter breakage at build time** — a single malformed frontmatter field in any file breaks the entire Astro build, not just that file. Generate in small batches (3-5 files), run `astro build`, verify clean before scaling. Always use YAML block scalar syntax (`|`) for all multiline fields; never use inline strings for answers.

2. **Order number collisions** — existing questions use `order: 1-15`; new questions must use `order: 16-30`. AI generation sessions lose context of existing numbering. Audit existing orders per section with `grep "^order:"` before generating and provide explicit numbering in every generation prompt.

3. **Shiki language registration gaps** — `solidity` (4 existing broken blocks in blockchain) and `gherkin` (2 existing broken blocks in automation-qa) are already unregistered. The try/catch fallback silently renders them as unhighlighted plain text, hiding the problem. Fix both before adding any new content, and add `python` and `go` proactively.

4. **Filename and slug collisions** — advanced questions naturally cover the same topics as existing basic ones at deeper depth, leading to duplicate filenames. The `deep-`, `trick-`, `practical-` prefix naming convention prevents this entirely. Apply it to all 90 new files.

5. **Flat list UX collapse at 30 questions per section** — doubling page length without visual grouping creates an overwhelming wall of flashcards. The basic/advanced divider and type badges must ship with the content in the same deployment. Content and UI changes are a single deployable unit, not sequential releases.

## Implications for Roadmap

Based on combined research, a 4-phase structure maps cleanly to the hard dependency chain identified in ARCHITECTURE.md, while accounting for the pitfall prevention timing requirements from PITFALLS.md.

### Phase 1: Infrastructure and Conventions
**Rationale:** Schema and Shiki config are hard prerequisites — content generation depends on the `type` field existing, and language registration must be fixed before advanced content introduces new code block languages. These changes take under an hour and unblock everything else. Conventions must be documented before content generation begins, not retrofitted afterward.
**Delivers:** Updated `content.config.ts` with `type` field; updated `src/lib/markdown.ts` with `solidity`, `gherkin`, `python`, `go` registered; content conventions document with "Trap:" pattern and practical task structure; `astro build` green with all 105 existing questions.
**Avoids:** Pitfall 3 (Shiki language gaps), Pitfall 7 (missing type metadata), costly retroactive retrofitting of `type` field across 90 generated files.

### Phase 2: UI Component Updates
**Rationale:** Component changes depend on the `type` schema field (Phase 1) but do not depend on actual content files existing. Can run in parallel with content generation but must be complete before final verification. Low time investment (~45 minutes) that pays off when 30-question pages arrive.
**Delivers:** Updated `Flashcard.astro` with type badge; updated `FlashcardList.astro` with basic/advanced visual divider; updated section page template with `type` in question mapping; i18n strings for badge labels in UA.
**Addresses:** Type badge (P1 feature), visual grouping (P1 feature), type-specific border accent colors (P2 feature).
**Avoids:** Pitfall 6 (flat list UX collapse) — the divider and badges ship with the content, not after.

### Phase 3: Content Generation (Bulk)
**Rationale:** Content is the core deliverable and the highest-effort phase. All 6 sections can be generated in parallel after Phase 1 establishes schema and conventions. Generate in per-section batches with `astro build` validation checkpoints to prevent the YAML breakage pitfall from compounding across all 90 files.
**Delivers:** 90 new bilingual Markdown files — 15 per section (5 deep + 5 trick + 5 practical) across automation-qa, java, kubernetes, blockchain, docker, sql.
**Addresses:** All P1 content requirements — bilingual coverage, type-specific answer conventions, code examples, meaningful tags populated per question.
**Avoids:** Pitfall 1 (YAML breakage via per-batch validation), Pitfall 2 (order collisions via explicit numbering convention), Pitfall 4 (filename collisions via type-prefix naming), Pitfall 5 (translation semantic drift via bilingual side-by-side review).

### Phase 4: Verification and Stretch Goals
**Rationale:** With 195 questions live, verify all checklist items from PITFALLS.md before shipping. Tag filter UI and Pagefind search are stretch goals for this phase — both are fully independent of the question type system and add no risk to the content milestone.
**Delivers:** Verified deployment of all 195 questions with correct rendering, syntax highlighting, bilingual display, and type badges. Optionally: Pagefind search integration and tag filter UI.
**Addresses:** Stretch P2 features (Pagefind search, tag filter) if time permits within milestone scope.
**Avoids:** Silent regressions — the "Looks Done But Isn't" checklist from PITFALLS.md drives all verification tasks.

### Phase Ordering Rationale

- **Schema before content** is the non-negotiable hard dependency. The `.default('basic')` value means zero cost to existing files, but new files need the `type` field from day one to avoid backfilling 90 files.
- **Conventions before content** prevents retrofitting 90 files with consistent "Trap:" callouts and practical task structure after the fact.
- **UI before content ships** avoids the UX cliff. Shipping 30 questions without grouping and then patching the UI is a worse user experience than shipping both together.
- **Content in parallel batches** with validation checkpoints prevents the "broken build, unclear which of 90 files is the cause" failure mode.
- **Stretch goals in Phase 4** rather than Phase 2 keeps the critical path focused. Pagefind and tag filtering are valuable but not required for v1.1 to be a meaningful milestone.

### Research Flags

Phases with standard patterns (skip deeper research — well-documented):
- **Phase 1:** All changes are config-level modifications to existing files with stable, documented APIs (Zod defaults, Shiki language names).
- **Phase 2:** Flashcard badge is a simple conditional Tailwind pattern. No novel UI patterns involved.
- **Phase 3:** Content conventions are fully specified in FEATURES.md. Follow documented patterns; no additional research needed.

Phases that may benefit from targeted pre-planning research:
- **Phase 4 (Pagefind):** Verify `astro-pagefind` compatibility with Astro 6.0.7 specifically before installing. STACK.md explicitly flags this: "verify Astro 6 support before installing (check npm page or GitHub issues)."

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based on direct inspection of `package.json`, `astro.config.mjs`, `src/lib/markdown.ts`. Existing versions are known quantities. One minor gap: `astro-pagefind` Astro 6.0.7 compatibility unverified. |
| Features | HIGH | Clear precedent from v1.0 feature set, competitor analysis across 5+ platforms (IT Flashcards, DataCamp, InterviewBit, Tech Interview Handbook), and explicit PROJECT.md requirements. Scope is well-bounded. |
| Architecture | HIGH | Based on direct codebase reading — actual source files, not estimates from documentation. Glob loader, Zod schema defaults, and component prop patterns are all verified against real code. |
| Pitfalls | HIGH | Based on direct content audit of all 105 existing files, known tech debt documented in PROJECT.md, and verified Astro 6 content collection behavior. Pitfalls 1-4 are observed against real content, not hypothetical. |

**Overall confidence:** HIGH

### Gaps to Address

- **`astro-pagefind` Astro 6.0.7 compatibility:** Check the package's GitHub issues before Phase 4 begins. Risk is LOW — Pagefind itself is compatible with any static HTML output; even if the integration package has issues, the fallback is a manual `pagefind --site dist/` CLI step in the build script.
- **Gherkin Shiki language identifier:** Confirm Shiki 4.x uses `gherkin` as the canonical identifier (not `cucumber` or `feature`) before updating the langs array in Phase 1. Low-stakes to verify.
- **Content quality per question:** The 90-question target assumes AI-generated bilingual content that passes human review. If trick question "Trap:" mechanisms or practical task solution quality is low, reducing scope from 5 to 3 questions per type per section is viable — nothing in the schema or UI depends on exact counts.

## Sources

### Primary (HIGH confidence)
- Existing codebase (direct read): `src/content.config.ts`, `src/lib/markdown.ts`, `src/pages/[locale]/[section]/index.astro`, `src/components/Flashcard.astro`, `src/components/FlashcardList.astro`, `package.json`, `astro.config.mjs`
- `PROJECT.md` — known tech debt (Solidity highlighting), active requirements (tag filtering, search), and explicitly out-of-scope items
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — glob loader behavior, Zod schema defaults
- [Shiki 4.x supported languages](https://shiki.matsu.io/languages) — language availability and canonical identifiers
- [Astro Starlight search guide](https://starlight.astro.build/guides/site-search/) — validates Pagefind as the standard Astro search solution

### Secondary (MEDIUM confidence)
- [astro-pagefind GitHub](https://github.com/shishkin/astro-pagefind) — Astro integration, base path handling
- [Pagefind official site](https://pagefind.app/) — static search architecture, multilingual indexing behavior
- Competitor analysis: IT Flashcards, DataCamp interview guides, InterviewBit, Tech Interview Handbook, InterviewQuery

### Tertiary (LOW confidence — verify before use)
- `astro-pagefind` Astro 6.0.7 compatibility — not verified against live package; check before Phase 4

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
