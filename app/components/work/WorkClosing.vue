<script setup lang="ts">
import type { WorkClosingContent } from '@/types/content';

defineProps<{
  content: WorkClosingContent;
}>();
</script>

<template>
  <section
    class="border-t border-line py-28 text-left sm:py-32 sm:text-center md:py-40 lg:py-48"
    aria-labelledby="work-close-title"
  >
    <SharedSectionKicker
      :prefix="content.kickerPrefix"
      :label="content.kicker"
      hide-prefix-from-screen-readers
    />
    <SharedDisplayHeading
      id="work-close-title"
      class="motion-hover mx-0 max-w-[13ch] sm:mx-auto"
      size="closing"
      data-reveal="scale"
    >
      {{ content.title }}
    </SharedDisplayHeading>
    <p
      class="motion-hover mt-7 max-w-[38rem] leading-[1.7] text-muted [--reveal-delay:100ms] sm:mx-auto"
      data-reveal="up"
    >
      {{ content.description }}
    </p>
    <div
      class="mt-9 flex items-center justify-start gap-6 [--reveal-delay:180ms] sm:justify-center"
      data-reveal="up"
    >
      <SharedActionLink
        v-for="action in content.actions"
        :key="action.label"
        v-bind="action"
      />
    </div>
  </section>
</template>
