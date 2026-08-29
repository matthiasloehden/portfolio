import { describe, expect, it } from 'vitest';

import { BACKGROUND_SETTINGS_PERSISTENCE_POLICY } from '@/config/backgrounds/settingsRegistry';
import { createDefaultDisplayPreferences } from '@/domain/displayPreferences/defaults';
import { decodeDisplayPreferences, encodeDisplayPreferences } from '@/domain/displayPreferences/schema';
import { createDefaultThemeSettings } from '@/domain/themes/settings';

describe('display preferences schema', () => {
  it('round-trips a current domain document', () => {
    const preferences = createDefaultDisplayPreferences();
    preferences.backgroundPreference = 'random';
    preferences.themeSettings.preset = 'random';
    preferences.themeSettings.colorOverrides.dark.primary = '#123456';

    expect(
      decodeDisplayPreferences(encodeDisplayPreferences(preferences), BACKGROUND_SETTINGS_PERSISTENCE_POLICY),
    ).toEqual({
      sourceVersion: 4,
      preferences,
    });
  });

  it('sanitizes untrusted values at the domain boundary', () => {
    const defaults = createDefaultDisplayPreferences();
    const decoded = decodeDisplayPreferences(
      {
        version: 4,
        themeSettings: {
          preset: 'unknown',
          fonts: { display: 'cinzel', body: 'unknown' },
          colorOverrides: { dark: { primary: '#AABBCC', unknown: '#ffffff' } },
        },
        backgroundPreference: 'particles',
        backgroundAnimations: defaults.backgroundAnimations,
        backgroundPerformance: { mode: 'high', showStats: true },
        backgroundSettingOverrides: { particles: { pointSize: 3, opacity: 'invalid', unknown: 9 } },
      },
      BACKGROUND_SETTINGS_PERSISTENCE_POLICY,
    );

    expect(decoded?.preferences.themeSettings).toEqual({
      ...createDefaultThemeSettings(),
      fonts: { display: 'cinzel', body: 'inter' },
      colorOverrides: { dark: { primary: '#aabbcc' }, light: {} },
    });
    expect(decoded?.preferences.backgroundSettingOverrides.particles).toEqual({ pointSize: 3 });
  });

  it('preserves the Arctic preset from older preference documents', () => {
    const defaults = createDefaultDisplayPreferences();
    const decoded = decodeDisplayPreferences(
      {
        version: 3,
        ...defaults,
        themeSettings: { ...defaults.themeSettings, preset: 'arctic' },
      },
      BACKGROUND_SETTINGS_PERSISTENCE_POLICY,
    );

    expect(decoded?.preferences.themeSettings.preset).toBe('arctic');
  });

  it('maps the former shared cursor setting to both interaction channels', () => {
    const defaults = createDefaultDisplayPreferences();
    const decoded = decodeDisplayPreferences(
      {
        version: 2,
        ...defaults,
        backgroundAnimations: { idle: true, cursor: false, scroll: true },
      },
      BACKGROUND_SETTINGS_PERSISTENCE_POLICY,
    );

    expect(decoded?.preferences.backgroundAnimations).toEqual({
      idle: true,
      cursorMovement: false,
      cursorClick: false,
      scroll: true,
    });
  });

  it('rejects incomplete or unsupported documents', () => {
    expect(decodeDisplayPreferences(null, BACKGROUND_SETTINGS_PERSISTENCE_POLICY)).toBeUndefined();
    expect(decodeDisplayPreferences({ version: 99 }, BACKGROUND_SETTINGS_PERSISTENCE_POLICY)).toBeUndefined();
    expect(
      decodeDisplayPreferences({ version: 3, backgroundPreference: 'auto' }, BACKGROUND_SETTINGS_PERSISTENCE_POLICY),
    ).toBeUndefined();
  });
});
