<script setup lang="ts">
defineProps<{
  title: string;
  meta: string;
}>();
</script>

<template>
  <figure
    class="motion-panel m-0 border border-line-strong bg-raised shadow-panel"
    data-reveal="scale"
  >
    <figcaption class="flex justify-between gap-4 border-b border-line px-4 py-3 font-mono text-[0.6rem] text-muted">
      <span>{{ title }}</span
      ><span class="text-quiet">{{ meta }}</span>
    </figcaption>
    <slot />
  </figure>
</template>
