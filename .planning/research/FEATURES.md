# Feature Research

**Domain:** Interview Q&A cheatsheet / flashcard static site
**Researched:** 2026-03-20
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Category/section browsing | Users expect questions organized by topic (QA, Java, Docker, etc.). Every competitor does this. | LOW | Simple route-per-section. PROJECT.md already specifies 5-7 sections. |
| Click-to-reveal answers (flashcard interaction) | Core interaction pattern. Users expect to see the question first, then reveal the answer on click/tap. Active recall is the entire value proposition. | LOW | Accordion or card-flip pattern. Accordion is simpler and works better for text-heavy answers with code blocks. |
| Mobile responsiveness | Over 50% of users will study on phones during commute/waiting. Non-negotiable for a study tool. | MEDIUM | Must work well at 320px+. Flashcard tap targets need to be large enough. |
| Full-text search | Users need to find specific questions across all sections. IT Flashcards, Quizlet, and every serious reference site has search. | MEDIUM | Client-side search (Fuse.js, Pagefind, or Lunr) since static site. Must index both questions and answers. |
| Clean typography and code formatting | Technical Q&A requires proper code blocks with syntax highlighting. Markdown answers with code snippets are useless without this. | LOW | Markdown rendering with syntax highlighting (Shiki or Prism). Table stakes for any developer-facing content site. |
| Fast page loads | Static site should load near-instantly. Users comparing against devhints.io and similar expect sub-second loads. | LOW | Inherent to static sites if done correctly. Avoid client-side rendering bottlenecks. |
| Permalink/shareable URLs | Users share specific questions with friends or bookmark them. Without deep links, the site feels broken. | LOW | Each section needs its own URL at minimum. Anchor links to individual questions are ideal. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| UA/EN language toggle | Most interview prep sites are English-only. Ukrainian localization serves an underserved audience and helps users prep for both Ukrainian and English interviews. | MEDIUM | Each question needs both language versions in Markdown. Toggle switches all content, not just UI chrome. Already in PROJECT.md requirements. |
| Tag-based cross-cutting filtering | Questions tagged by concept (e.g., "concurrency", "networking") let users study across sections. A question in Java and Kubernetes might both be tagged "networking." Goes beyond simple category browsing. | MEDIUM | Tags stored in Markdown frontmatter. Filter UI on section pages. Tag index page showing all tags. |
| Modern dark mode with design polish | Most open-source cheatsheet sites (devhints.io, GitHub gists, Tech Interview Handbook) look utilitarian. A polished, modern design with dark mode, smooth animations, and visual hierarchy makes studying more pleasant and builds trust. | MEDIUM | CSS custom properties for theming. Respect system preference, allow manual toggle. Already in PROJECT.md requirements. |
| Keyboard navigation | Power users studying intensively want to navigate with keyboard: arrow keys to move between questions, Enter/Space to reveal answers. | LOW | Event listeners on question list. Low effort, high perceived quality. |
| "Expand all / Collapse all" toggle | When reviewing (not testing yourself), users want to read through all Q&A without clicking each one. | LOW | Simple state toggle. Tiny feature, big convenience. |
| Anchor links to individual questions | Share or bookmark a specific question (e.g., `/java#what-is-jvm`). Most flashcard sites only link to categories. | LOW | Generate ID from question text. Add copy-link button on hover. |
| Print-friendly / export view | Some users want to print cheatsheets or save as PDF for offline study. | LOW | CSS `@media print` stylesheet. Hide nav, expand all answers, clean layout. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts and progress tracking | "I want to track which questions I've studied" | Requires backend, auth, database. Breaks the static site constraint. Massively increases complexity and hosting cost for a v1. | Use browser localStorage to mark questions as "reviewed" -- no auth needed. Or defer entirely; the site's value is the content, not tracking. |
| Quiz mode with multiple-choice answers | "Test me on the material" | Requires generating plausible wrong answers for every question. Enormous content effort. Multiple-choice also encourages recognition over recall, which is pedagogically weaker than flashcards. Already explicitly out of scope in PROJECT.md. | Stick with click-to-reveal flashcards. Active recall (try to answer before revealing) is more effective than multiple choice. |
| Spaced repetition (SRS) algorithm | "Show me questions I'm weakest on" | Requires persistent state (user accounts or complex localStorage), scheduling logic, and fundamentally changes the architecture from "reference site" to "learning app." Scope explosion. | The site is a cheatsheet, not Anki. Users who want SRS already use Anki. Focus on being the best reference/study content. |
| User-submitted questions / community content | "Let users contribute questions" | Moderation burden, spam, quality control, needs backend for submissions. Content quality drops fast without curation. | Accept contributions via GitHub PRs on the Markdown files. Git is the CMS. Community can contribute through the repo. |
| Difficulty levels (Junior/Middle/Senior) | "Categorize questions by experience level" | Subjective and contentious. What's "senior" for one company is "mid" for another. Creates arguments, not value. Already explicitly out of scope in PROJECT.md. | Use tags instead. Tag questions with concepts, and let users self-select what to study. |
| Comments / discussion on questions | "Let users discuss answers" | Requires backend, moderation. Discussions become outdated. Distracts from the core value of quick reference. | Link to relevant documentation or resources in the answer itself. |
| CMS admin panel | "Make it easier to add content" | Adds significant complexity. The content workflow is already simple: edit Markdown, push to git, site rebuilds. A CMS is overhead for a site maintained by 1-2 people. Already out of scope in PROJECT.md. | Git + Markdown + CI/CD is the CMS. |

## Feature Dependencies

```
[Markdown content files]
    |-- requires --> [Markdown parser + syntax highlighting]
    |                   |-- requires --> [Section pages with flashcard rendering]
    |                                       |-- enhances --> [Click-to-reveal interaction]
    |                                       |-- enhances --> [Expand all / Collapse all]
    |                                       |-- enhances --> [Keyboard navigation]
    |
    |-- requires --> [Frontmatter parsing (tags, language)]
                        |-- enables --> [Tag filtering]
                        |-- enables --> [UA/EN language toggle]

[Full-text search]
    |-- requires --> [Search index built from all Markdown content]
    |-- requires --> [Section pages exist to link results to]

[Dark mode]
    |-- independent (CSS-only, no content dependency)

[Anchor links to questions]
    |-- requires --> [Section pages with individual question IDs]

[Print view]
    |-- requires --> [Section pages rendered]
```

### Dependency Notes

- **Section pages require Markdown parsing:** Content pipeline (Markdown to HTML) must be built first. Everything else layers on top.
- **Tags require frontmatter:** Tag filtering depends on structured metadata in Markdown files. Define the frontmatter schema early.
- **Language toggle requires dual content:** Every question must have UA and EN versions. This is a content structure decision that affects Markdown file format from day one.
- **Search requires content index:** Full-text search needs a pre-built index. Choose the search library early since it affects the build pipeline.
- **Dark mode is independent:** Can be added at any point since it is purely CSS theming.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what is needed to validate the concept.

- [x] Home page with section list -- entry point, shows what topics are available
- [x] Section pages with flashcard Q&A -- the core value: questions with click-to-reveal answers
- [x] Markdown content pipeline -- content stored in Markdown, rendered to HTML at build time
- [x] Syntax highlighting in code blocks -- technical answers are useless without this
- [x] Mobile responsive layout -- must work on phones from day one
- [x] 3-4 sections with 15-20 questions each -- enough content to be useful, not so much it delays launch
- [x] Basic dark/light mode -- modern expectation, low effort with CSS custom properties

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Full-text search -- add once there are enough questions to make browsing insufficient
- [ ] UA/EN language toggle -- add once UA content is written (can launch English-only first)
- [ ] Tag filtering -- add once questions have tags in frontmatter and there are enough cross-cutting topics
- [ ] Anchor links to individual questions -- add when users start sharing specific questions
- [ ] Expand all / Collapse all -- add based on user feedback about study workflow
- [ ] Keyboard navigation -- polish feature, add when core UX is solid

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Print-friendly CSS -- low priority, add if users request it
- [ ] localStorage "reviewed" markers -- only if users want progress tracking
- [ ] PWA offline support -- only if mobile usage is significant
- [ ] AI-generated practice explanations -- scope creep, defer indefinitely

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Section pages with flashcards | HIGH | LOW | P1 |
| Markdown content pipeline | HIGH | MEDIUM | P1 |
| Syntax highlighting | HIGH | LOW | P1 |
| Mobile responsive | HIGH | MEDIUM | P1 |
| Dark/light mode | MEDIUM | LOW | P1 |
| Home page with sections | HIGH | LOW | P1 |
| Full-text search | HIGH | MEDIUM | P2 |
| UA/EN language toggle | HIGH | MEDIUM | P2 |
| Tag filtering | MEDIUM | MEDIUM | P2 |
| Anchor links to questions | MEDIUM | LOW | P2 |
| Expand/Collapse all | MEDIUM | LOW | P2 |
| Keyboard navigation | LOW | LOW | P3 |
| Print CSS | LOW | LOW | P3 |
| localStorage progress | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | IT Flashcards | devhints.io | Tech Interview Handbook (GitHub) | Our Approach |
|---------|---------------|-------------|----------------------------------|--------------|
| Content organization | 30+ tech categories | Flat cheatsheet list | Markdown chapters | Sections with tag cross-referencing |
| Flashcard interaction | Flip card + quiz | None (reference only) | None (article format) | Click-to-reveal accordion |
| Search | Category filter | Browser search only | GitHub search | Client-side full-text search |
| Language support | 20+ languages | English only | English only | UA/EN toggle (underserved niche) |
| Dark mode | No | No | GitHub default | Yes, with system preference detection |
| Code formatting | Basic | Good (Kramdown) | GitHub Markdown | Syntax-highlighted code blocks |
| Progress tracking | Quiz results | None | None | None (static site, intentionally omitted) |
| Mobile experience | Good (has apps) | Passable | GitHub mobile | Designed mobile-first |
| Design quality | Functional, dated | Clean, minimal | GitHub default | Modern, polished, animated |
| Content source | Curated editorial | Community Markdown | Curated editorial | AI-generated, Markdown in git |

**Key competitive advantages:**
1. **UA/EN bilingual** -- no major competitor serves Ukrainian-speaking developers
2. **Modern design polish** -- most competitors look utilitarian; good design builds trust and makes studying pleasant
3. **Focused simplicity** -- not trying to be LeetCode or Anki; just a clean, fast Q&A reference

## Sources

- [IT Flashcards](https://www.itflashcards.com/) -- primary competitor with 2100+ questions, 30+ categories, 20+ languages
- [devhints.io](https://devhints.io) -- developer cheatsheet reference site, clean minimal design
- [Tech Interview Handbook](https://github.com/yangshun/tech-interview-handbook) -- popular open-source interview prep (GitHub)
- [Tech Interview Cheat Sheet](https://github.com/tsiege/Tech-Interview-Cheat-Sheet) -- open-source cheat sheet
- [Design Gurus - Coding Interview Cheatsheet](https://www.designgurus.io/blog/coding-interview-cheatsheet) -- comprehensive coding interview prep
- [IGotAnOffer - Best Coding Interview Sites 2026](https://igotanoffer.com/en/advice/best-coding-interview-sites) -- platform comparison
- [Skillora - Interview Preparation Websites 2026](https://skillora.ai/blog/interview-preparation-websites) -- market overview
- [UI Patterns - FAQ Design Pattern](https://ui-patterns.com/patterns/frequently-asked-questions-faq) -- UX best practices for Q&A

---
*Feature research for: Interview Q&A cheatsheet static site*
*Researched: 2026-03-20*
