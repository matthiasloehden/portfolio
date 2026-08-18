<script setup lang="ts">
defineProps<{
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  change: [checked: boolean];
}>();

function onChange(event: Event): void {
  emit('change', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label class="flex cursor-pointer items-center justify-between gap-4">
    <span class="grid gap-1">
      <strong class="font-mono text-[0.65rem] font-semibold text-foreground">{{ label }}</strong>
      <small class="font-mono text-[0.56rem] leading-[1.45] text-muted">{{ description }}</small>
    </span>
    <input
      class="h-[1.3rem] w-[2.35rem] shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-45"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
  </label>
</template>
