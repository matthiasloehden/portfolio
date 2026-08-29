import {
  DISPLAY_PREFERENCES_STORAGE_KEY,
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
    variables: Object.fromEntries(THEME_COLOR_CONTROLS.map((control) => [control.key, control.cssVariable])),
    defaults: { preset: DEFAULT_THEME_PRESET_ID, fonts: DEFAULT_THEME_FONTS },
    storage: {
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

    try {
      themePreference = localStorage.getItem(config.storage.themePreferenceKey);
      const storedDocument = JSON.parse(localStorage.getItem(config.storage.preferencesKey) || 'null');
      if (config.storage.themeSettingsVersions.includes(storedDocument?.version)) {
        storedSettings = storedDocument.themeSettings;
      }
    } catch {}

    const mode =
      themePreference === 'light' || themePreference === 'dark'
        ? themePreference
        : matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    const presetId =
      typeof storedSettings?.preset === 'string' && Object.hasOwn(config.presets, storedSettings.preset)
        ? storedSettings.preset
        : config.defaults.preset;
    const displayFontId =
      typeof storedSettings?.fonts?.display === 'string' &&
      Object.hasOwn(config.fonts.display, storedSettings.fonts.display)
        ? storedSettings.fonts.display
        : config.defaults.fonts.display;
    const bodyFontId =
      typeof storedSettings?.fonts?.body === 'string' && Object.hasOwn(config.fonts.body, storedSettings.fonts.body)
        ? storedSettings.fonts.body
        : config.defaults.fonts.body;
    const palette = config.presets[presetId][mode];
    const overrides = storedSettings?.colorOverrides?.[mode] || {};

    root.dataset.theme = mode;
    root.dataset.themePreset = presetId;
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
