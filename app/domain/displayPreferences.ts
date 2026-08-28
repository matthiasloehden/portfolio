import { createBackgroundSettingOverrides } from '@/components/backgrounds/settings/registry';
import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/config/backgrounds';
import { createDefaultThemeSettings } from '@/config/themes';
import type { DisplayPreferencesState, ThemePreference } from '@/types/display';

/**
 * Creates the complete user-editable display state at its product defaults.
 *
 * This factory is the single source of truth for reset behavior, dirty-state
 * detection and persistence fallbacks. Keeping that policy outside Vue makes
 * the same contract reusable by a future framework-neutral package.
 */
export function createDefaultDisplayPreferences(): DisplayPreferencesState {
  return {
    themeSettings: createDefaultThemeSettings(),
    backgroundPreference: 'auto',
    backgroundAnimations: createDefaultBackgroundAnimationSettings(),
    backgroundPerformance: createDefaultBackgroundPerformanceSettings(),
    backgroundSettingOverrides: createBackgroundSettingOverrides(),
  };
}

export function hasCustomDisplayPreferences(
  preferences: DisplayPreferencesState,
  themePreference: ThemePreference,
): boolean {
  const defaults = createDefaultDisplayPreferences();

  if (themePreference !== 'system') return true;
  if (preferences.themeSettings.preset !== defaults.themeSettings.preset) return true;
  if (preferences.themeSettings.fonts.display !== defaults.themeSettings.fonts.display) return true;
  if (preferences.themeSettings.fonts.body !== defaults.themeSettings.fonts.body) return true;

  for (const overrides of Object.values(preferences.themeSettings.colorOverrides)) {
    if (Object.keys(overrides).length > 0) return true;
  }

  if (preferences.backgroundPreference !== defaults.backgroundPreference) return true;

  for (const animation of Object.keys(
    defaults.backgroundAnimations,
  ) as (keyof typeof defaults.backgroundAnimations)[]) {
    if (preferences.backgroundAnimations[animation] !== defaults.backgroundAnimations[animation]) return true;
  }

  if (preferences.backgroundPerformance.mode !== defaults.backgroundPerformance.mode) return true;
  if (preferences.backgroundPerformance.showStats !== defaults.backgroundPerformance.showStats) return true;

  return Object.values(preferences.backgroundSettingOverrides).some((overrides) => Object.keys(overrides).length > 0);
}
