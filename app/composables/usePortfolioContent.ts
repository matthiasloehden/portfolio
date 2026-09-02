import { DEFAULT_LOCALE, isSupportedLocale } from '@/config/locales';
import { loadPortfolioContent } from '@/data/content';
import type { PortfolioContent } from '@/data/content';

export async function usePortfolioContent() {
  const { locale } = useI18n();
  const resolvedLocale = computed(() => (isSupportedLocale(locale.value) ? locale.value : DEFAULT_LOCALE));
  const { data, error } = await useAsyncData(
    () => `portfolio-content-${resolvedLocale.value}`,
    () => loadPortfolioContent(resolvedLocale.value),
    { watch: [resolvedLocale] },
  );

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to load ${resolvedLocale.value} portfolio content`,
      cause: error.value,
    });
  }

  if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: `Portfolio content is unavailable for ${resolvedLocale.value}`,
    });
  }

  return computed<PortfolioContent>(() => {
    const content = data.value;
    if (!content) throw new Error(`Portfolio content is unavailable for ${resolvedLocale.value}`);
    return content;
  });
}
