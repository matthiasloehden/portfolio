import type {
  ThemeBodyFontId,
  ThemeColorToken,
  ThemeDisplayFontId,
  ThemeMode,
  ThemePresetId,
  ThemeSettings,
} from '@/types/theme';
import { normalizeHexColor } from '@/utils/color';

export function updateThemePreset(settings: ThemeSettings, preset: ThemePresetId): ThemeSettings {
  return { ...settings, preset };
}

export function updateThemeDisplayFont(settings: ThemeSettings, display: ThemeDisplayFontId): ThemeSettings {
  return { ...settings, fonts: { ...settings.fonts, display } };
}

export function updateThemeBodyFont(settings: ThemeSettings, body: ThemeBodyFontId): ThemeSettings {
  return { ...settings, fonts: { ...settings.fonts, body } };
}

export function updateThemeColorOverride(
  settings: ThemeSettings,
  mode: ThemeMode,
  token: ThemeColorToken,
  color: string,
): ThemeSettings {
  const normalizedColor = normalizeHexColor(color);
  if (!normalizedColor) return settings;

  return {
    ...settings,
    colorOverrides: {
      ...settings.colorOverrides,
      [mode]: { ...settings.colorOverrides[mode], [token]: normalizedColor },
    },
  };
}

export function removeThemeColorOverride(
  settings: ThemeSettings,
  mode: ThemeMode,
  token: ThemeColorToken,
): ThemeSettings {
  const { [token]: _removed, ...modeOverrides } = settings.colorOverrides[mode];

  return {
    ...settings,
    colorOverrides: { ...settings.colorOverrides, [mode]: modeOverrides },
  };
}

export function clearThemeColorOverrides(settings: ThemeSettings, mode: ThemeMode): ThemeSettings {
  if (Object.keys(settings.colorOverrides[mode]).length === 0) return settings;

  return {
    ...settings,
    colorOverrides: { ...settings.colorOverrides, [mode]: {} },
  };
}
