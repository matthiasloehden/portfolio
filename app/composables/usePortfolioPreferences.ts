export type ThemePreference = 'system' | 'light' | 'dark';

export type BackgroundPreference = 'auto' | 'wave' | 'particles' | 'triangles' | 'mesh' | 'none';

const THEME_STORAGE_KEY = 'portfolio-theme';
const BACKGROUND_STORAGE_KEY = 'portfolio-background';
const BACKGROUND_MOTION_STORAGE_KEY = 'portfolio-background-motion';

const themePreferences: readonly ThemePreference[] = ['system', 'light', 'dark'];

const backgroundPreferences: readonly BackgroundPreference[] = [
  'auto',
  'wave',
  'particles',
  'triangles',
  'mesh',
  'none',
];

let colorSchemeQuery: MediaQueryList | null = null;
let initialized = false;

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && themePreferences.includes(value as ThemePreference);
}

function isBackgroundPreference(value: unknown): value is BackgroundPreference {
  return typeof value === 'string' && backgroundPreferences.includes(value as BackgroundPreference);
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Preferences still work when storage is unavailable.
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The in-memory preference still applies when storage is unavailable.
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // The in-memory preference still applies when storage is unavailable.
  }
}

export function usePortfolioPreferences() {
  const themePreference = useState<ThemePreference>('portfolio-theme-preference', () => 'system');

  const backgroundPreference = useState<BackgroundPreference>('portfolio-background-preference', () => 'auto');

  const backgroundMotionEnabled = useState<boolean>('portfolio-background-motion', () => true);

  function applyTheme(): void {
    if (!import.meta.client) return;

    const isDark =
      themePreference.value === 'dark' || (themePreference.value === 'system' && colorSchemeQuery?.matches === true);

    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

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

    if (preference === 'system') {
      removeStorage(THEME_STORAGE_KEY);
    } else {
      writeStorage(THEME_STORAGE_KEY, preference);
    }
  }

  function setBackgroundPreference(preference: BackgroundPreference): void {
    backgroundPreference.value = preference;

    if (!import.meta.client) return;

    writeStorage(BACKGROUND_STORAGE_KEY, preference);
  }

  function setBackgroundMotionEnabled(enabled: boolean): void {
    backgroundMotionEnabled.value = enabled;
    applyBackgroundMotion();

    if (!import.meta.client) return;

    writeStorage(BACKGROUND_MOTION_STORAGE_KEY, String(enabled));
  }

  function syncSystemTheme(): void {
    if (themePreference.value === 'system') {
      applyTheme();
    }
  }

  function initializePreferences(): void {
    if (!import.meta.client || initialized) return;

    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const storedTheme = readStorage(THEME_STORAGE_KEY);
    const storedBackground = readStorage(BACKGROUND_STORAGE_KEY);
    const storedMotion = readStorage(BACKGROUND_MOTION_STORAGE_KEY);

    themePreference.value = isThemePreference(storedTheme) ? storedTheme : 'system';

    backgroundPreference.value = isBackgroundPreference(storedBackground) ? storedBackground : 'auto';

    backgroundMotionEnabled.value = storedMotion !== 'false';

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
