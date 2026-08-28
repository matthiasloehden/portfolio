import { describe, expect, it } from 'vitest';

import { createDefaultDisplayPreferences, hasCustomDisplayPreferences } from '@/domain/displayPreferences/defaults';
import type { DisplayPreferencesState } from '@/types/display';

const customizationCases: readonly {
  label: string;
  customize: (state: DisplayPreferencesState) => DisplayPreferencesState;
  themePreference: 'system' | 'dark';
}[] = [
  { label: 'explicit theme mode', customize: (state) => state, themePreference: 'dark' },
  {
    label: 'theme preset',
    customize: (state) => ({
      ...state,
      themeSettings: { ...state.themeSettings, preset: 'crimson' },
    }),
    themePreference: 'system',
  },
  {
    label: 'theme color override',
    customize: (state) => ({
      ...state,
      themeSettings: {
        ...state.themeSettings,
        colorOverrides: { ...state.themeSettings.colorOverrides, light: { primary: '#123456' } },
      },
    }),
    themePreference: 'system',
  },
  {
    label: 'background selection',
    customize: (state) => ({ ...state, backgroundPreference: 'mesh' }),
    themePreference: 'system',
  },
  {
    label: 'animation setting',
    customize: (state) => ({
      ...state,
      backgroundAnimations: { ...state.backgroundAnimations, scroll: false },
    }),
    themePreference: 'system',
  },
  {
    label: 'performance setting',
    customize: (state) => ({
      ...state,
      backgroundPerformance: { ...state.backgroundPerformance, showStats: true },
    }),
    themePreference: 'system',
  },
  {
    label: 'scene override',
    customize: (state) => ({
      ...state,
      backgroundSettingOverrides: {
        ...state.backgroundSettingOverrides,
        wave: { opacity: 0.5 },
      },
    }),
    themePreference: 'system',
  },
];

describe('display preference policy', () => {
  it('creates isolated defaults that are not marked as customized', () => {
    const first = createDefaultDisplayPreferences();
    const second = createDefaultDisplayPreferences();

    first.themeSettings.colorOverrides.dark.primary = '#123456';

    expect(second.themeSettings.colorOverrides.dark).toEqual({});
    expect(hasCustomDisplayPreferences(second, 'system')).toBe(false);
  });

  it.each(customizationCases)('detects a customized $label', ({ customize, themePreference }) => {
    expect(hasCustomDisplayPreferences(customize(createDefaultDisplayPreferences()), themePreference)).toBe(true);
  });
});
