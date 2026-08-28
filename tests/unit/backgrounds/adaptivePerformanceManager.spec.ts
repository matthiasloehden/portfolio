import { describe, expect, it } from 'vitest';

import { AdaptivePerformanceManager } from '@/components/backgrounds/shared/AdaptivePerformanceManager';
import type { BackgroundQualityPreset } from '@/types/background';

const presets = [
  { id: 'high', slowFrameThreshold: 20 },
  { id: 'medium', slowFrameThreshold: 24 },
  { id: 'low', slowFrameThreshold: 30 },
] as const satisfies readonly BackgroundQualityPreset[];

describe('AdaptivePerformanceManager', () => {
  it('validates that at least one quality level exists', () => {
    expect(() => new AdaptivePerformanceManager([], 'auto', 0)).toThrow(
      'AdaptivePerformanceManager requires at least one quality preset',
    );
  });

  it('clamps the estimated auto quality to the available presets', () => {
    expect(new AdaptivePerformanceManager(presets, 'auto', -4).currentPreset.id).toBe('high');
    expect(new AdaptivePerformanceManager(presets, 'auto', 99).currentPreset.id).toBe('low');
  });

  it('degrades only after consecutive slow sample windows', () => {
    const manager = new AdaptivePerformanceManager(presets, 'auto', 0, {
      warmupFrames: 0,
      sampleFrames: 2,
      poorPerformanceWindows: 2,
    });

    expect(manager.recordFrame(100)).toBeNull();
    expect(manager.recordFrame(125)).toBeNull();
    expect(manager.recordFrame(150)).toBeNull();
    expect(manager.currentPreset.id).toBe('high');
    expect(manager.recordFrame(175)).toBeNull();
    expect(manager.recordFrame(200)?.id).toBe('medium');
    expect(manager.averageFrameTime).toBe(25);
    expect(manager.fps).toBe(40);
  });

  it('resets adaptation and measurements when the mode changes', () => {
    const manager = new AdaptivePerformanceManager(presets, 'auto', 0, {
      warmupFrames: 0,
      sampleFrames: 1,
      poorPerformanceWindows: 1,
    });

    manager.recordFrame(100);
    manager.recordFrame(125);
    expect(manager.currentPreset.id).toBe('medium');

    expect(manager.setMode('high', 2).id).toBe('high');
    expect(manager.averageFrameTime).toBe(0);
    expect(manager.fps).toBe(0);
    manager.recordFrame(200);
    expect(manager.recordFrame(240)).toBeNull();
    expect(manager.currentPreset.id).toBe('high');
  });

  it('ignores non-rendering time gaps', () => {
    const manager = new AdaptivePerformanceManager(presets, 'auto', 0, { sampleFrames: 1 });

    manager.recordFrame(100);
    expect(manager.recordFrame(250)).toBeNull();
    expect(manager.averageFrameTime).toBe(0);
  });
});
