export const DISPLAY_PREFERENCES_STORAGE_KEY = 'portfolio-display-preferences';
export const THEME_PREFERENCE_STORAGE_KEY = 'portfolio-theme';
export const DISPLAY_PREFERENCES_VERSION = 3;

export const SUPPORTED_DISPLAY_PREFERENCES_VERSIONS = [1, 2, DISPLAY_PREFERENCES_VERSION] as const;
export const THEME_SETTINGS_STORAGE_VERSIONS = [2, DISPLAY_PREFERENCES_VERSION] as const;

/**
 * Version metadata is shared by the persistence adapter and pre-hydration
 * theme script. Keeping it here prevents either startup path from silently
 * falling behind when the persisted document schema changes.
 */
export function isSupportedDisplayPreferencesVersion(
  value: unknown,
): value is (typeof SUPPORTED_DISPLAY_PREFERENCES_VERSIONS)[number] {
  return typeof value === 'number' && SUPPORTED_DISPLAY_PREFERENCES_VERSIONS.some((version) => version === value);
}
