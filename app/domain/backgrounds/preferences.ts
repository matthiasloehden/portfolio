import type { BackgroundAnimationSettings, BackgroundPerformanceSettings } from '@/types/background';

export function createBackgroundAnimationSettings(
  settings: Partial<BackgroundAnimationSettings> = {},
): BackgroundAnimationSettings {
  return {
    idle: settings.idle ?? true,
    cursorMovement: settings.cursorMovement ?? true,
    cursorClick: settings.cursorClick ?? true,
    scroll: settings.scroll ?? true,
  };
}

export function createDefaultBackgroundAnimationSettings(): BackgroundAnimationSettings {
  return createBackgroundAnimationSettings();
}

export function createDefaultBackgroundPerformanceSettings(): BackgroundPerformanceSettings {
  return { mode: 'auto', showStats: false };
}
