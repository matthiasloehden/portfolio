<script setup lang="ts">
import type { WorkSignagePanelContent } from '@/types/content';

defineProps<{
  content: WorkSignagePanelContent;
}>();

const nodeClasses = 'grid gap-[0.35rem] border border-line bg-surface px-4 py-[0.8rem]';
</script>

<template>
  <SharedPanelFrame
    class="bg-raised/95"
    v-bind="content.frame"
  >
    <div class="grid justify-items-center p-5 sm:p-6 md:p-8 xl:p-10">
      <div
        :class="['w-[min(100%,15rem)]', nodeClasses]"
        data-panel-item
      >
        <small class="font-mono text-[0.54rem] leading-[1.45] text-muted">{{ content.remote.label }}</small>
        <strong class="font-display text-base uppercase">{{ content.remote.title }}</strong>
      </div>

      <i
        class="py-2 font-mono text-[0.7rem] text-primary not-italic"
        aria-hidden="true"
        >↓</i
      >

      <div
        class="grid w-full grid-cols-1 items-center gap-[0.8rem] border border-line-strong p-[0.8rem] sm:grid-cols-[1fr_auto_1fr]"
      >
        <template
          v-for="(node, index) in content.player"
          :key="node.title"
        >
          <span
            v-if="index > 0"
            class="text-center text-primary max-sm:rotate-90"
            aria-hidden="true"
            >↕</span
          >
          <div
            :class="nodeClasses"
            data-panel-item
          >
            <small class="font-mono text-[0.54rem] leading-[1.45] text-muted">{{ node.label }}</small>
            <strong class="font-display text-base uppercase">{{ node.title }}</strong>
          </div>
        </template>
      </div>

      <div class="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <span
          v-for="output in content.outputs"
          :key="output.title"
          :class="nodeClasses"
          data-panel-item
        >
          <i class="font-mono text-[0.55rem] text-primary not-italic">{{ output.connection }}</i>
          <strong class="font-display text-base uppercase">{{ output.title }}</strong>
          <small class="font-mono text-[0.54rem] leading-[1.45] text-muted">{{ output.description }}</small>
        </span>
      </div>
    </div>
  </SharedPanelFrame>
</template>
