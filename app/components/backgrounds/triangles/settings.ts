import { defineBackgroundSettings } from '@/components/backgrounds/settings/definition';
import type { TriangleSettings } from '@/types/background';

export const triangleSettingsDefinition = defineBackgroundSettings<TriangleSettings>({
  densityScale: {
    group: 'appearance',
    label: 'Triangle density',
    description: 'Number of triangles relative to the default scene.',
    defaultValue: 1,
    recommended: { min: 0.5, max: 1.5, step: 0.01 },
    runtime: { min: 0.1, max: 4 },
    presetValues: { high: 1, medium: 0.72, low: 0.48 },
  },
  opacity: {
    group: 'appearance',
    label: 'Triangle opacity',
    description: 'Visibility of the triangle field and its highlights.',
    defaultValue: 1,
    recommended: { min: 0.25, max: 1.5, step: 0.05 },
    runtime: { min: 0, max: 3 },
  },
  idleStrength: {
    group: 'appearance',
    label: 'Idle movement',
    description: 'Strength of the ambient triangle movement.',
    defaultValue: 1,
    recommended: { min: 0, max: 2, step: 0.05 },
    runtime: { min: 0, max: 5 },
  },
  pixelRatioCap: {
    group: 'appearance',
    label: 'Pixel-ratio cap',
    description: 'Maximum render resolution; lower values improve GPU performance.',
    defaultValue: 1.35,
    recommended: { min: 1, max: 2, step: 0.05 },
    runtime: { min: 0.5, max: 3 },
    presetValues: { high: 1.35, medium: 1.15, low: 1 },
  },
  interactionRadiusScale: {
    group: 'interaction',
    label: 'Interaction radius',
    description: 'Size of the pointer highlight area.',
    defaultValue: 1,
    recommended: { min: 0.5, max: 2, step: 0.05 },
    runtime: { min: 0.1, max: 5 },
  },
  highlightStrength: {
    group: 'interaction',
    label: 'Highlight strength',
    description: 'Intensity of pointer, click and scroll highlights.',
    defaultValue: 1,
    recommended: { min: 0, max: 2, step: 0.05 },
    runtime: { min: 0, max: 5 },
  },
  highlightLifetime: {
    group: 'interaction',
    label: 'Highlight lifetime',
    description: 'How long pointer highlights remain visible in milliseconds.',
    defaultValue: 1_000,
    recommended: { min: 300, max: 3_000, step: 100 },
    runtime: { min: 0, max: 30_000 },
  },
});
