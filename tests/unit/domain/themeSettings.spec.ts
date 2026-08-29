import { describe, expect, it } from 'vitest';

import { getThemePreset } from '@/config/themes/definitions';
import { createDefaultThemeSettings, resolveThemePalette, sanitizeThemeSettings } from '@/domain/themes/settings';

describe('theme configuration', () => {
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

    const palette = resolveThemePalette(settings, 'dark');

    expect(palette.primary).toBe('#123456');
    expect(palette.background).toBe(getThemePreset(settings.preset).palettes.dark.background);
    expect(getThemePreset(settings.preset).palettes.dark.primary).not.toBe('#123456');
  });
});
