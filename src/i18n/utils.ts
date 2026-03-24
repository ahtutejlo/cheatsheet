import { ui, defaultLocale, type Locale, locales } from './ui';

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale)) return lang as Locale;
  return defaultLocale;
}

export function t(locale: Locale, key: keyof (typeof ui)[typeof defaultLocale]): string {
  return ui[locale][key] || ui[defaultLocale][key];
}

export function localePath(locale: Locale, path: string = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${locale}${path ? '/' + path : ''}`;
}

/** Pick a locale-prefixed field from a bilingual data object.
 *  e.g. getLocalized(data, 'ua', 'name') → data.ua_name */
export function getLocalized<T extends Record<string, unknown>>(
  data: T,
  locale: Locale,
  field: string,
): string {
  return (data as Record<string, unknown>)[`${locale}_${field}`] as string;
}

/** Same as getLocalized but returns string[] */
export function getLocalizedArray<T extends Record<string, unknown>>(
  data: T,
  locale: Locale,
  field: string,
): string[] {
  return (data as Record<string, unknown>)[`${locale}_${field}`] as string[];
}

export { type Locale, defaultLocale, locales } from './ui';
