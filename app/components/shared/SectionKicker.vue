<script setup lang="ts">
withDefaults(
  defineProps<{
    prefix?: string;
    label: string;
    hidePrefixFromScreenReaders?: boolean;
  }>(),
  {
    hidePrefixFromScreenReaders: false,
  },
);
</script>

<template>
  <p class="font-mono text-[0.66rem] tracking-[0.08em] text-muted uppercase">
    <span
      v-if="prefix"
      class="mr-2.5 text-primary"
      :aria-hidden="hidePrefixFromScreenReaders || undefined"
    >
      {{ prefix }}
    </span>
    {{ label }}
  </p>
</template>
