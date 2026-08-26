import type {
  BackgroundAnimationSettings,
  BackgroundPerformanceSettings,
  BackgroundPreference,
  BackgroundSettingOverridesMap,
} from '@/types/background';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface DisplayPreferencesState {
  backgroundPreference: BackgroundPreference;
  backgroundAnimations: BackgroundAnimationSettings;
  backgroundPerformance: BackgroundPerformanceSettings;
  backgroundSettingOverrides: BackgroundSettingOverridesMap;
}
