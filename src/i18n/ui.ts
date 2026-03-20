export const ui = {
  ua: {
    'site.title': 'Шпаргалка для співбесіди',
    'site.description': 'Підготовка до технічної співбесіди',
    'home.title': 'Розділи',
    'home.subtitle': 'Оберіть тему для підготовки',
    'section.questions': 'питань',
    'section.back': 'Назад до розділів',
    'flashcard.show': 'Показати відповідь',
    'nav.home': 'Головна',
  },
  en: {
    'site.title': 'Interview Cheatsheet',
    'site.description': 'Technical interview preparation',
    'home.title': 'Sections',
    'home.subtitle': 'Choose a topic to study',
    'section.questions': 'questions',
    'section.back': 'Back to sections',
    'flashcard.show': 'Show answer',
    'nav.home': 'Home',
  },
} as const;

export type Locale = keyof typeof ui;
export const defaultLocale: Locale = 'ua';
export const locales: Locale[] = ['ua', 'en'];
