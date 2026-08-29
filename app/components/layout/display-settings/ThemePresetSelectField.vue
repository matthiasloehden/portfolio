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

const presetOptions = THEME_PRESET_OPTIONS;
const route = useRoute();
const automaticPreset = computed(() => resolveThemePreset(route.path, 'auto'));

function resolveOptionPreset(preference: ThemePresetPreference): ThemePresetId {
  if (preference === 'auto') return automaticPreset.value;
  return preference === 'random' ? props.activePreset : preference;
}

function getPreviewColors(palette: ThemePalette): readonly string[] {
  return [palette.background, palette.primary, palette.foreground];
}
</script>

<template>
  <SharedSelectField
    label="Color scheme"
    :meta="modelValue === 'auto' || modelValue === 'random' ? getThemePreset(activePreset).label : undefined"
    :model-value="modelValue"
    :options="presetOptions"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #value="{ option }">
      <span
        v-if="option"
        class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
      >
        <span class="truncate">{{ option.label }}</span>
        <span
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
      </span>
    </template>

    <template #option="{ option }">
      <span class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <span class="truncate text-[0.6rem] text-foreground">{{ option.label }}</span>
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
      </span>
    </template>
  </SharedSelectField>
</template>
