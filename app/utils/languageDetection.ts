import { DEFAULT_LOCALE, LOCALE_DEFINITIONS, type SupportedLocale } from '@/config/locales';

export function resolveBrowserLocale(languages: readonly string[]): SupportedLocale {
  for (const language of languages) {
    const normalizedLanguage = language.trim().replace('_', '-').toLowerCase();
    if (!normalizedLanguage) continue;

    const exactMatch = LOCALE_DEFINITIONS.find((locale) => locale.language.toLowerCase() === normalizedLanguage);
    if (exactMatch) return exactMatch.code;

    const baseLanguage = normalizedLanguage.split('-')[0];
    const baseMatch = LOCALE_DEFINITIONS.find((locale) => locale.code === baseLanguage);
    if (baseMatch) return baseMatch.code;
  }

  return DEFAULT_LOCALE;
}
