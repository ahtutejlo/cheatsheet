# Phase 1: Content Foundation and Core Flashcard UI - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Working flashcard site with content pipeline, CI/CD, responsive layout, and sample content. Users can browse sections and interact with click-to-reveal flashcards on a responsive, deployed static site. Includes Astro project setup, Markdown content pipeline with Zod schema validation, CI/CD deployment, core flashcard interaction, anchor links to questions, and mobile-responsive layout with clean typography.

</domain>

<decisions>
## Implementation Decisions

### Content file structure
- **Co-located content**: both languages (UA/EN) stored in a single Markdown file per question, with language-specific fields in frontmatter
- Prevents translation drift — no possibility of UA and EN versions silently diverging
- Structure: `src/content/questions/{section}/{question-slug}.md`
- Frontmatter contains `ua.question`, `ua.answer`, `en.question`, `en.answer` fields

### File organization
- One file = one question (granular, easy to add/remove individual questions)
- Files grouped by section directory: `questions/qa/`, `questions/java/`, etc.

### Question ordering
- Explicit `order` field in frontmatter controls display order within a section
- Allows easy insertion of new questions between existing ones

### Default language
- Ukrainian (ua) is the default language on first visit
- Root URL `/` redirects to `/ua/`

### Claude's Discretion
- Exact frontmatter schema fields beyond the decided ones (id, section, tags, order, ua/en content)
- Zod schema implementation details
- CI/CD platform choice (GitHub Pages / Vercel / Netlify)
- Flashcard visual design, animation style, and interaction details
- Home page layout and section card design
- Sample content: which sections to include and how many questions per section
- Deployment configuration

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project research
- `.planning/research/SUMMARY.md` — Stack decisions (Astro 6, Tailwind 4, Pagefind), architecture approach, critical pitfalls
- `.planning/research/ARCHITECTURE.md` — Component structure, content collections setup, routing
- `.planning/research/STACK.md` — Technology choices with version constraints (Node 22+, Zod 4)
- `.planning/research/PITFALLS.md` — Translation drift prevention, frontmatter schema validation, FlexSearch Cyrillic issue
- `.planning/research/FEATURES.md` — Feature prioritization, competitor analysis

### Project definition
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — CORE-01 through CORE-07, INFR-01 through INFR-03, DSGN-03, DSGN-04 requirements for this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — this is a greenfield project. Astro project will be initialized from scratch.

### Established Patterns
- No established patterns yet — Phase 1 defines them.

### Integration Points
- Content Collections (`src/content/`) will be the foundation for all subsequent phases
- Frontmatter schema defined here constrains search (Phase 2+) and i18n UI (Phase 3)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for flashcard UI, home page, and deployment.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-content-foundation-and-core-flashcard-ui*
*Context gathered: 2026-03-20*
