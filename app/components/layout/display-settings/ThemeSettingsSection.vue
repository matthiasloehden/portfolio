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
const { t } = useI18n();

const themeOptions = computed<readonly { value: ThemePreference; label: string }[]>(() => [
  { value: 'system', label: t('display.theme.modes.system') },
  { value: 'dark', label: t('display.theme.modes.dark') },
  { value: 'light', label: t('display.theme.modes.light') },
]);

const resolvedModeLabel = computed(() => {
  if (themePreference.value !== 'system') return undefined;

  const mode = resolvedThemeMode.value;
  return t(`display.theme.modes.${mode}`);
});
</script>

<template>
  <section :aria-label="t('display.theme.settingsLabel')">
    <SharedSelectField
      :label="t('display.theme.label')"
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
      :label="t('display.theme.openAdvanced')"
      @select="emit('open-advanced')"
    />
  </section>
</template>
