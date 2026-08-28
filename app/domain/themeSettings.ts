import { DEFAULT_THEME_FONTS, DEFAULT_THEME_PRESET_ID, getThemePreset } from '@/config/themes/definitions';
import {
  THEME_BODY_FONT_IDS,
  THEME_COLOR_TOKENS,
  THEME_DISPLAY_FONT_IDS,
  THEME_MODES,
  THEME_PRESET_IDS,
  type ThemeColorOverrides,
  type ThemeMode,
  type ThemePalette,
  type ThemeSettings,
} from '@/types/theme';
import { normalizeHexColor } from '@/utils/color';

function isKnownId<Id extends string>(ids: readonly Id[], value: unknown): value is Id {
  return typeof value === 'string' && ids.some((id) => id === value);
}

export function createDefaultThemeSettings(): ThemeSettings {
  return {
    preset: DEFAULT_THEME_PRESET_ID,
    fonts: { ...DEFAULT_THEME_FONTS },
    colorOverrides: { dark: {}, light: {} },
  };
}

export function sanitizeThemeSettings(value: unknown): ThemeSettings {
  const defaults = createDefaultThemeSettings();
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return defaults;

  const record = value as Record<string, unknown>;
  const preset = isKnownId(THEME_PRESET_IDS, record.preset) ? record.preset : defaults.preset;
  const storedFonts =
    typeof record.fonts === 'object' && record.fonts !== null && !Array.isArray(record.fonts)
      ? (record.fonts as Record<string, unknown>)
      : {};
  const fonts = {
    display: isKnownId(THEME_DISPLAY_FONT_IDS, storedFonts.display) ? storedFonts.display : defaults.fonts.display,
    body: isKnownId(THEME_BODY_FONT_IDS, storedFonts.body) ? storedFonts.body : defaults.fonts.body,
  };
  const colorOverrides = { dark: {}, light: {} } as Record<ThemeMode, ThemeColorOverrides>;
  const storedOverrides = record.colorOverrides;

  if (typeof storedOverrides === 'object' && storedOverrides !== null && !Array.isArray(storedOverrides)) {
    for (const mode of THEME_MODES) {
      const modeOverrides = (storedOverrides as Record<string, unknown>)[mode];
      if (typeof modeOverrides !== 'object' || modeOverrides === null || Array.isArray(modeOverrides)) continue;

      for (const token of THEME_COLOR_TOKENS) {
        const color = normalizeHexColor((modeOverrides as Record<string, unknown>)[token]);
        if (color) colorOverrides[mode][token] = color;
      }
    }
  }

  return { preset, fonts, colorOverrides };
}

export function resolveThemePalette(settings: ThemeSettings, mode: ThemeMode): ThemePalette {
  return { ...getThemePreset(settings.preset).palettes[mode], ...settings.colorOverrides[mode] };
}
