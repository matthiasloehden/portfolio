import { getThemeBodyFont, getThemeDisplayFont } from '@/config/themes/definitions';
import {
  getGoogleFontsStylesheet,
  GOOGLE_FONT_PRECONNECT_ATTRIBUTE,
  GOOGLE_FONT_PRECONNECTS,
  GOOGLE_FONTS_LINK_ATTRIBUTE,
} from '@/config/themes/googleFonts';
import type { ThemeSettings } from '@/types/theme';

const GOOGLE_FONTS_LINK_SELECTOR = `link[${GOOGLE_FONTS_LINK_ATTRIBUTE}]`;
const GOOGLE_FONT_PRECONNECT_SELECTOR = `link[${GOOGLE_FONT_PRECONNECT_ATTRIBUTE}]`;

function getSelectedGoogleFontQueries(settings: ThemeSettings): string[] {
  return [
    getThemeDisplayFont(settings.fonts.display).googleFontsQuery,
    getThemeBodyFont(settings.fonts.body).googleFontsQuery,
  ].filter((font, index, fonts): font is string => typeof font === 'string' && fonts.indexOf(font) === index);
}

function syncPreconnect(connection: (typeof GOOGLE_FONT_PRECONNECTS)[number]): void {
  const selector = `${GOOGLE_FONT_PRECONNECT_SELECTOR}[href="${connection.origin}"]`;
  if (document.head.querySelector(selector)) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = connection.origin;
  link.setAttribute(GOOGLE_FONT_PRECONNECT_ATTRIBUTE, '');
  if (connection.crossOrigin) link.crossOrigin = 'anonymous';
  document.head.append(link);
}

/** Loads only the Google Fonts selected in the current theme settings. */
export function syncSelectedGoogleFonts(settings: ThemeSettings): void {
  if (!import.meta.client) return;

  const stylesheet = getGoogleFontsStylesheet(getSelectedGoogleFontQueries(settings));
  const existingStylesheet = document.head.querySelector<HTMLLinkElement>(GOOGLE_FONTS_LINK_SELECTOR);

  if (!stylesheet) {
    existingStylesheet?.remove();
    document.head.querySelectorAll(GOOGLE_FONT_PRECONNECT_SELECTOR).forEach((link) => link.remove());
    return;
  }

  for (const connection of GOOGLE_FONT_PRECONNECTS) syncPreconnect(connection);

  if (existingStylesheet?.getAttribute('href') === stylesheet) return;

  const link = existingStylesheet ?? document.createElement('link');
  link.rel = 'stylesheet';
  link.href = stylesheet;
  link.setAttribute(GOOGLE_FONTS_LINK_ATTRIBUTE, '');
  if (!existingStylesheet) document.head.append(link);
}
