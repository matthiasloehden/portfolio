<script setup lang="ts">
import SharedToggleField from '@/components/shared/form/ToggleField.vue';

defineProps<{
  label: string;
  description: string;
  modelValue: boolean;
  overridden?: boolean;
  resetLabel?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  reset: [];
}>();
</script>

<template>
  <div class="grid gap-1.5">
    <SharedToggleField
      :label="label"
      :description="description"
      :checked="modelValue"
      @change="emit('update:modelValue', $event)"
    />
    <button
      v-if="overridden"
      class="w-fit cursor-pointer font-mono text-[0.54rem] text-muted underline decoration-line underline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground"
      type="button"
      :title="resetLabel"
      :aria-label="`${label}: ${resetLabel ?? 'reset override'}`"
      @click="emit('reset')"
    >
      Reset
    </button>
  </div>
</template>
