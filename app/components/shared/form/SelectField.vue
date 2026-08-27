<script setup lang="ts" generic="Value extends string">
interface SelectFieldOption<OptionValue extends string> {
  value: OptionValue;
  label: string;
}

defineProps<{
  label: string;
  meta?: string;
  description?: string;
  modelValue: Value;
  options: readonly SelectFieldOption<Value>[];
  disabled?: boolean;
}>();

const descriptionId = useId();

const emit = defineEmits<{
  'update:modelValue': [value: Value];
}>();

function onChange(event: Event): void {
  // Native selects expose strings, while the option registry guarantees that
  // every emitted value belongs to the generic union supplied by the caller.
  emit('update:modelValue', (event.target as HTMLSelectElement).value as Value);
}
</script>

<template>
  <label class="grid gap-[0.45rem] font-mono text-[0.6rem] text-muted">
    <span class="grid gap-[0.2rem]">
      <span class="flex min-w-0 items-baseline gap-2">
        <span class="text-[0.62rem] font-semibold text-foreground">{{ label }}</span>
        <span
          v-if="meta"
          class="truncate text-[0.54rem] text-muted"
        >
          {{ meta }}
        </span>
      </span>
      <small
        v-if="description"
        :id="descriptionId"
        class="text-[0.56rem] leading-[1.4] text-muted"
      >
        {{ description }}
      </small>
    </span>
    <select
      class="min-h-[2.4rem] w-full cursor-pointer rounded-none border border-line bg-background py-0 pr-8 pl-[0.7rem] text-[0.65rem] text-foreground transition-colors duration-150 outline-none hover:border-line-strong focus-visible:border-line-strong disabled:cursor-not-allowed disabled:opacity-45"
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
