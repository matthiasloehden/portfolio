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
let initialized = false;

export function useLanguagePreference() {
  const { locale } = useI18n();
  const route = useRoute();
  const switchLocalePath = useSwitchLocalePath();
  const storedAutomaticPreference = useCookie<typeof AUTOMATIC_LOCALE | null>(LANGUAGE_PREFERENCE_COOKIE, {
    default: () => null,
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  // The layout runtime and lazy settings panel need one reactive source of truth;
  // the cookie remains the persistence boundary instead of coordinating instances.
  const automaticPreference = useState<typeof AUTOMATIC_LOCALE | null>(
    'portfolio-automatic-language-preference',
    () => null,
  );
  const clientReady = useState('portfolio-language-preference-ready', () => false);
  const automaticLocale = useState<SupportedLocale>('portfolio-automatic-locale', () => DEFAULT_LOCALE);

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

  function persistAutomaticPreference(preference: typeof AUTOMATIC_LOCALE | null): void {
    automaticPreference.value = preference;
    storedAutomaticPreference.value = preference;
  }

  async function setLanguagePreference(preference: LanguagePreference): Promise<void> {
    if (preference === AUTOMATIC_LOCALE) {
      persistAutomaticPreference(AUTOMATIC_LOCALE);
      await applyAutomaticLocale();
      return;
    }

    persistAutomaticPreference(null);
    await switchToLocale(preference);
  }

  async function restoreDefaultLanguagePreference(): Promise<void> {
    persistAutomaticPreference(null);
    automaticLocale.value = DEFAULT_LOCALE;
    await switchToLocale(DEFAULT_LOCALE);
  }

  function onBrowserLanguageChange(): void {
    if (automaticPreference.value === AUTOMATIC_LOCALE) void applyAutomaticLocale(true);
  }

  function initializeLanguagePreference(): void {
    if (!import.meta.client || initialized) return;

    automaticPreference.value = storedAutomaticPreference.value;
    clientReady.value = true;
    if (automaticPreference.value === AUTOMATIC_LOCALE) void applyAutomaticLocale(true);
    window.addEventListener('languagechange', onBrowserLanguageChange);
    initialized = true;
  }

  function disposeLanguagePreference(): void {
    if (!initialized) return;

    window.removeEventListener('languagechange', onBrowserLanguageChange);
    initialized = false;
  }

  return {
    automaticLocale: readonly(automaticLocale),
    disposeLanguagePreference,
    hasLanguagePreferenceChanges,
    initializeLanguagePreference,
    restoreDefaultLanguagePreference,
    selectedPreference,
    setLanguagePreference,
  };
}
