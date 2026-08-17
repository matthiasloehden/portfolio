export type QualityId = 'high' | 'medium' | 'low';

export interface ParticleQuality {
  id: QualityId;
  resolution: number;
  dprCap: number;
  slowFrameThreshold: number;
}

export const PARTICLE_QUALITY = [
  { id: 'high', resolution: 224, dprCap: 1.5, slowFrameThreshold: 22 },
  { id: 'medium', resolution: 160, dprCap: 1.25, slowFrameThreshold: 25 },
  { id: 'low', resolution: 112, dprCap: 1, slowFrameThreshold: 30 },
] as const satisfies readonly ParticleQuality[];

export const PARTICLE_CONFIG = {
  particleSize: 1.35,
  particleOpacity: 0.32,
  darkColor: '#6d9fe8',
  lightColor: '#205da7',
  ambientStrength: 0.105,
  noiseScale: 1.15,
  noiseSpeed: 0.075,
  damping: 0.968,
  interactionDamping: 0.994,
  interactionMomentumDecay: 2.4,
  interactionMaxVelocity: 1.35,
  pointerRadius: 0.24,
  pointerRepulsion: 3.45,
  pointerVelocityTransfer: 0.72,
  pointerVortexStrength: 0.66,
  touchRadius: 0.3,
  touchStrength: 1.35,
  idleRingRadius: 0.43,
  idleRingThickness: 0.22,
  idleAttraction: 0.28,
  idleOrbitStrength: 0.085,
  scrollStrength: 1.02,
  maxScrollImpulse: 2.4,
  maxPointerSpeed: 4.5,
  interactionDecay: 0.72,
  simulationMargin: 1.16,
  maxVelocity: 0.72,
  performanceSampleFrames: 120,
  performanceWarmupFrames: 180,
  poorPerformanceWindows: 2,
  debugUpdateInterval: 250,
} as const;

export function chooseInitialQuality(): number {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const compactViewport = window.innerWidth < 820 || window.innerHeight < 620;
  const cores = navigator.hardwareConcurrency || 4;

  if (coarsePointer || cores <= 4) return 2;
  if (compactViewport || cores <= 6) return 1;
  return 0;
}

export function getParticleQuality(index: number): ParticleQuality {
  return PARTICLE_QUALITY[index] ?? PARTICLE_QUALITY[2];
}
