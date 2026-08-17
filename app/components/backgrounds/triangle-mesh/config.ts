import type { BackgroundQualityPreset } from '@/types/background';

export interface TriangleMeshQualityPreset extends BackgroundQualityPreset {
  spacingScale: number;
  pixelRatioCap: number;
}

export const TRIANGLE_MESH_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 22, spacingScale: 0.85, pixelRatioCap: 1.5 },
  { id: 'medium', slowFrameThreshold: 27, spacingScale: 1, pixelRatioCap: 1.25 },
  { id: 'low', slowFrameThreshold: 34, spacingScale: 1.3, pixelRatioCap: 1 },
] as const satisfies readonly TriangleMeshQualityPreset[];
