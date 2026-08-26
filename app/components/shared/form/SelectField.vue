<script setup lang="ts">
interface SelectFieldOption {
  value: string;
  label: string;
}

defineProps<{
  label: string;
  description?: string;
  modelValue: string;
  options: readonly SelectFieldOption[];
  disabled?: boolean;
}>();

const descriptionId = useId();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
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
    <select
      class="min-h-[2.4rem] w-full rounded-none border border-line bg-background py-0 pr-8 pl-[0.7rem] text-[0.65rem] text-foreground outline-none focus-visible:border-line-strong disabled:cursor-not-allowed disabled:opacity-45"
      :value="modelValue"
      :disabled="disabled"
      :aria-label="label"
      :aria-describedby="description ? descriptionId : undefined"
      @change="onChange"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
