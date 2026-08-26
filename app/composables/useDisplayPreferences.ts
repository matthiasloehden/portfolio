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
} from '@/components/backgrounds/settings/registry';
import {
  createBackgroundAnimationSettings,
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/config/backgrounds';
import {
  clearStoredDisplayPreferences,
  readDisplayPreferences,
  readThemePreference,
  writeDisplayPreferences,
  writeThemePreference,
} from '@/utils/displayPreferencesStorage';
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

// Renderer updates stay immediate; only rapid slider-driven storage writes are coalesced.
const BACKGROUND_SETTINGS_PERSIST_DELAY = 100;

let colorSchemeQuery: MediaQueryList | null = null;
let initialized = false;
let pendingDisplayPreferences: DisplayPreferencesState | null = null;
let displayPreferencesWriteTimer: ReturnType<typeof setTimeout> | null = null;

function cancelPendingDisplayPreferencesWrite(): void {
  if (displayPreferencesWriteTimer !== null) clearTimeout(displayPreferencesWriteTimer);

  displayPreferencesWriteTimer = null;
  pendingDisplayPreferences = null;
}

function flushPendingDisplayPreferencesWrite(): void {
  if (displayPreferencesWriteTimer !== null) clearTimeout(displayPreferencesWriteTimer);

  displayPreferencesWriteTimer = null;

  if (!pendingDisplayPreferences) return;

  writeDisplayPreferences(pendingDisplayPreferences);
  pendingDisplayPreferences = null;
}

function scheduleDisplayPreferencesWrite(preferences: DisplayPreferencesState): void {
  pendingDisplayPreferences = preferences;

  if (displayPreferencesWriteTimer !== null) clearTimeout(displayPreferencesWriteTimer);

  displayPreferencesWriteTimer = setTimeout(flushPendingDisplayPreferencesWrite, BACKGROUND_SETTINGS_PERSIST_DELAY);
}

export function useDisplayPreferences() {
  const themePreference = useState<ThemePreference>('portfolio-theme-preference', () => 'system');
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

  function currentDisplayPreferences(): DisplayPreferencesState {
    return {
      backgroundPreference: backgroundPreference.value,
      backgroundAnimations: backgroundAnimations.value,
      backgroundPerformance: backgroundPerformance.value,
      backgroundSettingOverrides: backgroundSettingOverrides.value,
    };
  }

  function persistDisplayPreferences(): void {
    if (!import.meta.client) return;

    cancelPendingDisplayPreferencesWrite();
    writeDisplayPreferences(currentDisplayPreferences());
  }

  function persistBackgroundSettings(): void {
    if (import.meta.client) scheduleDisplayPreferencesWrite(currentDisplayPreferences());
  }

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
    if (import.meta.client) writeThemePreference(preference);
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
    backgroundPreference.value = 'auto';
    backgroundAnimations.value = createDefaultBackgroundAnimationSettings();
    backgroundPerformance.value = createDefaultBackgroundPerformanceSettings();
    backgroundSettingOverrides.value = createBackgroundSettingOverrides();

    applyTheme();
    applyBackgroundAnimationState();
    if (import.meta.client) {
      cancelPendingDisplayPreferencesWrite();
      clearStoredDisplayPreferences();
    }
  }

  function syncSystemTheme(): void {
    if (themePreference.value === 'system') applyTheme();
  }

  function initializePreferences(): void {
    if (!import.meta.client || initialized) return;

    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = readDisplayPreferences();

    themePreference.value = readThemePreference();
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
    backgroundPreference,
    backgroundAnimations,
    backgroundPerformance,
    backgroundSettingOverrides,
    setThemePreference,
    setBackgroundPreference,
    setBackgroundAnimationEnabled,
    setBackgroundSetting,
    resetBackgroundSetting,
    setBackgroundPerformanceMode,
    setBackgroundPerformanceStatsEnabled,
    restoreDefaultSettings,
    initializePreferences,
    disposePreferences,
  };
}
