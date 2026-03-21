# Roadmap: Interview Cheatsheet

## Milestones

- v1.0 Interview Cheatsheet MVP - Phases 1-3 (shipped 2026-03-21)
- v1.1 Advanced Questions - Phases 4-6 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>v1.0 Interview Cheatsheet MVP (Phases 1-3) - SHIPPED 2026-03-21</summary>

- [x] Phase 1: Content Foundation and Core Flashcard UI (3/3 plans) - completed 2026-03-20
- [x] Phase 2: Design Polish and Full Content (3/3 plans) - completed 2026-03-21
- [x] Phase 3: Internationalization (1/1 plan) - completed 2026-03-21

</details>

### v1.1 Advanced Questions (In Progress)

**Milestone Goal:** Add 90 advanced questions (deep-technical, trick, practical) to 6 sections with type-based UI grouping and search

- [x] **Phase 4: Infrastructure and UI** - Schema type field, Shiki language fixes, content conventions, type badges, and visual grouping (completed 2026-03-21)
- [ ] **Phase 5: Content Generation** - 90 bilingual advanced questions across 6 sections (15 per section)
- [ ] **Phase 6: Search and Filter** - Full-text search via Pagefind and tag-based filtering

## Phase Details

### Phase 4: Infrastructure and UI
**Goal**: Users see a type-aware question system -- schema supports question types, UI displays type badges and groups questions by type
**Depends on**: Phase 3 (v1.0 complete)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Existing 105 questions render without errors after schema update (backward compatibility via default value)
  2. Solidity and Python code blocks in answers display with proper syntax highlighting
  3. Each flashcard shows a colored type badge (Deep / Trick / Practical) when the question has a non-basic type
  4. Questions on a section page are visually grouped by type (Basic, then Deep, then Trick, then Practical) with a count per type visible
  5. A content conventions document exists that defines the structure for each question type (Trap callout for tricks, Scenario/Approach/Solution for practicals)
**Plans:** 2/2 plans complete

Plans:
- [ ] 04-01-PLAN.md — Schema type field, Shiki solidity/python, i18n keys, content conventions doc
- [ ] 04-02-PLAN.md — TypeBadge component, type grouping on section pages, type count summary

### Phase 5: Content Generation
**Goal**: Users can study 90 new advanced bilingual questions covering deep-technical concepts, common traps, and practical scenarios across 6 sections
**Depends on**: Phase 4
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, CONT-09, CONT-10, CONT-11, CONT-12, CONT-13, CONT-14, CONT-15, CONT-16, CONT-17, CONT-18
**Success Criteria** (what must be TRUE):
  1. Each of the 6 sections (Automation QA, Java, Kubernetes, Blockchain, Docker, SQL) has 15 new questions (5 deep + 5 trick + 5 practical) totaling 30 questions per section
  2. Every new question has both Ukrainian and English versions with consistent quality
  3. Trick questions use the "Trap:" callout pattern to highlight the gotcha before explaining the correct answer
  4. Practical questions follow the Scenario/Approach/Solution structure with realistic scenarios
  5. `astro build` succeeds cleanly with all 195 questions (no YAML errors, no missing fields, no order collisions)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Search and Filter
**Goal**: Users can quickly find specific questions through full-text search and narrow results by topic tags
**Depends on**: Phase 5
**Requirements**: SRCH-01, SRCH-02
**Success Criteria** (what must be TRUE):
  1. User can type a search query and see matching questions and answers from any section in their selected language
  2. User can click a tag on a question to filter the section view to only questions with that tag
  3. Search and filter work correctly with all 195 questions across both UA and EN languages
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 4 -> 5 -> 6

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Content Foundation and Core Flashcard UI | v1.0 | 3/3 | Complete | 2026-03-20 |
| 2. Design Polish and Full Content | v1.0 | 3/3 | Complete | 2026-03-21 |
| 3. Internationalization | v1.0 | 1/1 | Complete | 2026-03-21 |
| 4. Infrastructure and UI | 2/2 | Complete   | 2026-03-21 | - |
| 5. Content Generation | v1.1 | 0/? | Not started | - |
| 6. Search and Filter | v1.1 | 0/? | Not started | - |
