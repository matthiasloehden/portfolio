<script setup lang="ts">
import type { WorkContextContent } from '@/types/content';

defineProps<{
  content: WorkContextContent;
}>();
</script>

<template>
  <section
    class="grid grid-cols-1 gap-12 border-t border-line py-20 md:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] md:gap-16 md:py-24 lg:gap-24 lg:py-28 xl:gap-32 xl:py-32"
    aria-labelledby="work-context-title"
  >
    <div
      class="motion-hover"
      data-reveal="left"
    >
      <SharedSectionKicker :label="content.kicker" />
      <SharedDisplayHeading
        id="work-context-title"
        size="overview"
      >
        {{ content.title }}
      </SharedDisplayHeading>

      <div class="mt-8 flex flex-col gap-2">
        <ul
          v-for="(items, category) in content.stack"
          :key="category"
          class="flex list-none flex-wrap gap-[0.55rem] p-0"
          :aria-label="category"
        >
          <li
            v-for="item in items"
            :key="item"
            class="border border-line px-[0.7rem] py-2 font-mono text-[0.62rem] text-muted"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div
      class="self-end [--reveal-delay:100ms]"
      data-reveal="right"
    >
      <h3 class="font-mono text-[0.62rem] tracking-[0.06em] text-primary-bright uppercase">
        {{ content.highlightsLabel }}
      </h3>
      <ul class="mt-4 list-none border-t border-line p-0">
        <li
          v-for="highlight in content.highlights"
          :key="highlight"
          class="motion-hover border-b border-line py-[0.8rem] leading-[1.55] text-muted"
        >
          {{ highlight }}
        </li>
      </ul>
    </div>
  </section>
</template>
