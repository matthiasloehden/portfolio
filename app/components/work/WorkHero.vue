<script setup lang="ts">
import type { WorkHeroContent } from '@/types/content';

defineProps<{
  content: WorkHeroContent;
}>();
</script>

<template>
  <SharedDetailHero
    title-id="work-title"
    :content="content"
    desktop-alignment="start"
  />
</template>
