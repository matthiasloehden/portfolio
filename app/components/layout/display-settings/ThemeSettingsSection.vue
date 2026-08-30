<script setup lang="ts">
import type { ThemePreference } from '@/types/display';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import SettingsPageButton from './SettingsPageButton.vue';
import ThemePresetSelectField from './ThemePresetSelectField.vue';

const emit = defineEmits<{
  'open-advanced': [];
}>();

const pageButton = ref<{ focus: (options?: FocusOptions) => void } | null>(null);

function focusAdvancedButton(options?: FocusOptions): void {
  pageButton.value?.focus(options);
}

defineExpose({ focus: focusAdvancedButton });

const { themePreference, resolvedThemeMode, resolvedThemePreset, themeSettings, setThemePreference, setThemePreset } =
  useDisplayPreferences();

const themeOptions: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

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
      :active-preset="resolvedThemePreset"
      :mode="resolvedThemeMode"
      @update:model-value="setThemePreset"
    />
    <SettingsPageButton
      ref="pageButton"
      class="mt-3"
      label="Advanced theme settings"
      @select="emit('open-advanced')"
    />
  </section>
</template>
