import { describe, expect, it } from 'vitest';

import { buildMeshGeometryWindow, type MeshGeometryWindowOptions } from '@/domain/backgrounds/meshGeometry';

const options: MeshGeometryWindowOptions = {
  startRow: 4,
  endRow: 6,
  columnCount: 5,
  spacing: 80,
  rowSpacing: 68,
};

describe('buildMeshGeometryWindow', () => {
  it('builds deterministic points and topology', () => {
    const first = buildMeshGeometryWindow(options);
    const second = buildMeshGeometryWindow(options);

    expect(first).toEqual(second);
    expect(first.points).toHaveLength(15);
    expect(first.triangles).toHaveLength(16);
  });

  it('keeps a shared document row stable when the viewport window moves', () => {
    const first = buildMeshGeometryWindow({ ...options, startRow: 4, endRow: 5 });
    const shifted = buildMeshGeometryWindow({ ...options, startRow: 5, endRow: 6 });

    expect(first.points.slice(options.columnCount)).toEqual(shifted.points.slice(0, options.columnCount));
  });

  it('creates unique normalized edges and valid triangle references', () => {
    const geometry = buildMeshGeometryWindow(options);
    const edgeKeys = geometry.edges.map(({ a, b }) => `${a}:${b}`);

    expect(new Set(edgeKeys).size).toBe(edgeKeys.length);
    expect(geometry.edges.every(({ a, b }) => a < b)).toBe(true);
    expect(
      geometry.triangles.every(({ a, b, c }) =>
        [a, b, c].every((pointIndex) => pointIndex >= 0 && pointIndex < geometry.points.length),
      ),
    ).toBe(true);
  });

  it('returns an empty mesh for an empty row window', () => {
    expect(buildMeshGeometryWindow({ ...options, startRow: 7, endRow: 6 })).toEqual({
      points: [],
      triangles: [],
      edges: [],
    });
  });
});
