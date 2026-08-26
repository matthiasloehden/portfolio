<script setup lang="ts">
import type { HomeAboutContent } from '@/types/content';

defineProps<{
  content: HomeAboutContent;
}>();

const revealDelayClasses = ['', '[--reveal-delay:100ms]'];
</script>

<template>
  <section
    id="about"
    class="grid grid-cols-1 gap-16 border-t border-line py-24 sm:py-28 md:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.7fr)] md:py-32 lg:gap-24 xl:gap-40 xl:py-40"
    aria-labelledby="about-title"
  >
    <div
      class="motion-hover"
      data-reveal="left"
    >
      <SharedSectionKicker
        :prefix="content.number"
        :label="content.label"
        variant="line"
        :reveal="false"
      />
      <SharedDisplayHeading
        id="about-title"
        :lines="content.titleLines"
      />
    </div>
    <div class="grid content-center gap-6 text-base leading-[1.8] text-muted sm:text-[1.06rem] lg:text-[1.12rem]">
      <p
        v-for="(paragraph, index) in content.paragraphs"
        :key="paragraph"
        class="motion-hover"
        :class="[
          index === 0 &&
            'first-letter:font-display first-letter:text-[3.4rem] first-letter:leading-[0.8] first-letter:font-bold first-letter:text-primary-bright',
          revealDelayClasses[index],
        ]"
        data-reveal="right"
      >
        {{ paragraph }}
      </p>
      <div
        class="mt-2 flex flex-wrap gap-2 [--reveal-delay:150ms]"
        data-reveal="up"
        aria-label="Development principles"
      >
        <span
          v-for="principle in content.principles"
          :key="principle"
          class="border border-line px-[0.6rem] py-[0.45rem] font-mono text-[0.62rem] text-foreground before:mr-[0.45rem] before:text-primary before:content-['/']"
        >
          {{ principle }}
        </span>
      </div>
    </div>
  </section>
</template>
