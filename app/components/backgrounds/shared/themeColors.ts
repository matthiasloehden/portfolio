import { hexColorToRgbChannels } from '@/utils/color';

/** Reads the semantic CSS theme used by Tailwind while preserving renderer fallbacks for non-browser contexts. */
export function getBackgroundThemeColor(variable: `--${string}`, fallback: string): string {
  if (typeof document === 'undefined') return fallback;

  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
}

export function getBackgroundThemeRgb(variable: `--${string}`, fallback: string): string {
  const color = getBackgroundThemeColor(variable, fallback);
  return hexColorToRgbChannels(color) ?? fallback;
}
