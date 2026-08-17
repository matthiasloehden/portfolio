<script setup lang="ts">
import type { CaseStudyListItem } from '@/types/content';

defineProps<{
  id: string;
  titleId: string;
  label: string;
  title: string;
  titleLines?: string[];
  items: CaseStudyListItem[];
}>();

const revealDelayClasses = [
  '[--reveal-delay:0ms]',
  '[--reveal-delay:75ms]',
  '[--reveal-delay:150ms]',
  '[--reveal-delay:225ms]',
];
</script>

<template>
  <section
    :id="id"
    class="grid grid-cols-1 gap-12 border-t border-line py-24 sm:py-28 md:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] md:gap-16 md:py-32 xl:gap-32 xl:py-36"
    :aria-labelledby="titleId"
  >
    <div
      class="motion-hover"
      data-reveal="left"
    >
      <SharedSectionKicker :label="label" />
      <SharedDisplayHeading
        :id="titleId"
        size="overview"
      >
        <template v-if="titleLines">
          <template
            v-for="(line, index) in titleLines"
            :key="line"
          >
            {{ line }}<br v-if="index < titleLines.length - 1" />
          </template>
        </template>
        <template v-else>{{ title }}</template>
      </SharedDisplayHeading>
    </div>
    <ol class="m-0 list-none border-t border-line p-0">
      <li
        v-for="(item, index) in items"
        :key="item.href"
        :class="revealDelayClasses[index]"
        data-reveal="right"
      >
        <a
          class="grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-line py-[1.3rem] transition-[color,padding] duration-[160ms] hover:pl-2.5 hover:text-primary-bright focus-visible:pl-2.5 focus-visible:text-primary-bright sm:grid-cols-[2.5rem_1fr_minmax(7rem,0.45fr)_auto]"
          :href="item.href"
        >
          <span class="font-mono text-[0.6rem] text-primary">{{ item.number }}</span>
          <strong class="font-display text-[1.3rem] tracking-[-0.02em] uppercase">{{ item.title }}</strong>
          <small class="hidden font-mono text-[0.6rem] text-muted sm:block">{{ item.category }}</small>
          <i
            class="font-mono text-[0.6rem] text-primary not-italic"
            aria-hidden="true"
            >↓</i
          >
        </a>
      </li>
    </ol>
  </section>
</template>
