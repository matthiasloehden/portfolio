import { THEME_PRESETS, getThemePreset } from '@/config/themes/definitions';
import type { ThemePresetId, ThemePresetPreference } from '@/types/theme';

export const DEFAULT_THEME_PRESET_PREFERENCE: ThemePresetPreference = 'auto';

export const AUTOMATIC_THEME_PRESETS: Readonly<Record<string, ThemePresetId>> = {
  '/': 'arctic',
  '/work': 'crimson',
  '/academic': 'aurora',
  '/personal': 'arctic',
};

const THEME_PRESET_OPTION_ORDER: readonly ThemePresetId[] = ['arctic', 'crimson', 'aurora', 'verdant', 'graphite'];

export const THEME_PRESET_OPTIONS: readonly { value: ThemePresetPreference; label: string }[] = [
  { value: 'auto', label: 'Automatic per page' },
  ...THEME_PRESET_OPTION_ORDER.map((value) => ({ value, label: getThemePreset(value).label })),
];

export function resolveThemePreset(path: string, preference: ThemePresetPreference): ThemePresetId {
  if (preference !== 'auto') return preference;

  const normalizedPath = path.replace(/\/+$/, '') || '/';
  return AUTOMATIC_THEME_PRESETS[normalizedPath] ?? THEME_PRESETS[0].id;
}
