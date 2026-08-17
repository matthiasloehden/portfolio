<script setup lang="ts">
import type { WorkClosingContent } from '@/types/content';

defineProps<{
  content: WorkClosingContent;
}>();
</script>

<template>
  <SharedPageClosing
    id="work-close"
    :content="content"
  />
</template>
