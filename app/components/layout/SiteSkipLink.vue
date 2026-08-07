<script setup lang="ts">
defineProps<{
  target: string;
}>();
</script>

<template>
  <a
    class="skip-link fixed z-20"
    :href="target"
  >
    Skip to content
  </a>
</template>
