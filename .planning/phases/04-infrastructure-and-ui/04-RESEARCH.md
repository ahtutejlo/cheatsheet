# Phase 4: Infrastructure and UI - Research

**Researched:** 2026-03-21
**Domain:** Astro content schema, Shiki syntax highlighting, Astro component architecture
**Confidence:** HIGH

## Summary

Phase 4 extends the existing Astro 6 + Tailwind 4 + Shiki static site with a question type system. The work breaks into three clear domains: (1) schema update to add a `type` field with a default value, (2) adding `solidity` and `python` to the Shiki highlighter's language list, and (3) UI components for type badges and grouping on section pages.

The codebase is small (567 LOC) and well-structured. All changes are additive -- no refactoring needed. The schema change uses Zod's `.default()` which Astro's content layer already supports, guaranteeing backward compatibility with the 105 existing questions. The Shiki highlighter already initializes with 8 languages; adding 2 more is a one-line change. The UI work involves creating one new component (`TypeBadge.astro`) and modifying two existing ones (`Flashcard.astro`, `FlashcardList.astro`) plus the section page.

**Primary recommendation:** Execute schema change first (INFRA-01), then Shiki languages (INFRA-02), then UI components (UI-01/02/03), then content conventions doc (INFRA-03) last since it codifies patterns established by the other tasks.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Schema supports `type` field (basic/deep/trick/practical) with default('basic') | Zod enum + `.default()` in `content.config.ts` -- verified Astro content collections API supports this |
| INFRA-02 | Shiki highlights solidity and python code in answers | Both `solidity` and `python` exist in `shiki@4.x` bundledLanguages -- verified via runtime check |
| INFRA-03 | Content conventions document defines structure for each question type | New markdown doc in project root or `.planning/` -- defines frontmatter patterns and answer structure per type |
| UI-01 | User sees type badge (Deep/Trick/Practical) on each flashcard | New `TypeBadge.astro` component, colors/labels defined in UI-SPEC |
| UI-02 | Questions grouped by type on section page (Basic > Deep > Trick > Practical) | Modify section `index.astro` to sort/group by `type` field, render group headers |
| UI-03 | User sees question count per type on section page | Type count summary with colored dots below section heading |
</phase_requirements>

## Standard Stack

### Core (already in project)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^6.0.7 | Static site framework | Already in use, content collections API handles schema |
| tailwindcss | ^4.2.2 | Utility CSS | Already in use, provides all needed badge/layout classes |
| shiki | ^4.0.2 | Syntax highlighting | Already in use, supports solidity + python out of the box |
| zod | (bundled with astro) | Schema validation | Used via `astro:content`, provides `.enum()` and `.default()` |

### Supporting (already in project)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | ^0.5.19 | Prose styling for answers | Already applied to flashcard answer areas |
| marked | ^17.0.4 | Markdown rendering | Used in `lib/markdown.ts` for frontmatter answers |

### Alternatives Considered

None -- this phase uses only existing dependencies. No new packages needed.

## Architecture Patterns

### Current Project Structure
```
src/
├── components/        # Astro components (Flashcard, FlashcardList, Header, SectionCard)
├── content/           # Content collections
│   └── questions/     # 7 section dirs, 105 .md files
├── content.config.ts  # Zod schema for questions collection
├── i18n/              # ui.ts (translations), sections.ts (section metadata), utils.ts
├── layouts/           # BaseLayout.astro
├── lib/               # markdown.ts (Shiki renderer)
├── pages/             # [locale]/[section]/index.astro routing
└── styles/            # global.css (Tailwind + Shiki dark mode)
```

### Pattern 1: Schema Extension with Backward Compatibility
**What:** Add `type` field to the questions collection schema using Zod enum with a default value
**When to use:** When extending content schema without breaking existing content files
**Example:**
```typescript
// In src/content.config.ts
const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
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
});
```
The `.default('basic')` ensures all 105 existing questions (which lack a `type` field in their frontmatter) pass validation and get `type: 'basic'` automatically.

### Pattern 2: Conditional Component Rendering
**What:** Render TypeBadge only when type is not 'basic'
**When to use:** For additive UI elements that should not appear on legacy content
**Example:**
```astro
---
// In Flashcard.astro
import TypeBadge from './TypeBadge.astro';
interface Props {
  slug: string;
  question: string;
  answer: string;
  type?: 'basic' | 'deep' | 'trick' | 'practical';
  locale: 'ua' | 'en';
}
const { slug, question, answer, type = 'basic', locale } = Astro.props;
---
<!-- Inside summary, between question text and anchor link -->
{type !== 'basic' && <TypeBadge type={type} locale={locale} />}
```

### Pattern 3: Group-and-Sort for Section Page
**What:** Group questions by type with a defined order, render group headers
**When to use:** When displaying categorized content on a listing page
**Example:**
```typescript
// Type display order
const TYPE_ORDER = ['basic', 'deep', 'trick', 'practical'] as const;

// Group questions
const grouped = TYPE_ORDER
  .map(type => ({
    type,
    questions: sectionQuestions.filter(q => q.data.type === type),
  }))
  .filter(g => g.questions.length > 0);
```

### Pattern 4: i18n Key Extension
**What:** Add new translation keys to the existing `ui` object in `src/i18n/ui.ts`
**When to use:** When adding bilingual UI text
**Example:**
```typescript
// Add to both locale objects in src/i18n/ui.ts
'type.deep': 'Deep',           // UA: 'Глибоке'
'type.trick': 'Trick',         // UA: 'Пастка'
'type.practical': 'Practical', // UA: 'Практичне'
'group.basic': 'Basic',        // UA: 'Базові'
'group.deep': 'Deep Technical',       // UA: 'Глибокі технічні'
'group.trick': 'Trick Questions',     // UA: 'Питання-пастки'
'group.practical': 'Practical Scenarios', // UA: 'Практичні задачі'
```

### Anti-Patterns to Avoid
- **Modifying existing content files to add `type: basic`:** The Zod `.default('basic')` handles this. Do not touch the 105 existing markdown files.
- **Creating a separate sorting utility:** The grouping logic is simple enough to inline in the section page. No need for a separate module.
- **Using client-side JS for grouping/badges:** This is a static site. All grouping and badge rendering happens at build time in Astro components. No client-side JS needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Badge color mapping | Manual if/else chains | A const map object (`TYPE_COLORS`) | Cleaner, reusable, matches UI-SPEC exactly |
| Syntax highlighting for new languages | Custom grammar definitions | Shiki's built-in `solidity` and `python` bundles | Shiki 4.x includes 332 languages |
| i18n for type labels | Inline conditionals per locale | Existing `t()` function + `ui.ts` keys | Consistent with project convention |
| Content type schema validation | Manual type checking in templates | Zod enum in `content.config.ts` | Astro validates at build time, surfaces errors early |

## Common Pitfalls

### Pitfall 1: Shiki Lazy Loading
**What goes wrong:** Shiki 4.x uses lazy-loading for language grammars. Adding a language to `createHighlighter({ langs: [...] })` does NOT automatically make it available if the language import fails silently.
**Why it happens:** Shiki loads grammar bundles on demand. If the language string is misspelled or not recognized, it returns no highlighting with no error.
**How to avoid:** Use exact language identifiers: `'solidity'` and `'python'`. Verified both exist in `bundledLanguages` via runtime check. Test with an actual code block after adding.
**Warning signs:** Code blocks render as plain text with no syntax colors.

### Pitfall 2: Astro Content Collection Cache
**What goes wrong:** After changing `content.config.ts` schema, Astro may serve stale data from its content collection cache.
**Why it happens:** Astro caches content collection data in `.astro/` directory.
**How to avoid:** Run `astro build` or restart `astro dev` after schema changes. If issues persist, delete `.astro/` directory.
**Warning signs:** New `type` field returns `undefined` despite schema having a default.

### Pitfall 3: TypeScript Strict Typing with Locale Keys
**What goes wrong:** Adding new keys to `ui.ts` requires the `t()` function's type parameter to include them. The `t()` function uses `keyof (typeof ui)[typeof defaultLocale]` which auto-updates.
**Why it happens:** TypeScript infers the union type from the object keys.
**How to avoid:** Add keys to BOTH `ua` and `en` objects simultaneously to keep types in sync.
**Warning signs:** TypeScript error when calling `t(locale, 'type.deep')` if key exists in only one locale.

### Pitfall 4: FlashcardList Props Interface Not Updated
**What goes wrong:** `FlashcardList.astro` currently defines `QuestionData` with only `slug`, `question`, `answer`. If you pass `type` and `locale` without updating the interface, TypeScript will error.
**Why it happens:** Astro components use typed Props interfaces.
**How to avoid:** Update the `QuestionData` interface in `FlashcardList.astro` to include `type` and `locale`. Also update the section page where questions are mapped.
**Warning signs:** Build error about unexpected props.

### Pitfall 5: First Group Top Padding
**What goes wrong:** The UI-SPEC specifies `pt-0` for the first group to avoid double spacing, but `pt-8` for subsequent groups.
**Why it happens:** The group header template uses `pt-8` universally.
**How to avoid:** Use array index or `:first-child` CSS to apply `pt-0` to the first group.
**Warning signs:** Excessive whitespace between section heading and first question group.

## Code Examples

### Adding Languages to Shiki Highlighter
```typescript
// In src/lib/markdown.ts - modify the langs array
highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile', 'solidity', 'python'],
});
```

### TypeBadge Component
```astro
---
// src/components/TypeBadge.astro
import { t, type Locale } from '../i18n/utils';

interface Props {
  type: 'deep' | 'trick' | 'practical';
  locale: Locale;
}

const { type, locale } = Astro.props;

const colorClasses: Record<string, string> = {
  deep: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  trick: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  practical: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const label = t(locale, `type.${type}` as any);
---
<span class:list={['inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold shrink-0', colorClasses[type]]}>
  {label}
</span>
```

### Grouping Logic for Section Page
```typescript
// In src/pages/[locale]/[section]/index.astro
const TYPE_ORDER = ['basic', 'deep', 'trick', 'practical'] as const;

const grouped = TYPE_ORDER
  .map(type => ({
    type,
    questions: sectionQuestions.filter(q => (q.data.type || 'basic') === type),
  }))
  .filter(g => g.questions.length > 0);

// Type counts for summary
const typeCounts = Object.fromEntries(
  TYPE_ORDER.map(type => [type, sectionQuestions.filter(q => (q.data.type || 'basic') === type).length])
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Shiki `getHighlighter()` | Shiki `createHighlighter()` | Shiki 1.x (2024) | Already using correct API |
| Astro content collections v1 (`src/content/config.ts`) | Astro content layer v2 (`src/content.config.ts` with loaders) | Astro 5.0 (late 2024) | Already using v2 API with `glob` loader |
| Tailwind v3 (`@apply`, config file) | Tailwind v4 (`@import "tailwindcss"`, CSS-first) | Tailwind 4.0 (2025) | Already using v4 -- no config file, use CSS |

## Open Questions

1. **Content conventions document location**
   - What we know: INFRA-03 requires a "content conventions document" defining structure for each question type
   - What's unclear: Should it live in project root, `.planning/`, or `docs/`?
   - Recommendation: Place in project root as `CONTENT_CONVENTIONS.md` since it's a reference for content authors (human or AI), not a planning artifact. Alternatively, `src/content/CONVENTIONS.md` to co-locate with content.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none -- see Wave 0 |
| Quick run command | `npx astro build` (validates schema + renders all pages) |
| Full suite command | `npx astro build` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | Schema accepts type field, defaults to 'basic' | build-validation | `npx astro build` (fails if schema invalid) | n/a (build-time) |
| INFRA-02 | Solidity and Python code blocks render with syntax highlighting | manual + build | `npx astro build` then inspect output HTML | n/a |
| INFRA-03 | Content conventions document exists | smoke | `test -f CONTENT_CONVENTIONS.md` | n/a |
| UI-01 | Type badge visible on non-basic flashcards | manual | Visual inspection after build (or grep output HTML for badge classes) | n/a |
| UI-02 | Questions grouped by type on section page | manual | Visual inspection after build | n/a |
| UI-03 | Type count summary visible on section page | manual | Visual inspection after build | n/a |

### Sampling Rate
- **Per task commit:** `npx astro build` (validates all content and renders all pages)
- **Per wave merge:** `npx astro build && npx astro preview` for visual verification
- **Phase gate:** Build succeeds + manual visual check of at least one section page

### Wave 0 Gaps
No formal test framework is installed. For this phase, the Astro build process serves as the primary validation:
- `npx astro build` validates all content against the Zod schema at build time
- Schema errors (wrong type values, missing required fields) cause build failures
- Template rendering errors (missing props, undefined variables) cause build failures
- This is sufficient for Phase 4 since all changes are build-time concerns (no client-side logic added)

To verify INFRA-02 specifically, after adding a test content file with solidity/python code blocks, the build will either highlight them (success) or render plain text (failure visible in output HTML).

## Sources

### Primary (HIGH confidence)
- **Project codebase** -- direct inspection of all relevant files (`content.config.ts`, `Flashcard.astro`, `FlashcardList.astro`, `markdown.ts`, `ui.ts`, section page, `astro.config.mjs`, `package.json`, `global.css`)
- **Shiki bundledLanguages** -- runtime verification that `solidity` and `python` are available in shiki@4.x (332 total languages)
- **UI-SPEC** -- `.planning/phases/04-infrastructure-and-ui/04-UI-SPEC.md` defines exact colors, labels, component structure

### Secondary (MEDIUM confidence)
- **Zod `.default()` behavior** -- well-documented Zod feature, verified by existing `tags: z.array(z.string()).default([])` pattern already in the schema

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or runtime checks

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all libraries already in use and verified
- Architecture: HIGH -- patterns derived from existing codebase conventions
- Pitfalls: HIGH -- identified from direct code inspection and Astro/Shiki behavior

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable -- no fast-moving dependencies)
