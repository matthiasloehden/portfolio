<script setup lang="ts">
import type { HomeHighlight } from '@/types/content';

defineProps<{
  items: HomeHighlight[];
}>();

const revealDelayClasses = ['', '[--reveal-delay:75ms]', '[--reveal-delay:200ms]'];
</script>

<template>
  <dl
    class="mt-20 grid grid-cols-1 border-y border-line p-0 md:mt-24 md:grid-cols-3 lg:mt-28 xl:mt-32"
    aria-label="Career highlights"
  >
    <div
      v-for="(item, index) in items"
      :key="item.number"
      class="motion-hover py-[1.1rem] md:px-[1.4rem] md:py-[1.2rem] md:first:pl-0 md:[&+div]:border-l md:[&+div]:border-line"
      :class="[index > 0 && 'border-t border-line md:border-t-0', revealDelayClasses[index]]"
      data-reveal="up"
    >
      <dt class="font-display text-[0.86rem] font-bold tracking-[0.025em] uppercase">
        <span
          class="mr-[0.55rem] font-mono text-[0.62rem] text-primary"
          aria-hidden="true"
        >
          {{ item.number }}
        </span>
        {{ item.title }}
      </dt>
      <dd class="mt-1.5 ml-[1.9rem] text-[0.73rem] leading-[1.45] text-muted">
        {{ item.description }}
      </dd>
    </div>
  </dl>
</template>
