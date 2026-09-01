import { contentByLocale } from '@/data/content';
import { isSupportedLocale } from '@/config/locales';

export function usePortfolioContent() {
  const { locale } = useI18n();

  return computed(() => contentByLocale[isSupportedLocale(locale.value) ? locale.value : 'en']);
}
