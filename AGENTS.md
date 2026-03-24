# AI Agent Guide

Instructions for AI agents contributing content to this project.

## Project Overview

A static Astro site for QA interview preparation. Two types of content:
1. **Questions** — flashcards grouped by tech topic (Java, Docker, etc.)
2. **Companies** — interview profiles with process details and real questions asked

## Adding a Company

### 1. Create company profile

File: `src/content/companies/{slug}.md`

```yaml
---
slug: "company-slug"
ua_name: "Назва компанії"
en_name: "Company Name"
type: "outsource"              # outsource | product | startup | agency
region: "international"        # international | ukraine | usa | eu
ua_description: "Короткий опис українською"
en_description: "Short description in English"
difficulty: "medium"           # easy | medium | hard
duration: "3 weeks"
stages:
  - ua_name: "HR скринінг"
    en_name: "HR Screening"
    duration: "30m"
  - ua_name: "Технічне інтерв'ю"
    en_name: "Technical Interview"
    duration: "1h"
tags: [java, automation, sql]
ua_tips:
  - "Порада українською"
en_tips:
  - "Tip in English"
---
```

### 2. Add interview questions

File: `src/content/company-questions/{company-slug}/{question-slug}.md`

```yaml
---
company: "company-slug"
stage: "technical-interview"   # kebab-case of stage en_name
ua_question: "Питання українською"
en_question: "Question in English"
ua_answer: |
  Відповідь в markdown форматі.
  Підтримуються блоки коду з підсвіткою синтаксису.
en_answer: |
  Answer in markdown format.
  Code blocks with syntax highlighting are supported.
tags: [tag1, tag2]
order: 1
---
```

### Stage Slug Convention

The `stage` field in questions must be the kebab-case version of the stage's `en_name`:
- "HR Screening" → `hr-screening`
- "Technical Interview" → `technical-interview`
- "Live Coding" → `live-coding`
- "Final Interview" → `final-interview`

### Validation Rules

- `company` must match an existing company slug in `src/content/companies/`
- `stage` must correspond to a stage defined in the company's `stages` array
- Both UA and EN fields are mandatory
- `tags` should have 2-4 entries, lowercase, hyphenated
- `order` determines display sequence within a stage (start from 1)
- Code examples must be identical in both languages (don't translate code)

## Adding Questions (tech sections)

Questions are flashcards grouped by tech topic. Each question is a separate markdown file.

### File location

`src/content/questions/{section-slug}/{question-slug}.md`

Available sections: `qa`, `java`, `docker`, `automation-qa`, `python`, `playwright`, `performance-testing`, `kubernetes`, `blockchain`, `sql`

### Template

```yaml
---
ua_question: "Питання українською"
en_question: "Question in English"
ua_answer: |
  Відповідь в markdown форматі.

  **Підтримується:**
  - Markdown розмітка
  - Блоки коду з підсвіткою синтаксису
  - Callout-блоки (Trap, Note, Key)

  ```java
  // Code example — identical in both languages
  public class Example {}
  ```
en_answer: |
  Answer in markdown format.

  **Supported:**
  - Markdown formatting
  - Syntax-highlighted code blocks
  - Callout blocks (Trap, Note, Key)

  ```java
  // Code example — identical in both languages
  public class Example {}
  ```
section: "java"
order: 31
tags: [concurrency, threads]
type: "basic"
---
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `ua_question` | yes | Question text in Ukrainian |
| `en_question` | yes | Question text in English |
| `ua_answer` | yes | Answer in Ukrainian (markdown, use `\|` block scalar) |
| `en_answer` | yes | Answer in English (markdown, use `\|` block scalar) |
| `section` | yes | Must match directory name under `src/content/questions/` |
| `order` | yes | Display order within section (see below) |
| `tags` | yes | 2-4 lowercase hyphenated tags |
| `type` | no | `basic` (default), `deep`, `trick`, or `practical` |

### Question types

- **basic** — standard interview question (default if omitted)
- **deep** — probes internals, edge cases, architecture. Answer: concept → implementation details → code → "why it matters"
- **trick** — has a common wrong answer. Answer must start with: `> **Trap:** {misconception}`
- **practical** — real-world scenario. Answer structure: Scenario → Approach → Solution with code

### Order ranges

For existing sections (Java, Docker, Kubernetes, Blockchain, SQL):
- `1-15` — basic questions
- `16-20` — deep questions
- `21-25` — trick questions
- `26-30` — practical questions
- `31+` — new questions (pick next available)

For newer sections (Python, Playwright, Performance Testing, QA, Automation QA): sequential from 1, grouped logically.

**To find the next available order:** check existing files in the section directory and pick the next number.

### Tags by section

| Section | Example tags |
|---------|-------------|
| java | `concurrency`, `collections`, `jvm`, `oop`, `generics` |
| docker | `networking`, `volumes`, `security`, `compose`, `images` |
| kubernetes | `pods`, `services`, `scaling`, `storage`, `networking` |
| sql | `joins`, `indexes`, `transactions`, `optimization` |
| blockchain | `consensus`, `smart-contracts`, `solidity`, `evm` |
| qa | `testing-strategies`, `automation`, `test-design` |
| python | `core-language`, `oop`, `pytest`, `fixtures`, `async`, `api-testing` |
| playwright | `selectors`, `auto-waiting`, `network`, `ci-cd`, `pom` |
| performance-testing | `load-testing`, `metrics`, `locust`, `bottleneck-analysis` |

### File naming

- Use kebab-case: `garbage-collector-internals.md`, `docker-overlay-networking.md`
- Name should reflect the topic, not the order number
- One question per file

### Bilingual rules

- Both UA and EN fields are **mandatory**
- Answers should be substantive: 3-6 paragraphs with code examples
- Code examples are **identical** in both languages — do not translate code
- Technical terms (Docker, JVM, Kubernetes) stay in English; explanations are in Ukrainian

See `CONTENT_CONVENTIONS.md` for detailed formatting conventions and answer structure per question type.

## Build & Verify

```bash
npm install
npm run build    # must complete without errors
npm run preview  # check your content at http://localhost:4321
```
