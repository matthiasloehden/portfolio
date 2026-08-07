export type ThemePreference = 'system' | 'light' | 'dark';
export type BackgroundPreference = 'auto' | 'wave' | 'particles' | 'triangles' | 'none';

const THEME_STORAGE_KEY = 'portfolio-theme';
const BACKGROUND_STORAGE_KEY = 'portfolio-background';
const BACKGROUND_MOTION_STORAGE_KEY = 'portfolio-background-motion';

const themePreferences: ThemePreference[] = ['system', 'light', 'dark'];
const backgroundPreferences: BackgroundPreference[] = ['auto', 'wave', 'particles', 'triangles', 'none'];

let colorSchemeQuery: MediaQueryList | null = null;
let initialized = false;

function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && themePreferences.includes(value as ThemePreference);
}

function isBackgroundPreference(value: string | null): value is BackgroundPreference {
  return value !== null && backgroundPreferences.includes(value as BackgroundPreference);
}

export function usePortfolioPreferences() {
  const themePreference = useState<ThemePreference>('portfolio-theme-preference', () => 'system');
  const backgroundPreference = useState<BackgroundPreference>('portfolio-background-preference', () => 'auto');
  const backgroundMotionEnabled = useState<boolean>('portfolio-background-motion', () => true);

  function applyTheme(): void {
    if (!import.meta.client) return;
    const dark = themePreference.value === 'dark' || (themePreference.value === 'system' && colorSchemeQuery?.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    window.dispatchEvent(new CustomEvent('portfolio-theme-change'));
  }

  function applyBackgroundMotion(): void {
    if (!import.meta.client) return;
    document.documentElement.dataset.backgroundMotion = backgroundMotionEnabled.value ? 'playing' : 'paused';
  }

  function setThemePreference(preference: ThemePreference): void {
    themePreference.value = preference;
    applyTheme();
    if (!import.meta.client) return;

    try {
      if (preference === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // The preference still applies while storage is unavailable.
    }
  }

  function setBackgroundPreference(preference: BackgroundPreference): void {
    backgroundPreference.value = preference;
    if (!import.meta.client) return;

    try {
      localStorage.setItem(BACKGROUND_STORAGE_KEY, preference);
    } catch {
      // The preference still applies while storage is unavailable.
    }
  }

  function setBackgroundMotionEnabled(enabled: boolean): void {
    backgroundMotionEnabled.value = enabled;
    applyBackgroundMotion();
    if (!import.meta.client) return;

    try {
      localStorage.setItem(BACKGROUND_MOTION_STORAGE_KEY, String(enabled));
    } catch {
      // The preference still applies while storage is unavailable.
    }
  }

  function syncSystemTheme(): void {
    if (themePreference.value === 'system') applyTheme();
  }

  function initializePreferences(): void {
    if (!import.meta.client || initialized) return;

    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const storedBackground = localStorage.getItem(BACKGROUND_STORAGE_KEY);
      const storedMotion = localStorage.getItem(BACKGROUND_MOTION_STORAGE_KEY);

      themePreference.value = isThemePreference(storedTheme) ? storedTheme : 'system';
      backgroundPreference.value = isBackgroundPreference(storedBackground) ? storedBackground : 'auto';
      backgroundMotionEnabled.value = storedMotion !== 'false';
    } catch {
      // Defaults remain available when storage is unavailable.
    }

    applyTheme();
    applyBackgroundMotion();
    colorSchemeQuery.addEventListener('change', syncSystemTheme);
    initialized = true;
  }

  function disposePreferences(): void {
    if (!initialized) return;
    colorSchemeQuery?.removeEventListener('change', syncSystemTheme);
    colorSchemeQuery = null;
    initialized = false;
  }

  return {
    themePreference,
    backgroundPreference,
    backgroundMotionEnabled,
    setThemePreference,
    setBackgroundPreference,
    setBackgroundMotionEnabled,
    initializePreferences,
    disposePreferences,
  };
}
