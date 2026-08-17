<script setup lang="ts">
import type { WorkCaseStudyContent } from '@/types/content';

defineProps<
  WorkCaseStudyContent & {
    reverse?: boolean;
  }
>();

const paragraphDelayClasses = ['[--reveal-delay:0ms]', '[--reveal-delay:70ms]'];
const factDelayClasses = ['[--reveal-delay:0ms]', '[--reveal-delay:55ms]', '[--reveal-delay:110ms]'];
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
        >
          {{ title }}
        </SharedDisplayHeading>
        <p class="mt-5 max-w-2xl text-base leading-[1.7] text-muted xl:text-[1.12rem]">
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
        <p
          v-for="(paragraph, index) in paragraphs"
          :key="paragraph"
          :class="[
            'motion-hover',
            paragraphDelayClasses[index],
            index === 0 ? 'text-[1.12rem] leading-[1.6] text-foreground xl:text-[1.34rem]' : 'mt-[1.4rem]',
          ]"
          data-reveal="up"
        >
          {{ paragraph }}
        </p>
        <dl class="mt-10 border-t border-line">
          <div
            v-for="(fact, index) in facts"
            :key="fact.label"
            :class="[
              'motion-hover grid grid-cols-1 gap-1 border-b border-line py-3 font-mono text-[0.62rem] xs:grid-cols-[8.5rem_1fr] xs:gap-4',
              factDelayClasses[index],
            ]"
            data-reveal="up"
          >
            <dt class="text-primary-bright uppercase">{{ fact.label }}</dt>
            <dd class="m-0">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>

      <div :class="reverse && 'md:col-start-1 md:row-start-1'">
        <slot />
      </div>
    </div>
  </article>
</template>
