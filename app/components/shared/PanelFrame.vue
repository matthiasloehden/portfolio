<script setup lang="ts">
defineProps<{
  title: string;
  meta: string;
}>();
</script>

<template>
  <figure class="m-0 border border-line-strong bg-raised shadow-panel">
    <figcaption>
      <span>{{ title }}</span
      ><span>{{ meta }}</span>
    </figcaption>
    <slot />
  </figure>
</template>

<style scoped>
figcaption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
}

figcaption span:last-child {
  color: var(--quiet);
}
</style>
