export const THEME_MODES = ['dark', 'light'] as const;
export const THEME_PRESET_IDS = [
  'arctic',
  'crimson',
  'orange',
  'gold',
  'graphite',
  'aurora',
  'rose',
  'verdant',
  'teal',
] as const;
export const THEME_PRESET_PREFERENCES = ['auto', ...THEME_PRESET_IDS, 'random'] as const;
export const THEME_DISPLAY_FONT_IDS = [
  'barlow-condensed',
  'archivo-narrow',
  'cinzel',
  'oswald',
  'playfair-display',
  'roboto-condensed',
  'space-grotesk',
] as const;
export const THEME_BODY_FONT_IDS = [
  'inter',
  'ibm-plex-sans',
  'jetbrains-mono',
  'lora',
  'merriweather',
  'nunito-sans',
  'roboto',
  'source-sans-3',
] as const;
export const THEME_COLOR_TOKENS = [
  'background',
  'raised',
  'surface',
  'surfaceHover',
  'line',
  'lineStrong',
  'foreground',
  'muted',
  'quiet',
  'primary',
  'primaryBright',
  'primaryForeground',
  'success',
  'selection',
] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ThemeColorToken = (typeof THEME_COLOR_TOKENS)[number];
export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];
export type ThemePresetPreference = (typeof THEME_PRESET_PREFERENCES)[number];
export type ThemeDisplayFontId = (typeof THEME_DISPLAY_FONT_IDS)[number];
export type ThemeBodyFontId = (typeof THEME_BODY_FONT_IDS)[number];
export type ThemePalette = Readonly<Record<ThemeColorToken, string>>;
export type ThemeColorOverrides = Partial<Record<ThemeColorToken, string>>;

export interface ThemeSettings {
  preset: ThemePresetPreference;
  fonts: {
    display: ThemeDisplayFontId;
    body: ThemeBodyFontId;
  };
  colorOverrides: Record<ThemeMode, ThemeColorOverrides>;
}
