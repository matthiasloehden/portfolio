/** Applies resolved theme settings at the browser boundary after hydration. */

import { THEME_COLOR_CONTROLS, getThemeBodyFont, getThemeDisplayFont } from '@/config/themes/definitions';
import { resolveThemePalette } from '@/domain/themes/settings';
import type { ThemeMode, ThemeSettings } from '@/types/theme';

export function applyThemeToDocument(settings: ThemeSettings, mode: ThemeMode): void {
  const root = document.documentElement;
  const palette = resolveThemePalette(settings, mode);
  const displayFont = getThemeDisplayFont(settings.fonts.display);
  const bodyFont = getThemeBodyFont(settings.fonts.body);

  root.dataset.theme = mode;
  root.dataset.themePreset = settings.preset;
  root.dataset.displayFont = settings.fonts.display;
  root.dataset.bodyFont = settings.fonts.body;

  for (const control of THEME_COLOR_CONTROLS) root.style.setProperty(control.cssVariable, palette[control.key]);

  root.style.setProperty('--display-font', displayFont.family);
  root.style.setProperty('--body-font', bodyFont.family);
  window.dispatchEvent(new CustomEvent('portfolio-theme-change'));
}
