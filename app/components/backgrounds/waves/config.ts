import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

import type { WavePalette } from './types';

export interface WaveQualityPreset extends BackgroundQualityPreset {
  vertexStepScale: number;
  trailLengthCap: number;
}

export const WAVE_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 22, pixelRatioCap: 2, vertexStepScale: 1, trailLengthCap: 48 },
  { id: 'medium', slowFrameThreshold: 26, pixelRatioCap: 1.5, vertexStepScale: 1.25, trailLengthCap: 36 },
  { id: 'low', slowFrameThreshold: 32, pixelRatioCap: 1, vertexStepScale: 1.75, trailLengthCap: 20 },
] as const satisfies readonly WaveQualityPreset[];

/** Minimum time between scroll-generated ripples. */
export const SCROLL_RIPPLE_THROTTLE = 80;

/** Minimum time between touch-movement ripples. */
export const TOUCH_RIPPLE_THROTTLE = 80;

/** Time offset between layered ripple points. */
export const RIPPLE_LAYER_OFFSET = 55;

/** Number of points used for a deliberate click or tap ripple. */
export const CLICK_RIPPLE_LAYERS = 3;

/** Number of points used for passive scroll and touch ripples. */
export const DEFAULT_RIPPLE_LAYERS = 2;

export function getWavePalette(theme: BackgroundTheme): WavePalette {
  if (theme === 'light') {
    return {
      color: '#37628f',
      waveColor: '#075fd7',
      opacity: 0.72,
    };
  }

  return {
    color: '#38679e',
    waveColor: '#72aaff',
    opacity: 0.82,
  };
}
