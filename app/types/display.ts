import type {
  BackgroundAnimationSettings,
  BackgroundPerformanceSettings,
  BackgroundPreference,
  BackgroundSettingOverridesMap,
} from '@/types/background';
import type { ThemeSettings } from '@/types/theme';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';

export interface DisplayPreferencesState {
  themeSettings: ThemeSettings;
  backgroundPreference: BackgroundPreference;
  backgroundAnimations: BackgroundAnimationSettings;
  backgroundPerformance: BackgroundPerformanceSettings;
  backgroundSettingOverrides: BackgroundSettingOverridesMap;
}
