/**
 * Coordinates quality selection and diagnostics for one background scene.
 *
 * The runtime wraps AdaptivePerformanceManager with the behavior shared by the
 * Vue controllers: mode changes, preset lookup, frame sampling and throttled
 * overlay updates. Renderers still apply their own preset values and report
 * scene-specific resource statistics. This keeps performance policy consistent
 * without forcing unrelated Canvas2D and WebGL renderers into one base class.
 */
import type {
  BackgroundPerformanceDescriptor,
  BackgroundPerformanceMode,
  BackgroundPerformanceStats,
  BackgroundQualityPreset,
  BackgroundRendererStats,
} from '@/types/background';

import {
  AdaptivePerformanceManager,
  chooseInitialBackgroundQuality,
  type AdaptivePerformanceManagerOptions,
} from './AdaptivePerformanceManager';

export interface BackgroundPerformanceRuntimeOptions extends AdaptivePerformanceManagerOptions {
  statsUpdateInterval?: number;
}

export class BackgroundPerformanceRuntime<Preset extends BackgroundQualityPreset> {
  private readonly manager: AdaptivePerformanceManager<Preset>;
  private readonly statsUpdateInterval: number;
  private lastStatsUpdate = Number.NEGATIVE_INFINITY;
  private selectedMode: BackgroundPerformanceMode;

  constructor(
    presets: readonly Preset[],
    mode: BackgroundPerformanceMode,
    options: BackgroundPerformanceRuntimeOptions = {},
  ) {
    this.selectedMode = mode;
    this.manager = new AdaptivePerformanceManager(presets, mode, chooseInitialBackgroundQuality(), options);
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

  get mode(): BackgroundPerformanceMode {
    return this.selectedMode;
  }

  recordFrame(now: number): Preset | null {
    return this.manager.recordFrame(now);
  }

  setMode(mode: BackgroundPerformanceMode): Preset {
    this.selectedMode = mode;
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

  createStats(
    descriptor: BackgroundPerformanceDescriptor,
    renderer: BackgroundRendererStats,
    details?: BackgroundPerformanceStats['details'],
  ): BackgroundPerformanceStats {
    return {
      ...descriptor,
      mode: this.mode,
      preset: this.currentPreset.id,
      fps: this.fps,
      frameTime: this.averageFrameTime,
      resolution: `${renderer.width} × ${renderer.height}`,
      dpr: renderer.dpr,
      details,
    };
  }
}
