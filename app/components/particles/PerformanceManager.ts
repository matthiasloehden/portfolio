import { PARTICLE_CONFIG, PARTICLE_QUALITY } from './config';

export class PerformanceManager {
  averageFrameTime = 16.7;

  private frameCount = 0;
  private sampleCount = 0;
  private sampleTotal = 0;
  private poorWindows = 0;

  constructor(public qualityIndex: number) {}

  record(frameTime: number): boolean {
    this.frameCount += 1;
    if (this.frameCount <= PARTICLE_CONFIG.performanceWarmupFrames) return false;

    this.sampleTotal += frameTime;
    this.sampleCount += 1;
    if (this.sampleCount < PARTICLE_CONFIG.performanceSampleFrames) return false;

    this.averageFrameTime = this.sampleTotal / this.sampleCount;
    this.sampleCount = 0;
    this.sampleTotal = 0;

    const threshold = PARTICLE_QUALITY[this.qualityIndex]?.slowFrameThreshold ?? 30;
    this.poorWindows = this.averageFrameTime > threshold ? this.poorWindows + 1 : 0;

    if (this.poorWindows < PARTICLE_CONFIG.poorPerformanceWindows) return false;
    if (this.qualityIndex >= PARTICLE_QUALITY.length - 1) return false;

    this.qualityIndex += 1;
    this.poorWindows = 0;
    this.frameCount = 0;
    return true;
  }
}
