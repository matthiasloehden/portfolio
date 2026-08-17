import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

import type { TrianglePalette } from './types';

export interface TriangleQualityPreset extends BackgroundQualityPreset {
  densityScale: number;
}

export const TRIANGLE_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 38, densityScale: 1, pixelRatioCap: 1.35 },
  { id: 'medium', slowFrameThreshold: 42, densityScale: 0.72, pixelRatioCap: 1.15 },
  { id: 'low', slowFrameThreshold: 48, densityScale: 0.48, pixelRatioCap: 1 },
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
  highlightLifetime: 1_000,
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
      fill: '68, 96, 134',
      accent: '7, 95, 215',
      ambient: '50, 132, 255',
      background: '#f3f7fc',
    };
  }

  return {
    fill: '112, 142, 181',
    accent: '114, 170, 255',
    ambient: '50, 132, 255',
    background: '#030509',
  };
}
