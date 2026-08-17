import type { BackgroundRendererStats } from '@/types/background';

export interface ParticleRendererStats extends BackgroundRendererStats {
  particleCount: number;
}
