<script setup lang="ts">
import { BACKGROUND_OPTIONS, resolveBackground } from '@/config/backgrounds/selection';
import type { BackgroundId, BackgroundPreference } from '@/types/background';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import BackgroundPreviewIcon from './BackgroundPreviewIcon.vue';

const props = defineProps<{
  modelValue: BackgroundPreference;
  activeBackground: BackgroundId | 'none';
  meta?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: BackgroundPreference];
}>();

const route = useRoute();
const automaticBackground = computed(() => resolveBackground(route.path, 'auto'));

function resolveOptionBackground(preference: BackgroundPreference): BackgroundId | 'none' {
  if (preference === 'auto') return automaticBackground.value;
  return preference === 'random' ? props.activeBackground : preference;
}
</script>

<template>
  <SharedSelectField
    label="Background"
    :meta="meta"
    :model-value="modelValue"
    :options="BACKGROUND_OPTIONS"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #value="{ option }">
      <span
        v-if="option"
        class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
      >
        <span class="truncate">{{ option.label }}</span>
        <BackgroundPreviewIcon
          class="size-5"
          :background="resolveOptionBackground(option.value)"
        />
      </span>
    </template>

    <template #option="{ option }">
      <span class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <span class="truncate text-[0.6rem] text-foreground">{{ option.label }}</span>
        <BackgroundPreviewIcon
          class="size-5"
          :background="resolveOptionBackground(option.value)"
        />
      </span>
    </template>
  </SharedSelectField>
</template>
