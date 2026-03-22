# Playful Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Visually overhaul all UI components with a "Playful & Colorful" aesthetic — type-coded flashcards, callout blocks, colorful section cards, updated header and tag styling.

**Architecture:** Pure visual changes to existing Astro components. No new pages, routes, or structural changes. A shared type-color config centralizes color mappings. Markdown renderer gets callout and code-header support. Section metadata gets color fields.

**Tech Stack:** Astro 6, Tailwind CSS 4, TypeScript, marked + Shiki

---

## File Map

| File | Role | Changes |
|------|------|---------|
| `src/lib/colors.ts` | **Create** — shared type/section/tag color config | New file with all color mappings used across components |
| `src/lib/markdown.ts` | Modify — markdown renderer | Add callout block parsing + code block headers |
| `src/i18n/sections.ts` | Modify — section metadata | Add `color` field per section |
| `src/components/Header.astro` | Modify — site header | Gradient logo, pill locale switch, colored border |
| `src/components/Flashcard.astro` | Modify — question card | Type-coded borders, icons, shadows, colored tags |
| `src/components/TypeBadge.astro` | Modify — type label | Minor color adjustments |
| `src/components/TagBadge.astro` | Modify — tag filter button | Pill shape, # prefix, deterministic colors, hover effects |
| `src/components/SectionCard.astro` | Modify — home page card | Section colors, icon wrapper, type distribution bar |
| `src/components/FlashcardList.astro` | Modify — card list wrapper | Styled filter banner |
| `src/styles/global.css` | Modify — global styles | Callout + code-header CSS, updated Pagefind vars |
| `src/pages/[locale]/index.astro` | Modify — home page | Pass type counts to SectionCard |
| `src/pages/[locale]/[section]/index.astro` | Modify — section page | Update heading styles |

---

### Task 1: Create Shared Color Config

**Files:**
- Create: `src/lib/colors.ts`

- [ ] **Step 1: Create the color config file**

```typescript
// src/lib/colors.ts

// --- Type colors (used by Flashcard, TypeBadge) ---
export const typeColors = {
  basic: {
    border: 'border-gray-400',
    borderLeft: 'border-l-gray-400',
    borderOuter: 'border-gray-200 dark:border-gray-700',
    icon: '📝',
    chevron: 'text-gray-400 dark:text-gray-500',
    tagBg: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300',
    shadow: 'shadow-sm',
  },
  deep: {
    border: 'border-blue-500',
    borderLeft: 'border-l-blue-500',
    borderOuter: 'border-blue-200 dark:border-blue-800',
    icon: '🔬',
    chevron: 'text-blue-400 dark:text-blue-500',
    tagBg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    shadow: 'shadow-sm shadow-blue-500/5',
  },
  trick: {
    border: 'border-amber-500',
    borderLeft: 'border-l-amber-500',
    borderOuter: 'border-amber-200 dark:border-amber-800',
    icon: '⚠️',
    chevron: 'text-amber-400 dark:text-amber-500',
    tagBg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    shadow: 'shadow-sm shadow-amber-500/5',
  },
  practical: {
    border: 'border-green-500',
    borderLeft: 'border-l-green-500',
    borderOuter: 'border-green-200 dark:border-green-800',
    icon: '🛠️',
    chevron: 'text-green-400 dark:text-green-500',
    tagBg: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    shadow: 'shadow-sm shadow-green-500/5',
  },
} as const;

export type QuestionType = keyof typeof typeColors;

// --- Section colors (used by SectionCard) ---
export const sectionColors: Record<string, {
  border: string;
  borderDark: string;
  gradientFrom: string;
  gradientTo: string;
  nameColor: string;
  nameDark: string;
  descColor: string;
  pillBg: string;
  shadowColor: string;
}> = {
  qa:                   { border: '#bfdbfe', borderDark: '#1e3a5f', gradientFrom: '#e0f2fe', gradientTo: '#bfdbfe', nameColor: '#1e40af', nameDark: '#93c5fd', descColor: '#7dd3fc', pillBg: '#3b82f6', shadowColor: '59,130,246' },
  'automation-qa':      { border: '#a5f3fc', borderDark: '#164e63', gradientFrom: '#cffafe', gradientTo: '#a5f3fc', nameColor: '#155e75', nameDark: '#67e8f9', descColor: '#22d3ee', pillBg: '#06b6d4', shadowColor: '6,182,212' },
  python:               { border: '#d9f99d', borderDark: '#365314', gradientFrom: '#f7fee7', gradientTo: '#d9f99d', nameColor: '#365314', nameDark: '#bef264', descColor: '#a3e635', pillBg: '#84cc16', shadowColor: '132,204,22' },
  playwright:           { border: '#c4b5fd', borderDark: '#3b0764', gradientFrom: '#ede9fe', gradientTo: '#c4b5fd', nameColor: '#5b21b6', nameDark: '#a78bfa', descColor: '#8b5cf6', pillBg: '#8b5cf6', shadowColor: '139,92,246' },
  'performance-testing': { border: '#fed7aa', borderDark: '#7c2d12', gradientFrom: '#fff7ed', gradientTo: '#fed7aa', nameColor: '#9a3412', nameDark: '#fdba74', descColor: '#fb923c', pillBg: '#f97316', shadowColor: '249,115,22' },
  java:                 { border: '#fecaca', borderDark: '#7f1d1d', gradientFrom: '#fef2f2', gradientTo: '#fecaca', nameColor: '#991b1b', nameDark: '#fca5a5', descColor: '#f87171', pillBg: '#ef4444', shadowColor: '239,68,68' },
  docker:               { border: '#bae6fd', borderDark: '#0c4a6e', gradientFrom: '#e0f2fe', gradientTo: '#bae6fd', nameColor: '#075985', nameDark: '#7dd3fc', descColor: '#38bdf8', pillBg: '#0ea5e9', shadowColor: '14,165,233' },
  kubernetes:           { border: '#c7d2fe', borderDark: '#312e81', gradientFrom: '#eef2ff', gradientTo: '#c7d2fe', nameColor: '#3730a3', nameDark: '#a5b4fc', descColor: '#818cf8', pillBg: '#6366f1', shadowColor: '99,102,241' },
  blockchain:           { border: '#a7f3d0', borderDark: '#064e3b', gradientFrom: '#ecfdf5', gradientTo: '#a7f3d0', nameColor: '#065f46', nameDark: '#6ee7b7', descColor: '#34d399', pillBg: '#10b981', shadowColor: '16,185,129' },
  sql:                  { border: '#fef08a', borderDark: '#713f12', gradientFrom: '#fefce8', gradientTo: '#fef08a', nameColor: '#854d0e', nameDark: '#fde047', descColor: '#facc15', pillBg: '#eab308', shadowColor: '234,179,8' },
};

// --- Tag color palette (used by TagBadge) ---
const tagPalette = [
  { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
  { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
  { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  { bg: 'bg-cyan-50 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
] as const;

/** Deterministic color for a tag name based on simple string hash */
export function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    hash |= 0;
  }
  return tagPalette[Math.abs(hash) % tagPalette.length];
}
```

- [ ] **Step 2: Verify Tailwind scans colors.ts for dynamic class names**

Tailwind CSS 4 with `@tailwindcss/vite` auto-detects content sources from the project. Verify `src/lib/colors.ts` is included by running a build — if tag colors are missing, add `src/lib/**/*.ts` to the Tailwind content configuration in `astro.config.mjs` or ensure the Vite plugin picks it up. Astro's default content detection typically covers `src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}` so this should work out of the box.

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npx astro check 2>&1 | head -20`
Expected: No errors related to `colors.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/colors.ts
git commit -m "feat(redesign): add shared color config for types, sections, tags"
```

---

### Task 2: Update Markdown Renderer — Callout Blocks & Code Headers

**Files:**
- Modify: `src/lib/markdown.ts`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add callout block parsing and code block headers to markdown.ts**

Replace the full `renderMarkdown` function. The key changes:
1. Add a custom `blockquote` renderer that detects `> **Trap:**`, `> **Note:**`, `> **Key:**` (and Ukrainian variants) and wraps them in styled callout divs
2. Modify the `code` renderer to wrap output in a container with a language header bar

```typescript
// In src/lib/markdown.ts — updated renderer section inside renderMarkdown()

const renderer = new marked.Renderer();

// --- Callout patterns ---
const calloutPatterns: { pattern: RegExp; type: string; icon: string; label: string }[] = [
  { pattern: /^<p><strong>Trap:<\/strong>/, type: 'trap', icon: '🪤', label: 'Trap' },
  { pattern: /^<p><strong>Пастка:<\/strong>/, type: 'trap', icon: '🪤', label: 'Пастка' },
  { pattern: /^<p><strong>Note:<\/strong>/, type: 'note', icon: 'ℹ️', label: 'Note' },
  { pattern: /^<p><strong>Примітка:<\/strong>/, type: 'note', icon: 'ℹ️', label: 'Примітка' },
  { pattern: /^<p><strong>Key:<\/strong>/, type: 'key', icon: '💡', label: 'Key' },
  { pattern: /^<p><strong>Ключове:<\/strong>/, type: 'key', icon: '💡', label: 'Ключове' },
];

renderer.blockquote = function ({ tokens }: Tokens.Blockquote): string {
  // marked v17: blockquote receives { tokens } (Token array), render them first
  const html = this.parser.parse(tokens);
  for (const callout of calloutPatterns) {
    if (callout.pattern.test(html)) {
      // Strip the label from content (it's already shown as the callout header)
      const content = html.replace(callout.pattern, '<p>');
      return `<div class="callout callout-${callout.type}">
        <span class="callout-icon">${callout.icon}</span>
        <div>
          <div class="callout-label">${callout.label}</div>
          ${content}
        </div>
      </div>`;
    }
  }
  return `<blockquote>${html}</blockquote>`;
};

// --- Code blocks with language headers ---
renderer.code = function ({ text, lang }: Tokens.Code): string {
  const language = lang || 'text';
  let codeHtml: string;
  try {
    codeHtml = hl.codeToHtml(text, {
      lang: language,
      themes: { light: 'github-light', dark: 'github-dark' },
    });
  } catch {
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    codeHtml = `<pre class="shiki"><code>${escaped}</code></pre>`;
  }

  if (lang) {
    return `<div class="code-block-wrapper">
      <div class="code-block-header"><span class="code-block-lang">📄 ${language}</span></div>
      ${codeHtml}
    </div>`;
  }
  return codeHtml;
};
```

- [ ] **Step 2: Add callout and code-block CSS to global.css**

Append the following to `src/styles/global.css`:

```css
/* --- Callout blocks --- */
.callout {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
}
.callout p { margin: 0; }
.callout-icon { font-size: 1.1rem; flex-shrink: 0; line-height: 1.4; }
.callout-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }

.callout-trap { background: #fffbeb; border: 1px solid #fde68a; }
.callout-trap .callout-label { color: #92400e; }
.callout-trap p { color: #78350f; }

.callout-note { background: #eff6ff; border: 1px solid #bfdbfe; }
.callout-note .callout-label { color: #1e40af; }
.callout-note p { color: #1e3a5f; }

.callout-key { background: #f0fdf4; border: 1px solid #bbf7d0; }
.callout-key .callout-label { color: #166534; }
.callout-key p { color: #14532d; }

html.dark .callout-trap { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); }
html.dark .callout-trap .callout-label { color: #fbbf24; }
html.dark .callout-trap p { color: #fde68a; }

html.dark .callout-note { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); }
html.dark .callout-note .callout-label { color: #60a5fa; }
html.dark .callout-note p { color: #bfdbfe; }

html.dark .callout-key { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); }
html.dark .callout-key .callout-label { color: #4ade80; }
html.dark .callout-key p { color: #bbf7d0; }

/* --- Code block with header --- */
.code-block-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.code-block-header {
  background: #f1f5f9;
  padding: 6px 12px;
  border-bottom: 1px solid #e2e8f0;
}
.code-block-lang {
  font-size: 0.625rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.code-block-wrapper pre {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
}

html.dark .code-block-wrapper { border-color: #334155; }
html.dark .code-block-header { background: #1e293b; border-color: #334155; }
html.dark .code-block-lang { color: #94a3b8; }
```

- [ ] **Step 3: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -10`
Expected: Build succeeds. Check a section with `> **Trap:**` content to verify callout rendering.

- [ ] **Step 4: Commit**

```bash
git add src/lib/markdown.ts src/styles/global.css
git commit -m "feat(redesign): add callout blocks and code block headers to markdown renderer"
```

---

### Task 3: Redesign Header

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Update Header.astro with gradient logo, pill locale switch, colored border**

Replace the entire template in `Header.astro`:

```astro
---
import { t, localePath, type Locale } from '../i18n/utils';

interface Props {
  locale: Locale;
  currentPath?: string;
}

const { locale, currentPath } = Astro.props;
const otherLocale: Locale = locale === 'ua' ? 'en' : 'ua';
const switchUrl = localePath(otherLocale, currentPath);
---
<header class="border-b-2 border-blue-100 dark:border-blue-900/30 bg-white dark:bg-gray-900 transition-colors duration-200">
  <div class="mx-auto max-w-4xl px-4 py-4 sm:px-6">
    <nav class="flex items-center justify-between">
      <a href={localePath(locale)} class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <span class="text-sm">📋</span>
        </div>
        <span class="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t(locale, 'site.title')}
        </span>
      </a>
      <div class="flex items-center gap-1">
        <a
          href={switchUrl}
          class="rounded-full px-2 py-0.5 text-[11px] font-semibold bg-blue-500 text-white dark:bg-blue-600 transition-colors"
          data-locale-switch={otherLocale}
          aria-label={t(locale, 'lang.label')}
        >
          {t(locale, 'lang.switch')}
        </a>
        <button
          id="search-button"
          type="button"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          aria-label={t(locale, 'search.label')}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          id="theme-toggle"
          type="button"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          <svg id="theme-icon-light" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
          <svg id="theme-icon-dark" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
      </div>
    </nav>
  </div>
</header>

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
  document.getElementById('search-button')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('search-open'));
  });
  document.querySelector('[data-locale-switch]')?.addEventListener('click', (e) => {
    const target = e.currentTarget as HTMLAnchorElement;
    localStorage.setItem('locale', target.dataset.localeSwitch || 'ua');
  });
</script>
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(redesign): update header with gradient logo, pill locale switch, colored border"
```

---

### Task 4: Redesign TagBadge

**Files:**
- Modify: `src/components/TagBadge.astro`

- [ ] **Step 1: Update TagBadge with pill shape, # prefix, deterministic colors**

```astro
---
import { getTagColor } from '../lib/colors';

interface Props {
  tag: string;
}
const { tag } = Astro.props;
const color = getTagColor(tag);
---
<button
  class:list={[
    'tag-filter inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    'border transition-all cursor-pointer hover:scale-105',
    color.bg, color.text, color.border,
  ]}
  data-tag={tag}
>
  #{tag}
</button>
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/TagBadge.astro
git commit -m "feat(redesign): update TagBadge with pill shape, hash prefix, deterministic colors"
```

---

### Task 5: Redesign Flashcard

**Files:**
- Modify: `src/components/Flashcard.astro`

- [ ] **Step 1: Update Flashcard.astro with type-coded borders, icons, shadows**

```astro
---
import { renderMarkdown } from '../lib/markdown';
import TypeBadge from './TypeBadge.astro';
import TagBadge from './TagBadge.astro';
import { typeColors, type QuestionType } from '../lib/colors';

interface Props {
  slug: string;
  question: string;
  answer: string;
  type?: QuestionType;
  locale: 'ua' | 'en';
  tags?: string[];
}

const { slug, question, answer, type = 'basic', locale, tags = [] } = Astro.props;
const answerHtml = await renderMarkdown(answer);
const colors = typeColors[type];
const borderWidth = type === 'basic' ? 'border' : 'border-2';
---
<details
  class:list={[
    'flashcard group overflow-hidden rounded-xl border-l-4',
    borderWidth, colors.borderOuter, colors.borderLeft, colors.shadow,
  ]}
  data-tags={tags.join(',')}
>
  <summary class="cursor-pointer select-none p-4 sm:p-5 font-medium text-gray-900 dark:text-gray-100
                   hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                   min-h-[44px] flex items-center gap-3 list-none">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3">
        <span class="text-base shrink-0" role="img" aria-hidden="true">{colors.icon}</span>
        <h3 id={slug} class="flex-1 text-base leading-relaxed font-medium">{question}</h3>
        {type !== 'basic' && <TypeBadge type={type} locale={locale} />}
        <a href={`#${slug}`}
           class="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors shrink-0"
           onclick="event.stopPropagation()"
           aria-label="Link to this question">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-1.102-4.242a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" />
          </svg>
        </a>
        <svg class:list={['w-5 h-5 transition-transform duration-200 group-open:rotate-180 shrink-0', colors.chevron]}
             viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd" />
        </svg>
      </div>
      {tags.length > 0 && (
        <div class="flex flex-wrap gap-1.5 mt-2 ml-8">
          {tags.map(tag => <TagBadge tag={tag} />)}
        </div>
      )}
    </div>
  </summary>
  <div class:list={[
    'flashcard-answer border-t p-4 sm:p-5',
    'prose prose-sm sm:prose-base max-w-none dark:prose-invert',
    'prose-pre:rounded-lg prose-pre:text-sm',
    'prose-code:before:content-none prose-code:after:content-none',
    type === 'basic' ? 'border-gray-200 dark:border-gray-700' : colors.borderOuter,
  ]}>
    <Fragment set:html={answerHtml} />
  </div>
</details>

<style>
  summary { list-style: none; }
  summary::-webkit-details-marker { display: none; }

  details .flashcard-answer {
    animation: flashcard-reveal 200ms ease-out;
  }
  @keyframes flashcard-reveal {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  details.highlight {
    box-shadow: 0 0 0 2px #3b82f6;
    transition: box-shadow 0.3s ease;
  }

  .flashcard-answer :global(pre.shiki) {
    background-color: var(--shiki-light-bg, #fff) !important;
  }
  html.dark .flashcard-answer :global(pre.shiki) {
    background-color: var(--shiki-dark-bg, #1e1e1e) !important;
  }

  /* Remove prose default code block styles when inside wrapper */
  .flashcard-answer :global(.code-block-wrapper pre) {
    background: transparent !important;
    border: none !important;
    padding: 12px !important;
  }
</style>
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Flashcard.astro
git commit -m "feat(redesign): type-coded flashcards with colored borders, icons, shadows"
```

---

### Task 6: Update FlashcardList — Styled Filter Banner

**Files:**
- Modify: `src/components/FlashcardList.astro`
- Modify: `src/pages/[locale]/[section]/index.astro` (filter bar markup)

- [ ] **Step 1: Update filter bar in section page**

In `src/pages/[locale]/[section]/index.astro`, replace the existing filter bar div (line ~115):

Old:
```html
<div id="filter-bar" class="hidden mb-4 flex items-center gap-2 text-sm" data-pagefind-ignore>
  <span class="text-gray-600 dark:text-gray-400">
    {t(locale, 'filter.activeLabel')}:
    <span id="filter-tag-name" class="font-medium text-gray-900 dark:text-gray-100"></span>
  </span>
  <button id="clear-filter" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
    {t(locale, 'filter.showAll')}
  </button>
</div>
```

New:
```html
<div id="filter-bar" class="hidden mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-sm" data-pagefind-ignore>
  <div class="flex items-center gap-2">
    <span class="text-base">🏷️</span>
    <span class="text-blue-800 dark:text-blue-300 font-medium">
      {t(locale, 'filter.activeLabel')}:
      <span id="filter-tag-name" class="font-semibold"></span>
    </span>
  </div>
  <button id="clear-filter" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors">
    {t(locale, 'filter.showAll')}
  </button>
</div>
```

- [ ] **Step 2: Update tag filter JS to handle new active styling**

In the same file, update the `applyFilter` function's tag badge toggle section. The current code toggles `bg-blue-500`, `text-white`, etc. Replace that block with:

Old toggling (lines ~194-206):
```javascript
document.querySelectorAll('.tag-filter').forEach(btn => {
  const btnTag = (btn as HTMLElement).dataset.tag;
  const isActive = btnTag === tag;
  btn.classList.toggle('bg-blue-500', isActive);
  btn.classList.toggle('text-white', isActive);
  btn.classList.toggle('dark:bg-blue-600', isActive);
  btn.classList.toggle('dark:text-white', isActive);
  btn.classList.toggle('bg-gray-100', !isActive);
  btn.classList.toggle('text-gray-600', !isActive);
  btn.classList.toggle('dark:bg-gray-700', !isActive);
  btn.classList.toggle('dark:text-gray-300', !isActive);
});
```

New — simply add/remove a `ring-2 ring-blue-500` to highlight the active tag without overriding its unique color:
```javascript
document.querySelectorAll('.tag-filter').forEach(btn => {
  const btnTag = (btn as HTMLElement).dataset.tag;
  const isActive = btnTag === tag;
  btn.classList.toggle('ring-2', isActive);
  btn.classList.toggle('ring-blue-500', isActive);
  btn.classList.toggle('scale-110', isActive);
});
```

- [ ] **Step 3: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/[locale]/[section]/index.astro
git commit -m "feat(redesign): styled filter banner and updated tag active state"
```

---

### Task 7: Redesign SectionCard with Colors and Type Distribution

**Files:**
- Modify: `src/components/SectionCard.astro`
- Modify: `src/pages/[locale]/index.astro`

- [ ] **Step 1: Update home page to compute and pass type counts**

In `src/pages/[locale]/index.astro`, update the `sectionData` computation:

Old:
```typescript
const sectionData = sectionSlugs.map(slug => ({
  slug,
  count: allQuestions.filter(q => q.data.section === slug).length,
}));
```

New:
```typescript
const TYPE_ORDER = ['basic', 'deep', 'trick', 'practical'] as const;

const sectionData = sectionSlugs.map(slug => {
  const questions = allQuestions.filter(q => q.data.section === slug);
  const typeCounts = TYPE_ORDER.map(type => ({
    type,
    count: questions.filter(q => (q.data.type || 'basic') === type).length,
  })).filter(tc => tc.count > 0);

  return { slug, count: questions.length, typeCounts };
});
```

And update the template to pass `typeCounts`:
```astro
<SectionCard slug={slug} count={count} typeCounts={typeCounts} locale={locale} />
```

- [ ] **Step 2: Rewrite SectionCard.astro**

```astro
---
import { t, localePath, type Locale } from '../i18n/utils';
import { getSectionMeta } from '../i18n/sections';
import { sectionColors } from '../lib/colors';

interface TypeCount {
  type: string;
  count: number;
}

interface Props {
  slug: string;
  count: number;
  typeCounts: TypeCount[];
  locale: Locale;
}

const { slug, count, typeCounts, locale } = Astro.props;
const meta = getSectionMeta(slug, locale);
const colors = sectionColors[slug];

const dotColorMap: Record<string, string> = {
  basic: '#9ca3af',
  deep: '#3b82f6',
  trick: '#f59e0b',
  practical: '#22c55e',
};
---
<a
  href={localePath(locale, slug)}
  class="group block rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-0.5"
  style={`border: 2px solid ${colors.border}; box-shadow: 0 2px 8px rgba(${colors.shadowColor}, 0.08); --name-dark: ${colors.nameDark}; --border-dark: ${colors.borderDark};`}
>
  <div class="flex items-center gap-3 mb-3">
    <div
      class="w-9 h-9 rounded-[10px] flex items-center justify-center"
      style={`background: linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo});`}
    >
      <span class="text-lg" role="img" aria-hidden="true">{meta?.icon}</span>
    </div>
    <div>
      <h2 class="text-lg font-bold leading-tight" style={`color: ${colors.nameColor};`}>
        {meta?.name}
      </h2>
    </div>
  </div>
  <p class="text-sm mb-3 opacity-70" style={`color: ${colors.descColor};`}>{meta?.description}</p>
  <div class="flex items-center gap-1.5 mb-2">
    <span
      class="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
      style={`background: ${colors.pillBg};`}
    >
      {count}
    </span>
    <span class="text-[10px] text-slate-400">{t(locale, 'section.questions')}</span>
  </div>
  {typeCounts.length > 1 && (
    <>
      <div class="flex h-1 rounded-full overflow-hidden gap-px">
        {typeCounts.map(tc => (
          <div style={`flex: ${tc.count}; background: ${dotColorMap[tc.type]};`}></div>
        ))}
      </div>
      <div class="flex gap-2 mt-1.5">
        {typeCounts.map(tc => (
          <span class="text-[9px] flex items-center gap-1" style={`color: ${dotColorMap[tc.type]};`}>
            <span class="w-1.5 h-1.5 rounded-full inline-block" style={`background: ${dotColorMap[tc.type]};`}></span>
            {tc.count}
          </span>
        ))}
      </div>
    </>
  )}
</a>

<style>
  /* Dark mode overrides via CSS custom properties set on the <a> style attribute */
  :global(html.dark) a {
    background: rgba(255,255,255,0.03);
    border-color: var(--border-dark) !important;
  }
  :global(html.dark) a h2 {
    color: var(--name-dark) !important;
  }
  :global(html.dark) a p {
    color: #94a3b8 !important;
  }
</style>
```

- [ ] **Step 3: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/SectionCard.astro src/pages/[locale]/index.astro
git commit -m "feat(redesign): colorful section cards with type distribution bar"
```

---

### Task 8: Update Section Page Heading Styles

**Files:**
- Modify: `src/pages/[locale]/[section]/index.astro`

- [ ] **Step 1: Update heading area with bolder styling**

In `src/pages/[locale]/[section]/index.astro`, update the heading section (lines ~95-113):

Change `<h1>` classes from `text-2xl font-bold` to `text-2xl font-extrabold sm:text-3xl`.

Change the section icon wrapper from a plain `<span>` to a styled div matching the home card style:

Old:
```html
<span class="text-3xl" role="img" aria-hidden="true">{meta.icon}</span>
```

New (import `sectionColors` at top of frontmatter):
```html
<div
  class="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
  style={`background: linear-gradient(135deg, ${sectionColor.gradientFrom}, ${sectionColor.gradientTo});`}
>
  <span class="text-xl" role="img" aria-hidden="true">{meta.icon}</span>
</div>
```

Add to frontmatter:
```typescript
import { sectionColors } from '../../../lib/colors';
const sectionColor = sectionColors[section];
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/pages/[locale]/[section]/index.astro
git commit -m "feat(redesign): update section page heading with gradient icon and bolder type"
```

---

### Task 9: Final Visual Polish & Verification

**Files:**
- Modify: `src/styles/global.css` (Pagefind theme vars update)

- [ ] **Step 1: Update Pagefind CSS vars to match new style**

In `src/styles/global.css`, update Pagefind vars:

```css
:root {
  --pagefind-ui-primary: #3b82f6;
  --pagefind-ui-text: #0f172a;
  --pagefind-ui-background: #ffffff;
  --pagefind-ui-border: #e2e8f0;
  --pagefind-ui-tag: #f1f5f9;
  --pagefind-ui-border-width: 2px;
  --pagefind-ui-border-radius: 12px;
  --pagefind-ui-scale: 1;
  --pagefind-ui-font: inherit;
}
```

- [ ] **Step 2: Full build and visual check**

Run: `cd /Users/ahtutejlo/projects/cheatsheet && npm run build && npm run preview`

Verify in browser:
1. Home page — section cards have unique colors, type distribution bars
2. Section page — flashcards have type-coded borders and icons
3. Open a flashcard — callout blocks render, code blocks have headers
4. Tags are colorful pills with # prefix
5. Header has gradient logo, pill locale switch
6. Dark mode — toggle and verify all components look correct
7. Responsive — check at 320px, 768px, 1024px widths

- [ ] **Step 3: Commit any final adjustments**

```bash
git add src/styles/global.css
git commit -m "feat(redesign): update Pagefind vars and final polish"
```
