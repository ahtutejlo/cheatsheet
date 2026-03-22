# Content Conventions

Reference for content authors (human or AI) when creating interview questions for the cheatsheet. Follow these conventions to ensure consistency across all sections and question types.

## Frontmatter Schema

Every question file uses this frontmatter structure:

```yaml
---
ua_question: "..."
en_question: "..."
ua_answer: |
  ...
en_answer: |
  ...
section: "section-slug"
order: N
tags: [tag1, tag2]
type: "basic" | "deep" | "trick" | "practical"
---
```

- `type` defaults to `basic` if omitted. All existing v1.0 questions omit it and are treated as basic.
- `ua_answer` and `en_answer` use YAML block scalars (`|`) for multiline Markdown content.
- `section` must match the directory name under `src/content/questions/` (e.g., `java`, `docker`, `sql`).

## Question Types

### Basic

**Default type.** Standard interview questions testing core knowledge.

**Answer structure:**
- Direct explanation in 2-4 paragraphs
- Optionally include a code example illustrating the concept
- No special callouts or formatting patterns required

**Example use:** "What is polymorphism in Java?", "What is a Docker volume?"

### Deep Technical

**Frontmatter:** `type: deep`

Questions probing deep understanding of internals, edge cases, or architecture. These go beyond surface-level definitions into "how" and "why."

**Answer structure:**
1. Start with the core concept (1 paragraph)
2. Dive into implementation details or internal mechanics (1-2 paragraphs)
3. Include code showing internal mechanism or advanced usage
4. End with a "why it matters" statement for interview context

**Example use:** "How does the JVM garbage collector decide what to collect?", "How does Docker overlay networking work across hosts?"

### Trick Questions

**Frontmatter:** `type: trick`

Questions with a common wrong answer, subtle gotcha, or widespread misconception. The answer must explicitly address the trap.

**Answer structure:**
1. Start with a trap callout blockquote:
   > **Trap:** {the common misconception or wrong answer}
2. Explain the correct answer (1-2 paragraphs)
3. Include code demonstrating the trap vs correct behavior
4. Optionally note why this misconception is so common

**Example use:** "Is Java pass-by-reference or pass-by-value?", "Does `docker stop` send SIGKILL?"

### Practical Scenarios

**Frontmatter:** `type: practical`

Real-world problem-solving questions presenting a situation and asking for a solution approach.

**Answer structure:**
1. **Scenario:** Describe a realistic situation the candidate might face
2. **Approach:** Outline the solution strategy in 2-3 steps
3. **Solution:** Provide concrete code or configuration that solves the problem

**Example use:** "How would you debug a memory leak in a Java application?", "Design a Docker Compose setup for a microservices app."

## File Naming

Question files live under `src/content/questions/{section}/{slug}.md`.

- Use kebab-case for the slug: `garbage-collector-internals.md`, `docker-overlay-networking.md`
- The slug should reflect the question topic, not the question number
- One question per file

## Order Field

The `order` field controls display sequence within a section.

- **Existing v1.0 sections** (Java, Docker, Kubernetes, Blockchain, SQL) use orders 1-15 for basic questions, 16+ for advanced
- **New sections** (Python, Playwright, Performance Testing) start ordering at 1 since they have no legacy content
- For v1.0 sections, allocate advanced order ranges by type:
  - 16-20 for `deep` questions
  - 21-25 for `trick` questions
  - 26-30 for `practical` questions

## Tags

Tags are lowercase, hyphenated strings describing the topic. Each question should have 2-4 tags.

Follow existing section-specific conventions:

| Section | Example Tags |
|---------|-------------|
| Java | `concurrency`, `collections`, `jvm`, `oop`, `generics` |
| Docker | `networking`, `volumes`, `security`, `compose`, `images` |
| Kubernetes | `pods`, `services`, `scaling`, `storage`, `networking` |
| SQL | `joins`, `indexes`, `transactions`, `optimization` |
| Blockchain | `consensus`, `smart-contracts`, `solidity`, `evm` |
| QA | `testing-strategies`, `automation`, `test-design` |
| Python | `core-language`, `oop`, `pytest`, `fixtures`, `async`, `api-testing`, `typing` |
| Playwright | `selectors`, `auto-waiting`, `network`, `ci-cd`, `visual-regression`, `pom` |
| Performance Testing | `load-testing`, `metrics`, `locust`, `bottleneck-analysis`, `ci-cd`, `monitoring` |

## Bilingual Content Rules

1. **Both UA and EN versions are mandatory.** Every question must have `ua_question`, `en_question`, `ua_answer`, and `en_answer`.
2. **Answers should be substantive:** 3-6 paragraphs with code examples where applicable.
3. **Code examples are identical in both languages.** Do not translate variable names, comments in code, or class names.
4. **Explanatory text is translated, not transliterated.** Use natural Ukrainian phrasing, not word-for-word transliteration from English.
5. **Technical terms** may remain in English when that is the standard in Ukrainian tech discourse (e.g., "Docker", "Kubernetes", "JVM"), but explanations around them should be in Ukrainian.
