import type { BackgroundId, BackgroundPreference } from '@/types/background';

export const BACKGROUND_OPTIONS = [
  { value: 'auto', label: 'Automatic per page' },
  { value: 'wave', label: 'Wave Grid' },
  { value: 'particles', label: 'Particles' },
  { value: 'triangles', label: 'Triangles' },
  { value: 'mesh', label: 'Living Mesh' },
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
