<script setup lang="ts">
import type { AcademicAuthenticationPanelContent } from '@/types/content';

defineProps<{
  content: AcademicAuthenticationPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <ol class="m-0 list-none p-5 sm:p-6 md:p-8 xl:p-10">
      <li
        v-for="(step, index) in content.steps"
        :key="step.number"
        :class="[
          'grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-4',
          index === 0 && 'pt-0',
          index === content.steps.length - 1 && 'border-b-0 pb-0',
        ]"
        data-panel-item
      >
        <span class="font-mono text-[0.58rem] text-primary">{{ step.number }}</span>
        <div class="grid gap-[0.3rem]">
          <strong class="font-display text-base uppercase">{{ step.title }}</strong>
          <small class="font-mono text-[0.55rem] leading-[1.45] text-muted">{{ step.description }}</small>
        </div>
      </li>
    </ol>

    <div class="border-t border-line px-4 py-3">
      <SharedStatusIndicator :label="content.status" />
    </div>
  </SharedPanelFrame>
</template>
