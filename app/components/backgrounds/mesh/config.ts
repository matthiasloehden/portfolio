import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

import type { MeshPalette } from './types';
import { getBackgroundThemeColor, getBackgroundThemeRgb } from '../shared/themeColors';

export type MeshQualityPreset = BackgroundQualityPreset;

export const MESH_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 22 },
  { id: 'medium', slowFrameThreshold: 27 },
  { id: 'low', slowFrameThreshold: 34 },
] as const satisfies readonly MeshQualityPreset[];

export const MESH_CONFIG = {
  pointerWakeAttackRate: 7.5,
  pointerActivityHold: 160,
  pointerWakeRadius: 320,
  pointerWakeMinRadius: 72,
  pointerCoreRadius: 58,
  renderMargin: 180,
  // Covers the complete pointer wake plus animated point drift so rows can be
  // exchanged outside the visible area without pop-in.
  viewportBuffer: 380,
  spacing: {
    desktop: 148,
    tablet: 128,
    mobile: 112,
    rowScale: 0.79,
  },
  viewportBreakpoints: {
    mobile: 640,
    tablet: 1_000,
  },
} as const;

export function getMeshPalette(theme: BackgroundTheme): MeshPalette {
  if (theme === 'light') {
    return {
      line: getBackgroundThemeColor('--muted', '#4a6f9e'),
      glow: getBackgroundThemeColor('--primary', '#075fd7'),
      node: getBackgroundThemeColor('--primary', '#075fd7'),
      ambient: getBackgroundThemeRgb('--primary', '7, 95, 215'),
      baseLineAlpha: 0.22,
      baseFillAlpha: 0.032,
    };
  }

  return {
    line: getBackgroundThemeColor('--muted', '#668bbd'),
    glow: getBackgroundThemeColor('--primary-bright', '#72aaff'),
    node: getBackgroundThemeColor('--primary-bright', '#9bc4ff'),
    ambient: getBackgroundThemeRgb('--primary', '50, 132, 255'),
    baseLineAlpha: 0.19,
    baseFillAlpha: 0.024,
  };
}
