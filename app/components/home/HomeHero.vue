<script setup lang="ts">
import type { HomeHeroContent } from '@/types/content';

defineProps<{
  content: HomeHeroContent;
}>();
</script>

<template>
  <section
    class="pt-20 md:min-h-[min(54rem,calc(100svh-5.5rem))] md:pt-24 lg:pt-28 xl:pt-[8.5rem]"
    aria-labelledby="hero-title"
  >
    <div
      class="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-16 xl:gap-32"
    >
      <div class="motion-hover">
        <SharedSectionKicker
          :label="content.kicker"
          variant="status"
        />
        <SharedDisplayHeading
          id="hero-title"
          level="h1"
          size="hero"
          class="[--reveal-delay:75ms]"
          data-reveal="up"
        >
          {{ content.title }}
          <template #accent> {{ content.titleAccent }}</template>
        </SharedDisplayHeading>
        <div
          class="mt-9 max-w-[38rem] space-y-4 text-base leading-7 text-muted [--reveal-delay:150ms] lg:text-[1.15rem] lg:leading-8"
          data-reveal="up"
        >
          <p
            v-for="paragraph in content.introduction"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
        <div
          class="mt-9 flex flex-col items-start gap-6 [--reveal-delay:200ms] xs:flex-row xs:flex-wrap xs:items-center"
          data-reveal="up"
        >
          <SharedActionLink
            v-for="action in content.actions"
            :key="action.label"
            v-bind="action"
          />
        </div>
      </div>

      <div
        class="[--reveal-delay:200ms]"
        data-reveal="right"
      >
        <HomeDeveloperProfileCard :profile="content.profile" />
      </div>
    </div>

    <HomeHighlights :items="content.highlights" />
  </section>
</template>
