# Theme architecture

The display menu provides three layers of theme control:

1. `System`, `Dark`, or `Light` chooses the active color mode.
2. A color-scheme preference selects a preset, follows the current page, or chooses one at random.
3. Advanced settings can override individual colors and select heading and body fonts independently.

The implementation keeps those choices separate. Changing the operating-system color mode does not replace a selected
preset, and changing a preset does not discard explicit color overrides.

Dark is the default color mode. System-based and light rendering remain explicit choices in the display menu.

Arctic Blue is the default color scheme. Automatic page-based selection remains available explicitly. Random selection
stays stable while the current page is active and is drawn again when it is selected again or navigation changes the
page. The pre-hydration initialization script resolves a stored random preference before the interface renders.

## Source of truth

[`app/config/themes.ts`](../app/config/themes.ts) owns all public theme definitions:

- `THEME_PRESETS` contains the named schemes and their complete dark and light palettes.
- `THEME_COLOR_CONTROLS` maps editable color tokens to their semantic CSS custom properties.
- `THEME_DISPLAY_FONTS` contains narrow families that are safe for the large portfolio headings.
- `THEME_BODY_FONTS` contains screen-readable families for paragraphs and general interface copy.
- Sanitizers validate persisted identifiers before they reach the DOM.

The corresponding contracts and identifier registries live in
[`app/types/theme.ts`](../app/types/theme.ts). Shared hexadecimal parsing lives in
[`app/utils/color.ts`](../app/utils/color.ts), so generic form controls and renderer adapters do not depend on the theme
feature. Adding a color token or font requires updating the typed registry rather than maintaining unrelated option
lists in the UI, persistence layer, and runtime.

## Palette resolution

Every preset supplies the complete semantic palette for both `dark` and `light`. An effective color is resolved in this
order:

1. An explicit override for the active color mode.
2. The selected preset's value for that mode.

Overrides are stored separately for light and dark mode. A visitor can therefore adjust a dark background without
accidentally applying it to the light palette. Switching presets preserves overrides deliberately; resetting an
individual field returns that token to the currently selected preset.

Color inputs accept `#RRGGBB` and `#RRGGBBAA`. The latter allows opacity for tokens such as surfaces, borders, and text
selection without introducing a second alpha control.

## Tailwind integration

[`app/assets/style/theme.css`](../app/assets/style/theme.css) exposes semantic Tailwind colors through `@theme inline`:

```css
--color-background: var(--background);
--color-foreground: var(--foreground);
--color-primary: var(--primary);
```

Components continue to use stable utilities such as `bg-background`, `text-foreground`, `border-line`, and `bg-primary`.
The theme runtime only replaces the underlying CSS custom properties, so components do not need preset-specific classes
or conditional styling.

The `:root` values in `theme.css` intentionally mirror the default Arctic scheme as a no-script fallback. They are the
only duplicated palette values; interactive clients replace them from the typed registry before hydration.

The background renderers read the same computed semantic colors through
[`themeColors.ts`](../app/components/backgrounds/shared/themeColors.ts). A theme update dispatches one shared event, which
keeps Canvas2D and WebGL scenes aligned with the Tailwind interface.

## Typography

Heading and body typography are independent settings. This prevents a body-font choice from changing the geometry of
the oversized display headings.

Available heading families range from compact technical faces to editorial and expressive styles:

- Barlow Condensed
- Archivo Narrow
- Cinzel
- Oswald
- Playfair Display
- Roboto Condensed
- Space Grotesk

Available body families are:

- Inter
- IBM Plex Sans
- JetBrains Mono
- Lora
- Merriweather
- Nunito Sans
- Roboto
- Source Sans 3

The default Barlow Condensed, Inter, and fixed IBM Plex Mono interface font remain self-hosted. Optional families are
served by Google Fonts only when selected. The runtime assigns the selected families to `--display-font` and
`--body-font`, which back Tailwind's `font-display` and `font-sans` utilities.

## UI responsibilities

The settings interface is split into focused components:

| Component | Responsibility |
| --- | --- |
| `ThemeSettingsSection.vue` | Theme feature boundary, derived active values, and preference actions |
| `ThemePresetSelectField.vue` | Main-menu color-scheme listbox, palette previews, and keyboard interaction |
| `ThemeSettingsFields.vue` | Advanced typography and grouped color controls |
| `HexColorInput.vue` | Draft input state, hex validation, preview swatch, and per-token reset |
| `DisplaySettings.vue` | Display-panel layout, background controls, and global reset |

The custom preset listbox supports pointer input, arrow keys, Home, End, and Escape. The closed control shows the current
palette preview without requiring the advanced section to be opened.

## Persistence and initialization

[`displayPreferencesStorage.ts`](../app/utils/displayPreferencesStorage.ts) stores theme settings inside the versioned
display-preferences document. Stored values are treated as untrusted input: identifiers are checked against the registry,
colors are validated, and incomplete older documents receive current defaults. Deprecated font profiles migrate to
Barlow Condensed and Inter so the earlier wide editorial heading option cannot survive an upgrade.

Storage keys, the current schema version, and the versions containing theme settings are centralized in
[`app/config/displayPreferences.ts`](../app/config/displayPreferences.ts). The migration layer and the pre-hydration
script therefore cannot drift onto different schema assumptions.

[`themeInitialization.ts`](../app/utils/themeInitialization.ts) applies the saved mode, preset, overrides, and fonts before
Vue hydrates. The composable repeats the operation after full validation and owns subsequent reactive changes. This
avoids a flash of the default palette or typography while keeping persistence parsing out of the UI components.

## Test coverage

The display-settings browser tests cover the behavior at its public boundaries:

- preset, heading-font, body-font, and color-override application;
- persistence across reloads and per-token reset behavior;
- migration from the deprecated font-profile schema;
- legacy background-setting migration through the same versioned document;
- keyboard and automatically detectable WCAG behavior for the open theme controls.

These scenarios exercise the integrated storage, DOM, CSS-variable, and accessible-control contracts. Additional tests
should target new behavior rather than duplicate the static registry data.
