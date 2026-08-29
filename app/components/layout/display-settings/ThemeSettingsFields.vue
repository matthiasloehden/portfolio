<script setup lang="ts">
import {
  THEME_BODY_FONTS,
  THEME_COLOR_CONTROLS,
  THEME_DISPLAY_FONTS,
  getThemePreset,
} from '@/config/themes/definitions';
import type {
  ThemeBodyFontId,
  ThemeColorToken,
  ThemeDisplayFontId,
  ThemeMode,
  ThemePalette,
  ThemePresetId,
  ThemeSettings,
} from '@/types/theme';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedHexColorInput from '@/components/shared/form/HexColorInput.vue';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import SharedSettingsResetButton from '@/components/shared/form/SettingsResetButton.vue';

const props = defineProps<{
  settings: ThemeSettings;
  mode: ThemeMode;
  activePreset: ThemePresetId;
  values: ThemePalette;
}>();

const emit = defineEmits<{
  'display-font-change': [font: ThemeDisplayFontId];
  'body-font-change': [font: ThemeBodyFontId];
  'color-change': [token: ThemeColorToken, color: string];
  'color-reset': [token: ThemeColorToken];
  reset: [];
}>();

const displayFontOptions = THEME_DISPLAY_FONTS.map(({ id, label }) => ({ value: id, label }));
const bodyFontOptions = THEME_BODY_FONTS.map(({ id, label }) => ({ value: id, label }));
const colorGroups = [
  { key: 'canvas', label: 'Canvas & surfaces' },
  { key: 'text', label: 'Text' },
  { key: 'accent', label: 'Accents & states' },
] as const;

const groupedControls = colorGroups.map((group) => ({
  ...group,
  controls: THEME_COLOR_CONTROLS.filter((control) => control.group === group.key),
}));
const selectedPreset = computed(() => getThemePreset(props.activePreset));
const hasCurrentThemeColorOverrides = computed(() => Object.keys(props.settings.colorOverrides[props.mode]).length > 0);

function onDisplayFontChange(font: ThemeDisplayFontId): void {
  emit('display-font-change', font);
}

function onBodyFontChange(font: ThemeBodyFontId): void {
  emit('body-font-change', font);
}
</script>

<template>
  <div>
    <SharedSelectField
      label="Heading font"
      :model-value="settings.fonts.display"
      :options="displayFontOptions"
      @update:model-value="onDisplayFontChange"
    />
    <SharedSelectField
      class="mt-3"
      label="Body font"
      :model-value="settings.fonts.body"
      :options="bodyFontOptions"
      @update:model-value="onBodyFontChange"
    />

    <SharedAccordionGroup
      class="mt-4"
      :end-border="false"
    >
      <SharedAccordion
        label="Configure active color scheme"
        :meta="selectedPreset.label"
        :heading-level="4"
        flush
      >
        <p class="py-2 font-mono text-[0.54rem] leading-[1.4] text-muted">
          Editing {{ mode }} custom colors. Overrides stay active when color schemes change.
        </p>

        <SharedAccordionGroup :end-border="false">
          <SharedAccordion
            v-for="group in groupedControls"
            :key="group.key"
            :label="group.label"
            :heading-level="5"
          >
            <div class="grid gap-4">
              <SharedHexColorInput
                v-for="control in group.controls"
                :key="control.key"
                :label="control.label"
                :description="control.description"
                :model-value="values[control.key]"
                :overridden="settings.colorOverrides[mode][control.key] !== undefined"
                :reset-label="`Use ${selectedPreset.label} ${mode} value`"
                @update:model-value="emit('color-change', control.key, $event)"
                @reset="emit('color-reset', control.key)"
              />
            </div>
          </SharedAccordion>
        </SharedAccordionGroup>

        <SharedSettingsResetButton
          class="my-4"
          label="Reset current theme colors"
          :disabled="!hasCurrentThemeColorOverrides"
          disabled-reason="No colors have been changed for the current theme."
          :aria-label="`Reset current ${mode} theme colors`"
          @click="emit('reset')"
        />
      </SharedAccordion>
    </SharedAccordionGroup>
  </div>
</template>
