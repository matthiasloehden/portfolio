import {
  DISPLAY_PREFERENCES_STORAGE_KEY,
  DISPLAY_PREFERENCES_VERSION,
  THEME_PREFERENCE_STORAGE_KEY,
  THEME_SETTINGS_STORAGE_VERSIONS,
} from '@/domain/displayPreferences/versioning';
import {
  DEFAULT_THEME_FONTS,
  DEFAULT_THEME_PRESET_ID,
  THEME_BODY_FONTS,
  THEME_COLOR_CONTROLS,
  THEME_DISPLAY_FONTS,
  THEME_PRESETS,
} from '@/config/themes/definitions';
import { AUTOMATIC_THEME_PRESETS, DEFAULT_THEME_PRESET_PREFERENCE } from '@/config/themes/selection';
import {
  GOOGLE_FONT_PRECONNECT_ATTRIBUTE,
  GOOGLE_FONT_PRECONNECTS,
  GOOGLE_FONTS_ENDPOINT,
  GOOGLE_FONTS_LINK_ATTRIBUTE,
} from '@/config/themes/googleFonts';
import { DEFAULT_THEME_PREFERENCE } from '@/types/display';

/**
 * Applies persisted theme tokens before Vue hydrates to avoid a flash of the
 * default palette. The runtime composable repeats the same operation after
 * validating the complete preferences document.
 */
export function createThemeInitializationScript(): string {
  const config = {
    presets: Object.fromEntries(THEME_PRESETS.map((preset) => [preset.id, preset.palettes])),
    fonts: {
      display: Object.fromEntries(THEME_DISPLAY_FONTS.map((font) => [font.id, font.family])),
      body: Object.fromEntries(THEME_BODY_FONTS.map((font) => [font.id, font.family])),
    },
    googleFonts: {
      endpoint: GOOGLE_FONTS_ENDPOINT,
      linkAttribute: GOOGLE_FONTS_LINK_ATTRIBUTE,
      preconnectAttribute: GOOGLE_FONT_PRECONNECT_ATTRIBUTE,
      preconnects: GOOGLE_FONT_PRECONNECTS,
      display: Object.fromEntries(THEME_DISPLAY_FONTS.map((font) => [font.id, font.googleFontsQuery])),
      body: Object.fromEntries(THEME_BODY_FONTS.map((font) => [font.id, font.googleFontsQuery])),
    },
    variables: Object.fromEntries(THEME_COLOR_CONTROLS.map((control) => [control.key, control.cssVariable])),
    automaticPresets: AUTOMATIC_THEME_PRESETS,
    defaults: {
      themePreference: DEFAULT_THEME_PREFERENCE,
      preset: DEFAULT_THEME_PRESET_ID,
      presetPreference: DEFAULT_THEME_PRESET_PREFERENCE,
      fonts: DEFAULT_THEME_FONTS,
    },
    storage: {
      currentVersion: DISPLAY_PREFERENCES_VERSION,
      preferencesKey: DISPLAY_PREFERENCES_STORAGE_KEY,
      themePreferenceKey: THEME_PREFERENCE_STORAGE_KEY,
      themeSettingsVersions: THEME_SETTINGS_STORAGE_VERSIONS,
    },
  };
  const serializedConfig = JSON.stringify(config).replaceAll('<', '\\u003c');

  return `(() => {
    const config = ${serializedConfig};
    const root = document.documentElement;
    const hexColor = /^#[\\da-f]{6}(?:[\\da-f]{2})?$/i;
    let themePreference;
    let storedSettings;
    let storedVersion;

    try {
      themePreference = localStorage.getItem(config.storage.themePreferenceKey);
      const storedDocument = JSON.parse(localStorage.getItem(config.storage.preferencesKey) || 'null');
      if (config.storage.themeSettingsVersions.includes(storedDocument?.version)) {
        storedVersion = storedDocument.version;
        storedSettings = storedDocument.themeSettings;
      }
    } catch {}

    const selectedTheme =
      themePreference === 'system' || themePreference === 'light' || themePreference === 'dark'
        ? themePreference
        : config.defaults.themePreference;
    const mode =
      selectedTheme === 'system'
        ? matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : selectedTheme;
    const storedPreset = storedSettings?.preset;
    const presetPreference =
      storedVersion < config.storage.currentVersion && storedPreset === config.defaults.preset
        ? config.defaults.presetPreference
        : storedPreset === 'auto' ||
            storedPreset === 'random' ||
            (typeof storedPreset === 'string' && Object.hasOwn(config.presets, storedPreset))
          ? storedPreset
          : config.defaults.presetPreference;
    const routeSegment = location.pathname.split('/').filter(Boolean).at(-1) || '';
    const routePath = Object.hasOwn(config.automaticPresets, '/' + routeSegment) ? '/' + routeSegment : '/';
    const themeRandomValue = Math.random();
    const presetIds = Object.keys(config.presets);
    const presetId =
      presetPreference === 'auto'
        ? config.automaticPresets[routePath] || config.defaults.preset
        : presetPreference === 'random'
          ? presetIds[Math.floor(themeRandomValue * presetIds.length)] || config.defaults.preset
          : presetPreference;
    const displayFontId =
      typeof storedSettings?.fonts?.display === 'string' &&
      Object.hasOwn(config.fonts.display, storedSettings.fonts.display)
        ? storedSettings.fonts.display
        : config.defaults.fonts.display;
    const bodyFontId =
      typeof storedSettings?.fonts?.body === 'string' && Object.hasOwn(config.fonts.body, storedSettings.fonts.body)
        ? storedSettings.fonts.body
        : config.defaults.fonts.body;
    const selectedGoogleFontQueries = [
      config.googleFonts.display[displayFontId],
      config.googleFonts.body[bodyFontId],
    ].filter((font, index, fonts) => font && fonts.indexOf(font) === index);
    const googleFontsStylesheet =
      selectedGoogleFontQueries.length > 0
        ? config.googleFonts.endpoint +
          '?' +
          selectedGoogleFontQueries.map((font) => 'family=' + font).join('&') +
          '&display=swap'
        : undefined;
    const googleFontsLinkSelector = 'link[' + config.googleFonts.linkAttribute + ']';
    const googleFontPreconnectSelector = 'link[' + config.googleFonts.preconnectAttribute + ']';
    const existingGoogleFontsLink = document.head.querySelector(googleFontsLinkSelector);
    const syncGoogleFontPreconnect = (connection) => {
      const alreadyConnected = [...document.head.querySelectorAll(googleFontPreconnectSelector)].some(
        (link) => link.getAttribute('href') === connection.origin,
      );
      if (alreadyConnected) return;

      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = connection.origin;
      link.setAttribute(config.googleFonts.preconnectAttribute, '');
      if (connection.crossOrigin) link.crossOrigin = 'anonymous';
      document.head.append(link);
    };

    if (googleFontsStylesheet) {
      config.googleFonts.preconnects.forEach(syncGoogleFontPreconnect);

      if (existingGoogleFontsLink?.getAttribute('href') !== googleFontsStylesheet) {
        const link = existingGoogleFontsLink || document.createElement('link');
        link.rel = 'stylesheet';
        link.href = googleFontsStylesheet;
        link.setAttribute(config.googleFonts.linkAttribute, '');
        if (!existingGoogleFontsLink) document.head.append(link);
      }
    } else {
      existingGoogleFontsLink?.remove();
      document.head.querySelectorAll(googleFontPreconnectSelector).forEach((link) => link.remove());
    }
    const palette = config.presets[presetId][mode];
    const overrides = storedSettings?.colorOverrides?.[mode] || {};

    root.dataset.theme = mode;
    root.dataset.themePreset = presetId;
    root.dataset.themePresetPreference = presetPreference;
    root.dataset.themeRandomValue = String(themeRandomValue);
    root.dataset.displayFont = displayFontId;
    root.dataset.bodyFont = bodyFontId;

    for (const [token, variable] of Object.entries(config.variables)) {
      const override = overrides[token];
      root.style.setProperty(
        variable,
        typeof override === 'string' && hexColor.test(override) ? override : palette[token],
      );
    }

    root.style.setProperty('--display-font', config.fonts.display[displayFontId]);
    root.style.setProperty('--body-font', config.fonts.body[bodyFontId]);
  })();`;
}
