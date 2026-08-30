import type { BackgroundQualityPreset, BackgroundTheme } from '@/types/background';
import { getBackgroundThemeColor } from '../shared/themeColors';

export type ParticleQualityPreset = BackgroundQualityPreset;

export const PARTICLE_QUALITY_PRESETS = [
  { id: 'high', slowFrameThreshold: 22 },
  { id: 'medium', slowFrameThreshold: 25 },
  { id: 'low', slowFrameThreshold: 30 },
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
  boundaryRestitution: 0.88,
  maxVelocity: 0.72,
  performanceSampleFrames: 120,
  performanceWarmupFrames: 180,
  poorPerformanceWindows: 2,
} as const;

export function getParticleColor(theme: BackgroundTheme): string {
  return theme === 'light'
    ? getBackgroundThemeColor('--primary', PARTICLE_CONFIG.lightColor)
    : getBackgroundThemeColor('--primary-bright', PARTICLE_CONFIG.darkColor);
}
