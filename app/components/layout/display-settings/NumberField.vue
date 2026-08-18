<script setup lang="ts">
defineProps<{
  label: string;
  description?: string;
  modelValue: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
}>();

const descriptionId = useId();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

function onChange(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);

  if (Number.isFinite(value)) emit('update:modelValue', value);
}
</script>

<template>
  <label class="grid gap-[0.45rem] font-mono text-[0.6rem] text-muted">
    <span class="grid gap-[0.2rem]">
      {{ label }}
      <small
        v-if="description"
        :id="descriptionId"
        class="text-[0.56rem] leading-[1.4] text-muted"
      >
        {{ description }}
      </small>
    </span>
    <input
      class="min-h-[2.4rem] w-full rounded-none border border-line bg-background px-[0.7rem] text-[0.65rem] text-foreground outline-none focus-visible:border-line-strong disabled:cursor-not-allowed disabled:opacity-45"
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="label"
      :aria-describedby="description ? descriptionId : undefined"
      @change="onChange"
    />
  </label>
</template>
