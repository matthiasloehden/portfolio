import { describe, expect, it } from 'vitest';

import { TriangleHighlightTrail } from '@/domain/backgrounds/triangleHighlightTrail';

function createTrail(maxPoints = 8): TriangleHighlightTrail {
  return new TriangleHighlightTrail({ maxPoints, pointSpacing: 10 });
}

describe('TriangleHighlightTrail', () => {
  it('interpolates long pointer movements at a bounded spacing', () => {
    const trail = createTrail();

    trail.addSegment({ x: 0, worldY: 0 }, { x: 25, worldY: 0 }, 1, 1_000);

    expect(trail.pointCount).toBe(3);
    expect(trail.hasActivePoint(1_000, 500)).toBe(true);
  });

  it('retains only the newest points when capacity is exceeded', () => {
    const trail = createTrail(2);

    trail.addPoint({ x: 0, worldY: 0 }, 1, 100);
    trail.addPoint({ x: 1, worldY: 0 }, 1, 200);
    trail.addPoint({ x: 2, worldY: 0 }, 1, 300);

    expect(trail.pointCount).toBe(2);
    expect(trail.hasActivePoint(300, 50)).toBe(true);
  });

  it('decays influence by distance and age', () => {
    const trail = createTrail();
    trail.addPoint({ x: 0, worldY: 0 }, 1, 1_000);

    const fresh = trail.getInfluence({ x: 0, worldY: 0 }, 1_000, {
      lifetime: 1_000,
      radius: 100,
      strength: 1,
    });
    const aged = trail.getInfluence({ x: 0, worldY: 0 }, 1_500, {
      lifetime: 1_000,
      radius: 100,
      strength: 1,
    });
    const outside = trail.getInfluence({ x: 100, worldY: 0 }, 1_000, {
      lifetime: 1_000,
      radius: 100,
      strength: 1,
    });

    expect(fresh).toBe(1);
    expect(aged).toBeCloseTo(0.25);
    expect(outside).toBe(0);
  });

  it('removes expired points and clears interaction state', () => {
    const trail = createTrail();
    trail.addClick({ x: 0, worldY: 0 }, 1_000);

    trail.removeExpired(2_001, 1_000);
    expect(trail.pointCount).toBe(0);

    trail.addPoint({ x: 0, worldY: 0 }, 1, 3_000);
    trail.clear();
    expect(trail.pointCount).toBe(0);
  });
});
