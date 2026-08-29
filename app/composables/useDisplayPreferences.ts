/**
 * Owns reactive display preferences and browser-only side effects.
 *
 * Persistence parsing and migrations stay in displayPreferencesStorage, while
 * scene-specific setting rules stay in the background settings registry. This
 * composable only coordinates Vue state, DOM effects and user actions.
 */

import {
  createBackgroundSettingOverrides,
  removeBackgroundSettingOverride,
  updateBackgroundSettingOverride,
} from '@/domain/backgrounds/settingOverrides';
import {
  createBackgroundAnimationSettings,
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/domain/backgrounds/preferences';
import { createDefaultThemeSettings } from '@/domain/themes/settings';
import {
  clearThemeColorOverrides,
  removeThemeColorOverride,
  updateThemeBodyFont,
  updateThemeColorOverride,
  updateThemeDisplayFont,
  updateThemePreset,
} from '@/domain/themes/updates';
import { createDisplayPreferencesStorage } from '@/utils/displayPreferencesStorage';
import { createDefaultDisplayPreferences, hasCustomDisplayPreferences } from '@/domain/displayPreferences/defaults';
import type {
  BackgroundAnimation,
  BackgroundAnimationSettings,
  BackgroundId,
  BackgroundPerformanceMode,
  BackgroundPerformanceSettings,
  BackgroundPreference,
  BackgroundSettingKey,
  BackgroundSettingOverridesMap,
} from '@/types/background';
import type { DisplayPreferencesState, ThemePreference } from '@/types/display';
import type {
  ThemeBodyFontId,
  ThemeColorToken,
  ThemeDisplayFontId,
  ThemeMode,
  ThemePresetId,
  ThemeSettings,
} from '@/types/theme';
import { applyThemeToDocument } from '@/utils/themeRuntime';

// Renderer updates stay immediate; only rapid slider-driven storage writes are coalesced.
const BACKGROUND_SETTINGS_PERSIST_DELAY = 100;

let colorSchemeQuery: MediaQueryList | null = null;
let initialized = false;
let pendingDisplayPreferences: DisplayPreferencesState | null = null;
let displayPreferencesWriteTimer: ReturnType<typeof setTimeout> | null = null;
const preferencesStorage = createDisplayPreferencesStorage();

function cancelPendingDisplayPreferencesWrite(): void {
  if (displayPreferencesWriteTimer !== null) clearTimeout(displayPreferencesWriteTimer);

  displayPreferencesWriteTimer = null;
  pendingDisplayPreferences = null;
}

function flushPendingDisplayPreferencesWrite(): void {
  if (displayPreferencesWriteTimer !== null) clearTimeout(displayPreferencesWriteTimer);

  displayPreferencesWriteTimer = null;

  if (!pendingDisplayPreferences) return;

  preferencesStorage.writePreferences(pendingDisplayPreferences);
  pendingDisplayPreferences = null;
}

function scheduleDisplayPreferencesWrite(preferences: DisplayPreferencesState): void {
  pendingDisplayPreferences = preferences;

  if (displayPreferencesWriteTimer !== null) clearTimeout(displayPreferencesWriteTimer);

  displayPreferencesWriteTimer = setTimeout(flushPendingDisplayPreferencesWrite, BACKGROUND_SETTINGS_PERSIST_DELAY);
}

export function useDisplayPreferences() {
  const themePreference = useState<ThemePreference>('portfolio-theme-preference', () => 'system');
  const resolvedThemeMode = useState<ThemeMode>('portfolio-resolved-theme-mode', () => 'dark');
  const themeSettings = useState<ThemeSettings>('portfolio-theme-settings', createDefaultThemeSettings);
  const backgroundPreference = useState<BackgroundPreference>('portfolio-background-preference', () => 'auto');
  const backgroundAnimations = useState<BackgroundAnimationSettings>(
    'portfolio-background-animations',
    createDefaultBackgroundAnimationSettings,
  );
  const backgroundPerformance = useState<BackgroundPerformanceSettings>(
    'portfolio-background-performance',
    createDefaultBackgroundPerformanceSettings,
  );
  const backgroundSettingOverrides = useState<BackgroundSettingOverridesMap>(
    'portfolio-background-setting-overrides',
    createBackgroundSettingOverrides,
  );
  const hasDisplayPreferenceChanges = computed(() =>
    hasCustomDisplayPreferences(currentDisplayPreferences(), themePreference.value),
  );

  function currentDisplayPreferences(): DisplayPreferencesState {
    return {
      themeSettings: themeSettings.value,
      backgroundPreference: backgroundPreference.value,
      backgroundAnimations: backgroundAnimations.value,
      backgroundPerformance: backgroundPerformance.value,
      backgroundSettingOverrides: backgroundSettingOverrides.value,
    };
  }

  function persistDisplayPreferences(): void {
    if (!import.meta.client) return;

    cancelPendingDisplayPreferencesWrite();
    preferencesStorage.writePreferences(currentDisplayPreferences());
  }

  function persistBackgroundSettings(): void {
    if (import.meta.client) scheduleDisplayPreferencesWrite(currentDisplayPreferences());
  }

  function applyTheme(): void {
    if (!import.meta.client) return;

    const isDark =
      themePreference.value === 'dark' || (themePreference.value === 'system' && colorSchemeQuery?.matches === true);
    const mode: ThemeMode = isDark ? 'dark' : 'light';

    resolvedThemeMode.value = mode;
    applyThemeToDocument(themeSettings.value, mode);
  }

  function applyBackgroundAnimationState(): void {
    if (!import.meta.client) return;

    const hasEnabledAnimation = Object.values(backgroundAnimations.value).some(Boolean);
    document.documentElement.dataset.backgroundMotion = hasEnabledAnimation ? 'playing' : 'paused';
  }

  function setThemePreference(preference: ThemePreference): void {
    themePreference.value = preference;
    applyTheme();
    if (import.meta.client) preferencesStorage.writeThemePreference(preference);
  }

  function setThemePreset(preset: ThemePresetId): void {
    themeSettings.value = updateThemePreset(themeSettings.value, preset);
    applyTheme();
    persistDisplayPreferences();
  }

  function setThemeDisplayFont(display: ThemeDisplayFontId): void {
    themeSettings.value = updateThemeDisplayFont(themeSettings.value, display);
    applyTheme();
    persistDisplayPreferences();
  }

  function setThemeBodyFont(body: ThemeBodyFontId): void {
    themeSettings.value = updateThemeBodyFont(themeSettings.value, body);
    applyTheme();
    persistDisplayPreferences();
  }

  function setThemeColor(token: ThemeColorToken, color: string): void {
    const mode = resolvedThemeMode.value;
    const updated = updateThemeColorOverride(themeSettings.value, mode, token, color);
    if (updated === themeSettings.value) return;

    themeSettings.value = updated;
    applyTheme();
    persistDisplayPreferences();
  }

  function resetThemeColor(token: ThemeColorToken): void {
    const mode = resolvedThemeMode.value;
    themeSettings.value = removeThemeColorOverride(themeSettings.value, mode, token);
    applyTheme();
    persistDisplayPreferences();
  }

  function resetCurrentThemeColors(): void {
    const mode = resolvedThemeMode.value;
    const updated = clearThemeColorOverrides(themeSettings.value, mode);
    if (updated === themeSettings.value) return;

    themeSettings.value = updated;
    applyTheme();
    persistDisplayPreferences();
  }

  function setBackgroundPreference(preference: BackgroundPreference): void {
    backgroundPreference.value = preference;
    persistDisplayPreferences();
  }

  function setBackgroundAnimationEnabled(animation: BackgroundAnimation, enabled: boolean): void {
    backgroundAnimations.value = createBackgroundAnimationSettings({
      ...backgroundAnimations.value,
      [animation]: enabled,
    });
    applyBackgroundAnimationState();
    persistDisplayPreferences();
  }

  function setBackgroundSetting<Id extends BackgroundId>(
    background: Id,
    setting: BackgroundSettingKey<Id>,
    value: number,
  ): void {
    if (!Number.isFinite(value)) return;

    backgroundSettingOverrides.value = updateBackgroundSettingOverride(
      backgroundSettingOverrides.value,
      background,
      setting,
      value,
    );
    persistBackgroundSettings();
  }

  function resetBackgroundSetting<Id extends BackgroundId>(background: Id, setting: BackgroundSettingKey<Id>): void {
    backgroundSettingOverrides.value = removeBackgroundSettingOverride(
      backgroundSettingOverrides.value,
      background,
      setting,
    );
    persistDisplayPreferences();
  }

  function resetBackgroundSettings(background: BackgroundId): void {
    if (Object.keys(backgroundSettingOverrides.value[background]).length === 0) return;

    backgroundSettingOverrides.value = { ...backgroundSettingOverrides.value, [background]: {} };
    persistDisplayPreferences();
  }

  function setBackgroundPerformanceMode(mode: BackgroundPerformanceMode): void {
    backgroundPerformance.value = { ...backgroundPerformance.value, mode };
    persistDisplayPreferences();
  }

  function setBackgroundPerformanceStatsEnabled(showStats: boolean): void {
    backgroundPerformance.value = { ...backgroundPerformance.value, showStats };
    persistDisplayPreferences();
  }

  function restoreDefaultSettings(): void {
    themePreference.value = 'system';
    const defaults = createDefaultDisplayPreferences();
    themeSettings.value = defaults.themeSettings;
    backgroundPreference.value = defaults.backgroundPreference;
    backgroundAnimations.value = defaults.backgroundAnimations;
    backgroundPerformance.value = defaults.backgroundPerformance;
    backgroundSettingOverrides.value = defaults.backgroundSettingOverrides;

    applyTheme();
    applyBackgroundAnimationState();
    if (import.meta.client) {
      cancelPendingDisplayPreferencesWrite();
      preferencesStorage.clear();
    }
  }

  function syncSystemTheme(): void {
    if (themePreference.value === 'system') applyTheme();
  }

  function initializePreferences(): void {
    if (!import.meta.client || initialized) return;

    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = preferencesStorage.readPreferences();

    themePreference.value = preferencesStorage.readThemePreference();
    themeSettings.value = stored.themeSettings;
    backgroundPreference.value = stored.backgroundPreference;
    backgroundAnimations.value = stored.backgroundAnimations;
    backgroundPerformance.value = stored.backgroundPerformance;
    backgroundSettingOverrides.value = stored.backgroundSettingOverrides;

    applyTheme();
    applyBackgroundAnimationState();
    colorSchemeQuery.addEventListener('change', syncSystemTheme);
    window.addEventListener('pagehide', flushPendingDisplayPreferencesWrite);
    initialized = true;
  }

  function disposePreferences(): void {
    if (!initialized) return;

    flushPendingDisplayPreferencesWrite();
    colorSchemeQuery?.removeEventListener('change', syncSystemTheme);
    window.removeEventListener('pagehide', flushPendingDisplayPreferencesWrite);
    colorSchemeQuery = null;
    initialized = false;
  }

  return {
    themePreference,
    resolvedThemeMode,
    themeSettings,
    backgroundPreference,
    backgroundAnimations,
    backgroundPerformance,
    backgroundSettingOverrides,
    hasDisplayPreferenceChanges,
    setThemePreference,
    setThemePreset,
    setThemeDisplayFont,
    setThemeBodyFont,
    setThemeColor,
    resetThemeColor,
    resetCurrentThemeColors,
    setBackgroundPreference,
    setBackgroundAnimationEnabled,
    setBackgroundSetting,
    resetBackgroundSetting,
    resetBackgroundSettings,
    setBackgroundPerformanceMode,
    setBackgroundPerformanceStatsEnabled,
    restoreDefaultSettings,
    initializePreferences,
    disposePreferences,
  };
}
