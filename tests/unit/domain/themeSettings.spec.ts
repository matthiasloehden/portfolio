import { describe, expect, it } from 'vitest';

import { getThemePreset } from '@/config/themes/definitions';
import { resolveThemePreset } from '@/config/themes/selection';
import { createDefaultThemeSettings, resolveThemePalette, sanitizeThemeSettings } from '@/domain/themes/settings';
import {
  clearThemeColorOverrides,
  removeThemeColorOverride,
  updateThemeBodyFont,
  updateThemeColorOverride,
  updateThemeDisplayFont,
  updateThemePreset,
} from '@/domain/themes/updates';

describe('theme configuration', () => {
  it('uses Arctic blue as the default color scheme', () => {
    expect(createDefaultThemeSettings().preset).toBe('arctic');
  });

  it('sanitizes IDs and accepts only known, normalized color tokens', () => {
    expect(
      sanitizeThemeSettings({
        preset: 'aurora',
        fonts: { display: 'space-grotesk', body: 'invalid' },
        colorOverrides: {
          dark: { primary: '#ABCDEF', selection: '#12345678', unknown: '#ffffff' },
          light: { primary: 'red' },
        },
      }),
    ).toEqual({
      preset: 'aurora',
      fonts: { display: 'space-grotesk', body: 'inter' },
      colorOverrides: {
        dark: { primary: '#abcdef', selection: '#12345678' },
        light: {},
      },
    });
  });

  it('falls back to fresh defaults for non-document values', () => {
    const result = sanitizeThemeSettings(null);
    result.colorOverrides.dark.primary = '#123456';

    expect(sanitizeThemeSettings([])).toEqual(createDefaultThemeSettings());
  });

  it('resolves overrides over the selected mode without mutating its preset', () => {
    const settings = createDefaultThemeSettings();
    settings.colorOverrides.dark.primary = '#123456';

    const palette = resolveThemePalette(settings, 'dark', 'arctic');

    expect(palette.primary).toBe('#123456');
    expect(palette.background).toBe(getThemePreset('arctic').palettes.dark.background);
    expect(getThemePreset('arctic').palettes.dark.primary).not.toBe('#123456');
  });

  it('resolves automatic presets from the current route', () => {
    expect(resolveThemePreset('/', 'auto')).toBe('arctic');
    expect(resolveThemePreset('/work/', 'auto')).toBe('crimson');
    expect(resolveThemePreset('/academic', 'auto')).toBe('aurora');
    expect(resolveThemePreset('/personal', 'auto')).toBe('teal');
    expect(resolveThemePreset('/work', 'verdant')).toBe('verdant');
  });

  it('resolves random presets from a stable random value', () => {
    expect(resolveThemePreset('/', 'random', 0)).toBe('arctic');
    expect(resolveThemePreset('/', 'random', 0.999)).toBe('teal');
  });

  it('updates preset and fonts immutably', () => {
    const original = createDefaultThemeSettings();
    const withPreset = updateThemePreset(original, 'aurora');
    const withDisplayFont = updateThemeDisplayFont(withPreset, 'space-grotesk');
    const withBodyFont = updateThemeBodyFont(withDisplayFont, 'source-sans-3');

    expect(withBodyFont).toMatchObject({
      preset: 'aurora',
      fonts: { display: 'space-grotesk', body: 'source-sans-3' },
    });
    expect(original).toEqual(createDefaultThemeSettings());
  });

  it('normalizes, removes and clears color overrides without changing other modes', () => {
    const original = createDefaultThemeSettings();
    const withDarkPrimary = updateThemeColorOverride(original, 'dark', 'primary', '#ABCDEF');
    const withLightPrimary = updateThemeColorOverride(withDarkPrimary, 'light', 'primary', '#123456');
    const withoutDarkPrimary = removeThemeColorOverride(withLightPrimary, 'dark', 'primary');
    const clearedLight = clearThemeColorOverrides(withoutDarkPrimary, 'light');

    expect(withDarkPrimary.colorOverrides.dark).toEqual({ primary: '#abcdef' });
    expect(withoutDarkPrimary.colorOverrides).toEqual({ dark: {}, light: { primary: '#123456' } });
    expect(clearedLight.colorOverrides).toEqual({ dark: {}, light: {} });
    expect(original.colorOverrides).toEqual({ dark: {}, light: {} });
  });

  it('rejects invalid color overrides without creating new state', () => {
    const settings = createDefaultThemeSettings();

    expect(updateThemeColorOverride(settings, 'dark', 'primary', 'red')).toBe(settings);
    expect(clearThemeColorOverrides(settings, 'dark')).toBe(settings);
  });
});
