// src/lib/colors.ts

// --- Type colors (used by Flashcard, TypeBadge) ---
export const typeColors = {
  basic: {
    border: 'border-gray-400',
    borderLeft: 'border-l-gray-400',
    borderOuter: 'border-gray-200 dark:border-gray-700',
    icon: '📝',
    chevron: 'text-gray-400 dark:text-gray-500',
    shadow: 'shadow-sm',
  },
  deep: {
    border: 'border-blue-500',
    borderLeft: 'border-l-blue-500',
    borderOuter: 'border-blue-200 dark:border-blue-800',
    icon: '🔬',
    chevron: 'text-blue-400 dark:text-blue-500',
    shadow: 'shadow-sm shadow-blue-500/5',
  },
  trick: {
    border: 'border-amber-500',
    borderLeft: 'border-l-amber-500',
    borderOuter: 'border-amber-200 dark:border-amber-800',
    icon: '⚠️',
    chevron: 'text-amber-400 dark:text-amber-500',
    shadow: 'shadow-sm shadow-amber-500/5',
  },
  practical: {
    border: 'border-green-500',
    borderLeft: 'border-l-green-500',
    borderOuter: 'border-green-200 dark:border-green-800',
    icon: '🛠️',
    chevron: 'text-green-400 dark:text-green-500',
    shadow: 'shadow-sm shadow-green-500/5',
  },
} as const;

export type QuestionType = keyof typeof typeColors;

// --- Type dot colors (used by SectionCard, section page) ---
export const typeDotColors: Record<string, string> = {
  basic: '#9ca3af',
  deep: '#3b82f6',
  trick: '#f59e0b',
  practical: '#22c55e',
};

export const typeDotClasses: Record<string, string> = {
  basic: 'bg-gray-400',
  deep: 'bg-blue-500',
  trick: 'bg-amber-500',
  practical: 'bg-green-500',
};

export const typeTextClasses: Record<string, string> = {
  basic: 'text-gray-600 dark:text-gray-400',
  deep: 'text-blue-700 dark:text-blue-300',
  trick: 'text-amber-700 dark:text-amber-300',
  practical: 'text-green-700 dark:text-green-300',
};

// --- Section colors (used by SectionCard, section page) ---
interface SectionColor {
  gradientFrom: string;
  gradientTo: string;
}

const defaultSectionColor: SectionColor = {
  gradientFrom: '#f1f5f9',
  gradientTo: '#e2e8f0',
};

const sectionColorMap: Record<string, SectionColor> = {
  qa:                    { gradientFrom: '#e0f2fe', gradientTo: '#bfdbfe' },
  'automation-qa':       { gradientFrom: '#cffafe', gradientTo: '#a5f3fc' },
  python:                { gradientFrom: '#f7fee7', gradientTo: '#d9f99d' },
  playwright:            { gradientFrom: '#ede9fe', gradientTo: '#c4b5fd' },
  'performance-testing': { gradientFrom: '#fff7ed', gradientTo: '#fed7aa' },
  java:                  { gradientFrom: '#fef2f2', gradientTo: '#fecaca' },
  docker:                { gradientFrom: '#e0f2fe', gradientTo: '#bae6fd' },
  kubernetes:            { gradientFrom: '#eef2ff', gradientTo: '#c7d2fe' },
  blockchain:            { gradientFrom: '#ecfdf5', gradientTo: '#a7f3d0' },
  sql:                   { gradientFrom: '#fefce8', gradientTo: '#fef08a' },
};

export function getSectionColor(slug: string): SectionColor {
  return sectionColorMap[slug] ?? defaultSectionColor;
}
