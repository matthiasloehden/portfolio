<script setup lang="ts">
import type { AcademicStreamingPanelContent } from '@/types/content';

defineProps<{
  content: AcademicStreamingPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <div
      class="grid grid-cols-1 items-center gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:p-6 md:p-8 xl:p-10"
      :aria-label="content.ariaLabel"
    >
      <template
        v-for="(node, index) in content.nodes"
        :key="node.name"
      >
        <i
          v-if="index > 0"
          class="flex items-center justify-center font-mono text-primary not-italic max-sm:rotate-90"
          :class="index === 3 ? 'sm:col-start-2' : ''"
          aria-hidden="true"
          >→</i
        >
        <div
          class="grid min-h-[7.2rem] min-w-0 content-between border border-line bg-surface p-3"
          data-panel-item
        >
          <span class="font-mono text-[0.58rem] text-primary">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <strong class="font-display text-base font-bold uppercase">{{ node.name }}</strong>
          <small class="font-mono text-[0.55rem] leading-[1.45] text-muted">{{ node.description }}</small>
        </div>
      </template>
    </div>

    <div
      class="flex flex-wrap gap-[0.45rem] border-t border-line px-4 py-[0.9rem]"
      :aria-label="$t('accessibility.technologiesUsed')"
    >
      <span
        v-for="node in content.nodes"
        :key="node.name"
        class="border border-line px-2 py-1 font-mono text-[0.55rem] text-muted"
      >
        {{ node.name }}
      </span>
    </div>
  </SharedPanelFrame>
</template>
