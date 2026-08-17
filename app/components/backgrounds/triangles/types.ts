import type { BackgroundRendererStats } from '@/types/background';

export interface TrianglePosition {
  x: number;
  worldY: number;
}

export interface TriangleRendererStats extends BackgroundRendererStats {
  triangleCount: number;
  trailPointCount: number;
  rotationDegrees: number;
}

export interface TrianglePalette {
  fill: string;
  accent: string;
  ambient: string;
  background: string;
}
