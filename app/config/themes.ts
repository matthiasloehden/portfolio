import {
  THEME_BODY_FONT_IDS,
  THEME_COLOR_TOKENS,
  THEME_DISPLAY_FONT_IDS,
  THEME_MODES,
  THEME_PRESET_IDS,
  type ThemeBodyFontId,
  type ThemeColorOverrides,
  type ThemeColorToken,
  type ThemeDisplayFontId,
  type ThemeMode,
  type ThemePalette,
  type ThemePresetId,
  type ThemeSettings,
} from '@/types/theme';
import { normalizeHexColor } from '@/utils/color';

export interface ThemePresetDefinition {
  id: ThemePresetId;
  label: string;
  description: string;
  palettes: Record<ThemeMode, ThemePalette>;
}

export interface ThemeFontDefinition<Id extends string> {
  id: Id;
  label: string;
  family: string;
}

export interface ThemeColorControl {
  key: ThemeColorToken;
  label: string;
  description: string;
  group: 'canvas' | 'text' | 'accent';
  cssVariable: `--${string}`;
}

export const DEFAULT_THEME_PRESET_ID: ThemePresetId = 'arctic';
export const DEFAULT_THEME_FONTS: Readonly<ThemeSettings['fonts']> = {
  display: 'barlow-condensed',
  body: 'inter',
};

export const THEME_PRESETS = [
  {
    id: 'arctic',
    label: 'Arctic blue',
    description: 'Cool blue accents with a crisp technical character.',
    palettes: {
      dark: {
        background: '#030509',
        raised: '#070b12',
        surface: '#09111fb8',
        surfaceHover: '#0c1a32cc',
        line: '#7ea4dd2e',
        lineStrong: '#5a97ff6b',
        foreground: '#edf5ff',
        muted: '#8190a8',
        quiet: '#697993',
        primary: '#3284ff',
        primaryBright: '#72aaff',
        primaryForeground: '#02060d',
        success: '#3cdc94',
        selection: '#3284ff59',
      },
      light: {
        background: '#f3f7fc',
        raised: '#ffffff',
        surface: '#ffffffc7',
        surfaceHover: '#e7f0fee6',
        line: '#143b6e29',
        lineStrong: '#0e5ccd6b',
        foreground: '#07101f',
        muted: '#53627a',
        quiet: '#627087',
        primary: '#075fd7',
        primaryBright: '#075fd7',
        primaryForeground: '#ffffff',
        success: '#16875a',
        selection: '#075fd733',
      },
    },
  },
  {
    id: 'crimson',
    label: 'Crimson signal',
    description: 'Confident red accents over warm graphite surfaces.',
    palettes: {
      dark: {
        background: '#090405',
        raised: '#12090b',
        surface: '#1b0e12c2',
        surfaceHover: '#2b1219d9',
        line: '#fda4af2e',
        lineStrong: '#fb718566',
        foreground: '#fff1f2',
        muted: '#b18a91',
        quiet: '#927078',
        primary: '#ef4444',
        primaryBright: '#fb7185',
        primaryForeground: '#160305',
        success: '#4ade80',
        selection: '#ef444459',
      },
      light: {
        background: '#fff7f7',
        raised: '#ffffff',
        surface: '#fffafacc',
        surfaceHover: '#ffe4e6e6',
        line: '#88133729',
        lineStrong: '#be123c66',
        foreground: '#24070d',
        muted: '#75545b',
        quiet: '#89666d',
        primary: '#be123c',
        primaryBright: '#e11d48',
        primaryForeground: '#ffffff',
        success: '#15803d',
        selection: '#e11d4833',
      },
    },
  },
  {
    id: 'graphite',
    label: 'Graphite mono',
    description: 'Restrained grayscale with bright, precise contrast.',
    palettes: {
      dark: {
        background: '#080a0d',
        raised: '#0e1116',
        surface: '#161a21bd',
        surfaceHover: '#222832d9',
        line: '#cbd5e12b',
        lineStrong: '#dbe4f05c',
        foreground: '#f3f4f6',
        muted: '#9ca3af',
        quiet: '#737b88',
        primary: '#b8c0cc',
        primaryBright: '#f1f5f9',
        primaryForeground: '#090b0f',
        success: '#5ee0a0',
        selection: '#cbd5e145',
      },
      light: {
        background: '#f4f5f6',
        raised: '#ffffff',
        surface: '#ffffffcc',
        surfaceHover: '#e7e9ece6',
        line: '#1f293729',
        lineStrong: '#3741515c',
        foreground: '#111318',
        muted: '#5f6670',
        quiet: '#747b85',
        primary: '#374151',
        primaryBright: '#111827',
        primaryForeground: '#ffffff',
        success: '#16875a',
        selection: '#64748b33',
      },
    },
  },
  {
    id: 'aurora',
    label: 'Aurora violet',
    description: 'Deep indigo surfaces with luminous violet details.',
    palettes: {
      dark: {
        background: '#06040d',
        raised: '#0d0918',
        surface: '#151027bd',
        surfaceHover: '#251b42d9',
        line: '#c4b5fd30',
        lineStrong: '#a78bfa70',
        foreground: '#f5f3ff',
        muted: '#9c91b5',
        quiet: '#7e7398',
        primary: '#8b5cf6',
        primaryBright: '#c4b5fd',
        primaryForeground: '#0c051d',
        success: '#34d399',
        selection: '#8b5cf659',
      },
      light: {
        background: '#f8f7ff',
        raised: '#ffffff',
        surface: '#fdfcffcc',
        surfaceHover: '#ede9fee6',
        line: '#4c1d9529',
        lineStrong: '#7c3aed66',
        foreground: '#1b1231',
        muted: '#625878',
        quiet: '#776d8d',
        primary: '#6d28d9',
        primaryBright: '#7c3aed',
        primaryForeground: '#ffffff',
        success: '#047857',
        selection: '#7c3aed33',
      },
    },
  },
  {
    id: 'verdant',
    label: 'Verdant circuit',
    description: 'Dark evergreen foundations with clean emerald energy.',
    palettes: {
      dark: {
        background: '#030806',
        raised: '#07110d',
        surface: '#0b1c15bd',
        surfaceHover: '#102d20d9',
        line: '#86efac2b',
        lineStrong: '#34d39966',
        foreground: '#effdf5',
        muted: '#82a193',
        quiet: '#688579',
        primary: '#10b981',
        primaryBright: '#6ee7b7',
        primaryForeground: '#02120c',
        success: '#a3e635',
        selection: '#10b98152',
      },
      light: {
        background: '#f3faf7',
        raised: '#ffffff',
        surface: '#fbfffdcc',
        surfaceHover: '#dcfce7e6',
        line: '#14532d29',
        lineStrong: '#05966966',
        foreground: '#071b12',
        muted: '#506c60',
        quiet: '#657d72',
        primary: '#047857',
        primaryBright: '#059669',
        primaryForeground: '#ffffff',
        success: '#4d7c0f',
        selection: '#05966933',
      },
    },
  },
] as const satisfies readonly ThemePresetDefinition[];

export const THEME_DISPLAY_FONTS = [
  {
    id: 'barlow-condensed',
    label: 'Barlow Condensed',
    family: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  },
  {
    id: 'archivo-narrow',
    label: 'Archivo Narrow',
    family: "'Archivo Narrow', 'Arial Narrow', sans-serif",
  },
  {
    id: 'cinzel',
    label: 'Cinzel',
    family: "'Cinzel', Georgia, serif",
  },
  {
    id: 'oswald',
    label: 'Oswald',
    family: "'Oswald', 'Arial Narrow', sans-serif",
  },
  {
    id: 'playfair-display',
    label: 'Playfair Display',
    family: "'Playfair Display', Georgia, serif",
  },
  {
    id: 'roboto-condensed',
    label: 'Roboto Condensed',
    family: "'Roboto Condensed', 'Arial Narrow', sans-serif",
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    family: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  },
] as const satisfies readonly ThemeFontDefinition<ThemeDisplayFontId>[];

export const THEME_BODY_FONTS = [
  {
    id: 'inter',
    label: 'Inter',
    family: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    family: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono',
    family: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace",
  },
  {
    id: 'lora',
    label: 'Lora',
    family: "'Lora', Georgia, serif",
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    family: "'Merriweather', Georgia, serif",
  },
  {
    id: 'nunito-sans',
    label: 'Nunito Sans',
    family: "'Nunito Sans', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: 'roboto',
    label: 'Roboto',
    family: "'Roboto', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    family: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
  },
] as const satisfies readonly ThemeFontDefinition<ThemeBodyFontId>[];

export const THEME_COLOR_CONTROLS = [
  {
    key: 'background',
    label: 'Page background',
    description: 'The base canvas behind all content.',
    group: 'canvas',
    cssVariable: '--background',
  },
  {
    key: 'raised',
    label: 'Raised surface',
    description: 'Menus, cards and elevated panels.',
    group: 'canvas',
    cssVariable: '--raised',
  },
  {
    key: 'surface',
    label: 'Surface',
    description: 'The default translucent content surface.',
    group: 'canvas',
    cssVariable: '--surface',
  },
  {
    key: 'surfaceHover',
    label: 'Surface hover',
    description: 'Interactive and highlighted surfaces.',
    group: 'canvas',
    cssVariable: '--surface-hover',
  },
  {
    key: 'line',
    label: 'Border',
    description: 'Subtle dividers and component outlines.',
    group: 'canvas',
    cssVariable: '--line',
  },
  {
    key: 'lineStrong',
    label: 'Strong border',
    description: 'Focused and emphasized outlines.',
    group: 'canvas',
    cssVariable: '--line-strong',
  },
  {
    key: 'foreground',
    label: 'Main text',
    description: 'Headings and high-contrast body copy.',
    group: 'text',
    cssVariable: '--foreground',
  },
  {
    key: 'muted',
    label: 'Muted text',
    description: 'Secondary copy and labels.',
    group: 'text',
    cssVariable: '--muted',
  },
  {
    key: 'quiet',
    label: 'Quiet text',
    description: 'Low-emphasis metadata and decoration.',
    group: 'text',
    cssVariable: '--quiet',
  },
  {
    key: 'primary',
    label: 'Primary',
    description: 'The main brand and interaction color.',
    group: 'accent',
    cssVariable: '--primary',
  },
  {
    key: 'primaryBright',
    label: 'Bright primary',
    description: 'Focus rings, highlights and luminous details.',
    group: 'accent',
    cssVariable: '--primary-bright',
  },
  {
    key: 'primaryForeground',
    label: 'On primary',
    description: 'Text and icons displayed on primary color.',
    group: 'accent',
    cssVariable: '--primary-foreground',
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Positive states and availability indicators.',
    group: 'accent',
    cssVariable: '--success',
  },
  {
    key: 'selection',
    label: 'Text selection',
    description: 'Selection fill; eight-digit hex can include opacity.',
    group: 'accent',
    cssVariable: '--selection',
  },
] as const satisfies readonly ThemeColorControl[];

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

export function getThemePreset(id: ThemePresetId): ThemePresetDefinition {
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0];
}

export function getThemeDisplayFont(id: ThemeDisplayFontId): ThemeFontDefinition<ThemeDisplayFontId> {
  return THEME_DISPLAY_FONTS.find((font) => font.id === id) ?? THEME_DISPLAY_FONTS[0];
}

export function getThemeBodyFont(id: ThemeBodyFontId): ThemeFontDefinition<ThemeBodyFontId> {
  return THEME_BODY_FONTS.find((font) => font.id === id) ?? THEME_BODY_FONTS[0];
}

export function resolveThemePalette(settings: ThemeSettings, mode: ThemeMode): ThemePalette {
  return { ...getThemePreset(settings.preset).palettes[mode], ...settings.colorOverrides[mode] };
}
