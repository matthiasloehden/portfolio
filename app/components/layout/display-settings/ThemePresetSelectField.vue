<script setup lang="ts">
import { THEME_PRESETS, getThemePreset } from '@/config/themes/definitions';
import type { ThemeMode, ThemePalette, ThemePresetId } from '@/types/theme';
import SharedSelectField from '@/components/shared/form/SelectField.vue';

defineProps<{
  modelValue: ThemePresetId;
  mode: ThemeMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ThemePresetId];
}>();

const presetOptions = THEME_PRESETS.map(({ id, label }) => ({ value: id, label }));

function getPreviewColors(palette: ThemePalette): readonly string[] {
  return [palette.background, palette.primary, palette.foreground];
}
</script>

<template>
  <SharedSelectField
    label="Color scheme"
    :model-value="modelValue"
    :options="presetOptions"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #value="{ option }">
      <span
        v-if="option"
        class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3"
      >
        <span
          class="flex -space-x-1"
          aria-hidden="true"
        >
          <span
            v-for="color in getPreviewColors(getThemePreset(option.value).palettes[mode])"
            :key="color"
            class="size-5 rounded-full border border-line-strong"
            :style="{ backgroundColor: color }"
          />
        </span>
        <span class="truncate">{{ option.label }}</span>
      </span>
    </template>

    <template #option="{ option }">
      <span class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span
          class="flex -space-x-1"
          aria-hidden="true"
        >
          <span
            v-for="color in getPreviewColors(getThemePreset(option.value).palettes[mode])"
            :key="color"
            class="size-4 rounded-full border border-line-strong"
            :style="{ backgroundColor: color }"
          />
        </span>
        <span class="min-w-0">
          <span class="block text-[0.6rem] text-foreground">{{ option.label }}</span>
          <span class="mt-0.5 block text-[0.52rem] leading-[1.3] text-muted">
            {{ getThemePreset(option.value).description }}
          </span>
        </span>
      </span>
    </template>
  </SharedSelectField>
</template>
