import type { BackgroundSettingOverridesMap, BackgroundSettingsMap } from '@/types/background';

/** Concrete scene definitions satisfy this port at the application boundary. */
export interface BackgroundSettingsPersistencePolicy {
  sanitizeOverrides: (candidate: unknown) => BackgroundSettingOverridesMap;
  getDefaults: () => BackgroundSettingsMap;
}
