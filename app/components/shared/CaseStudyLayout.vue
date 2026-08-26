<script setup lang="ts">
import type { DisplayHeadingLine } from '@/types/content';

defineProps<{
  id: string;
  number: string;
  category: string;
  type: string;
  titleLines: DisplayHeadingLine[];
  summary?: string;
  reverse?: boolean;
}>();
</script>

<template>
  <article
    :id="id"
    class="scroll-mt-4 border-t border-line py-24 sm:py-28 md:py-32 xl:py-40"
    :aria-labelledby="`${id}-title`"
  >
    <header
      class="grid grid-cols-1 gap-6 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-12 xl:grid-cols-[7rem_minmax(0,1fr)] xl:gap-16"
    >
      <span
        class="font-display text-[2.8rem] leading-[0.8] font-bold text-primary [text-shadow:0_0_2rem_rgb(50_132_255/25%)] sm:text-5xl md:text-7xl xl:text-[5.5rem]"
        aria-hidden="true"
        data-reveal="left"
      >
        {{ number }}
      </span>
      <div
        class="motion-hover [--reveal-delay:80ms]"
        data-reveal="up"
      >
        <SharedSectionKicker
          :prefix="category"
          :label="type"
        />
        <SharedDisplayHeading
          :id="`${id}-title`"
          size="case"
          :lines="titleLines"
        />
        <p
          v-if="summary"
          class="mt-5 max-w-2xl text-base leading-[1.7] text-muted xl:text-[1.12rem]"
        >
          {{ summary }}
        </p>
      </div>
    </header>

    <div
      :class="[
        'mt-16 grid grid-cols-1 items-center gap-14 md:mt-20 md:gap-16 lg:gap-24 xl:mt-28 xl:gap-36',
        reverse
          ? 'md:grid-cols-[minmax(0,1.28fr)_minmax(18rem,0.72fr)]'
          : 'md:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]',
      ]"
    >
      <div :class="['text-[0.95rem] leading-[1.8] text-muted', reverse && 'md:col-start-2']">
        <slot name="copy" />
      </div>

      <div :class="reverse && 'md:col-start-1 md:row-start-1'">
        <slot name="panel" />
      </div>
    </div>
  </article>
</template>
