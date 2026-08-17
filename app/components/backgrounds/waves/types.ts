import type { BackgroundRendererStats } from '@/types/background';

export interface WavePosition {
  x: number;
  z: number;
}

export interface TrailPoint extends WavePosition {
  createdAt: number;
  velocity: number;
}

export interface WavePalette {
  color: string;
  waveColor: string;
  opacity: number;
}

export type WaveRendererStats = BackgroundRendererStats;
