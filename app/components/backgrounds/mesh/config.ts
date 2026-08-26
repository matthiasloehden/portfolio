import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

import type { MeshPalette } from './types';

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
      line: '#4a6f9e',
      glow: '#075fd7',
      node: '#075fd7',
      ambient: '7, 95, 215',
      baseLineAlpha: 0.22,
      baseFillAlpha: 0.032,
    };
  }

  return {
    line: '#668bbd',
    glow: '#72aaff',
    node: '#9bc4ff',
    ambient: '50, 132, 255',
    baseLineAlpha: 0.19,
    baseFillAlpha: 0.024,
  };
}
