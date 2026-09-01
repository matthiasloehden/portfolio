import {
  AUTOMATIC_LOCALE,
  DEFAULT_LOCALE,
  type LanguagePreference,
  type SupportedLocale,
  isSupportedLocale,
} from '@/config/locales';
import { resolveBrowserLocale } from '@/utils/languageDetection';

const LANGUAGE_PREFERENCE_COOKIE = 'portfolio-language-preference';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function useLanguagePreference() {
  const { locale } = useI18n();
  const route = useRoute();
  const switchLocalePath = useSwitchLocalePath();
  const automaticPreference = useCookie<typeof AUTOMATIC_LOCALE | null>(LANGUAGE_PREFERENCE_COOKIE, {
    default: () => null,
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  const clientReady = ref(false);
  const automaticLocale = ref<SupportedLocale>(DEFAULT_LOCALE);

  const selectedPreference = computed<LanguagePreference>(() => {
    if (clientReady.value && automaticPreference.value === AUTOMATIC_LOCALE) {
      return AUTOMATIC_LOCALE;
    }

    return isSupportedLocale(locale.value) ? locale.value : DEFAULT_LOCALE;
  });
  const hasLanguagePreferenceChanges = computed(() => selectedPreference.value !== DEFAULT_LOCALE);

  function detectBrowserLocale(): SupportedLocale {
    if (!import.meta.client) return DEFAULT_LOCALE;

    const languages = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
    return resolveBrowserLocale(languages);
  }

  async function switchToLocale(nextLocale: SupportedLocale, replace = false): Promise<void> {
    const destination = switchLocalePath(nextLocale);
    if (destination && destination !== route.fullPath) {
      await navigateTo(destination, { replace });
    }
  }

  async function applyAutomaticLocale(replace = false): Promise<void> {
    automaticLocale.value = detectBrowserLocale();
    await switchToLocale(automaticLocale.value, replace);
  }

  async function setLanguagePreference(preference: LanguagePreference): Promise<void> {
    if (preference === AUTOMATIC_LOCALE) {
      automaticPreference.value = AUTOMATIC_LOCALE;
      await applyAutomaticLocale();
      return;
    }

    automaticPreference.value = null;
    await switchToLocale(preference);
  }

  async function restoreDefaultLanguagePreference(): Promise<void> {
    automaticPreference.value = null;
    automaticLocale.value = DEFAULT_LOCALE;
    await switchToLocale(DEFAULT_LOCALE);
  }

  function onBrowserLanguageChange(): void {
    if (automaticPreference.value === AUTOMATIC_LOCALE) void applyAutomaticLocale(true);
  }

  onMounted(() => {
    clientReady.value = true;
    if (automaticPreference.value === AUTOMATIC_LOCALE) void applyAutomaticLocale(true);
    window.addEventListener('languagechange', onBrowserLanguageChange);
  });
  onBeforeUnmount(() => window.removeEventListener('languagechange', onBrowserLanguageChange));

  return {
    automaticLocale: readonly(automaticLocale),
    hasLanguagePreferenceChanges,
    restoreDefaultLanguagePreference,
    selectedPreference,
    setLanguagePreference,
  };
}
