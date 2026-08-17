<script setup lang="ts">
import type { AcademicAuthenticationPanelContent } from '@/types/content';

defineProps<{
  content: AcademicAuthenticationPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <ol class="auth-flow m-0 list-none p-5 sm:p-6 md:p-8 xl:p-10">
      <li
        v-for="(step, index) in content.steps"
        :key="step.number"
        :class="[
          'grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-4',
          index === 0 && 'pt-0',
          index === content.steps.length - 1 && 'border-b-0 pb-0',
        ]"
      >
        <span class="font-mono text-[0.58rem] text-primary">{{ step.number }}</span>
        <div class="grid gap-[0.3rem]">
          <strong class="font-display text-base uppercase">{{ step.title }}</strong>
          <small class="font-mono text-[0.55rem] leading-[1.45] text-muted">{{ step.description }}</small>
        </div>
      </li>
    </ol>

    <div class="flex items-center gap-[0.6rem] border-t border-line px-4 py-3 font-mono text-[0.58rem] text-muted">
      <i
        class="size-[0.4rem] rounded-full bg-[#3cdc94] shadow-[0_0_0.7rem_rgb(60_220_148/70%)]"
        aria-hidden="true"
      />
      {{ content.status }}
    </div>
  </SharedPanelFrame>
</template>
