<script setup lang="ts">
import type { PageClosingContent } from '@/types/content';

type ClosingWidth = 'narrow' | 'wide';

withDefaults(
  defineProps<{
    id: string;
    content: PageClosingContent;
    width?: ClosingWidth;
  }>(),
  {
    width: 'wide',
  },
);

const titleWidthClasses: Record<ClosingWidth, string> = {
  narrow: 'max-w-[11ch]',
  wide: 'max-w-[13ch]',
};

const copyWidthClasses: Record<ClosingWidth, string> = {
  narrow: 'max-w-[34rem]',
  wide: 'max-w-[38rem]',
};
</script>

<template>
  <section
    class="border-t border-line py-28 text-left sm:py-32 sm:text-center md:py-40 lg:py-48"
    :aria-labelledby="`${id}-title`"
  >
    <SharedSectionKicker
      :prefix="content.kickerPrefix"
      :label="content.kicker"
      hide-prefix-from-screen-readers
    />
    <SharedDisplayHeading
      :id="`${id}-title`"
      :class="['motion-hover mx-0 sm:mx-auto', titleWidthClasses[width]]"
      size="closing"
      data-reveal="scale"
    >
      {{ content.title }}
    </SharedDisplayHeading>
    <p
      :class="['motion-hover mt-7 leading-[1.7] text-muted [--reveal-delay:100ms] sm:mx-auto', copyWidthClasses[width]]"
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
