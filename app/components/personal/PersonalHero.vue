<script setup lang="ts">
import type { PersonalHeroContent } from '@/types/content';

defineProps<{
  content: PersonalHeroContent;
}>();
</script>

<template>
  <section
    class="flex min-h-[calc(100svh-4.75rem)] flex-col justify-center pt-20 pb-8 md:min-h-[min(53rem,calc(100svh-5.5rem))] md:pt-24 lg:pt-28 xl:pt-32"
    aria-labelledby="personal-title"
  >
    <SharedSectionKicker
      :prefix="content.kickerPrefix"
      :label="content.kicker"
      hide-prefix-from-screen-readers
    />

    <div
      class="grid grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.55fr)] md:gap-16 lg:gap-24 xl:gap-36"
    >
      <SharedDisplayHeading
        id="personal-title"
        level="h1"
        size="page"
        class="motion-hover"
        :aria-label="`${content.title} ${content.titleAccent}`"
        data-reveal="left"
      >
        {{ content.title }}<br />
        <template #accent>{{ content.titleAccent }}</template>
      </SharedDisplayHeading>

      <div
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
            <dd class="m-0 text-right text-foreground">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <a
      class="scroll-cue mt-auto inline-flex items-center self-start pt-12 font-mono text-[0.65rem] text-muted transition-colors duration-[160ms] [--reveal-delay:260ms] hover:text-foreground focus-visible:text-foreground"
      :href="content.scrollHref"
      data-reveal="up"
    >
      {{ content.scrollLabel }}
      <span
        class="ml-[0.7rem] text-primary"
        aria-hidden="true"
        >↓</span
      >
    </a>
  </section>
</template>
