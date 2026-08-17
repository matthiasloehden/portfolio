import type {
  BackgroundPerformanceMode,
  BackgroundQualityPreset,
} from '@/types/background';

import {
  AdaptivePerformanceManager,
  chooseInitialBackgroundQuality,
  type AdaptivePerformanceManagerOptions,
} from './AdaptivePerformanceManager';

export interface BackgroundPerformanceRuntimeOptions extends AdaptivePerformanceManagerOptions {
  statsUpdateInterval?: number;
}

/**
 * Shared per-scene performance lifecycle. Renderers remain responsible for
 * applying their own presets, while this runtime owns device selection,
 * adaptive measurements, mode changes and diagnostics throttling.
 */
export class BackgroundPerformanceRuntime<Preset extends BackgroundQualityPreset> {
  private readonly manager: AdaptivePerformanceManager<Preset>;
  private readonly statsUpdateInterval: number;
  private lastStatsUpdate = Number.NEGATIVE_INFINITY;

  constructor(
    presets: readonly Preset[],
    mode: BackgroundPerformanceMode,
    options: BackgroundPerformanceRuntimeOptions = {},
  ) {
    this.manager = new AdaptivePerformanceManager(
      presets,
      mode,
      chooseInitialBackgroundQuality(),
      options,
    );
    this.statsUpdateInterval = options.statsUpdateInterval ?? 250;
  }

  get currentPreset(): Preset {
    return this.manager.currentPreset;
  }

  get averageFrameTime(): number {
    return this.manager.averageFrameTime;
  }

  get fps(): number {
    return this.manager.fps;
  }

  recordFrame(now: number): Preset | null {
    return this.manager.recordFrame(now);
  }

  setMode(mode: BackgroundPerformanceMode): Preset {
    this.lastStatsUpdate = Number.NEGATIVE_INFINITY;
    return this.manager.setMode(mode, chooseInitialBackgroundQuality());
  }

  resetMeasurements(): void {
    this.manager.resetMeasurements();
    this.lastStatsUpdate = Number.NEGATIVE_INFINITY;
  }

  shouldPublishStats(now: number, force = false): boolean {
    if (!force && now - this.lastStatsUpdate < this.statsUpdateInterval) return false;

    this.lastStatsUpdate = now;
    return true;
  }
}
