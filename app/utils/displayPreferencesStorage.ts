/**
 * Versioned browser persistence for display settings.
 *
 * The UI state is stored as one document so related values cannot drift across
 * independent localStorage keys. Scene settings contain only explicit user
 * overrides; defaults and performance values remain owned by the registry.
 * Legacy keys are read once and converted to the current document shape.
 */

import {
  createBackgroundSettingOverrides,
  getDefaultBackgroundSettingsMap,
  sanitizeBackgroundSettingOverrides,
} from '@/components/backgrounds/settings/registry';
import { createBackgroundAnimationSettings, createDefaultBackgroundPerformanceSettings } from '@/config/backgrounds';
import {
  BACKGROUND_IDS,
  BACKGROUND_PERFORMANCE_MODES,
  type BackgroundAnimationSettings,
  type BackgroundPerformanceMode,
  type BackgroundPerformanceSettings,
  type BackgroundPreference,
  type BackgroundSettingOverridesMap,
} from '@/types/background';
import type { DisplayPreferencesState, ThemePreference } from '@/types/display';

const STORAGE_VERSION = 1;
const DISPLAY_PREFERENCES_STORAGE_KEY = 'portfolio-display-preferences';
const THEME_STORAGE_KEY = 'portfolio-theme';

const LEGACY_STORAGE_KEYS = {
  background: 'portfolio-background',
  animations: 'portfolio-background-animations',
  settings: 'portfolio-background-advanced-settings',
  overrideFlags: 'portfolio-background-advanced-setting-overrides',
  performance: 'portfolio-background-performance',
  motion: 'portfolio-background-motion',
} as const;

interface StoredDisplayPreferences extends DisplayPreferencesState {
  version: typeof STORAGE_VERSION;
}

const BACKGROUND_PREFERENCES = ['auto', ...BACKGROUND_IDS, 'none'] as const;
const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

function readStorage(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Preferences are an enhancement; storage restrictions must not break UI.
  }
}

function removeStorage(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    // See writeStorage: private modes and policies may deny persistence.
  }
}

function parseJson(value: string | null): unknown {
  if (value === null) return undefined;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBackgroundPreference(value: unknown): value is BackgroundPreference {
  return typeof value === 'string' && BACKGROUND_PREFERENCES.includes(value as BackgroundPreference);
}

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && THEME_PREFERENCES.includes(value as ThemePreference);
}

function readAnimations(value: unknown): BackgroundAnimationSettings | undefined {
  if (!isRecord(value)) return undefined;

  if (
    typeof value.idle === 'boolean' &&
    typeof value.cursorMovement === 'boolean' &&
    typeof value.cursorClick === 'boolean' &&
    typeof value.scroll === 'boolean'
  ) {
    return createBackgroundAnimationSettings(value as Partial<BackgroundAnimationSettings>);
  }

  // Older builds exposed one shared cursor toggle instead of movement/click.
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

function readPerformance(value: unknown): BackgroundPerformanceSettings | undefined {
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

function deriveLegacyOverrides(values: BackgroundSettingOverridesMap): BackgroundSettingOverridesMap {
  const defaults = getDefaultBackgroundSettingsMap();
  const overrides = createBackgroundSettingOverrides();

  // Very old persisted settings predate explicit override flags. Preserving
  // values that differ from defaults is the least surprising migration.
  for (const background of BACKGROUND_IDS) {
    for (const [setting, value] of Object.entries(values[background])) {
      // Legacy documents use dynamic setting names, while current defaults retain
      // their finite scene-specific interfaces.
      const defaultValue = (defaults[background] as unknown as Readonly<Record<string, number>>)[setting];
      if (value !== defaultValue) {
        (overrides[background] as Record<string, number>)[setting] = value;
      }
    }
  }

  return overrides;
}

function readCurrentDocument(value: unknown): DisplayPreferencesState | undefined {
  if (!isRecord(value) || value.version !== STORAGE_VERSION) return undefined;

  const animations = readAnimations(value.backgroundAnimations);
  const performance = readPerformance(value.backgroundPerformance);
  if (!isBackgroundPreference(value.backgroundPreference) || !animations || !performance) return undefined;

  return {
    backgroundPreference: value.backgroundPreference,
    backgroundAnimations: animations,
    backgroundPerformance: performance,
    backgroundSettingOverrides: sanitizeBackgroundSettingOverrides(value.backgroundSettingOverrides),
  };
}

function readLegacyPreferences(): DisplayPreferencesState {
  const storedBackground = readStorage(LEGACY_STORAGE_KEYS.background);
  const parsedAnimations = readAnimations(parseJson(readStorage(LEGACY_STORAGE_KEYS.animations)));
  const legacyMotion = readStorage(LEGACY_STORAGE_KEYS.motion);
  const legacyMotionEnabled = legacyMotion !== 'false';
  const animations =
    parsedAnimations ??
    createBackgroundAnimationSettings({
      idle: legacyMotionEnabled,
      cursorMovement: legacyMotionEnabled,
      cursorClick: legacyMotionEnabled,
      scroll: legacyMotionEnabled,
    });

  return {
    backgroundPreference: isBackgroundPreference(storedBackground) ? storedBackground : 'auto',
    backgroundAnimations: animations,
    backgroundPerformance:
      readPerformance(parseJson(readStorage(LEGACY_STORAGE_KEYS.performance))) ??
      createDefaultBackgroundPerformanceSettings(),
    backgroundSettingOverrides: pickFlaggedLegacyOverrides(
      parseJson(readStorage(LEGACY_STORAGE_KEYS.settings)),
      parseJson(readStorage(LEGACY_STORAGE_KEYS.overrideFlags)),
    ),
  };
}

function removeLegacyPreferences(): void {
  for (const key of Object.values(LEGACY_STORAGE_KEYS)) removeStorage(key);
}

export function readThemePreference(): ThemePreference {
  const stored = readStorage(THEME_STORAGE_KEY);
  return isThemePreference(stored) ? stored : 'system';
}

export function writeThemePreference(preference: ThemePreference): void {
  if (preference === 'system') removeStorage(THEME_STORAGE_KEY);
  else writeStorage(THEME_STORAGE_KEY, preference);
}

export function readDisplayPreferences(): DisplayPreferencesState {
  const current = readCurrentDocument(parseJson(readStorage(DISPLAY_PREFERENCES_STORAGE_KEY)));
  if (current) return current;

  const migrated = readLegacyPreferences();
  writeDisplayPreferences(migrated);
  removeLegacyPreferences();
  return migrated;
}

export function writeDisplayPreferences(preferences: DisplayPreferencesState): void {
  const document: StoredDisplayPreferences = { version: STORAGE_VERSION, ...preferences };
  writeStorage(DISPLAY_PREFERENCES_STORAGE_KEY, JSON.stringify(document));
}

export function clearStoredDisplayPreferences(): void {
  removeStorage(THEME_STORAGE_KEY);
  removeStorage(DISPLAY_PREFERENCES_STORAGE_KEY);
  removeLegacyPreferences();
}
