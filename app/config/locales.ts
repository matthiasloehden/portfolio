export const LOCALE_DEFINITIONS = [
  { code: 'en', name: 'English', language: 'en-US', file: 'en.ts', quality: 'recommended' },
  { code: 'de', name: 'Deutsch', language: 'de-DE', file: 'de.ts', quality: 'reviewed' },
  { code: 'fr', name: 'Français', language: 'fr-FR', file: 'fr.ts', quality: 'machine' },
  { code: 'es', name: 'Español', language: 'es-ES', file: 'es.ts', quality: 'machine' },
  { code: 'it', name: 'Italiano', language: 'it-IT', file: 'it.ts', quality: 'machine' },
  { code: 'pl', name: 'Polski', language: 'pl-PL', file: 'pl.ts', quality: 'machine' },
] as const;

export const DEFAULT_LOCALE = 'en' as const;
export const AUTOMATIC_LOCALE = 'auto' as const;
export type SupportedLocale = (typeof LOCALE_DEFINITIONS)[number]['code'];
export type LocaleTranslationQuality = (typeof LOCALE_DEFINITIONS)[number]['quality'];
export type LanguagePreference = SupportedLocale | typeof AUTOMATIC_LOCALE;

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = LOCALE_DEFINITIONS.map(({ code }) => code);

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.some((candidate) => candidate === locale);
}

export function getLocaleDefinition(locale: SupportedLocale) {
  const definition = LOCALE_DEFINITIONS.find(({ code }) => code === locale);

  if (!definition) {
    throw new Error(`Missing locale definition for supported locale: ${locale}`);
  }

  return definition;
}
