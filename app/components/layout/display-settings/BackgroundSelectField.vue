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

const { t } = useI18n();
const route = useRoute();
const automaticBackground = computed(() => resolveBackground(route.path, 'auto'));
const backgroundOptions = computed(() =>
  BACKGROUND_OPTIONS.map((option) => ({
    value: option.value,
    label:
      option.value === 'auto' || option.value === 'none' || option.value === 'random'
        ? t(`display.shared.${option.value === 'auto' ? 'automatic' : option.value}`)
        : t(`display.background.scenes.${option.value}`),
  })),
);

function resolveOptionBackground(preference: BackgroundPreference): BackgroundId | 'none' {
  if (preference === 'auto') return automaticBackground.value;
  return preference === 'random' ? props.activeBackground : preference;
}
</script>

<template>
  <SharedSelectField
    :label="t('display.background.label')"
    :meta="meta"
    :model-value="modelValue"
    :options="backgroundOptions"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #value-indicator="{ option }">
      <BackgroundPreviewIcon
        v-if="option"
        class="size-5"
        :background="resolveOptionBackground(option.value)"
      />
    </template>

    <template #option-indicator="{ option }">
      <BackgroundPreviewIcon
        class="size-5"
        :background="resolveOptionBackground(option.value)"
      />
    </template>
  </SharedSelectField>
</template>
