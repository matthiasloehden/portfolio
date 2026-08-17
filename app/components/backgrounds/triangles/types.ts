export interface TrianglePosition {
  x: number;
  worldY: number;
}

export interface TriangleRendererStats {
  width: number;
  height: number;
  dpr: number;
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
