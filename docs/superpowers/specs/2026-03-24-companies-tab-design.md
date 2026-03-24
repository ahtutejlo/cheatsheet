# Companies Tab — Design Spec

## Overview

Add a "Companies" tab to the QA Cheatsheet homepage alongside the existing "Questions" tab. The Companies tab provides interview preparation info per company: interview process overview, tips from candidates, and specific questions asked — organized as flashcards grouped by interview stage.

## Navigation & Routing

### Homepage Tabs (client-side, hash-based)
- Two tabs on the homepage below the title: "📝 Питання" and "🏢 Компанії"
- Tab state stored in URL hash (`#companies`) and localStorage
- Default tab: "Питання" (no hash or `#questions`)
- Both grids rendered at build time, one hidden via CSS/JS toggle

### URL Schema
- `/{locale}/` — homepage, Questions tab (default)
- `/{locale}/#companies` — homepage, Companies tab
- `/{locale}/company/{company-slug}/` — individual company page

## Data Model

### Content Collection: `companies`

Location: `src/content/companies/{company-slug}.md`

Frontmatter schema:
```yaml
slug: string              # unique identifier, matches filename
ua_name: string           # company name in Ukrainian
en_name: string           # company name in English
type: enum                # outsource | product | startup | agency
region: enum              # international | ukraine | usa | eu
ua_description: string    # short description in Ukrainian
en_description: string    # short description in English
difficulty: enum          # easy | medium | hard
duration: string          # e.g. "3 weeks"
stages:                   # interview process stages, ordered
  - ua_name: string
    en_name: string
    duration: string      # e.g. "30m", "1h"
tags: string[]            # technologies asked about
ua_tips: string[]         # preparation tips in Ukrainian
en_tips: string[]         # preparation tips in English
```

### Content Collection: `companyQuestions`

Location: `src/content/company-questions/{company-slug}/*.md`

Each question is a separate markdown file. This structure enables AI agents to contribute individual questions without editing existing files.

Frontmatter schema:
```yaml
company: string           # must match a company slug
stage: string             # kebab-case slug derived from en_name of a stage (e.g. "technical-interview")
ua_question: string
en_question: string
ua_answer: string         # markdown, block scalar
en_answer: string         # markdown, block scalar
tags: string[]            # 2-4 tags
order: number             # display order within stage
```

### Why Two Separate Collections
- Company metadata changes rarely; questions are added frequently by different contributors
- AI agents can create a single question file without modifying existing content
- Follows the existing pattern where questions are individual markdown files

## Components

### New Components

**`CompanyCard.astro`** — Company card on the homepage grid
- Company letter-avatar with gradient background
- Company name + type/region subtitle
- Summary line: stages count, duration, difficulty
- Technology tags (colored pills)
- Question count badge (purple)
- 2-column grid layout (vs 3-column for section cards)

**`CompanyHeader.astro`** — Info block at top of company page
- Company name + type/region
- Interview process timeline (stages as connected boxes with arrows)
- Meta info: total duration, difficulty, review count
- Technology tags
- Tips block (amber/yellow callout with bullet list)

### Reused Components
- `Flashcard.astro` — reuse for company questions with minor adaptation (stage color on border-left instead of type color)
- `FlashcardList.astro` — reuse as-is for grouping questions
- `Header.astro` — no changes needed
- `BaseLayout.astro` — no changes needed
- `SearchModal.astro` — no changes, Pagefind indexes company pages automatically

### Modified Components/Pages

**`src/pages/[locale]/index.astro`**
- Add tab switcher UI below the title/subtitle
- Add companies grid (hidden by default)
- Fetch companies collection + company questions for counts
- Client-side JS: tab switching, hash sync, localStorage persistence

### New Pages

**`src/pages/[locale]/company/[company]/index.astro`**
- `getStaticPaths()` generates pages for each (locale, company) pair
- Fetches company data + its questions
- Groups questions by stage
- Renders CompanyHeader + stage-grouped flashcards

## i18n

### New UI Keys (`src/i18n/ui.ts`)
```
tab.questions: "Питання" / "Questions"
tab.companies: "Компанії" / "Companies"
company.stages: "Процес співбесіди" / "Interview Process"
company.duration: "Загалом" / "Total Duration"
company.difficulty: "Складність" / "Difficulty"
company.reviews: "відгуків" / "reviews"
company.tips: "Поради від кандидатів" / "Tips from Candidates"
company.questions_asked: "питань від кандидатів" / "questions from candidates"
company.back: "Назад" / "Back"
difficulty.easy: "Легка" / "Easy"
difficulty.medium: "Середня" / "Medium"
difficulty.hard: "Висока" / "Hard"
type.outsource: "Outsource" / "Outsource"
type.product: "Product" / "Product"
type.startup: "Startup" / "Startup"
type.agency: "Agency" / "Agency"
region.international: "Міжнародна" / "International"
region.ukraine: "Україна" / "Ukraine"
region.usa: "США" / "USA"
region.eu: "Європа" / "Europe"
```

## Colors (`src/lib/colors.ts`)

### Company Card Gradient
Default company card gradient (can be overridden per-company later):
```typescript
const defaultCompanyColor = { gradientFrom: '#f1f5f9', gradientTo: '#e2e8f0' };
```

### Stage Colors
Interview stages use a distinct color to differentiate from question types:
```typescript
const stageColors: Record<string, string> = {
  // Assigned dynamically based on stage index in the company's stages array
  // Colors cycle through a palette to ensure visual distinction
};
```

Stage border colors for flashcards cycle through: blue → green → purple → amber (based on stage index).

## Content Schema (`src/content.config.ts`)

Add two new collection definitions:
- `companies` loader pointing to `src/content/companies/`
- `companyQuestions` loader pointing to `src/content/company-questions/`

Both use glob loader pattern matching existing `questions` collection setup.

## Search Integration

- Company pages include `data-pagefind-body` attribute
- Pagefind indexes company names, descriptions, questions, and answers at build time
- Search results show 🏢 icon prefix for company results (detected by URL pattern `/company/`)

## AI Agent Template

For AI agents contributing company data, the expected workflow:

1. Create `src/content/companies/{slug}.md` with full frontmatter
2. Create `src/content/company-questions/{slug}/` directory
3. Add individual question files: `{slug}/{question-slug}.md`

All fields are explicit in frontmatter — no implicit defaults except `order` (defaults to sequential). The schema is designed to be parseable and generatable by LLMs without ambiguity.
