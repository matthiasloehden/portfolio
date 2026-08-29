import { describe, expect, it } from 'vitest';

import { WaveInteractionTrail } from '@/components/backgrounds/waves/WaveInteractionTrail';

describe('WaveInteractionTrail', () => {
  it('creates an ordered layered ripple with a full-strength leading point', () => {
    const trail = new WaveInteractionTrail();

    trail.addRipple({ x: 2, z: -3 }, 1_000, 0.8, 3, 50, 8);

    expect(trail.points.map(({ x, z, createdAt }) => ({ x, z, createdAt }))).toEqual([
      { x: 2, z: -3, createdAt: 900 },
      { x: 2, z: -3, createdAt: 950 },
      { x: 2, z: -3, createdAt: 1_000 },
    ]);
    expect(trail.points[0]?.velocity).toBeCloseTo(0.72);
    expect(trail.points[1]?.velocity).toBeCloseTo(0.72);
    expect(trail.points[2]?.velocity).toBe(0.8);
  });

  it('retains only the newest points when its configured capacity shrinks', () => {
    const trail = new WaveInteractionTrail();

    trail.add({ x: 0, z: 0, createdAt: 100, velocity: 0.5 }, 3);
    trail.add({ x: 1, z: 1, createdAt: 200, velocity: 0.6 }, 3);
    trail.add({ x: 2, z: 2, createdAt: 300, velocity: 0.7 }, 3);
    trail.trim(2);

    expect(trail.points.map(({ createdAt }) => createdAt)).toEqual([200, 300]);
  });

  it('removes expired points while retaining the lifetime boundary', () => {
    const trail = new WaveInteractionTrail();

    trail.add({ x: 0, z: 0, createdAt: 100, velocity: 0.5 }, 4);
    trail.add({ x: 1, z: 1, createdAt: 200, velocity: 0.6 }, 4);
    trail.add({ x: 2, z: 2, createdAt: 300, velocity: 0.7 }, 4);
    trail.removeExpired(500, 300);

    expect(trail.points.map(({ createdAt }) => createdAt)).toEqual([200, 300]);
    expect(trail.isActive(601, 300)).toBe(false);
  });

  it('supports a disabled zero-length trail', () => {
    const trail = new WaveInteractionTrail();

    trail.add({ x: 0, z: 0, createdAt: 100, velocity: 1 }, 0);

    expect(trail.length).toBe(0);
  });
});
