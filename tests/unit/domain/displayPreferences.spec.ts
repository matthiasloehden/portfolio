import { describe, expect, it } from 'vitest';

import { createDefaultDisplayPreferences, hasCustomDisplayPreferences } from '@/domain/displayPreferences/defaults';
import type { DisplayPreferencesState, ThemePreference } from '@/types/display';

const customizationCases: readonly {
  label: string;
  customize: (state: DisplayPreferencesState) => DisplayPreferencesState;
  themePreference: ThemePreference;
}[] = [
  { label: 'explicit theme mode', customize: (state) => state, themePreference: 'system' },
  {
    label: 'theme preset',
    customize: (state) => ({
      ...state,
      themeSettings: { ...state.themeSettings, preset: 'crimson' },
    }),
    themePreference: 'dark',
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
    themePreference: 'dark',
  },
  {
    label: 'background selection',
    customize: (state) => ({ ...state, backgroundPreference: 'mesh' }),
    themePreference: 'dark',
  },
  {
    label: 'animation setting',
    customize: (state) => ({
      ...state,
      backgroundAnimations: { ...state.backgroundAnimations, scroll: false },
    }),
    themePreference: 'dark',
  },
  {
    label: 'performance setting',
    customize: (state) => ({
      ...state,
      backgroundPerformance: { ...state.backgroundPerformance, showStats: true },
    }),
    themePreference: 'dark',
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
    themePreference: 'dark',
  },
];

describe('display preference policy', () => {
  it('creates isolated defaults that are not marked as customized', () => {
    const first = createDefaultDisplayPreferences();
    const second = createDefaultDisplayPreferences();

    first.themeSettings.colorOverrides.dark.primary = '#123456';

    expect(second.themeSettings.colorOverrides.dark).toEqual({});
    expect(hasCustomDisplayPreferences(second, 'dark')).toBe(false);
  });

  it.each(customizationCases)('detects a customized $label', ({ customize, themePreference }) => {
    expect(hasCustomDisplayPreferences(customize(createDefaultDisplayPreferences()), themePreference)).toBe(true);
  });
});
