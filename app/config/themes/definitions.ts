import type {
  ThemeBodyFontId,
  ThemeColorToken,
  ThemeDisplayFontId,
  ThemeMode,
  ThemePalette,
  ThemePresetId,
  ThemeSettings,
} from '@/types/theme';

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
        foreground: '#f1f4f8',
        muted: '#9aa3b0',
        quiet: '#747e8c',
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
        foreground: '#11151b',
        muted: '#59616c',
        quiet: '#68717c',
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
        raised: '#0d0a0b',
        surface: '#1b0e12c2',
        surfaceHover: '#2b1219d9',
        line: '#fda4af2e',
        lineStrong: '#fb718566',
        foreground: '#f8f3f4',
        muted: '#aaa0a2',
        quiet: '#81777a',
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
        foreground: '#1b1718',
        muted: '#665e60',
        quiet: '#756d6f',
        primary: '#be123c',
        primaryBright: '#dc1c47',
        primaryForeground: '#ffffff',
        success: '#15803d',
        selection: '#e11d4833',
      },
    },
  },
  {
    id: 'orange',
    label: 'Ember orange',
    description: 'Warm orange accents over restrained charcoal surfaces.',
    palettes: {
      dark: {
        background: '#090603',
        raised: '#0d0b09',
        surface: '#1c120abd',
        surfaceHover: '#302013d9',
        line: '#fdba742b',
        lineStrong: '#fb923c66',
        foreground: '#f8f5f2',
        muted: '#aaa39c',
        quiet: '#817970',
        primary: '#f97316',
        primaryBright: '#fb923c',
        primaryForeground: '#170802',
        success: '#4ade80',
        selection: '#f9731652',
      },
      light: {
        background: '#fff8f3',
        raised: '#ffffff',
        surface: '#fffdfacc',
        surfaceHover: '#ffedd5e6',
        line: '#7c2d1229',
        lineStrong: '#c2410c66',
        foreground: '#1c1815',
        muted: '#68615b',
        quiet: '#776f68',
        primary: '#c2410c',
        primaryBright: '#c2410c',
        primaryForeground: '#ffffff',
        success: '#15803d',
        selection: '#ea580c33',
      },
    },
  },
  {
    id: 'gold',
    label: 'Solar gold',
    description: 'Focused golden accents over warm, near-neutral foundations.',
    palettes: {
      dark: {
        background: '#080703',
        raised: '#0d0c09',
        surface: '#1b1609bd',
        surfaceHover: '#2d240fd9',
        line: '#fde68a2b',
        lineStrong: '#eab30866',
        foreground: '#f8f6f0',
        muted: '#a8a49a',
        quiet: '#7f7a70',
        primary: '#eab308',
        primaryBright: '#facc15',
        primaryForeground: '#151000',
        success: '#4ade80',
        selection: '#eab30852',
      },
      light: {
        background: '#fffbeb',
        raised: '#ffffff',
        surface: '#fffefacc',
        surfaceHover: '#fef3c7e6',
        line: '#713f1229',
        lineStrong: '#a1620766',
        foreground: '#1c1912',
        muted: '#656158',
        quiet: '#746f65',
        primary: '#a16207',
        primaryBright: '#a16207',
        primaryForeground: '#ffffff',
        success: '#15803d',
        selection: '#ca8a0433',
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
        quiet: '#68707a',
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
        raised: '#0c0a10',
        surface: '#151027bd',
        surfaceHover: '#251b42d9',
        line: '#c4b5fd30',
        lineStrong: '#a78bfa70',
        foreground: '#f6f4f8',
        muted: '#a39faa',
        quiet: '#7c7784',
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
        foreground: '#19171c',
        muted: '#625e68',
        quiet: '#716c76',
        primary: '#6d28d9',
        primaryBright: '#7c3aed',
        primaryForeground: '#ffffff',
        success: '#047857',
        selection: '#7c3aed33',
      },
    },
  },
  {
    id: 'rose',
    label: 'Rose pulse',
    description: 'Expressive rose accents balanced by restrained neutral text.',
    palettes: {
      dark: {
        background: '#090306',
        raised: '#0e0a0c',
        surface: '#1f0b15bd',
        surfaceHover: '#341224d9',
        line: '#f9a8d42b',
        lineStrong: '#ec489966',
        foreground: '#f8f3f6',
        muted: '#aaa0a5',
        quiet: '#81777c',
        primary: '#ec4899',
        primaryBright: '#f472b6',
        primaryForeground: '#17030d',
        success: '#4ade80',
        selection: '#ec489952',
      },
      light: {
        background: '#fff6fa',
        raised: '#ffffff',
        surface: '#fffafccc',
        surfaceHover: '#fce7f3e6',
        line: '#83184329',
        lineStrong: '#be185d66',
        foreground: '#1c1719',
        muted: '#665e62',
        quiet: '#756d71',
        primary: '#be185d',
        primaryBright: '#be185d',
        primaryForeground: '#ffffff',
        success: '#15803d',
        selection: '#db277733',
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
        raised: '#090d0b',
        surface: '#0b1c15bd',
        surfaceHover: '#102d20d9',
        line: '#86efac2b',
        lineStrong: '#34d39966',
        foreground: '#f2f7f4',
        muted: '#9ca7a1',
        quiet: '#75817b',
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
        foreground: '#141917',
        muted: '#5b645f',
        quiet: '#68726d',
        primary: '#047857',
        primaryBright: '#047857',
        primaryForeground: '#ffffff',
        success: '#4d7c0f',
        selection: '#05966933',
      },
    },
  },
  {
    id: 'teal',
    label: 'Petrol teal',
    description: 'Mature petrol accents with cool, near-neutral foundations.',
    palettes: {
      dark: {
        background: '#030809',
        raised: '#090d0e',
        surface: '#0b1b1fbd',
        surfaceHover: '#102a30d9',
        line: '#67c8d12b',
        lineStrong: '#268e9766',
        foreground: '#f2f6f7',
        muted: '#9da5a8',
        quiet: '#768084',
        primary: '#168a94',
        primaryBright: '#35a8ad',
        primaryForeground: '#020f11',
        success: '#a3e635',
        selection: '#168a9452',
      },
      light: {
        background: '#f3f9fa',
        raised: '#ffffff',
        surface: '#fbfeffcc',
        surfaceHover: '#dceff1e6',
        line: '#164e5529',
        lineStrong: '#0d687066',
        foreground: '#14191a',
        muted: '#5c6366',
        quiet: '#697276',
        primary: '#0d6870',
        primaryBright: '#0d6870',
        primaryForeground: '#ffffff',
        success: '#4d7c0f',
        selection: '#168a9433',
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

export function getThemePreset(id: ThemePresetId): ThemePresetDefinition {
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0];
}

export function getThemeDisplayFont(id: ThemeDisplayFontId): ThemeFontDefinition<ThemeDisplayFontId> {
  return THEME_DISPLAY_FONTS.find((font) => font.id === id) ?? THEME_DISPLAY_FONTS[0];
}

export function getThemeBodyFont(id: ThemeBodyFontId): ThemeFontDefinition<ThemeBodyFontId> {
  return THEME_BODY_FONTS.find((font) => font.id === id) ?? THEME_BODY_FONTS[0];
}
