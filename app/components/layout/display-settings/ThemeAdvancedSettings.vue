<script setup lang="ts">
import { resolveThemePalette } from '@/domain/themes/settings';
import ThemeSettingsFields from './ThemeSettingsFields.vue';

const {
  resolvedThemeMode,
  resolvedThemePreset,
  themeSettings,
  setThemeDisplayFont,
  setThemeBodyFont,
  setThemeColor,
  resetThemeColor,
  resetCurrentThemeColors,
} = useDisplayPreferences();

const activePalette = computed(() =>
  resolveThemePalette(themeSettings.value, resolvedThemeMode.value, resolvedThemePreset.value),
);
const { t } = useI18n();
</script>

<template>
  <section :aria-label="t('display.theme.advancedLabel')">
    <ThemeSettingsFields
      :settings="themeSettings"
      :mode="resolvedThemeMode"
      :active-preset="resolvedThemePreset"
      :values="activePalette"
      @display-font-change="setThemeDisplayFont"
      @body-font-change="setThemeBodyFont"
      @color-change="setThemeColor"
      @color-reset="resetThemeColor"
      @reset="resetCurrentThemeColors"
    />
  </section>
</template>
