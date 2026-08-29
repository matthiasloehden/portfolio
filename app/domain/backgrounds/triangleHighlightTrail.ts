import { smoothstep } from './math';

export interface TrianglePosition {
  x: number;
  worldY: number;
}

interface TriangleHighlightPoint extends TrianglePosition {
  time: number;
  strength: number;
}

export interface TriangleHighlightTrailOptions {
  maxPoints: number;
  pointSpacing: number;
}

export interface TriangleHighlightInfluenceOptions {
  lifetime: number;
  radius: number;
  strength: number;
}

/**
 * Owns the bounded interaction trail independently from Canvas rendering.
 * Global scene coordinates make the model stable across viewport-grid rebuilds.
 */
export class TriangleHighlightTrail {
  private readonly points: TriangleHighlightPoint[] = [];

  constructor(private readonly options: TriangleHighlightTrailOptions) {}

  get pointCount(): number {
    return this.points.length;
  }

  addPoint(position: TrianglePosition, strength: number, time: number): void {
    this.points.push({ ...position, time, strength });

    if (this.points.length > this.options.maxPoints) {
      this.points.splice(0, this.points.length - this.options.maxPoints);
    }
  }

  addSegment(from: TrianglePosition, to: TrianglePosition, strength: number, now: number): void {
    const distance = Math.hypot(to.x - from.x, to.worldY - from.worldY);

    if (distance < 1) {
      this.addPoint(to, strength, now);
      return;
    }

    const steps = Math.max(1, Math.ceil(distance / this.options.pointSpacing));

    for (let index = 1; index <= steps; index += 1) {
      const progress = index / steps;
      this.addPoint(
        {
          x: from.x + (to.x - from.x) * progress,
          worldY: from.worldY + (to.worldY - from.worldY) * progress,
        },
        strength,
        now - (steps - index) * 7,
      );
    }
  }

  addClick(position: TrianglePosition, now: number): void {
    this.addPoint(position, 0.82, now - 80);
    this.addPoint(position, 1, now);
  }

  clear(): void {
    this.points.length = 0;
  }

  hasActivePoint(now: number, lifetime: number): boolean {
    this.removeExpired(now, lifetime);
    const newest = this.points[this.points.length - 1];
    return newest !== undefined && now - newest.time < lifetime;
  }

  removeExpired(now: number, lifetime: number): void {
    let firstValidIndex = 0;

    while (firstValidIndex < this.points.length) {
      const point = this.points[firstValidIndex];
      if (!point || now - point.time < lifetime) break;
      firstValidIndex += 1;
    }

    if (firstValidIndex > 0) this.points.splice(0, firstValidIndex);
  }

  getInfluence(position: TrianglePosition, now: number, options: TriangleHighlightInfluenceOptions): number {
    if (this.points.length === 0 || options.radius <= 0 || options.lifetime <= 0) return 0;

    const radiusSquared = options.radius * options.radius;
    let influence = 0;

    for (const point of this.points) {
      const age = now - point.time;
      if (age >= options.lifetime) continue;

      const distanceX = position.x - point.x;
      const distanceY = position.worldY - point.worldY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
      if (distanceSquared >= radiusSquared) continue;

      const fade = (1 - age / options.lifetime) ** 2;
      const proximity = smoothstep(options.radius, 0, Math.sqrt(distanceSquared));
      influence = Math.max(influence, proximity * fade * point.strength);

      if (influence * options.strength >= 1) return 1;
    }

    return Math.min(1, influence * options.strength);
  }
}
