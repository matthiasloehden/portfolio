<script setup lang="ts">
import type { WorkRetailPanelContent } from '@/types/content';

defineProps<{
  content: WorkRetailPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame
    class="work-panel bg-raised/95"
    v-bind="content.frame"
  >
    <div class="p-5 sm:p-6 md:p-8 xl:p-10">
      <div class="grid grid-cols-[1fr_auto] items-end gap-x-4 gap-y-[0.4rem] border-b border-line pb-4">
        <span class="col-span-full font-mono text-[0.58rem] text-primary">{{ content.code }}</span>
        <strong class="font-display text-base uppercase">{{ content.title }}</strong>
        <small class="flex items-center gap-[0.4rem] font-mono text-[0.54rem] leading-6 text-muted">
          <i
            class="size-[0.38rem] rounded-full bg-[#3cdc94] shadow-[0_0_0.65rem_rgb(60_220_148/75%)]"
            aria-hidden="true"
          />
          {{ content.status }}
        </small>
      </div>

      <div class="shop-fields mt-4 grid grid-cols-1 border border-line xs:grid-cols-2">
        <div
          v-for="(field, index) in content.fields"
          :key="field.label"
          :class="[
            'grid gap-[0.6rem] p-4',
            index > 0 && 'border-t border-line',
            index === 1 && 'xs:border-t-0 xs:border-l',
            index === 3 && 'xs:border-l',
          ]"
        >
          <small class="font-mono text-[0.54rem] leading-6 text-muted">{{ field.label }}</small>
          <strong class="font-display text-base uppercase">{{ field.value }}</strong>
        </div>
      </div>

      <div
        class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border border-line-strong p-[0.8rem] text-center font-mono text-[0.62rem] text-muted"
        :aria-label="content.sync.label"
      >
        <span>{{ content.sync.source }}</span>
        <i
          class="text-base text-primary not-italic"
          aria-hidden="true"
          >⇄</i
        >
        <strong class="text-primary-bright">{{ content.sync.target }}</strong>
      </div>
    </div>
  </SharedPanelFrame>
</template>
