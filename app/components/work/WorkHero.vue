<script setup lang="ts">
import type { WorkHeroContent } from '@/types/content';

defineProps<{
  content: WorkHeroContent;
}>();
</script>

<template>
  <section
    class="grid min-h-[calc(100svh-4.75rem)] grid-cols-1 items-start gap-y-12 pb-8 md:min-h-[min(53rem,calc(100svh-5.5rem))] md:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.65fr)] md:grid-rows-[1fr_auto] md:items-end md:gap-x-16 md:pt-24 lg:gap-x-24 lg:pt-28 xl:gap-x-36 "
    aria-labelledby="work-title"
  >
    <div class="motion-hover">
      <SharedSectionKicker
        :prefix="content.kickerPrefix"
        :label="content.kicker"
        hide-prefix-from-screen-readers
      />
      <SharedDisplayHeading
        id="work-title"
        level="h1"
        size="page"
        :aria-label="`${content.titleLines.join(' ')} ${content.titleAccent}`"
        data-reveal="left"
      >
        <template
          v-for="line in content.titleLines"
          :key="line"
        >
          {{ line }}<br />
        </template>
        <template #accent>{{ content.titleAccent }}</template>
      </SharedDisplayHeading>
    </div>

    <aside
      class="max-w-lg pb-2 [--reveal-delay:130ms] md:max-w-none"
      data-reveal="right"
    >
      <p class="motion-hover text-base leading-7 text-muted xl:text-[1.15rem] xl:leading-8">
        {{ content.introduction }}
      </p>
      <dl class="mt-9 border-t border-line">
        <div
          v-for="fact in content.facts"
          :key="fact.label"
          class="motion-hover flex justify-between gap-4 border-b border-line py-[0.7rem] font-mono text-[0.62rem]"
        >
          <dt class="text-quiet uppercase">{{ fact.label }}</dt>
          <dd class="m-0 text-right">{{ fact.value }}</dd>
        </div>
      </dl>
    </aside>

    <a
      class="scroll-cue inline-flex items-center gap-[0.7rem] font-mono text-[0.65rem] text-muted transition-colors duration-[160ms] [--reveal-delay:260ms] hover:text-foreground focus-visible:text-foreground"
      :href="content.scrollHref"
      data-reveal="up"
    >
      {{ content.scrollLabel }}
      <span
        class="text-primary"
        aria-hidden="true"
        >↓</span
      >
    </a>
  </section>
</template>
