import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

import type { WavePalette } from './types';
import { getBackgroundThemeColor } from '../shared/themeColors';

export type WaveQualityPreset = BackgroundQualityPreset;

export const WAVE_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 22 },
  { id: 'medium', slowFrameThreshold: 26 },
  { id: 'low', slowFrameThreshold: 32 },
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
      color: getBackgroundThemeColor('--muted', '#37628f'),
      waveColor: getBackgroundThemeColor('--primary', '#075fd7'),
      opacity: 0.72,
    };
  }

  return {
    color: getBackgroundThemeColor('--muted', '#38679e'),
    waveColor: getBackgroundThemeColor('--primary-bright', '#72aaff'),
    opacity: 0.82,
  };
}
