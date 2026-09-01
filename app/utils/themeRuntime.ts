/** Applies resolved theme settings at the browser boundary after hydration. */

import { THEME_COLOR_CONTROLS, getThemeBodyFont, getThemeDisplayFont } from '@/config/themes/definitions';
import { resolveThemePalette } from '@/domain/themes/settings';
import type { ThemeMode, ThemePresetId, ThemeSettings } from '@/types/theme';
import { syncSelectedGoogleFonts } from '@/utils/googleFonts';

export function applyThemeToDocument(
  settings: ThemeSettings,
  mode: ThemeMode,
  preset: ThemePresetId,
  transition = false,
): void {
  const root = document.documentElement;
  const palette = resolveThemePalette(settings, mode, preset);
  const displayFont = getThemeDisplayFont(settings.fonts.display);
  const bodyFont = getThemeBodyFont(settings.fonts.body);

  syncSelectedGoogleFonts(settings);

  function apply(): void {
    root.dataset.theme = mode;
    root.dataset.themePreset = preset;
    root.dataset.themePresetPreference = settings.preset;
    root.dataset.displayFont = settings.fonts.display;
    root.dataset.bodyFont = settings.fonts.body;

    for (const control of THEME_COLOR_CONTROLS) root.style.setProperty(control.cssVariable, palette[control.key]);

    root.style.setProperty('--display-font', displayFont.family);
    root.style.setProperty('--body-font', bodyFont.family);
    window.dispatchEvent(new CustomEvent('portfolio-theme-change'));
  }

  const shouldTransition =
    transition &&
    (root.dataset.theme !== mode || root.dataset.themePreset !== preset) &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startViewTransition =
    typeof document.startViewTransition === 'function' ? document.startViewTransition.bind(document) : undefined;

  if (!shouldTransition || !startViewTransition) {
    apply();
    return;
  }

  try {
    startViewTransition(apply);
  } catch {
    // A rapid second change can collide with an active browser transition.
    // Applying immediately is preferable to dropping the visitor's selection.
    apply();
  }
}
