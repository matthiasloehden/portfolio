import type {
  BackgroundAnimationSettings,
  BackgroundPerformanceSettings,
  BackgroundPreference,
  BackgroundSettingOverridesMap,
} from '@/types/background';
import type { ThemeSettings } from '@/types/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface DisplayPreferencesState {
  themeSettings: ThemeSettings;
  backgroundPreference: BackgroundPreference;
  backgroundAnimations: BackgroundAnimationSettings;
  backgroundPerformance: BackgroundPerformanceSettings;
  backgroundSettingOverrides: BackgroundSettingOverridesMap;
}
