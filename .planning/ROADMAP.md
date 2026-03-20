# Roadmap: Interview Cheatsheet

## Overview

A three-phase delivery of a static flashcard site for interview preparation. Phase 1 establishes the Astro project, content pipeline, CI/CD, and core flashcard interaction with responsive layout. Phase 2 adds visual polish (dark mode, animations, accents) and populates all 5-7 content sections. Phase 3 layers on UA/EN internationalization with a language toggle and bilingual content. The content file structure supports i18n from Phase 1 to avoid costly rework.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Content Foundation and Core Flashcard UI** - Working flashcard site with content pipeline, CI/CD, responsive layout, and sample content
- [ ] **Phase 2: Design Polish and Full Content** - Dark/light mode, animations, visual accents, and all 5-7 sections populated
- [ ] **Phase 3: Internationalization** - UA/EN language toggle, bilingual content, translated UI elements

## Phase Details

### Phase 1: Content Foundation and Core Flashcard UI
**Goal**: Users can browse sections and interact with click-to-reveal flashcards on a responsive, deployed static site
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, CORE-06, CORE-01, CORE-02, CORE-03, CORE-04, CORE-07, DSGN-03, DSGN-04
**Success Criteria** (what must be TRUE):
  1. User can visit the deployed site and see a home page listing available sections with question counts
  2. User can click a section and see a list of flashcard questions; clicking a flashcard reveals the answer with smooth animation
  3. Answers render Markdown correctly including syntax-highlighted code blocks
  4. User can copy an anchor link to a specific question and share it; opening that link scrolls to and highlights that question
  5. Site is usable on mobile devices (320px+) with readable typography and no horizontal overflow
**Plans:** 3 plans

Plans:
- [ ] 01-01-PLAN.md — Astro 6 project setup, content schema, sample content, CI/CD
- [ ] 01-02-PLAN.md — Layout, i18n utils, home page with section listing
- [ ] 01-03-PLAN.md — Section pages, flashcard UI, Markdown rendering, anchor links

### Phase 2: Design Polish and Full Content
**Goal**: The site has a polished, modern visual identity with dark/light mode and all planned content sections populated
**Depends on**: Phase 1
**Requirements**: DSGN-01, DSGN-02, CORE-05
**Success Criteria** (what must be TRUE):
  1. User can toggle between dark and light mode; the site respects system preference on first visit
  2. UI has visible design polish: accent colors, smooth transitions, and modern aesthetic (not a plain default theme)
  3. All 5-7 planned sections (QA, Automation QA, Java, Kubernetes, Blockchain, Docker, SQL) are present with 15+ questions each
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Internationalization
**Goal**: Users can switch between Ukrainian and English, with all content and UI available in both languages
**Depends on**: Phase 2
**Requirements**: I18N-01, I18N-02, I18N-03
**Success Criteria** (what must be TRUE):
  1. User can toggle between UA and EN on any page; the toggle is visible and accessible on all pages
  2. Switching language shows the same section/question content translated into the selected language
  3. All UI elements (navigation, buttons, labels, headings) display in the selected language
  4. Language preference persists across page navigation within the same session
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Foundation and Core Flashcard UI | 0/3 | Planning complete | - |
| 2. Design Polish and Full Content | 0/0 | Not started | - |
| 3. Internationalization | 0/0 | Not started | - |
