<script setup lang="ts">
import { getThemePreset, resolveThemePalette } from '@/config/themes';
import type { ThemePreference } from '@/types/display';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import ThemePresetSelectField from './ThemePresetSelectField.vue';
import ThemeSettingsFields from './ThemeSettingsFields.vue';

const {
  themePreference,
  resolvedThemeMode,
  themeSettings,
  setThemePreference,
  setThemePreset,
  setThemeDisplayFont,
  setThemeBodyFont,
  setThemeColor,
  resetThemeColor,
  resetThemeCustomizations,
} = useDisplayPreferences();

const themeOptions: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const activePalette = computed(() => resolveThemePalette(themeSettings.value, resolvedThemeMode.value));
const activePresetLabel = computed(() => getThemePreset(themeSettings.value.preset).label);
const resolvedModeLabel = computed(() => {
  if (themePreference.value !== 'system') return undefined;

  const mode = resolvedThemeMode.value;
  return `${mode.charAt(0).toUpperCase()}${mode.slice(1)}`;
});
</script>

<template>
  <section aria-label="Theme settings">
    <SharedSelectField
      label="Theme"
      :meta="resolvedModeLabel"
      :model-value="themePreference"
      :options="themeOptions"
      @update:model-value="setThemePreference"
    />
    <ThemePresetSelectField
      class="mt-3"
      :model-value="themeSettings.preset"
      :mode="resolvedThemeMode"
      @update:model-value="setThemePreset"
    />
    <SharedAccordionGroup class="mt-3">
      <SharedAccordion
        label="Advanced theme settings"
        :meta="activePresetLabel"
        flush
      >
        <ThemeSettingsFields
          :settings="themeSettings"
          :mode="resolvedThemeMode"
          :values="activePalette"
          @display-font-change="setThemeDisplayFont"
          @body-font-change="setThemeBodyFont"
          @color-change="setThemeColor"
          @color-reset="resetThemeColor"
          @reset="resetThemeCustomizations"
        />
      </SharedAccordion>
    </SharedAccordionGroup>
  </section>
</template>
