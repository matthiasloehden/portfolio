<script setup lang="ts">
import type { PageClosingContent } from '@/types/content';

defineProps<{
  content: PageClosingContent;
}>();
</script>

<template>
  <SharedPageClosing
    id="projects-close"
    :content="content"
    width="narrow"
  />
</template>
