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
import { resolveBackground } from '@/config/backgrounds/selection';
import { resolveThemePreset } from '@/config/themes/selection';
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
import { DEFAULT_THEME_PREFERENCE, type DisplayPreferencesState, type ThemePreference } from '@/types/display';
import type {
  ThemeBodyFontId,
  ThemeColorToken,
  ThemeDisplayFontId,
  ThemeMode,
  ThemePresetId,
  ThemePresetPreference,
  ThemeSettings,
} from '@/types/theme';
import { createCoalescedWriter } from '@/utils/coalescedWriter';
import { applyThemeToDocument } from '@/utils/themeRuntime';

// Renderer updates stay immediate; only rapid slider-driven storage writes are coalesced.
const BACKGROUND_SETTINGS_PERSIST_DELAY = 100;

let colorSchemeQuery: MediaQueryList | null = null;
let initialized = false;
let activeRoutePath = '/';
let themeRandomValue = 0;
let backgroundRandomValue = 0;
const preferencesStorage = createDisplayPreferencesStorage();
const backgroundSettingsWriter = createCoalescedWriter(
  (preferences: DisplayPreferencesState) => preferencesStorage.writePreferences(preferences),
  BACKGROUND_SETTINGS_PERSIST_DELAY,
);

export function useDisplayPreferences() {
  const themePreference = useState<ThemePreference>('portfolio-theme-preference', () => DEFAULT_THEME_PREFERENCE);
  const resolvedThemeMode = useState<ThemeMode>('portfolio-resolved-theme-mode', () => 'dark');
  const resolvedThemePreset = useState<ThemePresetId>('portfolio-resolved-theme-preset', () => 'arctic');
  const themeSettings = useState<ThemeSettings>('portfolio-theme-settings', createDefaultThemeSettings);
  const backgroundPreference = useState<BackgroundPreference>('portfolio-background-preference', () => 'auto');
  const resolvedBackground = useState<BackgroundId | 'none'>('portfolio-resolved-background', () => 'wave');
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

    backgroundSettingsWriter.cancel();
    preferencesStorage.writePreferences(currentDisplayPreferences());
  }

  function persistBackgroundSettings(): void {
    if (import.meta.client) backgroundSettingsWriter.schedule(currentDisplayPreferences());
  }

  function applyTheme(transition = false): void {
    if (!import.meta.client) return;

    const isDark =
      themePreference.value === 'dark' || (themePreference.value === 'system' && colorSchemeQuery?.matches === true);
    const mode: ThemeMode = isDark ? 'dark' : 'light';
    const preset = resolveThemePreset(activeRoutePath, themeSettings.value.preset, themeRandomValue);

    resolvedThemeMode.value = mode;
    resolvedThemePreset.value = preset;
    applyThemeToDocument(themeSettings.value, mode, preset, transition);
  }

  function applyBackgroundPreference(): void {
    resolvedBackground.value = resolveBackground(
      activeRoutePath,
      backgroundPreference.value,
      backgroundRandomValue,
    );
  }

  function createThemeRandomValue(): void {
    themeRandomValue = Math.random();
    if (import.meta.client) document.documentElement.dataset.themeRandomValue = String(themeRandomValue);
  }

  function applyBackgroundAnimationState(): void {
    if (!import.meta.client) return;

    const hasEnabledAnimation = Object.values(backgroundAnimations.value).some(Boolean);
    document.documentElement.dataset.backgroundMotion = hasEnabledAnimation ? 'playing' : 'paused';
  }

  function setThemePreference(preference: ThemePreference): void {
    themePreference.value = preference;
    applyTheme(true);
    if (import.meta.client) preferencesStorage.writeThemePreference(preference);
  }

  function setThemePreset(preset: ThemePresetPreference): void {
    themeSettings.value = updateThemePreset(themeSettings.value, preset);
    if (preset === 'random') createThemeRandomValue();
    applyTheme(true);
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
    if (preference === 'random') backgroundRandomValue = Math.random();
    applyBackgroundPreference();
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
    themePreference.value = DEFAULT_THEME_PREFERENCE;
    const defaults = createDefaultDisplayPreferences();
    themeSettings.value = defaults.themeSettings;
    backgroundPreference.value = defaults.backgroundPreference;
    backgroundAnimations.value = defaults.backgroundAnimations;
    backgroundPerformance.value = defaults.backgroundPerformance;
    backgroundSettingOverrides.value = defaults.backgroundSettingOverrides;

    applyTheme(true);
    applyBackgroundPreference();
    applyBackgroundAnimationState();
    if (import.meta.client) {
      backgroundSettingsWriter.cancel();
      preferencesStorage.clear();
    }
  }

  function syncSystemTheme(): void {
    if (themePreference.value === 'system') applyTheme(true);
  }

  function syncDisplayForRoute(path: string): void {
    activeRoutePath = path;
    if (themeSettings.value.preset === 'random') createThemeRandomValue();
    if (themeSettings.value.preset === 'auto' || themeSettings.value.preset === 'random') applyTheme(true);

    if (backgroundPreference.value === 'random') backgroundRandomValue = Math.random();
    applyBackgroundPreference();
  }

  function initializePreferences(path = '/'): void {
    activeRoutePath = path;
    if (!import.meta.client || initialized) return;

    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = preferencesStorage.readPreferences();

    themePreference.value = preferencesStorage.readThemePreference();
    themeSettings.value = stored.themeSettings;
    backgroundPreference.value = stored.backgroundPreference;
    backgroundAnimations.value = stored.backgroundAnimations;
    backgroundPerformance.value = stored.backgroundPerformance;
    backgroundSettingOverrides.value = stored.backgroundSettingOverrides;

    const initializedThemeRandomValue = Number(document.documentElement.dataset.themeRandomValue);
    themeRandomValue = Number.isFinite(initializedThemeRandomValue) ? initializedThemeRandomValue : Math.random();
    backgroundRandomValue = Math.random();

    applyTheme();
    applyBackgroundPreference();
    applyBackgroundAnimationState();
    colorSchemeQuery.addEventListener('change', syncSystemTheme);
    window.addEventListener('pagehide', backgroundSettingsWriter.flush);
    initialized = true;
  }

  function disposePreferences(): void {
    if (!initialized) return;

    backgroundSettingsWriter.flush();
    colorSchemeQuery?.removeEventListener('change', syncSystemTheme);
    window.removeEventListener('pagehide', backgroundSettingsWriter.flush);
    colorSchemeQuery = null;
    initialized = false;
  }

  return {
    themePreference,
    resolvedThemeMode,
    resolvedThemePreset,
    themeSettings,
    backgroundPreference,
    resolvedBackground,
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
    syncDisplayForRoute,
    initializePreferences,
    disposePreferences,
  };
}
