import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

import type { TrianglePalette } from './types';
import { getBackgroundThemeColor, getBackgroundThemeRgb } from '../shared/themeColors';

export type TriangleQualityPreset = BackgroundQualityPreset;

export const TRIANGLE_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 38 },
  { id: 'medium', slowFrameThreshold: 42 },
  { id: 'low', slowFrameThreshold: 48 },
] as const satisfies readonly TriangleQualityPreset[];

export const TRIANGLE_CONFIG = {
  rotationRadians: Math.PI / 4,
  targetTriangles: {
    desktop: 1_000,
    tablet: 480,
    mobile: 320,
  },
  viewportBreakpoints: {
    mobile: 640,
    tablet: 1_000,
  },
  frameBudget: {
    // One millisecond of tolerance prevents 60 Hz timestamps from being
    // mistaken for an over-budget frame while still capping faster displays.
    active: 1_000 / 60 - 1,
  },
  pointerRadius: {
    desktop: 135,
    mobile: 100,
  },
  maxHighlightPoints: 32,
  trailSpacing: 18,
  minPointerDistance: 8,
  minPointerInterval: 24,
  overscanCells: 2,
  minimumColumns: 6,
  minimumRows: 5,
} as const;

export function getTrianglePalette(theme: BackgroundTheme): TrianglePalette {
  if (theme === 'light') {
    return {
      fill: getBackgroundThemeRgb('--muted', '68, 96, 134'),
      accent: getBackgroundThemeRgb('--primary', '7, 95, 215'),
      ambient: getBackgroundThemeRgb('--primary', '50, 132, 255'),
      background: getBackgroundThemeColor('--background', '#f3f7fc'),
    };
  }

  return {
    fill: getBackgroundThemeRgb('--muted', '112, 142, 181'),
    accent: getBackgroundThemeRgb('--primary-bright', '114, 170, 255'),
    ambient: getBackgroundThemeRgb('--primary', '50, 132, 255'),
    background: getBackgroundThemeColor('--background', '#030509'),
  };
}
