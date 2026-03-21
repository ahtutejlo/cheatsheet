# Phase 2: Design Polish and Full Content - Research

**Researched:** 2026-03-20
**Domain:** Tailwind CSS v4 dark mode, design theming, content authoring
**Confidence:** HIGH

## Summary

Phase 2 adds two distinct workstreams to the existing Astro + Tailwind CSS v4 site: (1) visual design polish with dark/light mode toggle, and (2) populating all 5-7 content sections with 15+ questions each. The codebase from Phase 1 is minimal but well-structured -- a `BaseLayout.astro` with hardcoded light colors, components using Tailwind utility classes with gray/blue palette, and 3 content sections (qa, java, docker) with 3 questions each.

For dark mode, Tailwind CSS v4 uses `@custom-variant` in CSS (not a config file) to enable class-based toggling. The site already has partial dark mode support: `global.css` includes Shiki code block dark mode rules targeting `html.dark` and `prefers-color-scheme: dark`. The toggle implementation needs an inline `<script>` in `<head>` to prevent flash of wrong theme (FOUC), localStorage persistence, and system preference detection as fallback. All existing components need `dark:` variant classes added.

For content, 4 new sections must be created (automation-qa, kubernetes, blockchain, sql) and all 7 sections need 15+ questions each (currently only 9 total across 3 sections). The content format is established: frontmatter-only Markdown with `ua_question`, `en_question`, `ua_answer`, `en_answer`, `section`, `order`, and `tags` fields. The `sections.ts` registry must be updated with metadata for new sections.

**Primary recommendation:** Implement dark mode toggle first (structural change to layout and all components), then batch-create content files per section. Do not interleave design and content tasks.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSGN-01 | Modern design with bright accents and animations | Tailwind v4 `@theme` for custom colors, `transition-*` utilities, existing animation pattern in Flashcard.astro |
| DSGN-02 | Dark/light mode with system detection and manual toggle | `@custom-variant dark` in CSS, inline script for FOUC prevention, localStorage pattern verified from official docs |
| CORE-05 | 5-7 sections at launch: QA, Automation QA, Java, Kubernetes, Blockchain, Docker, SQL | Content schema established in Phase 1, sections.ts registry pattern known, 4 new section dirs needed |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.0.7 | Static site framework | Already in use |
| Tailwind CSS | 4.2.2 | Utility-first CSS | Already in use, `@custom-variant` for dark mode |
| @tailwindcss/typography | 0.5.19 | Prose styling for answers | Already in use |
| Shiki | 4.0.2 | Code syntax highlighting | Already in use, dual-theme output |
| marked | 17.0.4 | Markdown rendering | Already in use |

### Supporting
No new dependencies needed. All design work uses Tailwind CSS utilities. Dark mode uses vanilla JS (no library needed).

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS dark mode toggle | next-themes / astro-color-scheme | Overkill for a static site with one toggle; adds dependency for 20 lines of JS |
| CSS custom properties for theming | Tailwind `dark:` variants | `dark:` variants are the standard Tailwind approach; CSS custom properties are for design systems with many themes |

**Installation:**
No new packages needed.

## Architecture Patterns

### Dark Mode Implementation

**Step 1: CSS configuration** -- Add class-based dark mode variant to `global.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));
```

Source: https://tailwindcss.com/docs/dark-mode

**Step 2: Inline script in `<head>`** -- Prevents FOUC by setting class before paint:

```html
<script is:inline>
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

Key: Must use `is:inline` in Astro to prevent bundling/deferring. Must be in `<head>` before any `<body>` content renders.

**Step 3: Toggle component** -- Button in Header that toggles `.dark` on `<html>` and persists to localStorage:

```astro
<button id="theme-toggle" class="..." aria-label="Toggle dark mode">
  <!-- sun/moon SVG icons -->
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

**Step 4: Update all components** -- Add `dark:` variants to every color utility:
- `bg-white` -> `bg-white dark:bg-gray-900`
- `text-gray-900` -> `text-gray-900 dark:text-gray-100`
- `border-gray-200` -> `border-gray-200 dark:border-gray-700`
- etc.

### Design Polish Pattern

Current site uses default gray/blue palette. Polish means:
1. Define accent color via `@theme` in CSS (e.g., custom brand color beyond default blue)
2. Add subtle transitions to interactive elements (`transition-all duration-200`)
3. Improve section cards with gradient or colored accent strips
4. Add hover/focus states that feel intentional
5. Consider subtle background patterns or gradients on hero/header area

```css
@theme {
  --color-accent-50: #eff6ff;
  --color-accent-100: #dbeafe;
  --color-accent-500: #3b82f6;
  --color-accent-600: #2563eb;
  --color-accent-700: #1d4ed8;
}
```

### Content Authoring Pattern

Established in Phase 1. Each question is a `.md` file in `src/content/questions/{section}/`:

```markdown
---
ua_question: "Question in Ukrainian"
en_question: "Question in English"
ua_answer: |
  Answer in Ukrainian with **markdown** and code blocks.
en_answer: |
  Answer in English with **markdown** and code blocks.
section: "section-slug"
order: 1
tags:
  - tag1
---
```

New sections need:
1. Directory created: `src/content/questions/{section}/`
2. Entry in `src/i18n/sections.ts` with `name`, `description`, `icon` for both locales
3. 15+ `.md` files per section

### Recommended File Change Summary
```
src/
  styles/global.css           # Add @custom-variant, @theme accent colors, dark prose overrides
  layouts/BaseLayout.astro    # Add inline dark mode script, dark body classes
  components/
    Header.astro              # Add theme toggle button, dark classes
    SectionCard.astro          # Add dark classes
    Flashcard.astro            # Add dark classes
    FlashcardList.astro        # Check if needs dark classes
  i18n/sections.ts            # Add 4 new sections
  content/questions/
    automation-qa/             # NEW: 15+ question files
    kubernetes/                # NEW: 15+ question files
    blockchain/                # NEW: 15+ question files
    sql/                       # NEW: 15+ question files
    qa/                        # ADD: 12+ more question files (has 3)
    java/                      # ADD: 12+ more question files (has 3)
    docker/                    # ADD: 12+ more question files (has 3)
```

### Anti-Patterns to Avoid
- **Server-side theme detection in static site:** Astro static mode has no request context. Theme must be client-side only.
- **Theme script in `<body>` or deferred:** Causes flash of light theme before dark applies. Must be inline in `<head>`.
- **Using `@media (prefers-color-scheme: dark)` alongside class-based:** The existing `global.css` uses both `html.dark` and `@media` for Shiki. After implementing class-based toggle, remove the `@media` rules for Shiki -- the class-based approach covers system preference via JS.
- **Forgetting prose dark mode:** The `@tailwindcss/typography` plugin needs `dark:prose-invert` on the prose container for answer content to look right in dark mode.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FOUC prevention | Custom observer/MutationObserver | Inline `<script>` in `<head>` | Synchronous script before first paint is the only reliable approach |
| Dark mode persistence | Cookie-based or session-based | localStorage + system fallback | Standard web pattern, works offline, no server needed |
| Prose dark styling | Manual color overrides for every typography element | `dark:prose-invert` class | Tailwind Typography plugin handles all prose element colors with one class |
| Icon toggle (sun/moon) | Canvas/complex SVG animation | Two inline SVGs toggled with `hidden` class | Simple, accessible, no JS animation library needed |

## Common Pitfalls

### Pitfall 1: Flash of Unstyled Content (FOUC)
**What goes wrong:** Page loads in light mode then flickers to dark mode.
**Why it happens:** Theme script runs after DOM paint because it's bundled/deferred by Astro.
**How to avoid:** Use `is:inline` attribute on the script tag in `<head>`. This tells Astro not to process it.
**Warning signs:** Any flash when loading the page with dark system preference or localStorage set to dark.

### Pitfall 2: Shiki Dark Mode Duplication
**What goes wrong:** Code blocks don't respect dark mode, or have conflicting styles.
**Why it happens:** Phase 1 added both `html.dark` selector AND `@media (prefers-color-scheme: dark)` rules for Shiki. After class-based toggle, the `@media` rules become redundant and can conflict.
**How to avoid:** Remove the `@media (prefers-color-scheme: dark)` block from `global.css` after implementing class-based dark mode. Keep only the `html.dark` selectors.
**Warning signs:** Code blocks showing wrong theme colors after toggling.

### Pitfall 3: Prose Content Not Inverting
**What goes wrong:** Flashcard answers remain dark text on dark background.
**Why it happens:** `prose` class styles headings, paragraphs, lists, links with hardcoded light colors. Need `dark:prose-invert`.
**How to avoid:** Add `dark:prose-invert` to the prose container in `Flashcard.astro`.
**Warning signs:** Answer text becomes unreadable in dark mode.

### Pitfall 4: Missing Dark Variants on Component
**What goes wrong:** One component stays light-themed when rest is dark.
**Why it happens:** Easy to miss adding `dark:` variants to every color utility in every component.
**How to avoid:** Audit all components systematically. Search for `bg-white`, `text-gray-900`, `border-gray-200`, etc.
**Warning signs:** Visual inconsistency when toggling themes.

### Pitfall 5: Content YAML Multiline Strings with Special Characters
**What goes wrong:** YAML parsing fails on answer content containing colons, quotes, or backticks.
**Why it happens:** YAML multiline strings (`|`) are generally safe, but nested code blocks with certain characters can break parsing.
**How to avoid:** Always use `|` (literal block scalar) for answers. Test each content file with `astro build` after creation.
**Warning signs:** Build errors mentioning YAML parsing or Zod validation failures.

### Pitfall 6: Section Slug Mismatch
**What goes wrong:** New section appears in navigation but shows 0 questions, or questions exist but section card is missing.
**Why it happens:** The `section` field in content frontmatter must exactly match the key in `sections.ts` AND the directory name.
**How to avoid:** Use consistent slug: directory name = `sections.ts` key = frontmatter `section` value. E.g., `automation-qa` everywhere.
**Warning signs:** Question count showing 0 on home page for a section that has files.

## Code Examples

### Complete Dark Mode Toggle Component
```astro
---
// ThemeToggle.astro -- or inline in Header.astro
---
<button
  id="theme-toggle"
  type="button"
  class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
  aria-label="Toggle dark mode"
>
  <!-- Sun icon (shown in dark mode) -->
  <svg id="theme-icon-light" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
  </svg>
  <!-- Moon icon (shown in light mode) -->
  <svg id="theme-icon-dark" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
</button>

<script>
  function updateIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('theme-icon-light')?.classList.toggle('hidden', !isDark);
    document.getElementById('theme-icon-dark')?.classList.toggle('hidden', isDark);
  }

  updateIcons();

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcons();
  });
</script>
```

### Updated global.css with Dark Mode
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Enable class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

/* Dark mode for Shiki code blocks */
html.dark .astro-code,
html.dark .shiki,
html.dark .astro-code span,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

### Sections Registry Update Pattern
```typescript
// src/i18n/sections.ts -- add new entries
export const sections: Record<string, Record<Locale, SectionMeta>> = {
  // ... existing qa, java, docker ...
  'automation-qa': {
    ua: { name: 'Automation QA', description: 'Автоматизоване тестування', icon: '🤖' },
    en: { name: 'Automation QA', description: 'Test automation fundamentals', icon: '🤖' },
  },
  kubernetes: {
    ua: { name: 'Kubernetes', description: 'Оркестрація контейнерів', icon: '☸️' },
    en: { name: 'Kubernetes', description: 'Container orchestration', icon: '☸️' },
  },
  blockchain: {
    ua: { name: 'Blockchain', description: 'Технологія блокчейн', icon: '🔗' },
    en: { name: 'Blockchain', description: 'Blockchain technology', icon: '🔗' },
  },
  sql: {
    ua: { name: 'SQL', description: 'Мова запитів до баз даних', icon: '🗃️' },
    en: { name: 'SQL', description: 'Database query language', icon: '🗃️' },
  },
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` `darkMode: 'class'` | `@custom-variant dark (...)` in CSS | Tailwind v4 (Jan 2025) | No config file needed, CSS-first |
| `@apply` for dark theme overrides | `dark:` variant utilities inline | Tailwind v3+ | More explicit, easier to audit |

**Deprecated/outdated:**
- `tailwind.config.js` darkMode key: Does not exist in Tailwind v4. Use `@custom-variant` in CSS.
- `@media (prefers-color-scheme: dark)` for manual toggle: Use class-based approach with JS fallback to system preference.

## Open Questions

1. **Accent color choice**
   - What we know: Current site uses Tailwind's default blue (`blue-600`). DSGN-01 requires "bright accents."
   - What's unclear: Whether to keep blue or pick a different accent color.
   - Recommendation: Use a vibrant blue/indigo gradient as primary accent. This is a design discretion area -- planner can decide.

2. **Content depth per section**
   - What we know: Need 15+ questions per section, covering interview-relevant topics.
   - What's unclear: Exact question list per section.
   - Recommendation: Focus on most commonly asked interview questions. This is content authoring, not a technical risk.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test framework installed |
| Config file | None |
| Quick run command | `pnpm build` (build-time validation) |
| Full suite command | `pnpm build` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-02 | Dark/light toggle works, system preference respected | manual | Visual inspection in browser | N/A |
| DSGN-01 | Modern design with accents and animations | manual | Visual inspection in browser | N/A |
| CORE-05 | All 7 sections present with 15+ questions | smoke | `pnpm build` (fails if content schema invalid) | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` -- catches YAML parsing errors, broken imports, Zod schema violations
- **Per wave merge:** `pnpm build && pnpm preview` -- visual verification of dark mode and design
- **Phase gate:** Full build green + manual dark/light mode toggle verification

### Wave 0 Gaps
- No test framework needed for this phase. Build validation (`pnpm build`) catches content and schema errors. Design polish and dark mode are inherently visual and best verified manually or with Playwright screenshots (out of scope for this phase).

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Dark Mode docs](https://tailwindcss.com/docs/dark-mode) - `@custom-variant` syntax, class-based toggle, localStorage pattern
- Existing codebase analysis - Phase 1 component structure, global.css, content schema

### Secondary (MEDIUM confidence)
- [Tailwind CSS dark mode discussion #15083](https://github.com/tailwindlabs/tailwindcss/discussions/15083) - CSS variables approach for dark/light mode
- [Fix dark class not applying in Tailwind CSS v4](https://www.sujalvanjare.com/blog/fix-dark-class-not-applying-tailwind-css-v4) - Common v4 migration issues

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, all existing libraries verified working
- Architecture: HIGH - Dark mode pattern is well-documented in official Tailwind v4 docs, content pattern established in Phase 1
- Pitfalls: HIGH - FOUC, prose-invert, and Shiki dark mode are well-known issues with established solutions

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- Tailwind v4 dark mode API is settled)
