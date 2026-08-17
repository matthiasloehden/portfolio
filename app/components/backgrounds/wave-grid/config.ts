import type { WaveGridPalette } from './types';

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

export function getWaveGridPalette(theme: string | undefined): WaveGridPalette {
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
