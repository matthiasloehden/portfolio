import { BACKGROUND_IDS, type BackgroundId, type BackgroundPreference } from '@/types/background';

/** Route-aware choices exposed by the display-settings UI. */
const BACKGROUND_LABELS: Readonly<Record<BackgroundId, string>> = {
  wave: 'Wave Grid',
  particles: 'Particles',
  triangles: 'Triangles',
  mesh: 'Living Mesh',
};

export const BACKGROUND_SCENE_OPTIONS: readonly { value: BackgroundId; label: string }[] = BACKGROUND_IDS.map(
  (value) => ({ value, label: BACKGROUND_LABELS[value] }),
);

export const BACKGROUND_OPTIONS = [
  { value: 'auto', label: 'Automatic per page' },
  ...BACKGROUND_SCENE_OPTIONS,
  { value: 'none', label: 'None' },
] as const satisfies readonly { value: BackgroundPreference; label: string }[];

const AUTOMATIC_BACKGROUNDS: Readonly<Record<string, BackgroundId>> = {
  '/': 'wave',
  '/work': 'triangles',
  '/academic': 'mesh',
  '/personal': 'particles',
};

export function resolveBackground(path: string, preference: BackgroundPreference): BackgroundId | 'none' {
  if (preference !== 'auto') return preference;

  const normalizedPath = path.replace(/\/+$/, '') || '/';
  return AUTOMATIC_BACKGROUNDS[normalizedPath] ?? 'none';
}

export function getBackgroundLabel(background: BackgroundId | 'none'): string {
  return background === 'none' ? 'None' : BACKGROUND_LABELS[background];
}
