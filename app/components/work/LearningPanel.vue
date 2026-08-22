<script setup lang="ts">
import type { WorkLearningPanelContent } from '@/types/content';

defineProps<{
  content: WorkLearningPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame
    class="bg-raised/95"
    v-bind="content.frame"
  >
    <SharedAppPreview
      :navigation="content.navigation"
      aria-label="Learning platform interface preview"
    >
      <div class="grid grid-cols-1 gap-[0.65rem] sm:grid-cols-3">
        <div
          class="grid min-h-32 content-between border border-line bg-[linear-gradient(110deg,var(--surface-hover),transparent),repeating-linear-gradient(90deg,transparent,transparent_2rem,var(--line)_2rem,var(--line)_calc(2rem+1px))] p-3 sm:col-span-3"
          data-panel-item
        >
          <i
            class="size-[0.4rem] rounded-full bg-success shadow-[0_0_0.65rem_color-mix(in_srgb,var(--success)_75%,transparent)]"
            aria-hidden="true"
          />
          <strong class="font-display text-base uppercase">{{ content.featured.title }}</strong>
          <small class="font-mono text-[0.54rem] leading-[1.45] text-muted">{{ content.featured.description }}</small>
        </div>

        <div
          v-for="format in content.formats"
          :key="format.title"
          class="grid min-h-[6.3rem] content-between border border-line bg-surface p-3"
          data-panel-item
        >
          <span
            class="font-mono text-[0.62rem] text-primary"
            aria-hidden="true"
            >{{ format.symbol }}</span
          >
          <strong class="font-display text-base uppercase">{{ format.title }}</strong>
          <small class="font-mono text-[0.54rem] leading-[1.45] text-muted">{{ format.description }}</small>
        </div>
      </div>
    </SharedAppPreview>

    <div class="border-t border-line px-4 py-3">
      <SharedStatusIndicator :label="content.status" />
    </div>
  </SharedPanelFrame>
</template>
