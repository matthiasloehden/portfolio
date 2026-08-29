import { defineBackgroundSettings } from '@/domain/backgrounds/settingsDefinition';
import type { WaveSettings } from '@/types/background';

/** Texture capacity shared with the Wave Grid shader; trailLength is capped here. */
export const WAVE_MAX_TRAIL_POINTS = 48;

export const waveSettingsDefinition = defineBackgroundSettings<WaveSettings>({
  gridWidth: {
    group: 'appearance',
    label: 'Grid width',
    description: 'Horizontal extent of the grid.',
    defaultValue: 34,
    recommended: { min: 16, max: 52, step: 1 },
    runtime: { min: 2, max: 100 },
  },
  gridDepth: {
    group: 'appearance',
    label: 'Grid depth',
    description: 'Visible depth of the grid.',
    defaultValue: 32,
    recommended: { min: 16, max: 52, step: 1 },
    runtime: { min: 2, max: 100 },
  },
  gridSpacing: {
    group: 'appearance',
    label: 'Grid spacing',
    description: 'Distance between grid lines; lower values draw more lines.',
    defaultValue: 0.8,
    recommended: { min: 0.4, max: 1.6, step: 0.05 },
    runtime: { min: 0.2, max: 4 },
  },
  opacity: {
    group: 'appearance',
    label: 'Grid opacity',
    description: 'Visibility of the grid and its highlights.',
    defaultValue: 1,
    recommended: { min: 0.25, max: 1.5, step: 0.05 },
    runtime: { min: 0, max: 3 },
  },
  idleStrength: {
    group: 'appearance',
    label: 'Idle movement',
    description: 'Strength of the ambient grid movement.',
    defaultValue: 1,
    recommended: { min: 0, max: 2, step: 0.05 },
    runtime: { min: 0, max: 5 },
  },
  vertexStep: {
    group: 'appearance',
    label: 'Vertex spacing',
    description: 'Distance between line vertices; lower values cost more GPU work.',
    defaultValue: 0.32,
    recommended: { min: 0.16, max: 0.64, step: 0.04 },
    runtime: { min: 0.08, max: 2 },
    presetValues: { high: 0.32, medium: 0.4, low: 0.56 },
  },
  pixelRatioCap: {
    group: 'appearance',
    label: 'Pixel-ratio cap',
    description: 'Maximum render resolution; lower values improve GPU performance.',
    defaultValue: 1.5,
    recommended: { min: 1, max: 2, step: 0.25 },
    runtime: { min: 0.5, max: 3 },
    presetValues: { high: 2, medium: 1.5, low: 1 },
  },
  rippleStrength: {
    group: 'interaction',
    label: 'Ripple strength',
    description: 'Height and visibility of interaction ripples.',
    defaultValue: 1,
    recommended: { min: 0, max: 2, step: 0.05 },
    runtime: { min: 0, max: 5 },
  },
  trailLength: {
    group: 'interaction',
    label: 'Trail points',
    description: 'Maximum simultaneous pointer and ripple points.',
    defaultValue: 32,
    recommended: { min: 8, max: WAVE_MAX_TRAIL_POINTS, step: 1 },
    runtime: { min: 1, max: WAVE_MAX_TRAIL_POINTS, integer: true },
    presetValues: { high: 48, medium: 36, low: 20 },
  },
  trailLifetime: {
    group: 'interaction',
    label: 'Trail lifetime',
    description: 'How long ripples remain visible in milliseconds.',
    defaultValue: 2_300,
    recommended: { min: 600, max: 5_000, step: 100 },
    runtime: { min: 50, max: 30_000 },
  },
});
