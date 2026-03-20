import type { Locale } from './ui';

export interface SectionMeta {
  name: string;
  description: string;
  icon: string;
}

export const sections: Record<string, Record<Locale, SectionMeta>> = {
  qa: {
    ua: { name: 'QA', description: 'Основи тестування програмного забезпечення', icon: '🧪' },
    en: { name: 'QA', description: 'Software testing fundamentals', icon: '🧪' },
  },
  java: {
    ua: { name: 'Java', description: 'Мова програмування Java та екосистема', icon: '☕' },
    en: { name: 'Java', description: 'Java programming language and ecosystem', icon: '☕' },
  },
  docker: {
    ua: { name: 'Docker', description: 'Контейнеризація та Docker', icon: '🐳' },
    en: { name: 'Docker', description: 'Containerization and Docker', icon: '🐳' },
  },
};

export function getSectionMeta(slug: string, locale: Locale): SectionMeta | undefined {
  return sections[slug]?.[locale];
}

export function getAllSectionSlugs(): string[] {
  return Object.keys(sections);
}
