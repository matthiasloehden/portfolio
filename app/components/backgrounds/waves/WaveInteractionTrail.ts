export interface WavePosition {
  x: number;
  z: number;
}

export interface WaveTrailPoint extends WavePosition {
  createdAt: number;
  velocity: number;
}

/** Owns the ordered, bounded lifetime of wave interactions independently from WebGL rendering. */
export class WaveInteractionTrail {
  private readonly mutablePoints: WaveTrailPoint[] = [];

  get points(): readonly WaveTrailPoint[] {
    return this.mutablePoints;
  }

  get length(): number {
    return this.mutablePoints.length;
  }

  add(point: WaveTrailPoint, maximumLength: number): void {
    this.mutablePoints.push(point);
    this.trim(maximumLength);
  }

  addRipple(
    position: WavePosition,
    now: number,
    velocity: number,
    layers: number,
    layerOffset: number,
    maximumLength: number,
  ): void {
    for (let layer = layers - 1; layer >= 0; layer -= 1) {
      this.mutablePoints.push({
        ...position,
        createdAt: now - layer * layerOffset,
        velocity: velocity * (layer === 0 ? 1 : 0.9),
      });
    }

    this.trim(maximumLength);
  }

  trim(maximumLength: number): void {
    const overflow = this.mutablePoints.length - Math.max(0, maximumLength);

    if (overflow > 0) this.mutablePoints.splice(0, overflow);
  }

  removeExpired(now: number, lifetime: number): void {
    const firstActivePoint = this.mutablePoints.findIndex((point) => now - point.createdAt <= lifetime);

    if (firstActivePoint === 0) return;
    if (firstActivePoint === -1) this.clear();
    else this.mutablePoints.splice(0, firstActivePoint);
  }

  isActive(now: number, lifetime: number): boolean {
    this.removeExpired(now, lifetime);
    return this.mutablePoints.length > 0;
  }

  clear(): void {
    this.mutablePoints.length = 0;
  }
}
