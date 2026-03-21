# Architecture Research

**Domain:** Advanced question types integration into existing Astro + Markdown interview cheatsheet
**Researched:** 2026-03-21
**Confidence:** HIGH

## Existing Architecture (Actual Implementation)

The current site uses co-located bilingual content -- one `.md` file per question containing both UA and EN in frontmatter fields. This differs from the v1.0 research recommendation of locale-parallel files. The actual architecture is simpler and better.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Content Layer (Build-time)                   │
│  ┌──────────────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │  Markdown Files   │  │  Zod Schema   │  │  i18n Strings  │    │
│  │  (1 file = 1 Q&A) │  │  (validation) │  │  (UI labels)   │    │
│  └────────┬─────────┘  └──────┬───────┘  └───────┬────────┘    │
│           │                   │                   │              │
├───────────┴───────────────────┴───────────────────┴──────────────┤
│                     Build Pipeline (Astro SSG)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  getCollection│  │  marked +     │  │  getStaticPaths    │    │
│  │  (glob loader)│  │  Shiki render │  │  (page generation) │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
│         │                 │                    │                 │
├─────────┴─────────────────┴────────────────────┴────────────────┤
│                     Presentation Layer (Client)                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐      │
│  │  Section  │  │  Flashcard    │  │  Theme/Language      │      │
│  │  Pages    │  │  Components   │  │  Client-side toggles │      │
│  └──────────┘  └──────────────┘  └──────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Current Content Schema

```typescript
// content.config.ts (actual)
schema: z.object({
  ua_question: z.string(),
  en_question: z.string(),
  ua_answer: z.string(),
  en_answer: z.string(),
  section: z.string(),
  order: z.number(),
  tags: z.array(z.string()).default([]),
})
```

### Current File Layout

```
src/content/questions/
├── automation-qa/     # 15 files
├── blockchain/        # 15 files
├── docker/            # 15 files
├── java/              # 15 files
├── kubernetes/        # 15 files
├── qa/                # 15 files (NOT receiving new questions)
└── sql/               # 15 files
```

Each file: frontmatter-only `.md` (no body content -- all Q&A in frontmatter fields).

## Integration Strategy for Advanced Questions

### The Core Question: Do advanced questions need new components?

**No.** Advanced questions (deep technical, trick, practical) are structurally identical to existing questions. They are bilingual flashcards with question text and answer text. The Flashcard component renders any markdown answer -- whether it is a 2-sentence fundamentals answer or a multi-paragraph deep technical answer with code blocks, tables, and diagrams.

What changes:
1. **Schema** -- add a `type` field to distinguish question categories
2. **Content files** -- 90 new `.md` files following the same pattern
3. **Ordering** -- new questions must integrate into section ordering
4. **Section page** -- optionally group/label questions by type
5. **Shiki langs** -- add `solidity` for blockchain advanced questions

What does NOT change:
- Flashcard component (renders any markdown)
- FlashcardList component (renders any list of questions)
- Page routing (`[locale]/[section]/index.astro`)
- Build pipeline (glob loader picks up new files automatically)
- i18n approach (co-located `ua_`/`en_` fields)

## Schema Changes

### Add `type` Field

```typescript
// content.config.ts -- updated
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

**Why `type` as an enum, not a tag:** Tags are freeform and used for topic filtering (e.g., "generics", "containers"). Question type is a fixed taxonomy with UI implications (grouping, badges, filtering). Mixing them would make tag filtering noisy and type logic fragile.

**Why `default('basic')`:** All 105 existing questions get `type: 'basic'` without modifying any existing files. Zero migration cost.

### New Question File Example

```markdown
---
ua_question: "Чому HashMap не є потокобезпечним і що станеться при конкурентному доступі?"
en_question: "Why is HashMap not thread-safe and what happens with concurrent access?"
ua_answer: |
  HashMap не синхронізований. При конкурентному доступі з кількох потоків...
  [detailed multi-paragraph answer with code examples]
en_answer: |
  HashMap is not synchronized. With concurrent access from multiple threads...
  [detailed multi-paragraph answer with code examples]
section: "java"
order: 16
tags:
  - collections
  - concurrency
  - thread-safety
type: "deep"
---
```

## Ordering Strategy

Current questions use `order: 1` through `order: 15` per section. New advanced questions continue the sequence.

**Recommended ordering per section:**

| Order Range | Type | Count |
|-------------|------|-------|
| 1-15 | basic (existing) | 15 |
| 16-20 | deep | 5 |
| 21-25 | trick | 5 |
| 26-30 | practical | 5 |

This keeps all questions in a single flat list, sorted by order. The `type` field enables optional grouping in the UI without requiring separate lists or pages.

## Component Changes

### Option A: Flat List with Type Badges (Recommended)

Add a small visual badge to flashcards indicating the question type. This requires a minor change to `Flashcard.astro` to accept and display a `type` prop.

**What changes:**
- `Flashcard.astro` -- add optional `type` prop, render a badge
- `FlashcardList.astro` -- pass `type` through
- `[section]/index.astro` -- pass `type` from question data

**What this looks like:**

```
[deep] Why is HashMap not thread-safe?          [v]
[trick] Will this code compile? Explain why.     [v]
[practical] Design a connection pool for...      [v]
```

The badge is a small colored label: deep = blue, trick = amber, practical = green. Basic questions get no badge (they are the default).

### Option B: Grouped by Type with Section Headers

Insert heading dividers between question types on the section page. This requires changes to the section page template but not to Flashcard itself.

**Trade-off:** More visual structure but adds complexity. The flat list with badges is simpler and lets users scroll naturally. Groups make sense only if the section page gets long enough to need navigation anchors within it.

**Recommendation:** Start with Option A (badges). If the 30-question pages feel too long, add section headers in a follow-up. YAGNI.

### Flashcard.astro Changes

Minimal. Add `type` prop and a conditional badge:

```astro
---
interface Props {
  slug: string;
  question: string;
  answer: string;
  type?: 'basic' | 'deep' | 'trick' | 'practical';
}

const { slug, question, answer, type = 'basic' } = Astro.props;
const answerHtml = await renderMarkdown(answer);

const badgeConfig = {
  deep: { label: 'Deep', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  trick: { label: 'Trick', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  practical: { label: 'Practical', class: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
};
const badge = type !== 'basic' ? badgeConfig[type] : null;
---
```

The badge renders as a `<span>` inside the summary, before the question text. Approximately 10 lines of template change.

### Section Page Changes

The `[section]/index.astro` page currently maps questions to `{ slug, question, answer }`. Add `type`:

```typescript
const questions = sectionQuestions.map(q => {
  const slug = q.id.split('/').pop() || q.id;
  return {
    slug,
    question: (q.data as any)[questionKey] as string,
    answer: (q.data as any)[answerKey] as string,
    type: q.data.type,  // <-- add this
  };
});
```

Also update the question count display to show breakdown: "30 questions (15 basic, 5 deep, 5 trick, 5 practical)" or simply "30 questions".

## Shiki Language Addition

The `src/lib/markdown.ts` highlighter needs `solidity` added to the langs array for blockchain advanced questions:

```typescript
langs: ['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile', 'solidity'],
```

This is already tracked as known tech debt in PROJECT.md. Advanced blockchain questions will likely include Solidity code, making this a dependency for the content phase.

Additionally, advanced questions across sections may use languages not currently loaded:
- **Kubernetes** questions may use `go` for operator examples
- **Automation QA** questions may use `python` for Selenium/pytest examples
- **SQL** advanced questions may use `plpgsql` or `sql` (already included)

**Recommendation:** Add `python` and `go` to the langs array proactively. Shiki loads languages lazily at build time -- additional languages add negligible build cost.

```typescript
langs: ['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile', 'solidity', 'python', 'go'],
```

## Data Flow (Unchanged)

```
New .md files added to src/content/questions/{section}/
    |
    v
Astro glob loader picks them up automatically (no config change)
    |
    v
Zod schema validates frontmatter (including new `type` field)
    |
    v
getCollection('questions') returns all questions (old + new)
    |
    v
Section page filters by section, sorts by order
    |
    v
FlashcardList renders all questions with type badges
    |
    v
Static HTML output (30 cards per section page instead of 15)
```

No new pages. No new routes. No new data sources. The glob loader and content collections handle everything.

## File Naming Convention for New Questions

Existing files use descriptive kebab-case names: `docker-best-practices.md`, `generics.md`, `string-pool.md`.

**Convention for new files -- prefix with type:**

```
src/content/questions/java/
├── what-is-oop.md                    # basic (existing, order 1-15)
├── generics.md                       # basic (existing)
├── ...
├── deep-hashmap-concurrency.md       # deep (new, order 16-20)
├── deep-jvm-memory-model.md          # deep
├── ...
├── trick-string-comparison.md        # trick (new, order 21-25)
├── trick-autoboxing-cache.md         # trick
├── ...
├── practical-connection-pool.md      # practical (new, order 26-30)
├── practical-deadlock-debug.md       # practical
└── ...
```

**Why prefix:** Makes the question type immediately obvious in file listings and git diffs without opening the file. The `type` frontmatter field is the source of truth; the filename prefix is a convention for human readability.

## Integration Points Summary

| What | Status | Change Required |
|------|--------|----------------|
| Content schema (`content.config.ts`) | MODIFY | Add `type` enum field with `'basic'` default |
| Markdown files | ADD | 90 new `.md` files (15 per section x 6 sections) |
| Flashcard component | MODIFY | Add `type` prop, render badge (~10 lines) |
| FlashcardList component | MODIFY | Pass `type` through (~2 lines) |
| Section page template | MODIFY | Include `type` in question mapping (~1 line) |
| Markdown renderer (`lib/markdown.ts`) | MODIFY | Add `solidity`, `python`, `go` to Shiki langs |
| i18n strings | MODIFY | Add badge label translations (deep/trick/practical in UA) |
| Home page | NO CHANGE | Already shows sections dynamically |
| BaseLayout | NO CHANGE | No structural changes |
| Routing | NO CHANGE | Same `[locale]/[section]/` pattern |
| Build pipeline | NO CHANGE | Glob loader auto-discovers new files |
| GitHub Actions CI/CD | NO CHANGE | Same build command |

## Anti-Patterns to Avoid

### Anti-Pattern 1: Separate Pages per Question Type

**What people do:** Create `/java/deep/`, `/java/tricks/`, `/java/practical/` as separate pages.
**Why it's wrong:** Fragments the learning flow. Users want all Java questions in one place. Creates routing complexity, more pages to maintain, breaks the simple section model.
**Do this instead:** Single section page with all questions sorted by order. Use type badges for visual distinction.

### Anti-Pattern 2: Different Component per Question Type

**What people do:** Create `DeepQuestion.astro`, `TrickQuestion.astro`, `PracticalQuestion.astro`.
**Why it's wrong:** They are structurally identical -- question text and answer text. Different components means duplicated logic and harder maintenance.
**Do this instead:** One `Flashcard.astro` component with a `type` prop that controls the badge. Same render logic for all types.

### Anti-Pattern 3: Storing Type Only in Tags

**What people do:** Add "deep", "trick", "practical" as tags instead of a dedicated `type` field.
**Why it's wrong:** Tags are freeform and meant for topic filtering. Mixing structural metadata with topic tags makes filtering unreliable (what if someone tags a question "deep-dive" as a topic tag?). Also, tags allow multiples -- a question cannot be both "deep" and "trick".
**Do this instead:** Dedicated `type` enum field. Clean separation of concerns.

### Anti-Pattern 4: Modifying Existing Question Files

**What people do:** Go back and add `type: "basic"` to all 105 existing files.
**Why it's wrong:** Unnecessary churn. The Zod schema default handles this: `.default('basic')` means any file without an explicit `type` field is treated as basic.
**Do this instead:** Only new files get explicit `type` values. Existing files remain untouched.

## Build Order (Dependencies)

```
Step 1: Schema Update
  - Add `type` field to content.config.ts
  - Add Shiki languages to markdown.ts
  Dependencies: None. Safe to do first; default value means no breaking change.

Step 2: Component Updates
  - Update Flashcard.astro (add type prop + badge)
  - Update FlashcardList.astro (pass type through)
  - Update [section]/index.astro (include type in mapping)
  - Add i18n strings for badge labels
  Dependencies: Step 1 (type field must exist in schema)

Step 3: Content Creation (bulk, parallelizable)
  - Create 15 new .md files per section (5 deep + 5 trick + 5 practical)
  - Sections: automation-qa, java, kubernetes, blockchain, docker, sql
  - Each file follows existing frontmatter pattern + type field
  Dependencies: Step 1 (schema must accept type field)
  Note: Can run in parallel with Step 2 -- content creation
  does not depend on UI changes, only on schema.

Step 4: Verification
  - Build site, verify all 195 questions render
  - Check type badges display correctly
  - Verify Shiki highlighting for new languages
  - Test on mobile (badges should not break layout)
  Dependencies: Steps 1-3 complete
```

**Critical path:** Step 1 (5 min) -> Step 2 (30 min) + Step 3 (bulk content, longest task) -> Step 4

Step 2 and Step 3 can run in parallel after Step 1 is complete.

## Sources

- Existing codebase inspection (HIGH confidence -- direct source code reading)
- [Astro Content Collections with glob loader](https://docs.astro.build/en/guides/content-collections/) -- schema validation, default values
- [Zod .default() documentation](https://zod.dev/?id=default) -- schema defaults for backward compatibility
- [Shiki supported languages](https://shiki.matsu.io/languages) -- language availability for syntax highlighting

---
*Architecture research for: Advanced question types integration into Astro interview cheatsheet*
*Researched: 2026-03-21*
