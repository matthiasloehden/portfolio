import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';

export interface ParticleQualityPreset extends BackgroundQualityPreset {
  resolution: number;
}

export const PARTICLE_QUALITY_PRESETS = [
  { id: 'high', resolution: 224, slowFrameThreshold: 22 },
  { id: 'medium', resolution: 160, slowFrameThreshold: 25 },
  { id: 'low', resolution: 112, slowFrameThreshold: 30 },
] as const satisfies readonly ParticleQualityPreset[];

export const PARTICLE_CONFIG = {
  darkColor: '#6d9fe8',
  lightColor: '#205da7',
  ambientStrength: 0.105,
  noiseScale: 1.15,
  damping: 0.968,
  interactionDamping: 0.994,
  interactionMomentumDecay: 2.4,
  interactionMaxVelocity: 1.35,
  clickDecay: 0.9,
  pointerVelocityTransfer: 0.72,
  touchRadiusScale: 1.25,
  touchStrength: 1.35,
  idleRingRadius: 0.43,
  idleRingThickness: 0.22,
  idleAttraction: 0.28,
  idleOrbitStrength: 0.085,
  maxScrollImpulse: 2.4,
  maxPointerSpeed: 4.5,
  interactionDecay: 0.72,
  simulationMargin: 1.16,
  maxVelocity: 0.72,
  performanceSampleFrames: 120,
  performanceWarmupFrames: 180,
  poorPerformanceWindows: 2,
} as const;

export function getParticleColor(theme: BackgroundTheme): string {
  return theme === 'light' ? PARTICLE_CONFIG.lightColor : PARTICLE_CONFIG.darkColor;
}
