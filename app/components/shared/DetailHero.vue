<script setup lang="ts">
import type { PageHeroContent } from '@/types/content';

const props = withDefaults(
  defineProps<{
    titleId: string;
    content: PageHeroContent;
    desktopAlignment?: 'start' | 'end';
  }>(),
  {
    desktopAlignment: 'end',
  },
);

const titleLabel = computed(() => props.content.titleLines.map((line) => `${line.text}${line.suffix ?? ''}`).join(' '));
</script>

<template>
  <section
    class="flex min-h-[calc(100svh-4.75rem)] flex-col justify-center pt-20 pb-8 md:min-h-[min(53rem,calc(100svh-5.5rem))] md:pt-24 lg:pt-28 xl:pt-32"
    :aria-labelledby="titleId"
  >
    <SharedSectionKicker
      :prefix="content.kickerPrefix"
      :label="content.kicker"
      hide-prefix-from-screen-readers
    />

    <div
      :class="[
        'grid grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.55fr)] md:gap-16 lg:gap-24 xl:gap-36',
        desktopAlignment === 'start' ? 'md:items-start' : 'md:items-end',
      ]"
    >
      <SharedDisplayHeading
        :id="titleId"
        level="h1"
        size="page"
        class="motion-hover"
        :lines="content.titleLines"
        :aria-label="titleLabel"
        data-reveal="left"
      />

      <div
        :class="['max-w-lg pb-2 [--reveal-delay:130ms] md:max-w-none', desktopAlignment === 'start' && 'md:pt-9']"
        data-reveal="right"
      >
        <p class="motion-hover text-base leading-7 text-muted xl:text-[1.15rem] xl:leading-8">
          {{ content.introduction }}
        </p>
        <SharedHeroFacts :facts="content.facts" />
      </div>
    </div>

    <SharedScrollCue
      class="mt-auto self-start pt-12"
      :href="content.scrollHref"
      :label="content.scrollLabel"
    />
  </section>
</template>
