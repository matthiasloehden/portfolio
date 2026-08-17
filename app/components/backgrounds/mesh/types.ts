import type { BackgroundRendererStats } from '@/types/background';

export interface MeshPalette {
  line: string;
  glow: string;
  node: string;
  ambient: string;
  baseLineAlpha: number;
  baseFillAlpha: number;
}

export interface MeshRenderState {
  active: boolean;
  advanceIdle: boolean;
  motionAllowed: boolean;
}

export interface MeshRendererStats extends BackgroundRendererStats {
  pointCount: number;
  triangleCount: number;
  edgeCount: number;
  rowCount: number;
  pointerStrength: number;
}
