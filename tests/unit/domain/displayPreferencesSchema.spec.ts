import { describe, expect, it } from 'vitest';

import { createDefaultDisplayPreferences } from '@/domain/displayPreferences/defaults';
import { decodeDisplayPreferences, encodeDisplayPreferences } from '@/domain/displayPreferences/schema';
import { createDefaultThemeSettings } from '@/domain/themeSettings';

describe('display preferences schema', () => {
  it('round-trips a current domain document', () => {
    const preferences = createDefaultDisplayPreferences();
    preferences.backgroundPreference = 'particles';
    preferences.themeSettings.colorOverrides.dark.primary = '#123456';

    expect(decodeDisplayPreferences(encodeDisplayPreferences(preferences))).toEqual({
      sourceVersion: 3,
      preferences,
    });
  });

  it('sanitizes untrusted values at the domain boundary', () => {
    const defaults = createDefaultDisplayPreferences();
    const decoded = decodeDisplayPreferences({
      version: 3,
      themeSettings: {
        preset: 'unknown',
        fonts: { display: 'cinzel', body: 'unknown' },
        colorOverrides: { dark: { primary: '#AABBCC', unknown: '#ffffff' } },
      },
      backgroundPreference: 'particles',
      backgroundAnimations: defaults.backgroundAnimations,
      backgroundPerformance: { mode: 'high', showStats: true },
      backgroundSettingOverrides: { particles: { pointSize: 3, opacity: 'invalid', unknown: 9 } },
    });

    expect(decoded?.preferences.themeSettings).toEqual({
      ...createDefaultThemeSettings(),
      fonts: { display: 'cinzel', body: 'inter' },
      colorOverrides: { dark: { primary: '#aabbcc' }, light: {} },
    });
    expect(decoded?.preferences.backgroundSettingOverrides.particles).toEqual({ pointSize: 3 });
  });

  it('maps the former shared cursor setting to both interaction channels', () => {
    const defaults = createDefaultDisplayPreferences();
    const decoded = decodeDisplayPreferences({
      version: 2,
      ...defaults,
      backgroundAnimations: { idle: true, cursor: false, scroll: true },
    });

    expect(decoded?.preferences.backgroundAnimations).toEqual({
      idle: true,
      cursorMovement: false,
      cursorClick: false,
      scroll: true,
    });
  });

  it('rejects incomplete or unsupported documents', () => {
    expect(decodeDisplayPreferences(null)).toBeUndefined();
    expect(decodeDisplayPreferences({ version: 99 })).toBeUndefined();
    expect(decodeDisplayPreferences({ version: 3, backgroundPreference: 'auto' })).toBeUndefined();
  });
});
