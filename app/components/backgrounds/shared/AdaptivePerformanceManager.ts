/**
 * Chooses and monitors the quality level shared by all background scenes.
 *
 * Presets are ordered from highest to lowest quality. Auto mode starts from a
 * coarse device estimate, ignores an initial warm-up period and only steps down
 * after several consistently slow sample windows. Fixed modes bypass adaptation
 * but still collect frame-time and FPS data for the diagnostics overlay.
 * Scene-specific preset values remain outside this module; the manager only
 * decides which typed preset is active.
 */
import type { BackgroundPerformanceMode, BackgroundQualityPreset } from '@/types/background';

export interface AdaptivePerformanceManagerOptions {
  warmupFrames?: number;
  sampleFrames?: number;
  poorPerformanceWindows?: number;
}

export function chooseInitialBackgroundQuality(): number {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const compactViewport = window.innerWidth < 820 || window.innerHeight < 620;
  const cores = navigator.hardwareConcurrency || 4;

  if (coarsePointer || cores <= 4) return 2;
  if (compactViewport || cores <= 6) return 1;
  return 0;
}

export class AdaptivePerformanceManager<Preset extends BackgroundQualityPreset> {
  averageFrameTime = 0;
  fps = 0;

  private frameCount = 0;
  private sampleCount = 0;
  private sampleTotal = 0;
  private poorWindows = 0;
  private previousFrameTime = 0;
  private qualityIndex = 0;
  private mode: BackgroundPerformanceMode;

  private readonly warmupFrames: number;
  private readonly sampleFrames: number;
  private readonly poorPerformanceWindows: number;

  constructor(
    private readonly presets: readonly Preset[],
    mode: BackgroundPerformanceMode,
    autoInitialQualityIndex: number,
    options: AdaptivePerformanceManagerOptions = {},
  ) {
    if (presets.length === 0) {
      throw new Error('AdaptivePerformanceManager requires at least one quality preset');
    }

    this.warmupFrames = options.warmupFrames ?? 120;
    this.sampleFrames = options.sampleFrames ?? 60;
    this.poorPerformanceWindows = options.poorPerformanceWindows ?? 2;
    this.mode = mode;
    this.qualityIndex = this.resolveQualityIndex(mode, autoInitialQualityIndex);
  }

  get currentPreset(): Preset {
    const preset = this.presets[this.qualityIndex] ?? this.presets[this.presets.length - 1];

    if (!preset) {
      throw new Error('AdaptivePerformanceManager has no quality preset');
    }

    return preset;
  }

  setMode(mode: BackgroundPerformanceMode, autoInitialQualityIndex: number): Preset {
    this.mode = mode;
    this.qualityIndex = this.resolveQualityIndex(mode, autoInitialQualityIndex);
    this.resetMeasurements();
    return this.currentPreset;
  }

  resetMeasurements(): void {
    this.frameCount = 0;
    this.sampleCount = 0;
    this.sampleTotal = 0;
    this.poorWindows = 0;
    this.previousFrameTime = 0;
    this.averageFrameTime = 0;
    this.fps = 0;
  }

  recordFrame(now: number): Preset | null {
    if (this.previousFrameTime === 0) {
      this.previousFrameTime = now;
      return null;
    }

    const frameTime = now - this.previousFrameTime;
    this.previousFrameTime = now;

    // Ignore tab restoration, debugger pauses and other non-rendering gaps.
    if (!Number.isFinite(frameTime) || frameTime <= 0 || frameTime > 100) {
      return null;
    }

    this.frameCount += 1;
    this.sampleTotal += frameTime;
    this.sampleCount += 1;

    if (this.sampleCount < this.sampleFrames) return null;

    this.averageFrameTime = this.sampleTotal / this.sampleCount;
    this.fps = 1_000 / this.averageFrameTime;
    this.sampleCount = 0;
    this.sampleTotal = 0;

    if (this.mode !== 'auto' || this.frameCount <= this.warmupFrames) return null;

    this.poorWindows = this.averageFrameTime > this.currentPreset.slowFrameThreshold ? this.poorWindows + 1 : 0;

    if (this.poorWindows < this.poorPerformanceWindows) return null;
    if (this.qualityIndex >= this.presets.length - 1) return null;

    this.qualityIndex += 1;
    this.poorWindows = 0;
    this.frameCount = 0;
    return this.currentPreset;
  }

  private resolveQualityIndex(mode: BackgroundPerformanceMode, autoInitialQualityIndex: number): number {
    if (mode !== 'auto') {
      const explicitIndex = this.presets.findIndex((preset) => preset.id === mode);
      if (explicitIndex >= 0) return explicitIndex;
    }

    return Math.min(this.presets.length - 1, Math.max(0, Math.floor(autoInitialQualityIndex)));
  }
}
