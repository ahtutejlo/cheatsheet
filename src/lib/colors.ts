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
