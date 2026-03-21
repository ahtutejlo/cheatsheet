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
    'theme.toggle': 'Перемкнути тему',
    'section.empty.title': 'Питань поки немає',
    'section.empty.body': 'Цей розділ ще наповнюється. Поверніться пізніше.',
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
    'theme.toggle': 'Toggle dark mode',
    'section.empty.title': 'No questions yet',
    'section.empty.body': 'This section is being populated. Check back soon.',
  },
} as const;

export type Locale = keyof typeof ui;
export const defaultLocale: Locale = 'ua';
export const locales: Locale[] = ['ua', 'en'];
