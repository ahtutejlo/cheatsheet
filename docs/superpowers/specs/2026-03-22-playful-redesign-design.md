# Playful Redesign — Design Spec

**Date:** 2026-03-22
**Approach:** B (Revamp) — new component designs with Playful & Colorful style
**Scope:** Visual overhaul of all UI components; no structural/navigation changes

## Summary

Comprehensive visual redesign of the QA Cheatsheet site applying a "Playful & Colorful" aesthetic — vibrant accents, colored badges, generous border-radius, type-coded icons, and interactive tag styling. Navigation structure remains unchanged.

## 1. Flashcard Redesign

### Current State
- All flashcards look identical regardless of type
- Gray borders, minimal visual hierarchy
- Tags are small gray pills, barely noticeable
- `<details>` element with basic expand animation

### New Design

**Type-coded visual identity** — each question type gets a unique look:

| Type | Left Border | Icon | Border Color | Tag Color |
|------|-------------|------|-------------|-----------|
| basic | 4px `#9ca3af` (gray-400) | 📝 | `#e5e7eb` (gray-200) | gray |
| deep | 4px `#3b82f6` (blue-500) | 🔬 | `#bfdbfe` (blue-200) | blue |
| trick | 4px `#f59e0b` (amber-500) | ⚠️ | `#fde68a` (amber-200) | amber |
| practical | 4px `#22c55e` (green-500) | 🛠️ | `#bbf7d0` (green-200) | green |

**Structural changes to `Flashcard.astro`:**
- Add `border-left: 4px solid {typeColor}` — instant type identification
- Add type icon before question text (all types including basic)
- Border: 2px for non-basic types, 1px for basic
- `border-radius: 12px` (up from 8px)
- `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` for non-basic, `0.04` for basic
- Question text: `font-weight: 500` (up from normal)
- Chevron color matches type color (instead of gray)

**Tag styling within flashcards:**
- Tags inherit the card's type color scheme
- Add `#` prefix to tag text
- `border-radius: 6px`, `font-weight: 500`
- Background: light variant of type color (e.g., `blue-50` for deep cards)

**Dark mode adaptations:**
- Border colors use darker variants (e.g., `blue-800` instead of `blue-200`)
- Left border stays the same (bright color on dark bg = good contrast)
- Shadow: `rgba(0,0,0,0.2)` instead of `0.06`
- Tag backgrounds: dark variant (e.g., `blue-900/30`)

**Keep unchanged:**
- `<details>` element (works, accessible, no JS needed)
- Expand animation (200ms ease-out)
- Anchor link functionality
- Highlight animation for hash targets

### Implementation Notes
- Type color mappings defined as a shared config object (used by Flashcard, TypeBadge, TagBadge)
- Icons can be a simple Record<type, emoji> in the component
- CSS changes are mostly Tailwind class swaps, minimal custom CSS needed

## 2. Structured Answers

### Current State
- Plain prose block with `@tailwindcss/typography` styling
- Code blocks have basic gray background
- No visual distinction between different content types within answers

### New Design

**Callout blocks** — auto-parsed from existing Markdown patterns:

| Pattern | Callout Style | Icon | Colors |
|---------|--------------|------|--------|
| `> **Trap:**` or `> **Пастка:**` | Trap callout | 🪤 | amber bg, amber-900 text |
| `> **Note:**` or `> **Примітка:**` | Note callout | ℹ️ | blue bg, blue-900 text |
| `> **Key:**` or `> **Ключове:**` | Key insight | 💡 | green bg, green-900 text |

**Callout implementation:**
- Custom renderer in `markdown.ts` — detect blockquote patterns and wrap in styled divs
- Callout structure: icon + label (uppercase, small) + content text
- `border-radius: 10px`, `padding: 10px 12px`
- Each callout has matching border + background color

**Highlighted keywords (deferred):**
- Removed from initial scope — standard `**bold**` Markdown is too ambiguous to auto-style as pills
- May be revisited later with opt-in syntax (e.g., `==term==`) if needed
- For now, bold text renders normally via `@tailwindcss/typography` prose styles

**Code blocks with headers:**
- When code block has a language identifier, show a header bar with:
  - 📄 icon + language/filename label
  - `background: slate-100`, `font-size: 10px`, uppercase, `letter-spacing: 0.5px`
- Code block body: `border-radius: 10px` (bottom), cleaner padding
- Header + body wrapped in a container with `border: 1px solid slate-200, border-radius: 10px, overflow: hidden`

**Dark mode:**
- Callout backgrounds use dark variants (e.g., `amber-900/20`)
- Code block headers: `slate-800` background
- Keyword highlights: dark variant colors

### Implementation Notes
- Callout parsing happens in `renderMarkdown()` in `lib/markdown.ts`
- The `marked` library's renderer can be extended to detect blockquote patterns
- Code block headers require wrapping the Shiki output in a container div
- Existing content uses `> **Trap:**` pattern already — no content migration needed

## 3. Section Cards

### Current State
- Uniform white cards with gray borders
- Emoji icon + name + description + question count
- Blue hover accent (same for all)

### New Design

**Section color system** — each section gets a unique color:

| Section | Color | Border | Icon BG gradient |
|---------|-------|--------|-----------------|
| QA | blue | `#bfdbfe` | `#e0f2fe → #bfdbfe` |
| Automation QA | cyan | `#a5f3fc` | `#cffafe → #a5f3fc` |
| Python | lime | `#d9f99d` | `#f7fee7 → #d9f99d` |
| Playwright | violet | `#c4b5fd` | `#ede9fe → #c4b5fd` |
| Performance | orange | `#fed7aa` | `#fff7ed → #fed7aa` |
| Java | red | `#fecaca` | `#fef2f2 → #fecaca` |
| Docker | sky | `#bae6fd` | `#e0f2fe → #bae6fd` |
| Kubernetes | indigo | `#c7d2fe` | `#eef2ff → #c7d2fe` |
| Blockchain | emerald | `#a7f3d0` | `#ecfdf5 → #a7f3d0` |
| SQL | yellow | `#fef08a` | `#fefce8 → #fef08a` |

**Structural changes to `SectionCard.astro`:**
- Border: `2px solid {sectionColor}`
- `border-radius: 14px`
- Colored shadow: `box-shadow: 0 2px 8px rgba({sectionRgb}, 0.08)`
- Icon wrapper: `36x36px` div with gradient background, `border-radius: 10px`
- Section name: `font-weight: 700`, color = dark variant of section color
- Subtitle/description: color = light variant of section color

**Question count pill:**
- `background: {sectionColor}` (the main color from the table above), `color: white`
- `font-size: 9px`, `font-weight: 700`, `border-radius: 99px`
- Next to "questions" text in muted color

**Type distribution bar:**
- Horizontal bar below count, `height: 4px`, `border-radius: 99px`
- Segments: gray (basic), blue (deep), amber (trick), green (practical)
- Flex-based width proportional to actual question count per type
- Below bar: small colored dots with numbers for each type

**Data source:** section colors stored in `i18n/sections.ts` alongside existing icon/name/description.

**Dark mode:**
- Border colors: darker variants
- Icon bg gradient: darker shades
- Section name: lighter variant
- Shadow: slightly increased opacity

### Implementation Notes
- Section color config added to `i18n/sections.ts` as `color` field per section
- Type distribution data requires counting question types per section at build time
- This is already available in the `[section]/index.astro` page — extract to a shared utility
- SectionCard receives type counts as additional prop

## 4. Header

### Current State
- Plain white header, gray bottom border
- Text logo, plain locale switch, icon buttons

### New Design

**Logo:**
- Gradient icon: `28x28px`, `linear-gradient(135deg, #3b82f6, #8b5cf6)`, `border-radius: 8px`
- Emoji 📋 centered inside
- Title: `font-weight: 800`, `letter-spacing: -0.3px`, `color: slate-900`

**Locale switch:**
- Pill badge style: active locale gets `background: blue-500, color: white`
- `font-size: 11px`, `font-weight: 600`, `border-radius: 99px`, `padding: 3px 8px`

**Border:**
- Bottom border: `2px solid blue-100` (instead of gray-200)

**Dark mode:**
- Gradient icon: same (pops on dark bg)
- Title: `color: slate-100`
- Locale pill: `background: blue-600`
- Border: `2px solid blue-900/30`

### Implementation Notes
- Changes isolated to `Header.astro`
- Minimal — mostly Tailwind class changes

## 5. Tag Badges (Global)

### Current State
- Small gray pills: `bg-gray-100 text-gray-600`
- Square-ish border-radius (4px)
- Functional but invisible

### New Design

**Colorful pill tags:**
- `border-radius: 99px` (full pill)
- `#` prefix added to tag text
- `font-weight: 500`
- `border: 1px solid {tagColor-200}`
- Color cycling from a preset palette:
  - blue, purple, orange, green, yellow, pink, cyan, indigo
  - Color assigned by hash of tag name (deterministic, consistent)

**Active filter banner:**
- When a tag filter is active, show a styled banner above the flashcard list
- `background: blue-50`, `border: 1px solid blue-200`, `border-radius: 10px`
- Contains: 🏷️ icon + "Filter: #tagname" + "Show all" link
- Replaces current plain filter bar

**Hover effects:**
- Scale: `hover:scale-105`
- Background darkens slightly
- Cursor: pointer

**Dark mode:**
- Tag backgrounds: dark variants (e.g., `blue-900/30`)
- Border: darker shade
- Active filter banner: `blue-900/20` bg

### Implementation Notes
- Tag color assignment: hash tag string → index into color array → deterministic color
- Color utility function shared between TagBadge and Flashcard (for in-card tags)
- Filter banner markup in `FlashcardList.astro` or section page

## 6. Global Style Changes

### Color Palette Extension
Add to `global.css` `@theme`:
- Keep existing accent colors
- Add section-specific color tokens (used by SectionCard)
- Add type-specific color tokens (used by Flashcard, TypeBadge)

### Typography
- Increase heading weights: `font-weight: 700-800` for h1/h2
- Section page title: include section emoji + colored text

### Border Radius
- Cards: `12-14px`
- Badges/pills: `99px`
- Code blocks: `10px`
- Buttons: `8-10px`
- Consistent everywhere

### Shadows
- Cards: `0 2px 8px rgba({color}, 0.06-0.08)`
- Hover: `0 4px 12px rgba({color}, 0.12)`
- Use section/type color in shadow (not gray)

### Transitions
- All interactive elements: `transition-all duration-200`
- Hover cards: slight lift (`translateY(-1px)`)

## 7. Files to Modify

| File | Changes |
|------|---------|
| `src/styles/global.css` | Extended color palette, global border-radius tokens, shadow utilities |
| `src/components/Flashcard.astro` | Type-coded borders, icons, colored tags, rounded corners, shadows |
| `src/components/FlashcardList.astro` | Styled filter banner |
| `src/components/SectionCard.astro` | Section colors, icon wrapper, type distribution bar, pill count |
| `src/components/TypeBadge.astro` | Updated colors (minor) |
| `src/components/TagBadge.astro` | Pill shape, # prefix, color cycling, hover effects |
| `src/components/Header.astro` | Gradient logo, pill locale switch, colored border |
| `src/i18n/sections.ts` | Add color field per section |
| `src/lib/markdown.ts` | Callout block parsing, code block headers |

**No new files needed.** All changes are modifications to existing components.

## 8. Out of Scope

- Navigation structure changes
- New pages or routes
- Quiz mode, progress tracking, gamification (deferred to future milestone)
- Content changes (existing Markdown works as-is)
- Search modal redesign (already recently built)

## 9. Dark Mode Strategy

Every visual change has a dark mode counterpart:
- Light borders → darker shade borders
- Light backgrounds → dark transparent variants (e.g., `blue-900/30`)
- Bright accent colors stay bright (good contrast on dark)
- Shadows get increased opacity on dark backgrounds
- Callout blocks use dark bg variants

Existing dark mode toggle + localStorage persistence remains unchanged.

## 10. Responsive Considerations

No breakpoint changes needed. All new styles work within existing responsive grid:
- Section cards: same 1→2→3 column grid
- Flashcards: full-width with padding adjustments
- Tags: flex-wrap handles overflow
- Type distribution bar: stretches with card width
- Header: flex layout adapts naturally
