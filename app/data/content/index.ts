import type { SupportedLocale } from '@/config/locales';
import type { EnglishContent } from './en';

export type PortfolioContent = EnglishContent;

interface PortfolioContentModule {
  default: PortfolioContent;
}

const contentLoaders = {
  de: () => import('./de'),
  en: () => import('./en'),
  es: () => import('./es'),
  fr: () => import('./fr'),
  it: () => import('./it'),
  pl: () => import('./pl'),
} satisfies Record<SupportedLocale, () => Promise<PortfolioContentModule>>;

const contentCache = new Map<SupportedLocale, Promise<PortfolioContent>>();

/** Loads one complete locale bundle and reuses it for later page navigation. */
export function loadPortfolioContent(locale: SupportedLocale): Promise<PortfolioContent> {
  const cachedContent = contentCache.get(locale);
  if (cachedContent) return cachedContent;

  const content = contentLoaders[locale]()
    .then((module) => module.default)
    .catch((error: unknown) => {
      contentCache.delete(locale);
      throw error;
    });

  contentCache.set(locale, content);
  return content;
}
