<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number;
    label: string;
    describedBy?: string;
    step?: number | 'any';
    disabled?: boolean;
  }>(),
  {
    step: 'any',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

function onChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.value.trim() === '') return;

  const value = Number(input.value);
  if (Number.isFinite(value)) emit('update:modelValue', value);
}
</script>

<template>
  <input
    class="min-h-[2.4rem] w-full rounded-none border border-line bg-background px-[0.55rem] text-[0.65rem] text-foreground outline-none focus-visible:border-line-strong disabled:cursor-not-allowed disabled:opacity-45"
    type="number"
    :value="modelValue"
    :step="step"
    :disabled="disabled"
    :aria-label="label"
    :aria-describedby="describedBy"
    @change="onChange"
  />
</template>
