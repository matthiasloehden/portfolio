<script setup lang="ts">
import type { WorkClientPanelContent } from '@/types/content';

defineProps<{
  content: WorkClientPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame
    class="work-panel bg-raised/95"
    v-bind="content.frame"
  >
    <div class="module-grid grid grid-cols-1 gap-3 p-5 xs:grid-cols-2 sm:p-6 md:p-8 xl:p-10">
      <div
        v-for="module in content.modules"
        :key="module.number"
        class="grid min-h-32 content-between border border-line bg-[linear-gradient(135deg,var(--surface-hover),transparent)] p-4"
      >
        <span class="font-mono text-[0.62rem] text-primary">{{ module.number }}</span>
        <strong class="font-display text-base uppercase">{{ module.title }}</strong>
        <small class="font-mono text-[0.54rem] leading-6 text-muted">{{ module.description }}</small>
      </div>
    </div>

    <div
      class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 pb-4 text-center font-mono text-[0.58rem] text-muted"
    >
      <template
        v-for="(audience, index) in content.audiences"
        :key="audience"
      >
        <i
          v-if="index > 0"
          class="text-primary not-italic"
          aria-hidden="true"
          >+</i
        >
        <span class="border border-line p-[0.7rem]">{{ audience }}</span>
      </template>
    </div>
  </SharedPanelFrame>
</template>
