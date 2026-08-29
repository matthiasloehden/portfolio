<script setup lang="ts">
defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  select: [];
}>();

const button = ref<HTMLButtonElement | null>(null);

function focus(options?: FocusOptions): void {
  button.value?.focus(options);
}

defineExpose({ focus });
</script>

<template>
  <button
    ref="button"
    class="flex w-full cursor-pointer items-center justify-between gap-3 border-y border-line py-3 text-left font-mono font-normal text-foreground transition-colors hover:border-line-strong focus-visible:border-line-strong"
    type="button"
    :aria-label="label"
    @click="emit('select')"
  >
    <span class="text-[0.6rem]">{{ label }}</span>
    <svg
      class="size-3 shrink-0 stroke-current [stroke-linecap:round] [stroke-linejoin:round]"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="m4.25 2.5 3.5 3.5-3.5 3.5" />
    </svg>
  </button>
</template>
