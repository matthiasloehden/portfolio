import {
  createBackgroundSettingOverrides,
  getDefaultBackgroundSettingsMap,
  sanitizeBackgroundSettingOverrides,
} from '@/components/backgrounds/settings/registry';
import { createBackgroundAnimationSettings, createDefaultBackgroundPerformanceSettings } from '@/config/backgrounds';
import { createDefaultThemeSettings } from '@/domain/themeSettings';
import { BACKGROUND_IDS, type BackgroundSettingOverridesMap } from '@/types/background';
import type { DisplayPreferencesState } from '@/types/display';

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

function deriveLegacyOverrides(values: BackgroundSettingOverridesMap): BackgroundSettingOverridesMap {
  const defaults = getDefaultBackgroundSettingsMap();
  const overrides = createBackgroundSettingOverrides();

  // The earliest documents predate explicit override flags. Values that differ
  // from defaults represent the visitor's intent and are retained during upgrade.
  for (const background of BACKGROUND_IDS) {
    for (const [setting, value] of Object.entries(values[background])) {
      const defaultValue = (defaults[background] as unknown as Readonly<Record<string, number>>)[setting];
      if (value !== defaultValue) {
        (overrides[background] as Record<string, number>)[setting] = value;
      }
    }
  }

  return overrides;
}

function pickFlaggedLegacyOverrides(values: unknown, flags: unknown): BackgroundSettingOverridesMap {
  const sanitizedValues = sanitizeBackgroundSettingOverrides(values);
  if (!isRecord(flags)) return deriveLegacyOverrides(sanitizedValues);

  const derivedOverrides = deriveLegacyOverrides(sanitizedValues);
  const overrides = createBackgroundSettingOverrides();

  for (const background of BACKGROUND_IDS) {
    const backgroundFlags = flags[background];
    if (!isRecord(backgroundFlags)) {
      overrides[background] = derivedOverrides[background] as never;
      continue;
    }

    for (const [setting, value] of Object.entries(sanitizedValues[background])) {
      if (backgroundFlags[setting] === true) {
        (overrides[background] as Record<string, number>)[setting] = value;
      }
    }
  }

  return overrides;
}

export function migrateLegacyDisplayPreferences(source: LegacyDisplayPreferencesSource): DisplayPreferencesState {
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
    backgroundSettingOverrides: pickFlaggedLegacyOverrides(source.settings, source.overrideFlags),
  };
}
