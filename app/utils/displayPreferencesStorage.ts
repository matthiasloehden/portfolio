/**
 * Browser persistence adapter for display preferences.
 *
 * The adapter owns localStorage access, JSON serialization and cleanup of
 * consumed legacy keys. Schema validation and migration policy live in the
 * domain layer, leaving this module concerned only with the browser boundary.
 * Storage failures remain non-fatal because display customization is an
 * enhancement and must never prevent the portfolio from rendering.
 */

import {
  DISPLAY_PREFERENCES_STORAGE_KEY,
  DISPLAY_PREFERENCES_VERSION,
  THEME_PREFERENCE_STORAGE_KEY,
} from '@/config/displayPreferences';
import { migrateLegacyDisplayPreferences } from '@/domain/displayPreferences/migrations';
import {
  decodeDisplayPreferences,
  decodeThemePreference,
  encodeDisplayPreferences,
} from '@/domain/displayPreferences/schema';
import type { DisplayPreferencesState, ThemePreference } from '@/types/display';

const LEGACY_STORAGE_KEYS = {
  background: 'portfolio-background',
  animations: 'portfolio-background-animations',
  settings: 'portfolio-background-advanced-settings',
  overrideFlags: 'portfolio-background-advanced-setting-overrides',
  performance: 'portfolio-background-performance',
  motion: 'portfolio-background-motion',
} as const;

export type DisplayPreferencesStorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface DisplayPreferencesStorage {
  readThemePreference: () => ThemePreference;
  writeThemePreference: (preference: ThemePreference) => void;
  readPreferences: () => DisplayPreferencesState;
  writePreferences: (preferences: DisplayPreferencesState) => void;
  clear: () => void;
}

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
    // Private browsing modes and organization policies may deny persistence.
  }
}

function removeStorage(storage: DisplayPreferencesStorageAdapter | undefined, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // See writeStorage: cleanup is best-effort at the browser boundary.
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

export function createDisplayPreferencesStorage(
  storage: DisplayPreferencesStorageAdapter | undefined = resolveBrowserStorage(),
): DisplayPreferencesStorage {
  function writePreferences(preferences: DisplayPreferencesState): void {
    writeStorage(storage, DISPLAY_PREFERENCES_STORAGE_KEY, JSON.stringify(encodeDisplayPreferences(preferences)));
  }

  function readPreferences(): DisplayPreferencesState {
    const decoded = decodeDisplayPreferences(parseJson(readStorage(storage, DISPLAY_PREFERENCES_STORAGE_KEY)));
    if (decoded) {
      if (decoded.sourceVersion !== DISPLAY_PREFERENCES_VERSION) writePreferences(decoded.preferences);
      return decoded.preferences;
    }

    const migrated = migrateLegacyDisplayPreferences({
      background: readStorage(storage, LEGACY_STORAGE_KEYS.background),
      animations: parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.animations)),
      settings: parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.settings)),
      overrideFlags: parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.overrideFlags)),
      performance: parseJson(readStorage(storage, LEGACY_STORAGE_KEYS.performance)),
      motion: readStorage(storage, LEGACY_STORAGE_KEYS.motion),
    });

    writePreferences(migrated);
    removeLegacyPreferences(storage);
    return migrated;
  }

  return {
    readThemePreference() {
      return decodeThemePreference(readStorage(storage, THEME_PREFERENCE_STORAGE_KEY));
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
