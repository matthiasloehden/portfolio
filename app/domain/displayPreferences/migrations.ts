import {
  createBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/domain/backgrounds/preferences';
import { createDefaultThemeSettings } from '@/domain/themes/settings';
import { createBackgroundSettingOverrides } from '@/domain/backgrounds/settingOverrides';
import { BACKGROUND_IDS, type BackgroundSettingOverridesMap, type BackgroundSettingValue } from '@/types/background';
import type { DisplayPreferencesState } from '@/types/display';

import type { BackgroundSettingsPersistencePolicy } from './contracts';
import { decodeBackgroundAnimations, decodeBackgroundPerformance, decodeBackgroundPreference } from './schema';

export interface LegacyDisplayPreferencesSource {
  background: string | null;
  animations: unknown;
  settings: unknown;
  overrideFlags: unknown;
  performance: unknown;
  motion: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deriveLegacyOverrides(
  values: BackgroundSettingOverridesMap,
  backgroundSettings: BackgroundSettingsPersistencePolicy,
): BackgroundSettingOverridesMap {
  const defaults = backgroundSettings.getDefaults();
  const overrides = createBackgroundSettingOverrides();

  // The earliest documents predate explicit override flags. Values that differ
  // from defaults represent the visitor's intent and are retained during upgrade.
  for (const background of BACKGROUND_IDS) {
    for (const [setting, value] of Object.entries(values[background])) {
      const defaultValue = (defaults[background] as unknown as Readonly<Record<string, BackgroundSettingValue>>)[
        setting
      ];
      if (value !== defaultValue) {
        (overrides[background] as Record<string, BackgroundSettingValue>)[setting] = value;
      }
    }
  }

  return overrides;
}

function pickFlaggedLegacyOverrides(
  values: unknown,
  flags: unknown,
  backgroundSettings: BackgroundSettingsPersistencePolicy,
): BackgroundSettingOverridesMap {
  const sanitizedValues = backgroundSettings.sanitizeOverrides(values);
  if (!isRecord(flags)) return deriveLegacyOverrides(sanitizedValues, backgroundSettings);

  const derivedOverrides = deriveLegacyOverrides(sanitizedValues, backgroundSettings);
  const overrides = createBackgroundSettingOverrides();

  for (const background of BACKGROUND_IDS) {
    const backgroundFlags = flags[background];
    if (!isRecord(backgroundFlags)) {
      overrides[background] = derivedOverrides[background] as never;
      continue;
    }

    for (const [setting, value] of Object.entries(sanitizedValues[background])) {
      if (backgroundFlags[setting] === true) {
        (overrides[background] as Record<string, BackgroundSettingValue>)[setting] = value;
      }
    }
  }

  return overrides;
}

export function migrateLegacyDisplayPreferences(
  source: LegacyDisplayPreferencesSource,
  backgroundSettings: BackgroundSettingsPersistencePolicy,
): DisplayPreferencesState {
  const legacyMotionEnabled = source.motion !== 'false';
  const backgroundAnimations =
    decodeBackgroundAnimations(source.animations) ??
    createBackgroundAnimationSettings({
      idle: legacyMotionEnabled,
      cursorMovement: legacyMotionEnabled,
      cursorClick: legacyMotionEnabled,
      scroll: legacyMotionEnabled,
    });

  return {
    themeSettings: createDefaultThemeSettings(),
    backgroundPreference: decodeBackgroundPreference(source.background) ?? 'auto',
    backgroundAnimations,
    backgroundPerformance:
      decodeBackgroundPerformance(source.performance) ?? createDefaultBackgroundPerformanceSettings(),
    backgroundSettingOverrides: pickFlaggedLegacyOverrides(source.settings, source.overrideFlags, backgroundSettings),
  };
}
