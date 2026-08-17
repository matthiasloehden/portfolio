export interface GridPosition {
  x: number;
  z: number;
}

export interface TrailPoint extends GridPosition {
  createdAt: number;
  velocity: number;
}

export interface WaveGridPalette {
  color: string;
  waveColor: string;
  opacity: number;
}
