/**
 * Versioned browser persistence for display settings.
 *
 * Rich display settings are stored as one document so related values cannot
 * drift across independent localStorage keys. The small mode preference keeps
 * its established scalar key for backwards-compatible first-paint handling.
 * Scene settings contain only explicit user overrides; defaults and
 * performance values remain owned by the registry. Legacy keys are read once
 * and converted to the current document shape.
 */

import {
  createBackgroundSettingOverrides,
  getDefaultBackgroundSettingsMap,
  sanitizeBackgroundSettingOverrides,
} from '@/components/backgrounds/settings/registry';
import { createBackgroundAnimationSettings, createDefaultBackgroundPerformanceSettings } from '@/config/backgrounds';
import {
  DISPLAY_PREFERENCES_STORAGE_KEY,
  DISPLAY_PREFERENCES_VERSION,
  THEME_PREFERENCE_STORAGE_KEY,
  isSupportedDisplayPreferencesVersion,
} from '@/config/displayPreferences';
import { createDefaultThemeSettings, sanitizeThemeSettings } from '@/config/themes';
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

const LEGACY_STORAGE_KEYS = {
  background: 'portfolio-background',
  animations: 'portfolio-background-animations',
  settings: 'portfolio-background-advanced-settings',
  overrideFlags: 'portfolio-background-advanced-setting-overrides',
  performance: 'portfolio-background-performance',
  motion: 'portfolio-background-motion',
} as const;

interface StoredDisplayPreferences extends DisplayPreferencesState {
  version: typeof DISPLAY_PREFERENCES_VERSION;
}

export type DisplayPreferencesStorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface DisplayPreferencesStorage {
  readThemePreference: () => ThemePreference;
  writeThemePreference: (preference: ThemePreference) => void;
  readPreferences: () => DisplayPreferencesState;
  writePreferences: (preferences: DisplayPreferencesState) => void;
  clear: () => void;
}

const BACKGROUND_PREFERENCES = ['auto', ...BACKGROUND_IDS, 'none'] as const;
const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

function readStorage(storage: DisplayPreferencesStorageAdapter | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStorage(storage: DisplayPreferencesStorageAdapter | undefined, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // Preferences are an enhancement; storage restrictions must not break UI.
  }
}

function removeStorage(storage: DisplayPreferencesStorageAdapter | undefined, key: string): void {
  try {
    storage?.removeItem(key);
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
  if (!isRecord(value) || !isSupportedDisplayPreferencesVersion(value.version)) return undefined;

  const animations = readAnimations(value.backgroundAnimations);
  const performance = readPerformance(value.backgroundPerformance);
  if (!isBackgroundPreference(value.backgroundPreference) || !animations || !performance) return undefined;

  return {
    themeSettings: value.version === 1 ? createDefaultThemeSettings() : sanitizeThemeSettings(value.themeSettings),
    backgroundPreference: value.backgroundPreference,
    backgroundAnimations: animations,
    backgroundPerformance: performance,
    backgroundSettingOverrides: sanitizeBackgroundSettingOverrides(value.backgroundSettingOverrides),
  };
}

function readLegacyPreferences(storage: DisplayPreferencesStorageAdapter | undefined): DisplayPreferencesState {
  const storedBackground = readStorage(storage, LEGACY_STORAGE_KEYS.background);
  const parsedAnimations = readAnimations(parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.animations)));
  const legacyMotion = readStorage(storage, LEGACY_STORAGE_KEYS.motion);
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
    themeSettings: createDefaultThemeSettings(),
    backgroundPreference: isBackgroundPreference(storedBackground) ? storedBackground : 'auto',
    backgroundAnimations: animations,
    backgroundPerformance:
      readPerformance(parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.performance))) ??
      createDefaultBackgroundPerformanceSettings(),
    backgroundSettingOverrides: pickFlaggedLegacyOverrides(
      parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.settings)),
      parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.overrideFlags)),
    ),
  };
}

function removeLegacyPreferences(storage: DisplayPreferencesStorageAdapter | undefined): void {
  for (const key of Object.values(LEGACY_STORAGE_KEYS)) removeStorage(storage, key);
}

function resolveBrowserStorage(): DisplayPreferencesStorageAdapter | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Creates the persistence boundary used by the display-preferences feature.
 *
 * Browser storage is injected so schema migration and failure handling can be
 * verified without booting Nuxt. The adapter intentionally mirrors only the
 * three localStorage operations the feature needs, which also keeps a future
 * package free to provide cookies, native storage or an in-memory backend.
 */
export function createDisplayPreferencesStorage(
  storage: DisplayPreferencesStorageAdapter | undefined = resolveBrowserStorage(),
): DisplayPreferencesStorage {
  function writePreferences(preferences: DisplayPreferencesState): void {
    const document: StoredDisplayPreferences = { version: DISPLAY_PREFERENCES_VERSION, ...preferences };
    writeStorage(storage, DISPLAY_PREFERENCES_STORAGE_KEY, JSON.stringify(document));
  }

  function readPreferences(): DisplayPreferencesState {
    const parsedDocument = parseJson(readStorage(storage, DISPLAY_PREFERENCES_STORAGE_KEY));
    const current = readCurrentDocument(parsedDocument);
    if (current) {
      if (isRecord(parsedDocument) && parsedDocument.version !== DISPLAY_PREFERENCES_VERSION) {
        writePreferences(current);
      }
      return current;
    }

    const migrated = readLegacyPreferences(storage);
    writePreferences(migrated);
    removeLegacyPreferences(storage);
    return migrated;
  }

  return {
    readThemePreference() {
      const stored = readStorage(storage, THEME_PREFERENCE_STORAGE_KEY);
      return isThemePreference(stored) ? stored : 'system';
    },
    writeThemePreference(preference) {
      if (preference === 'system') removeStorage(storage, THEME_PREFERENCE_STORAGE_KEY);
      else writeStorage(storage, THEME_PREFERENCE_STORAGE_KEY, preference);
    },
    readPreferences,
    writePreferences,
    clear() {
      removeStorage(storage, THEME_PREFERENCE_STORAGE_KEY);
      removeStorage(storage, DISPLAY_PREFERENCES_STORAGE_KEY);
      removeLegacyPreferences(storage);
    },
  };
}
