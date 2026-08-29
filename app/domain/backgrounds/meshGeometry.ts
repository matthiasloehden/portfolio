import { seededRandom } from './math';

export interface MeshPoint {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  amplitudeX: number;
  amplitudeY: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  secondaryPhase: number;
}

export interface MeshTriangle {
  a: number;
  b: number;
  c: number;
  tone: number;
}

export interface MeshEdge {
  a: number;
  b: number;
  tone: number;
}

export interface MeshGeometryWindowOptions {
  startRow: number;
  endRow: number;
  columnCount: number;
  spacing: number;
  rowSpacing: number;
}

export interface MeshGeometryWindow {
  points: MeshPoint[];
  triangles: MeshTriangle[];
  edges: MeshEdge[];
}

/** Builds a deterministic document-space mesh for one buffered viewport window. */
export function buildMeshGeometryWindow(options: MeshGeometryWindowOptions): MeshGeometryWindow {
  const points: MeshPoint[] = [];
  const triangles: MeshTriangle[] = [];
  const edges: MeshEdge[] = [];
  const edgeKeys = new Set<string>();
  const rows = Math.max(0, options.endRow - options.startRow + 1);
  const startX = -options.spacing * 1.25;
  const rowOriginY = -options.rowSpacing;

  function addEdge(a: number, b: number, tone: number): void {
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    const key = `${start}:${end}`;
    if (edgeKeys.has(key)) return;

    edgeKeys.add(key);
    edges.push({ a: start, b: end, tone });
  }

  function addTriangle(a: number, b: number, c: number, tone: number): void {
    triangles.push({ a, b, c, tone });
    addEdge(a, b, tone);
    addEdge(b, c, tone);
    addEdge(c, a, tone);
  }

  for (let localRow = 0; localRow < rows; localRow += 1) {
    const globalRow = options.startRow + localRow;

    for (let column = 0; column < options.columnCount; column += 1) {
      // Document-level indices preserve geometry and motion phases when the
      // buffered window shifts while the visitor scrolls.
      const seed = globalRow * 101 + column * 37 + 1;
      const offsetX = globalRow % 2 === 0 ? 0 : options.spacing * 0.5;
      const jitterX = (seededRandom(seed) - 0.5) * options.spacing * 0.26;
      const jitterY = (seededRandom(seed + 7) - 0.5) * options.rowSpacing * 0.24;
      const baseX = startX + column * options.spacing + offsetX + jitterX;
      const baseY = rowOriginY + globalRow * options.rowSpacing + jitterY;

      points.push({
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        amplitudeX: 8 + seededRandom(seed + 13) * 18,
        amplitudeY: 7 + seededRandom(seed + 19) * 16,
        phaseX: seededRandom(seed + 23) * Math.PI * 2,
        phaseY: seededRandom(seed + 29) * Math.PI * 2,
        speedX: 0.22 + seededRandom(seed + 31) * 0.25,
        speedY: 0.18 + seededRandom(seed + 43) * 0.28,
        secondaryPhase: (globalRow * options.columnCount + column) * 0.31,
      });
    }
  }

  for (let localRow = 0; localRow < rows - 1; localRow += 1) {
    const globalRow = options.startRow + localRow;

    for (let column = 0; column < options.columnCount - 1; column += 1) {
      const topLeft = localRow * options.columnCount + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + options.columnCount;
      const bottomRight = bottomLeft + 1;
      const tone = 0.72 + seededRandom(globalRow * 89 + column * 17) * 0.28;

      if ((globalRow + column) % 2 === 0) {
        addTriangle(topLeft, topRight, bottomRight, tone);
        addTriangle(topLeft, bottomRight, bottomLeft, tone * 0.82);
      } else {
        addTriangle(topLeft, topRight, bottomLeft, tone * 0.82);
        addTriangle(topRight, bottomRight, bottomLeft, tone);
      }
    }
  }

  return { points, triangles, edges };
}
