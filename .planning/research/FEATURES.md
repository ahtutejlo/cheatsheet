# Feature Research

**Domain:** Interview cheatsheet -- advanced question types (v1.1 milestone)
**Researched:** 2026-03-21
**Confidence:** HIGH (well-understood domain, clear existing codebase, straightforward extension)

## Scope

This research covers features needed for adding 90 advanced bilingual questions (deep technical, trick/gotcha, practical tasks) to 6 existing sections. It does NOT re-evaluate v1.0 features (already shipped).

## Feature Landscape

### Table Stakes (Users Expect These)

Features that are non-negotiable for the v1.1 advanced questions milestone. Without these, the new content feels like "more of the same" rather than a meaningful upgrade.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Question type field in schema | Every question needs a machine-readable type so the UI can distinguish basic from advanced. Without it, 30 questions per section are an undifferentiated wall. | LOW | Add `type` field to `content.config.ts` schema: `z.enum(["basic", "deep-technical", "trick", "practical"]).default("basic")`. Default preserves backward compatibility with existing 105 questions. One-line schema change. |
| Question type badge/pill | Users need to know at a glance whether a question is deep-technical, trick, or practical. Interview prep platforms universally distinguish question categories visually. DataCamp, InterviewBit, and others all label question types. | LOW | Render a small colored `<span>` pill next to the question text inside `Flashcard.astro`'s `<summary>`. Approximately 10 lines of template + Tailwind classes. No new components needed. |
| Visual grouping by type within sections | When a section grows from 15 to 30 questions, a flat list becomes hard to scan. Users expect the 3 new types to be visually separated from the original 15 basic questions. | LOW | Add subheadings in `FlashcardList.astro` that group questions by type. Simple `.filter()` + `.map()` on the questions array. Approximately 20 lines. |
| Bilingual content for all 90 new questions | Existing site is fully UA/EN. Any new question without both languages breaks the user contract. | LOW (code), HIGH (content effort) | Same frontmatter structure (`ua_question`, `en_question`, `ua_answer`, `en_answer`). 90 questions x 2 languages = 180 Q&A pairs. AI-generated per PROJECT.md conventions. No code changes needed for this. |
| Code examples in advanced answers | Advanced technical questions demand code snippets. Users expect syntax-highlighted examples showing the "why" not just the "what". Deep-technical and practical questions especially need code. | NONE (already supported) | Already works via Shiki + Markdown fenced code blocks. Content authors just include code. Known gap: Solidity lacks highlighting (tech debt from v1.0). |
| Consistent ordering | New questions need predictable placement. Users scanning a section should find basic questions first, then advanced types grouped together. | LOW | Existing `order` field. Assign order 16-30 for new questions. Combine with type-based grouping in the UI so order within each type group is deterministic. |

### Differentiators (Competitive Advantage)

Features that make this cheatsheet stand out from generic interview question lists. Not required for v1.1 launch, but high-value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| "Why this is tricky" callout pattern in trick questions | Most sites just list trick questions. Explaining *why* the question traps people (the common wrong answer, the subtle distinction) is uniquely valuable. DataCamp and InterviewBit mention gotchas but don't structure them consistently. | LOW | Content convention, not code. Use a bold prefix in the answer body: `**Trap:** Most developers assume X, but...`. Renders with existing Markdown/prose styling. Document the convention so all 30 trick questions follow it. |
| Structured practical task format | Practical tasks should show scenario, then reveal a structured approach -- not just a bare answer. Real interviews test *process*, not just knowledge. | LOW | Content convention using Markdown headers within the answer: `**Scenario:** ...`, `**Approach:** ...`, `**Solution:** ...`. No schema change, no code change. Just a content pattern to document and follow. |
| Type-specific visual styling (border accents) | Different left-border colors for each question type. Deep-technical = blue, trick = amber/orange, practical = green. Enables instant visual scanning without reading labels. | LOW | 3-4 Tailwind `border-l-4` color variants in `Flashcard.astro` keyed off the `type` prop. Approximately 5 lines of conditional CSS. |
| Tag-based filtering UI | PROJECT.md lists tags as active requirement. Tags already exist in schema and frontmatter. With 195 total questions, filtering by subtopic (e.g., "multithreading", "networking") across a section becomes genuinely useful. | MEDIUM | Schema supports it (already defined). Need a client-side filter component with vanilla JS or Astro island. Button group or checkbox list that hides/shows flashcards by tag. |
| Full-text search (Pagefind) | PROJECT.md lists this as active. With 195 questions across 7 sections, search becomes valuable. Pagefind is purpose-built for static sites and well-documented for Astro integration. | MEDIUM | Pagefind runs at build time to generate a search index. Needs a search input component and results display. Independent of question types -- can be built in parallel. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Difficulty levels (Junior/Mid/Senior) | Seems logical for progressive learning | Explicitly out of scope per PROJECT.md. Subjective -- what is "senior" at one company is "mid" at another. Creates friction in content creation and arguments about classification. | Use question *types* (basic/deep-technical/trick/practical) instead. These describe the nature of the question, not a subjective difficulty rating. |
| Separate pages per question type | "Keep advanced questions on their own page" | Fragments the content. Users preparing for a Java interview want ALL Java questions in one place. Extra navigation overhead. More routes to maintain. | Group by type *within* the section page using subheadings. One page per section, scroll to find what you need. |
| Multiple-choice quiz mode for trick questions | "Trick questions are perfect for quizzes" | Out of scope per PROJECT.md ("only flashcards"). Writing 3-4 plausible wrong answers per trick question = 3-4x content effort for 30 questions. Fundamentally changes the product. | Flashcard click-to-reveal already works. The "Trap:" callout pattern in trick question answers achieves the same learning goal without quiz infrastructure. |
| Collapsible type sections | "Let users collapse entire type groups" | Adds state management complexity. Users would lose context about what questions exist in collapsed sections. Double-accordion (section collapse + flashcard reveal) creates confusing nested interactions. | Flat subheading groups with all flashcards visible (collapsed individually as they already are). Users can scroll; the page is not infinitely long. |
| Per-question difficulty rating (stars, numbers) | "Rate each question 1-5 difficulty" | Requires per-question calibration, highly subjective, creates content maintenance burden. Every rating becomes debatable. | The question type itself signals relative difficulty. Deep-technical and trick questions are implicitly harder than basic. |

## Feature Dependencies

```
[type field in content.config.ts schema]
    +-- enables --> [Type badge in Flashcard.astro]
    +-- enables --> [Visual grouping in FlashcardList.astro]
    +-- enables --> [Type-specific border colors]

[Content conventions document]
    +-- guides --> [90 new Markdown content files]

[90 new Markdown content files]
    +-- requires --> [type field in schema]
    +-- requires --> [Content conventions documented first]

[Tag filter UI]
    +-- requires --> [Tags populated in new content files]
    +-- independent of --> [Question type system]

[Pagefind search]
    +-- independent of --> [Question types]
    +-- independent of --> [Tag filter]
```

### Dependency Notes

- **Schema change must come first.** The `type` field addition to `content.config.ts` is a prerequisite for everything else. With `.default("basic")`, existing 105 questions need zero changes.
- **Content conventions before content.** Document the "Trap:" callout pattern and structured practical task format *before* generating 90 questions. Retrofitting conventions across 90 files is painful.
- **UI changes (badge, grouping, colors) can happen in parallel with content.** They depend on the schema but not on the actual content files existing yet.
- **Tag filter and Pagefind are fully independent.** Neither depends on the question type system. Can be built in any order, or deferred entirely without blocking v1.1.

## MVP Definition (v1.1 Scope)

### Must Ship

- [ ] Schema update: add `type` field (`basic | deep-technical | trick | practical`) with `.default("basic")` to `content.config.ts`
- [ ] Question type badge in `Flashcard.astro` -- small colored pill showing question type
- [ ] Visual grouping by type in section pages -- subheadings separating basic from advanced types
- [ ] Content conventions document -- patterns for "Trap:" callouts, practical task structure, deep-technical answer depth
- [ ] 90 new bilingual Markdown content files (5 deep-technical + 5 trick + 5 practical per 6 sections)

### Add If Time Permits (v1.1 stretch)

- [ ] Type-specific border accent colors -- low effort (~5 lines), high visual impact
- [ ] Tag filter UI -- schema supports it, PROJECT.md lists as active requirement
- [ ] Pagefind search -- PROJECT.md lists as active, value grows with more content

### Defer (v1.2+)

- [ ] Tag filter UI (if not done in v1.1)
- [ ] Pagefind search (if not done in v1.1)
- [ ] Solidity syntax highlighting -- known v1.0 tech debt, minor impact
- [ ] Keyboard navigation enhancements
- [ ] Print-friendly CSS

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| `type` field in schema | HIGH (enables everything) | LOW (one-line change) | P1 |
| Content conventions document | HIGH (ensures consistency) | LOW (documentation only) | P1 |
| 90 new content files | HIGH (the actual deliverable) | HIGH (content volume) | P1 |
| Type badge in flashcard | HIGH (visual distinction) | LOW (~10 lines) | P1 |
| Visual grouping by type | HIGH (scannable sections) | LOW (~20 lines) | P1 |
| Type-specific border colors | MEDIUM (visual polish) | LOW (~5 lines) | P2 |
| Tag filter UI | MEDIUM (cross-cutting discovery) | MEDIUM (new component + JS) | P2 |
| Pagefind search | MEDIUM (find across sections) | MEDIUM (build integration + UI) | P2 |
| Solidity highlighting fix | LOW (affects ~15 questions) | LOW (config change) | P3 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add if time permits within v1.1
- P3: Nice to have, defer to future milestone

## Content Structure Conventions (for 90 new questions)

### Deep Technical Questions (30 total: 5 per section)
- **Nature:** Require understanding of internals, edge cases, performance characteristics, implementation details
- **Question pattern:** "How does X work internally?", "What happens when Y?", "Explain the difference between X and Y at the implementation level"
- **Answer pattern:** Detailed explanation with code examples, complexity analysis, internal mechanism walkthrough. Longer answers than basic questions (3-5 paragraphs + code).
- **Example (Java):** "What happens internally when you call `HashMap.put()` with a key whose `hashCode()` collides with an existing entry?"
- **Example (SQL):** "How does a database engine execute a query with multiple JOINs? Describe the query execution plan."
- **Example (Kubernetes):** "What happens step-by-step when you run `kubectl apply -f deployment.yaml`?"

### Trick/Gotcha Questions (30 total: 5 per section)
- **Nature:** Questions designed to expose common misconceptions or subtle technical traps that even experienced developers get wrong
- **Question pattern:** "What is the output of this code?", "Is this statement true or false?", "What's wrong with this approach?"
- **Answer pattern:** Start with the common wrong answer using the "Trap:" callout, then explain the correct answer and *why* the misconception exists. Structure: wrong answer -> correct answer -> explanation of the trap.
- **Content convention:** Every trick question answer MUST begin with `**Trap:** Most developers assume...` or similar phrasing that names the misconception before correcting it.
- **Example (SQL):** "Does `WHERE column != NULL` filter out NULL values?" (Trap: it returns zero rows because any comparison with NULL yields NULL, not TRUE)
- **Example (Docker):** "Can you remove a paused container?" (Trap: No, it must be stopped first)
- **Example (Java):** "What does `new String('hello') == new String('hello')` return?" (Trap: false, because `==` compares references)

### Practical Tasks/Scenarios (30 total: 5 per section)
- **Nature:** Real-world problems requiring applied knowledge and problem-solving process, not just recall
- **Question pattern:** "How would you...", "Design a...", "Debug this...", "Your production environment has X problem, walk through your approach"
- **Answer pattern:** Structured multi-part format showing the thought process, not just the final answer
- **Content convention:** Every practical task answer should follow this structure:
  - `**Scenario:**` -- the real-world context and constraints
  - `**Key considerations:**` -- what to think about before jumping to a solution
  - `**Approach:**` -- step-by-step process
  - `**Solution:**` -- concrete code/config/commands example
- **Example (Docker):** "A container keeps restarting in CrashLoopBackOff. Walk through your debugging process."
- **Example (Kubernetes):** "Design a zero-downtime deployment strategy for a stateful application."
- **Example (Automation QA):** "You inherit a flaky test suite with 30% failure rate. How do you stabilize it?"

## Competitor Feature Analysis (Advanced Question Handling)

| Feature | IT Flashcards | DataCamp Guides | InterviewBit | Our Approach |
|---------|---------------|-----------------|--------------|--------------|
| Question type labels | None -- flat list by category | "Basic" / "Advanced" headers | "Easy" / "Medium" / "Hard" tags | Type-specific badges: deep-technical, trick, practical |
| Trick question callouts | Not present | Mentions gotchas inline but inconsistently | Not structured | Explicit "Trap:" pattern in every trick question |
| Practical task structure | Not present | Scenario-based questions but unstructured answers | Some scenario questions | Structured Scenario -> Considerations -> Approach -> Solution |
| Visual distinction | None | Section headers only | Color-coded difficulty dots | Colored badge pills + border accent colors |
| Bilingual advanced content | Not present | English only | English only | Full UA/EN for every advanced question |
| Questions per section | Varies (50-200+) | 26-50 | 30-50+ | 30 per section (15 basic + 15 advanced) -- curated, not exhaustive |

## Sources

- [IT Flashcards](https://www.itflashcards.com/) -- competitor with 2179 questions, category-only organization
- [Tech Interview Handbook](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/) -- cheatsheet structure and best practices
- [DataCamp Docker Interview Questions](https://www.datacamp.com/blog/docker-interview-questions) -- advanced Docker gotcha examples, basic/advanced split
- [DataCamp Kubernetes Interview Questions](https://www.datacamp.com/blog/kubernetes-interview-questions) -- advanced K8s question patterns
- [InterviewBit Kubernetes Questions](https://www.interviewbit.com/kubernetes-interview-questions/) -- hands-on question format
- [hackajob Technical Assessment Guide](https://hackajob.com/talent/technical-assessment) -- interview format trends 2025
- [InterviewQuery SQL Scenario Questions](https://www.interviewquery.com/p/sql-scenario-based-interview-questions) -- scenario-based question structure

---
*Feature research for: Interview Cheatsheet v1.1 Advanced Questions*
*Researched: 2026-03-21*
