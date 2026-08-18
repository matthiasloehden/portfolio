<script setup lang="ts">
import type { WorkHeroContent } from '@/types/content';

const props = defineProps<{
  content: WorkHeroContent;
}>();

const titleLabel = computed(() => props.content.titleLines.map((line) => `${line.text}${line.suffix ?? ''}`).join(' '));
</script>

<template>
  <section
    class="grid min-h-[calc(100svh-4.75rem)] grid-cols-1 items-start gap-y-12 pb-8 md:min-h-[min(53rem,calc(100svh-5.5rem))] md:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.65fr)] md:grid-rows-[1fr_auto] md:items-end md:gap-x-16 md:pt-24 lg:gap-x-24 lg:pt-28 xl:gap-x-36"
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
        :lines="content.titleLines"
        :aria-label="titleLabel"
        data-reveal="left"
      />
    </div>

    <aside
      class="max-w-lg pb-2 [--reveal-delay:130ms] md:max-w-none"
      data-reveal="right"
    >
      <p class="motion-hover text-base leading-7 text-muted xl:text-[1.15rem] xl:leading-8">
        {{ content.introduction }}
      </p>
      <SharedHeroFacts :facts="content.facts" />
    </aside>

    <SharedScrollCue
      :href="content.scrollHref"
      :label="content.scrollLabel"
    />
  </section>
</template>
