# Pitfalls Research

**Domain:** Adding 90 advanced bilingual interview questions to an existing Astro 6 static site
**Researched:** 2026-03-21
**Confidence:** HIGH (based on direct codebase analysis of existing content pipeline, schema, and rendering)

## Critical Pitfalls

### Pitfall 1: YAML Frontmatter Breakage in Bilingual Multiline Content

**What goes wrong:**
The content schema requires `ua_question`, `en_question`, `ua_answer`, `en_answer` as YAML frontmatter fields using block scalar syntax (`|`). Advanced questions contain colons, quotes, backticks, triple-backtick code blocks, and Ukrainian special characters inside YAML values. Any YAML syntax error in a single file breaks the entire Astro build -- not just that question -- because the glob loader validates all files in the collection at once via the Zod schema in `src/content.config.ts`.

**Why it happens:**
AI-generated content frequently produces unescaped YAML special characters. A colon followed by a space inside a value, an unindented line in a multiline block, or a tab character all corrupt YAML parsing. With 90 files x 4 multiline fields each (360 field values total), even a 1% error rate means 3-4 broken files per batch. Triple-backtick code blocks inside YAML block scalars are especially fragile -- the backticks must be properly indented within the YAML block.

**How to avoid:**
- Always use YAML block scalar syntax (`|`) for all answer and question fields, never inline strings.
- Ensure consistent 2-space indentation for all content within block scalars.
- Validate every generated file before committing: parse YAML and check against the Zod schema.
- Generate a small batch (3-5 files), run `astro build`, verify. Then scale up.
- Watch specifically for: tabs (must be spaces), bare `---` inside answer content (conflicts with YAML document separators), and unindented lines breaking out of block scalars.

**Warning signs:**
`astro build` fails with cryptic YAML parse errors. Error messages may point to line numbers but not clearly identify the offending file among 90+ new files.

**Phase to address:**
Content generation phase -- build validation into the generation workflow before any bulk content creation.

---

### Pitfall 2: Order Number Collisions Within Sections

**What goes wrong:**
Each section currently has 15 questions numbered `order: 1` through `order: 15`. Adding 15 new questions per section requires `order: 16` through `order: 30`. If AI generates files with order numbers that collide with existing ones (starting from 1, or using arbitrary numbers), two questions with the same order in one section produce unpredictable sort order because the sort in `src/pages/[locale]/[section]/index.astro` uses `.sort((a, b) => a.data.order - b.data.order)` which is unstable for equal values.

**Why it happens:**
Content generated in separate AI sessions loses track of existing numbering. Each batch may restart numbering from 1 or use gaps. With 6 sections x 15 new questions, the probability of at least one collision is high without explicit tracking.

**How to avoid:**
- Before generating content for any section, check existing order numbers: `grep "^order:" src/content/questions/{section}/*.md | sort -t: -k3 -n`.
- Assign order numbers explicitly in the generation prompt: "Use order 16 through 30 for this section."
- Add a build-time validation script that checks for duplicate `order` values within each section and fails the build if found.

**Warning signs:**
Questions appearing in wrong order on section pages. New questions interspersed randomly with existing ones instead of appearing after them.

**Phase to address:**
Content preparation phase -- establish numbering convention and validate before creating any files.

---

### Pitfall 3: Shiki Language Registration Gaps for Advanced Content

**What goes wrong:**
The custom `renderMarkdown()` function in `src/lib/markdown.ts` initializes Shiki with a fixed language list: `['java', 'javascript', 'typescript', 'sql', 'bash', 'yaml', 'json', 'dockerfile']`. Advanced questions will introduce code blocks in languages not on this list. Already broken: `solidity` (4 existing blocks in blockchain section) and `gherkin` (2 existing blocks in automation-qa section -- used in BDD/Cucumber content). Advanced questions will likely need: `python`, `kotlin`, `groovy` (Automation QA), `go` (Kubernetes), `xml` (Java/Spring), `toml` (Docker Compose v2).

The `codeToHtml()` call has a try/catch fallback that renders unrecognized languages as plain unstyled text. This means missing languages do not crash the build -- they silently degrade to monochrome text without syntax highlighting. For "advanced" technical content, unhighlighted code blocks are a significant quality problem.

**Why it happens:**
The language list was set during v1.0 for the original 105 questions. The fallback silently hides the problem, so nobody notices until someone inspects the rendered output.

**How to avoid:**
- Audit all code block languages in existing content: `grep -r '^\`\`\`' src/content/questions/ | grep -o '\`\`\`[a-z]*' | sort -u`.
- Add every language used to the `langs` array in `src/lib/markdown.ts`.
- Fix the known tech debt immediately: add `solidity` and `gherkin`.
- After generating new content, re-run the audit and add any new languages before building.

**Warning signs:**
Code blocks on the site render without color highlighting -- monochrome text on a flat background instead of syntax-colored code.

**Phase to address:**
Infrastructure prep phase -- update Shiki config before adding any content. This is a prerequisite, not a follow-up.

---

### Pitfall 4: Filename/Slug Collisions Between New and Existing Questions

**What goes wrong:**
Astro content collection entry IDs are derived from file paths (`{section}/{filename}`). The slug used for anchor links is extracted in the section page as `q.id.split('/').pop()`. If a new advanced question reuses a filename that already exists (e.g., `docker-security.md` already exists and a new "advanced Docker security" question also uses `docker-security.md`), the content collection will either fail to build or produce undefined behavior with duplicate IDs.

**Why it happens:**
Advanced questions often cover the same topics as existing ones at deeper depth. Natural naming leads to collisions: the existing `docker-security.md` and a new "deep dive into Docker security" both want the same filename.

**How to avoid:**
- Adopt a naming convention that distinguishes question types. Prefix all advanced question filenames: `deep-`, `trick-`, `practical-` (e.g., `deep-docker-security.md`, `trick-sql-null-comparison.md`, `practical-k8s-pod-debugging.md`).
- Before generating, list all existing filenames per section to provide as context to the AI generator.
- This naming convention also makes it trivial to filter or identify question types later when tags/search are implemented.

**Warning signs:**
`astro build` fails with "duplicate content entry" errors. Anchor links on the page point to wrong questions.

**Phase to address:**
Content preparation phase -- establish naming convention before creating files.

---

### Pitfall 5: Translation Semantic Drift in Trick Questions

**What goes wrong:**
The co-located bilingual format (both languages in one file) prevents structural drift. But semantic drift is the real risk for advanced content: the UA and EN versions of a trick question may have different "trick" mechanisms. A subtle wording difference can make the English version trivially obvious while the Ukrainian version is properly deceptive, or vice versa. For practical tasks, the expected solution approach may differ between languages if the problem statement is not precisely parallel.

**Why it happens:**
AI generates both languages simultaneously but handles technical nuance differently per language. Ukrainian technical vocabulary is less standardized for advanced concepts (e.g., "reentrancy attack" in blockchain, "phantom read" in SQL, "resource quota" in Kubernetes). The reviewer may only carefully check one language version.

**How to avoid:**
- Review trick questions in both languages side-by-side, specifically verifying the "trap" mechanism works identically in both.
- Keep code blocks identical between UA and EN answers -- only translate the prose explanation around them.
- Establish a glossary of key technical terms with their canonical Ukrainian translations and enforce it across all content.
- For practical tasks, verify the problem statement describes the same scenario in both languages.

**Warning signs:**
One language version has significantly more or less content than the other. Code examples differ between UA and EN answers for the same question. A trick question is obvious in one language but not the other.

**Phase to address:**
Content review phase -- require bilingual review for every question, especially trick questions.

---

### Pitfall 6: Flat List UX Collapse at 30 Questions Per Section

**What goes wrong:**
Going from 15 to 30 questions per section doubles the page length. The current UI renders all questions in a flat `<div class="flex flex-col gap-3">` with no visual grouping. Users scrolling through 30 flashcards cannot distinguish basic from advanced questions, find the section they need, or understand the progression. The page becomes an overwhelming wall of collapsed cards.

**Why it happens:**
The v1.0 design worked well for 15 questions -- a manageable list that fits in a few scroll lengths. The architecture (FlashcardList component iterating over a flat array) has no concept of sub-groups or visual separators. Doubling content without UI adaptation creates a quantity-over-quality feel.

**How to avoid:**
- Add a visual separator or section header between the original 15 and the new 15 advanced questions (e.g., "Advanced Questions" divider).
- Use the `order` numbering gap (1-15 basic, 16-30 advanced) to programmatically insert a divider in FlashcardList.
- Consider adding question type badges (deep / trick / practical) to each flashcard summary line.
- If tags are implemented in v1.1, add a filter bar at the top of each section page.

**Warning signs:**
User testing reveals people scroll past content without engaging. Users cannot find specific questions they previously read. Section pages feel "too long."

**Phase to address:**
UI enhancement phase -- should be planned alongside content addition, not as an afterthought. The content and UI work should ship together.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| No question `type` field in frontmatter (deep/trick/practical) | No schema changes needed | Cannot filter or visually distinguish question types without re-tagging all 90 files | Never -- add a `type` field to the schema before generating content |
| Hardcoded Shiki language list | Simple config | Every new content language requires a code change to `src/lib/markdown.ts` | Only acceptable if audit is done before each content batch |
| No build-time content validation CI step | Faster CI pipeline | Broken YAML or schema violations ship to production on push to main | Never -- add validation before bulk-adding 90 files to a CI/CD auto-deploy pipeline |
| Global `marked.setOptions()` in renderMarkdown | Quick setup | Mutates global state, could cause issues with concurrent rendering | Acceptable at current scale (build-time only, sequential) |
| No `type` or difficulty metadata | Fewer fields per file | Cannot distinguish basic vs advanced vs trick in the UI or search | Never for v1.1 -- the whole point is adding categorized advanced content |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Astro Content Collections (glob loader) | One broken file with invalid frontmatter fails the entire collection, not just that file | Validate each file independently against the Zod schema before committing; use a pre-commit hook or CI step |
| Shiki syntax highlighting | Using language identifiers that do not match Shiki grammar names (`sh` vs `bash`, `sol` vs `solidity`) | Check Shiki's supported language list; use canonical names; test with `astro build` |
| GitHub Pages CI/CD auto-deploy | Pushing 90 new files at once with a broken file deploys nothing (build fails) or deploys stale content | Build locally first; push in verified batches; or add a staging step |
| Marked + Shiki rendering pipeline | Nested code blocks (triple backticks inside triple backticks) break the Marked parser | Ensure AI-generated content never contains nested fenced code blocks; use indented code blocks for "code about code" if needed |
| Zod schema defaults | `tags: z.array(z.string()).default([])` means empty tags pass validation silently | If tags are meant to be required for new content, update the schema or add a separate check |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| All 30 questions rendered on single section page | Increased HTML payload, slower FCP on mobile | Monitor page sizes after content addition; add pagination only if >500KB per page | ~50+ questions with heavy code blocks per section |
| Shiki dual-theme output doubles code block HTML | Each code block emits two color sets via CSS variables | Already using CSS variable approach (optimal for this); no action needed | Not a concern at 30 questions per section |
| Build time scaling with Shiki renders | `astro build` slowing from seconds to minutes | The singleton `createHighlighter` pattern is already in place; bottleneck is `codeToHtml()` calls | Likely still under 30s for 195 total questions; monitor |
| Loading all language content for both UA and EN | Both languages rendered at build time but only one visible | This is the correct approach for a static site with client-side language toggle; no performance concern | N/A -- both are needed |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 30 questions in flat list with no grouping | Users overwhelmed, cannot find what they need | Visual divider between basic (1-15) and advanced (16-30) questions |
| Trick questions with no visual indicator | Users may memorize a wrong interpretation thinking it is straightforward | Label trick questions with a badge or icon so users know to read carefully |
| Long advanced answers pushing content below fold | Users scroll endlessly inside a single expanded flashcard | Keep answers concise; for multi-part answers, use headers within the answer |
| Abrupt difficulty jump from question 15 to 16 | Users confused by sudden shift from basic to advanced | Add a clear "Advanced" section header between basic and advanced blocks |
| Question count display says "30 questions" with no context | Users intimidated by volume, no sense of structure | Show count breakdown: "15 fundamentals, 15 advanced" or similar |

## "Looks Done But Isn't" Checklist

- [ ] **Every file has all 4 language fields:** `ua_question`, `en_question`, `ua_answer`, `en_answer` -- verify no field is empty string or missing
- [ ] **Order numbers are unique per section:** Run `grep "^order:" src/content/questions/{section}/*.md | sort -t: -k3 -n` for each section, confirm no duplicates
- [ ] **Order numbers are sequential 16-30:** New questions should not use orders 1-15 (existing) or skip numbers
- [ ] **Code blocks have syntax highlighting:** View every section page and verify code blocks are colored, not plain monochrome text
- [ ] **All code block languages are registered:** Run `grep -r '^\`\`\`' src/content/questions/ | grep -o '\`\`\`[a-z]*' | sort -u` and compare against the `langs` array in `src/lib/markdown.ts`
- [ ] **Anchor links work for new questions:** Click the link icon on each new flashcard and verify the URL fragment scrolls to it correctly
- [ ] **Both languages render correctly:** Toggle between UA and EN for every new question and verify display is correct in both
- [ ] **Tags field is populated:** New questions should have meaningful tags -- the schema defaults to `[]` so empty tags pass validation but defeat future filtering
- [ ] **No YAML special characters break rendering:** Questions containing colons, quotes, hashes, or brackets in their text render correctly
- [ ] **Solidity highlighting works:** Fix the known tech debt by adding `solidity` to Shiki langs array; verify blockchain code blocks are highlighted
- [ ] **Gherkin highlighting works:** Add `gherkin` to Shiki langs array; verify BDD/Cucumber code blocks in automation-qa are highlighted
- [ ] **Section `value` matches directory name:** The `section` frontmatter field must exactly match the directory name (e.g., `automation-qa` not `automationQA` or `Automation QA`)
- [ ] **No filename collisions:** No new file shares a filename with an existing file in the same section directory

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| YAML frontmatter breakage | LOW | Fix syntax in the broken file; each file is independent; re-run `astro build` |
| Order number collisions | LOW | Re-number affected files; grep for duplicates; rebuild |
| Slug/filename collisions | LOW | Rename the conflicting file; slugs derive from filenames, nothing else to update |
| Missing Shiki languages | LOW | Add language to `langs` array in `src/lib/markdown.ts`; rebuild |
| Translation semantic drift | MEDIUM | Requires human review of both versions side-by-side; re-generate affected questions if needed |
| Flat list UX | MEDIUM | Requires FlashcardList component changes to add grouping; content is fine, only UI needs work |
| Missing `type` metadata | MEDIUM | Requires adding field to schema and backfilling all 90 files; easier if done before generation |
| Build time explosion | LOW | Profile with `time astro build`; unlikely to be an issue at 195 questions |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| YAML frontmatter breakage | Content generation | YAML lint on every file; `astro build` succeeds without errors |
| Order number collisions | Content prep (before generation) | Script that checks unique sequential order values 16-30 per section |
| Shiki language gaps | Infrastructure prep (before content) | Updated `langs` array; visual check of all code blocks post-build |
| Filename/slug collisions | Content prep (naming convention) | No duplicate filenames within any section directory |
| Translation semantic drift | Content review (after generation) | Side-by-side review of UA/EN for each question, especially trick questions |
| Flat list UX | UI enhancement (alongside content) | Visual separation visible between basic and advanced question blocks |
| Missing type/difficulty metadata | Schema update (before generation) | `type` field present in schema; every new file has a valid type value |
| Build time regression | Post-integration testing | `time astro build` stays under 60s; section page sizes under 500KB |

## Sources

- Direct codebase analysis: `src/content.config.ts` (Zod schema with glob loader), `src/lib/markdown.ts` (Shiki singleton with fixed langs array), `src/pages/[locale]/[section]/index.astro` (sort-by-order rendering, slug extraction), `src/components/FlashcardList.astro` (flat list rendering)
- Content audit: 105 existing files across 7 sections, each with `order: 1-15`, using `solidity` (4 blocks) and `gherkin` (2 blocks) without Shiki registration
- Known tech debt from `PROJECT.md`: Solidity syntax highlighting gap explicitly documented
- Astro 6 content collections documentation: glob loader validates entire collection, not per-file
- Shiki v4 language loading behavior: unregistered languages fall through to try/catch, render as plain text

---
*Pitfalls research for: Adding 90 advanced bilingual interview questions to existing Astro static site*
*Researched: 2026-03-21*
