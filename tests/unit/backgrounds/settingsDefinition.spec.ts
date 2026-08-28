import { describe, expect, it } from 'vitest';

import {
  createDefaultSettings,
  createRuntimeSettings,
  defineBackgroundSettings,
  resolveSettings,
  sanitizeSettingOverrides,
} from '@/components/backgrounds/settings/definition';

interface ExampleSettings {
  density: number;
  opacity: number;
}

const definition = defineBackgroundSettings<ExampleSettings>({
  density: {
    group: 'appearance',
    label: 'Density',
    description: 'Fixture used to verify integer runtime bounds.',
    defaultValue: 10,
    recommended: { min: 4, max: 12, step: 1 },
    runtime: { min: 2, max: 20, integer: true },
    presetValues: { high: 12, medium: 8, low: 4 },
  },
  opacity: {
    group: 'appearance',
    label: 'Opacity',
    description: 'Fixture used to verify continuous runtime bounds.',
    defaultValue: 0.5,
    recommended: { min: 0.1, max: 1, step: 0.1 },
    runtime: { min: 0, max: 1 },
  },
});

describe('background settings definition', () => {
  it('creates defaults in the declared control order', () => {
    expect(definition.controls.map((control) => control.key)).toEqual(['density', 'opacity']);
    expect(createDefaultSettings(definition)).toEqual({ density: 10, opacity: 0.5 });
  });

  it('resolves explicit overrides before presets and defaults', () => {
    expect(resolveSettings(definition, { density: 17 }, 'low')).toEqual({ density: 17, opacity: 0.5 });
    expect(resolveSettings(definition, { density: Number.NaN }, 'medium')).toEqual({ density: 8, opacity: 0.5 });
  });

  it('applies the final renderer safety boundary and integer policy', () => {
    expect(createRuntimeSettings(definition, { density: 24.6, opacity: -0.2 })).toEqual({
      density: 20,
      opacity: 0,
    });
    expect(createRuntimeSettings(definition, { density: 7.6, opacity: 0.75 })).toEqual({
      density: 8,
      opacity: 0.75,
    });
  });

  it('keeps only declared finite numeric overrides', () => {
    expect(sanitizeSettingOverrides(definition, { density: 9, opacity: '0.5', unknown: 4 })).toEqual({ density: 9 });
    expect(sanitizeSettingOverrides(definition, null)).toEqual({});
  });
});
