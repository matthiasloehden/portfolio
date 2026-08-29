import { DEFAULT_THEME_PRESET_ID, THEME_PRESETS, getThemePreset } from '@/config/themes/definitions';
import { THEME_PRESET_IDS, type ThemePresetId, type ThemePresetPreference } from '@/types/theme';
import { selectByRandomValue } from '@/utils/randomSelection';

export const DEFAULT_THEME_PRESET_PREFERENCE: ThemePresetPreference = DEFAULT_THEME_PRESET_ID;

export const AUTOMATIC_THEME_PRESETS: Readonly<Record<string, ThemePresetId>> = {
  '/': 'arctic',
  '/work': 'crimson',
  '/academic': 'aurora',
  '/personal': 'teal',
};

const PAGE_THEME_PRESET_ORDER: readonly ThemePresetId[] = ['arctic', 'crimson', 'aurora', 'teal', 'graphite'];
const ADDITIONAL_THEME_PRESET_ORDER: readonly ThemePresetId[] = ['rose', 'orange', 'gold', 'verdant'];

export const THEME_PRESET_OPTIONS: readonly { value: ThemePresetPreference; label: string }[] = [
  { value: 'auto', label: 'Automatic per page' },
  ...PAGE_THEME_PRESET_ORDER.map((value) => ({ value, label: getThemePreset(value).label })),
  { value: 'random', label: 'Random' },
  ...ADDITIONAL_THEME_PRESET_ORDER.map((value) => ({ value, label: getThemePreset(value).label })),
];

export function resolveThemePreset(
  path: string,
  preference: ThemePresetPreference,
  randomValue?: number,
): ThemePresetId {
  if (preference === 'random') {
    if (randomValue === undefined) throw new Error('Random theme resolution requires a stable random value.');
    return selectByRandomValue(THEME_PRESET_IDS, randomValue);
  }
  if (preference !== 'auto') return preference;

  const normalizedPath = path.replace(/\/+$/, '') || '/';
  return AUTOMATIC_THEME_PRESETS[normalizedPath] ?? THEME_PRESETS[0].id;
}
