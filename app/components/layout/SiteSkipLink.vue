<script setup lang="ts">
defineProps<{
  target: string;
}>();
</script>

<template>
  <a
    class="fixed top-4 left-4 z-20 -translate-y-[180%] border border-primary bg-raised px-4 py-3 font-mono text-xs text-foreground focus:translate-y-0"
    :href="target"
  >
    Skip to content
  </a>
</template>
