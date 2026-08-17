import type { BackgroundQualityPreset } from '@/types/background';

export interface TriangleQualityPreset extends BackgroundQualityPreset {
  densityScale: number;
  pixelRatioCap: number;
}

export const TRIANGLE_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 38, densityScale: 1, pixelRatioCap: 1.35 },
  { id: 'medium', slowFrameThreshold: 42, densityScale: 0.72, pixelRatioCap: 1.15 },
  { id: 'low', slowFrameThreshold: 48, densityScale: 0.48, pixelRatioCap: 1 },
] as const satisfies readonly TriangleQualityPreset[];
