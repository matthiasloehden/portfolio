<script setup lang="ts">
import { THEME_BODY_FONTS, THEME_COLOR_CONTROLS, THEME_DISPLAY_FONTS } from '@/config/themes/definitions';
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

const { t } = useI18n();
const displayFontOptions = THEME_DISPLAY_FONTS.map(({ id, label }) => ({ value: id, label }));
const bodyFontOptions = THEME_BODY_FONTS.map(({ id, label }) => ({ value: id, label }));
const colorGroups = computed(
  () =>
    [
      { key: 'canvas', label: t('display.theme.groups.canvas') },
      { key: 'text', label: t('display.theme.groups.text') },
      { key: 'accent', label: t('display.theme.groups.accent') },
    ] as const,
);

const groupedControls = computed(() =>
  colorGroups.value.map((group) => ({
    ...group,
    controls: THEME_COLOR_CONTROLS.filter((control) => control.group === group.key),
  })),
);
const selectedPresetLabel = computed(() => t(`display.theme.presets.${props.activePreset}`));
const modeLabel = computed(() => t(`display.theme.modes.${props.mode}`));
const hasCurrentThemeColorOverrides = computed(() => Object.keys(props.settings.colorOverrides[props.mode]).length > 0);
const colorSettingsTitleId = useId();

function onDisplayFontChange(font: ThemeDisplayFontId): void {
  emit('display-font-change', font);
}

function onBodyFontChange(font: ThemeBodyFontId): void {
  emit('body-font-change', font);
}

function getColorLabel(token: ThemeColorToken): string {
  return t(`display.theme.colors.${token}.label`);
}

function getColorDescription(token: ThemeColorToken): string {
  return t(`display.theme.colors.${token}.description`);
}
</script>

<template>
  <div>
    <SharedSelectField
      :label="t('display.theme.headingFont')"
      :model-value="settings.fonts.display"
      :options="displayFontOptions"
      @update:model-value="onDisplayFontChange"
    />
    <SharedSelectField
      class="mt-3"
      :label="t('display.theme.bodyFont')"
      :model-value="settings.fonts.body"
      :options="bodyFontOptions"
      @update:model-value="onBodyFontChange"
    />

    <section
      class="mt-4 border-t border-line"
      :aria-labelledby="colorSettingsTitleId"
    >
      <div class="flex items-baseline justify-between gap-3 py-3 font-mono font-normal">
        <h3
          :id="colorSettingsTitleId"
          class="text-[0.6rem] text-foreground"
        >
          {{ t('display.theme.configureColors') }}
        </h3>
        <span class="truncate text-[0.54rem] text-muted">{{ selectedPresetLabel }}</span>
      </div>

      <p class="pb-3 font-mono text-[0.54rem] leading-[1.4] text-muted">
        {{ t('display.theme.editingColors', { mode: modeLabel }) }}
      </p>

      <SharedAccordionGroup :end-border="false">
        <SharedAccordion
          v-for="group in groupedControls"
          :key="group.key"
          :label="group.label"
          :heading-level="4"
        >
          <div class="grid gap-4">
            <SharedHexColorInput
              v-for="control in group.controls"
              :key="control.key"
              :label="getColorLabel(control.key)"
              :description="getColorDescription(control.key)"
              :model-value="values[control.key]"
              :overridden="settings.colorOverrides[mode][control.key] !== undefined"
              :reset-label="t('display.theme.usePresetValue', { preset: selectedPresetLabel, mode: modeLabel })"
              @update:model-value="emit('color-change', control.key, $event)"
              @reset="emit('color-reset', control.key)"
            />
          </div>
        </SharedAccordion>
      </SharedAccordionGroup>

      <SharedSettingsResetButton
        class="my-4"
        :label="t('display.theme.resetColors')"
        :disabled="!hasCurrentThemeColorOverrides"
        :disabled-reason="t('display.theme.resetColorsDisabled')"
        :aria-label="t('display.theme.resetColorsLabel', { mode: modeLabel })"
        @click="emit('reset')"
      />
    </section>
  </div>
</template>
