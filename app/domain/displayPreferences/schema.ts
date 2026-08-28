import { sanitizeBackgroundSettingOverrides } from '@/components/backgrounds/settings/registry';
import { createBackgroundAnimationSettings } from '@/config/backgrounds';
import { DISPLAY_PREFERENCES_VERSION, isSupportedDisplayPreferencesVersion } from '@/config/displayPreferences';
import { createDefaultThemeSettings, sanitizeThemeSettings } from '@/domain/themeSettings';
import {
  BACKGROUND_IDS,
  BACKGROUND_PERFORMANCE_MODES,
  type BackgroundAnimationSettings,
  type BackgroundPerformanceMode,
  type BackgroundPerformanceSettings,
  type BackgroundPreference,
} from '@/types/background';
import type { DisplayPreferencesState, ThemePreference } from '@/types/display';

const BACKGROUND_PREFERENCES = ['auto', ...BACKGROUND_IDS, 'none'] as const;
const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

export interface StoredDisplayPreferences extends DisplayPreferencesState {
  version: typeof DISPLAY_PREFERENCES_VERSION;
}

export interface DecodedDisplayPreferences {
  preferences: DisplayPreferencesState;
  sourceVersion: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function decodeBackgroundPreference(value: unknown): BackgroundPreference | undefined {
  return typeof value === 'string' && BACKGROUND_PREFERENCES.includes(value as BackgroundPreference)
    ? (value as BackgroundPreference)
    : undefined;
}

export function decodeThemePreference(value: unknown): ThemePreference {
  return typeof value === 'string' && THEME_PREFERENCES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : 'system';
}

export function decodeBackgroundAnimations(value: unknown): BackgroundAnimationSettings | undefined {
  if (!isRecord(value)) return undefined;

  if (
    typeof value.idle === 'boolean' &&
    typeof value.cursorMovement === 'boolean' &&
    typeof value.cursorClick === 'boolean' &&
    typeof value.scroll === 'boolean'
  ) {
    return createBackgroundAnimationSettings(value as Partial<BackgroundAnimationSettings>);
  }

  // Documents written before cursor interactions were separated still map to
  // both modern channels, preserving the visitor's original motion choice.
  if (typeof value.idle === 'boolean' && typeof value.cursor === 'boolean' && typeof value.scroll === 'boolean') {
    return createBackgroundAnimationSettings({
      idle: value.idle,
      cursorMovement: value.cursor,
      cursorClick: value.cursor,
      scroll: value.scroll,
    });
  }

  return undefined;
}

export function decodeBackgroundPerformance(value: unknown): BackgroundPerformanceSettings | undefined {
  if (!isRecord(value)) return undefined;

  const mode = value.mode;
  if (
    typeof mode !== 'string' ||
    !BACKGROUND_PERFORMANCE_MODES.includes(mode as BackgroundPerformanceMode) ||
    typeof value.showStats !== 'boolean'
  ) {
    return undefined;
  }

  return { mode: mode as BackgroundPerformanceMode, showStats: value.showStats };
}

export function decodeDisplayPreferences(value: unknown): DecodedDisplayPreferences | undefined {
  if (!isRecord(value) || !isSupportedDisplayPreferencesVersion(value.version)) return undefined;

  const backgroundPreference = decodeBackgroundPreference(value.backgroundPreference);
  const backgroundAnimations = decodeBackgroundAnimations(value.backgroundAnimations);
  const backgroundPerformance = decodeBackgroundPerformance(value.backgroundPerformance);

  if (!backgroundPreference || !backgroundAnimations || !backgroundPerformance) return undefined;

  return {
    sourceVersion: value.version,
    preferences: {
      themeSettings: value.version === 1 ? createDefaultThemeSettings() : sanitizeThemeSettings(value.themeSettings),
      backgroundPreference,
      backgroundAnimations,
      backgroundPerformance,
      backgroundSettingOverrides: sanitizeBackgroundSettingOverrides(value.backgroundSettingOverrides),
    },
  };
}

export function encodeDisplayPreferences(preferences: DisplayPreferencesState): StoredDisplayPreferences {
  return { version: DISPLAY_PREFERENCES_VERSION, ...preferences };
}
