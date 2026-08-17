/** Deterministic pseudo-random value in the range [0, 1). */
export function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;

  return value - Math.floor(value);
}

export function smoothstep(edgeStart: number, edgeEnd: number, value: number): number {
  const range = edgeEnd - edgeStart;

  if (range === 0) return value < edgeStart ? 0 : 1;

  const normalized = Math.min(1, Math.max(0, (value - edgeStart) / range));

  return normalized * normalized * (3 - 2 * normalized);
}
