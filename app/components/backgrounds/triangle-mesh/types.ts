export interface TriangleMeshPalette {
  line: string;
  glow: string;
  node: string;
  ambient: string;
  baseLineAlpha: number;
  baseFillAlpha: number;
}

export interface TriangleMeshRenderState {
  active: boolean;
  advanceIdle: boolean;
  motionAllowed: boolean;
}

export interface TriangleMeshRendererStats {
  width: number;
  height: number;
  dpr: number;
  pointCount: number;
  triangleCount: number;
  edgeCount: number;
  rowCount: number;
  pointerStrength: number;
}
