import { describe, expect, it } from 'vitest';

import {
  createDefaultSettings,
  createRuntimeSettings,
  defineBackgroundSettings,
  resolveSettings,
  sanitizeSettingOverrides,
} from '@/domain/backgrounds/settingsDefinition';

interface ExampleSettings {
  density: number;
  opacity: number;
  enabled: boolean;
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
  enabled: {
    type: 'boolean',
    group: 'interaction',
    label: 'Enabled',
    description: 'Fixture used to verify boolean settings.',
    defaultValue: true,
  },
});

describe('background settings definition', () => {
  it('creates defaults in the declared control order', () => {
    expect(definition.controls.map((control) => control.key)).toEqual(['density', 'opacity', 'enabled']);
    expect(createDefaultSettings(definition)).toEqual({ density: 10, opacity: 0.5, enabled: true });
  });

  it('resolves explicit overrides before presets and defaults', () => {
    expect(resolveSettings(definition, { density: 17, enabled: false }, 'low')).toEqual({
      density: 17,
      opacity: 0.5,
      enabled: false,
    });
    expect(resolveSettings(definition, { density: Number.NaN }, 'medium')).toEqual({
      density: 8,
      opacity: 0.5,
      enabled: true,
    });
  });

  it('applies the final renderer safety boundary and integer policy', () => {
    expect(createRuntimeSettings(definition, { density: 24.6, opacity: -0.2, enabled: false })).toEqual({
      density: 20,
      opacity: 0,
      enabled: false,
    });
    expect(createRuntimeSettings(definition, { density: 7.6, opacity: 0.75, enabled: true })).toEqual({
      density: 8,
      opacity: 0.75,
      enabled: true,
    });
  });

  it('keeps only declared values with the expected primitive type', () => {
    expect(sanitizeSettingOverrides(definition, { density: 9, opacity: '0.5', enabled: false, unknown: 4 })).toEqual({
      density: 9,
      enabled: false,
    });
    expect(sanitizeSettingOverrides(definition, null)).toEqual({});
  });
});
