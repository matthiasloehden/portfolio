/**
 * Stores display preferences and synchronizes browser-only effects such as
 * theme attributes. General animation controls and per-scene advanced options
 * are persisted independently, keeping future background additions isolated.
 */

import {
  createBackgroundAnimationSettings,
  createDefaultBackgroundAdvancedSettings,
  createDefaultBackgroundAnimationSettings,
  createWaveGridSettings,
  type BackgroundAnimation,
  type BackgroundAdvancedSettings,
  type BackgroundAnimationSettings,
  type BackgroundPreference,
  type WaveGridSetting,
  type WaveGridSettings,
} from '@/types/background';

export type {
  BackgroundAnimation,
  BackgroundAdvancedSettings,
  BackgroundAnimationSettings,
  BackgroundPreference,
  WaveGridSetting,
  WaveGridSettings,
} from '@/types/background';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-theme';
const BACKGROUND_STORAGE_KEY = 'portfolio-background';
const BACKGROUND_ANIMATIONS_STORAGE_KEY = 'portfolio-background-animations';
const BACKGROUND_ADVANCED_SETTINGS_STORAGE_KEY = 'portfolio-background-advanced-settings';
const LEGACY_BACKGROUND_MOTION_STORAGE_KEY = 'portfolio-background-motion';

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

function isBackgroundAnimationSettings(value: unknown): value is BackgroundAnimationSettings {
  if (typeof value !== 'object' || value === null) return false;

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.idle === 'boolean' &&
    typeof settings.cursorMovement === 'boolean' &&
    typeof settings.cursorClick === 'boolean' &&
    typeof settings.scroll === 'boolean'
  );
}

function isLegacyBackgroundAnimationSettings(value: unknown): value is {
  idle: boolean;
  cursor: boolean;
  scroll: boolean;
} {
  if (typeof value !== 'object' || value === null) return false;

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.idle === 'boolean' && typeof settings.cursor === 'boolean' && typeof settings.scroll === 'boolean'
  );
}

function isWaveGridSettings(value: unknown): value is WaveGridSettings {
  if (typeof value !== 'object' || value === null) return false;

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.gridWidth === 'number' &&
    typeof settings.gridDepth === 'number' &&
    typeof settings.gridSpacing === 'number' &&
    typeof settings.vertexStep === 'number' &&
    typeof settings.trailLength === 'number' &&
    typeof settings.trailLifetime === 'number' &&
    typeof settings.pixelRatioCap === 'number'
  );
}

function isBackgroundAdvancedSettings(value: unknown): value is BackgroundAdvancedSettings {
  if (typeof value !== 'object' || value === null) return false;

  return isWaveGridSettings((value as Record<string, unknown>).wave);
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

function readBackgroundAnimationSettings(): BackgroundAnimationSettings {
  const storedSettings = readStorage(BACKGROUND_ANIMATIONS_STORAGE_KEY);

  if (storedSettings !== null) {
    try {
      const parsedSettings: unknown = JSON.parse(storedSettings);

      if (isBackgroundAnimationSettings(parsedSettings)) {
        return createBackgroundAnimationSettings(parsedSettings);
      }

      if (isLegacyBackgroundAnimationSettings(parsedSettings)) {
        return createBackgroundAnimationSettings({
          idle: parsedSettings.idle,
          cursorMovement: parsedSettings.cursor,
          cursorClick: parsedSettings.cursor,
          scroll: parsedSettings.scroll,
        });
      }
    } catch {
      // Invalid stored data falls back to a safe default below.
    }
  }

  const legacyMotionEnabled = readStorage(LEGACY_BACKGROUND_MOTION_STORAGE_KEY) !== 'false';

  return createBackgroundAnimationSettings({
    idle: legacyMotionEnabled,
    cursorMovement: legacyMotionEnabled,
    cursorClick: legacyMotionEnabled,
    scroll: legacyMotionEnabled,
  });
}

function readBackgroundAdvancedSettings(): BackgroundAdvancedSettings {
  const storedSettings = readStorage(BACKGROUND_ADVANCED_SETTINGS_STORAGE_KEY);

  if (storedSettings === null) return createDefaultBackgroundAdvancedSettings();

  try {
    const parsedSettings: unknown = JSON.parse(storedSettings);

    if (isBackgroundAdvancedSettings(parsedSettings)) {
      return {
        wave: createWaveGridSettings(parsedSettings.wave),
      };
    }
  } catch {
    // Invalid stored data falls back to the defaults below.
  }

  return createDefaultBackgroundAdvancedSettings();
}

export function usePortfolioPreferences() {
  const themePreference = useState<ThemePreference>('portfolio-theme-preference', () => 'system');

  const backgroundPreference = useState<BackgroundPreference>('portfolio-background-preference', () => 'auto');

  const backgroundAnimations = useState<BackgroundAnimationSettings>(
    'portfolio-background-animations',
    createDefaultBackgroundAnimationSettings,
  );

  const backgroundAdvancedSettings = useState<BackgroundAdvancedSettings>(
    'portfolio-background-advanced-settings',
    createDefaultBackgroundAdvancedSettings,
  );

  function applyTheme(): void {
    if (!import.meta.client) return;

    const isDark =
      themePreference.value === 'dark' || (themePreference.value === 'system' && colorSchemeQuery?.matches === true);

    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

    window.dispatchEvent(new CustomEvent('portfolio-theme-change'));
  }

  function applyBackgroundAnimationState(): void {
    if (!import.meta.client) return;

    const hasEnabledAnimation = Object.values(backgroundAnimations.value).some(Boolean);

    document.documentElement.dataset.backgroundMotion = hasEnabledAnimation ? 'playing' : 'paused';
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

  function setBackgroundAnimationEnabled(animation: BackgroundAnimation, enabled: boolean): void {
    backgroundAnimations.value = createBackgroundAnimationSettings({
      ...backgroundAnimations.value,
      [animation]: enabled,
    });

    applyBackgroundAnimationState();

    if (!import.meta.client) return;

    writeStorage(BACKGROUND_ANIMATIONS_STORAGE_KEY, JSON.stringify(backgroundAnimations.value));
  }

  function setWaveGridSetting(setting: WaveGridSetting, value: number): void {
    backgroundAdvancedSettings.value = {
      ...backgroundAdvancedSettings.value,
      wave: createWaveGridSettings({
        ...backgroundAdvancedSettings.value.wave,
        [setting]: value,
      }),
    };

    if (!import.meta.client) return;

    writeStorage(BACKGROUND_ADVANCED_SETTINGS_STORAGE_KEY, JSON.stringify(backgroundAdvancedSettings.value));
  }

  function restoreDefaultSettings(): void {
    themePreference.value = 'system';
    backgroundPreference.value = 'auto';
    backgroundAnimations.value = createDefaultBackgroundAnimationSettings();
    backgroundAdvancedSettings.value = createDefaultBackgroundAdvancedSettings();

    applyTheme();
    applyBackgroundAnimationState();

    if (!import.meta.client) return;

    removeStorage(THEME_STORAGE_KEY);
    removeStorage(BACKGROUND_STORAGE_KEY);
    removeStorage(BACKGROUND_ANIMATIONS_STORAGE_KEY);
    removeStorage(BACKGROUND_ADVANCED_SETTINGS_STORAGE_KEY);
    removeStorage(LEGACY_BACKGROUND_MOTION_STORAGE_KEY);
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

    themePreference.value = isThemePreference(storedTheme) ? storedTheme : 'system';

    backgroundPreference.value = isBackgroundPreference(storedBackground) ? storedBackground : 'auto';

    backgroundAnimations.value = readBackgroundAnimationSettings();
    backgroundAdvancedSettings.value = readBackgroundAdvancedSettings();

    applyTheme();
    applyBackgroundAnimationState();

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
    backgroundAnimations,
    backgroundAdvancedSettings,
    setThemePreference,
    setBackgroundPreference,
    setBackgroundAnimationEnabled,
    setWaveGridSetting,
    restoreDefaultSettings,
    initializePreferences,
    disposePreferences,
  };
}
