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
  'automation-qa': {
    ua: { name: 'Automation QA', description: 'Автоматизоване тестування', icon: '🤖' },
    en: { name: 'Automation QA', description: 'Test automation fundamentals', icon: '🤖' },
  },
  python: {
    ua: { name: 'Python', description: 'Мова програмування Python та екосистема тестування', icon: '🐍' },
    en: { name: 'Python', description: 'Python programming language and testing ecosystem', icon: '🐍' },
  },
  playwright: {
    ua: { name: 'Playwright', description: 'UI автоматизація з Playwright', icon: '🎭' },
    en: { name: 'Playwright', description: 'UI automation with Playwright', icon: '🎭' },
  },
  'performance-testing': {
    ua: { name: 'Performance Testing', description: 'Тестування продуктивності', icon: '⚡' },
    en: { name: 'Performance Testing', description: 'Performance testing', icon: '⚡' },
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

export function getSectionMeta(slug: string, locale: Locale): SectionMeta | undefined {
  return sections[slug]?.[locale];
}

export function getAllSectionSlugs(): string[] {
  return Object.keys(sections);
}
