<script setup lang="ts">
import { getThemePreset } from '@/config/themes/definitions';
import { THEME_PRESET_OPTIONS, resolveThemePreset } from '@/config/themes/selection';
import type { ThemeMode, ThemePalette, ThemePresetId, ThemePresetPreference } from '@/types/theme';
import SharedSelectField from '@/components/shared/form/SelectField.vue';

const props = defineProps<{
  modelValue: ThemePresetPreference;
  activePreset: ThemePresetId;
  mode: ThemeMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ThemePresetPreference];
}>();

const { t } = useI18n();
const presetOptions = computed(() =>
  THEME_PRESET_OPTIONS.map((option) => ({
    value: option.value,
    label:
      option.value === 'auto' || option.value === 'random'
        ? t(`display.shared.${option.value === 'auto' ? 'automatic' : 'random'}`)
        : t(`display.theme.presets.${option.value}`),
  })),
);
const route = useRoute();
const automaticPreset = computed(() => resolveThemePreset(route.path, 'auto'));

function resolveOptionPreset(preference: ThemePresetPreference): ThemePresetId {
  if (preference === 'auto') return automaticPreset.value;
  return preference === 'random' ? props.activePreset : preference;
}

function getPreviewColors(palette: ThemePalette): readonly string[] {
  return [palette.background, palette.primary, palette.foreground];
}

function getPresetLabel(preset: ThemePresetId): string {
  return t(`display.theme.presets.${preset}`);
}
</script>

<template>
  <SharedSelectField
    :label="t('display.theme.colorScheme')"
    :meta="modelValue === 'auto' || modelValue === 'random' ? getPresetLabel(activePreset) : undefined"
    :model-value="modelValue"
    :options="presetOptions"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #value-indicator="{ option }">
      <span
        v-if="option"
        class="flex -space-x-1"
        aria-hidden="true"
      >
        <span
          v-for="color in getPreviewColors(getThemePreset(resolveOptionPreset(option.value)).palettes[mode])"
          :key="color"
          class="size-5 rounded-full border border-line-strong"
          :style="{ backgroundColor: color }"
        />
      </span>
    </template>

    <template #option-indicator="{ option }">
      <span
        class="flex -space-x-1"
        aria-hidden="true"
      >
        <span
          v-for="color in getPreviewColors(getThemePreset(resolveOptionPreset(option.value)).palettes[mode])"
          :key="color"
          class="size-4 rounded-full border border-line-strong"
          :style="{ backgroundColor: color }"
        />
      </span>
    </template>
  </SharedSelectField>
</template>
