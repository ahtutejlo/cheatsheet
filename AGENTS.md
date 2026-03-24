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

## Adding Questions (existing sections)

See `CONTENT_CONVENTIONS.md` for the question format used in tech topic sections (Java, Docker, etc.).

## Build & Verify

```bash
npm install
npm run build    # must complete without errors
npm run preview  # check your content at http://localhost:4321
```
