/**
 * Registers the performance-setting watchers shared by all scene controllers.
 *
 * A mode change asks the scene to record its newly selected preset; inactive
 * scenes may defer the corresponding renderer work until activation. Enabling
 * the overlay requests an immediate sample so users do not wait for the normal
 * diagnostics interval. The callbacks stay scene-owned because applying quality
 * and collecting renderer details differ between backgrounds.
 */
import { watch } from 'vue';

import type { BackgroundPerformanceSettings } from '@/types/background';

export interface BackgroundPerformanceSettingsHandlers {
  onModeChange: () => void;
  onStatsRequested: () => void;
}

export function useBackgroundPerformanceSettings(
  getSettings: () => BackgroundPerformanceSettings,
  handlers: BackgroundPerformanceSettingsHandlers,
): void {
  watch(() => getSettings().mode, handlers.onModeChange, { flush: 'post' });
  watch(
    () => getSettings().showStats,
    (showStats) => {
      if (showStats) handlers.onStatsRequested();
    },
    { flush: 'post' },
  );
}
