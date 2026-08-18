<script setup lang="ts">
import type { AcademicServicePanelContent } from '@/types/content';

defineProps<{
  content: AcademicServicePanelContent;
}>();

const stageClasses =
  "relative grid gap-[1.15rem] border-t border-b border-t-primary border-b-line p-[0.9rem] before:absolute before:-top-[0.22rem] before:left-[0.8rem] before:size-[0.38rem] before:rounded-full before:bg-primary before:shadow-[0_0_0.6rem_var(--primary)] before:content-['']";
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <div class="grid grid-cols-2 p-5 sm:grid-cols-4 sm:p-6 md:p-8 xl:p-10">
      <div
        v-for="(stage, index) in content.stages"
        :key="stage.number"
        :class="[
          stageClasses,
          index % 2 === 1 && 'border-l border-l-line',
          index > 0 && 'sm:border-l sm:border-l-line',
        ]"
        data-panel-item
      >
        <span class="font-mono text-[0.58rem] text-primary">{{ stage.number }}</span>
        <strong class="font-display text-base uppercase">{{ stage.title }}</strong>
        <small class="font-mono text-[0.55rem] leading-[1.45] text-muted">{{ stage.description }}</small>
      </div>
    </div>

    <dl class="m-0 px-4 pb-4">
      <div
        v-for="(framework, index) in content.frameworks"
        :key="framework.name"
        :class="['grid grid-cols-[5rem_1fr] gap-4 border border-line p-[0.8rem]', index > 0 && 'border-t-0']"
        data-panel-item
      >
        <dt class="font-display text-base font-bold text-primary-bright">{{ framework.name }}</dt>
        <dd class="m-0 text-[0.72rem] leading-6 text-muted">{{ framework.description }}</dd>
      </div>
    </dl>
  </SharedPanelFrame>
</template>
