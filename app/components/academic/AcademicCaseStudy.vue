<script setup lang="ts">
import type { AcademicCaseStudyContent } from '@/types/content';

defineProps<
  AcademicCaseStudyContent & {
    reverse?: boolean;
  }
>();

const noteDelayClasses = ['[--reveal-delay:120ms]', '[--reveal-delay:185ms]'];
</script>

<template>
  <SharedCaseStudyLayout
    :id="id"
    :number="number"
    :category="category"
    :type="type"
    :title-lines="titleLines"
    :reverse="reverse"
  >
    <template #copy>
      <p
        class="motion-hover text-[1.15rem] leading-[1.55] text-foreground xl:text-[1.4rem]"
        data-reveal="up"
      >
        {{ lead }}
      </p>
      <p
        class="motion-hover mt-[1.4rem] [--reveal-delay:70ms]"
        data-reveal="up"
      >
        {{ description }}
      </p>

      <div class="mt-10 grid gap-5">
        <section
          v-for="(note, index) in notes"
          :key="note.title"
          :class="['motion-hover border-t border-l border-t-line border-l-primary pt-4 pl-4', noteDelayClasses[index]]"
          data-reveal="up"
        >
          <h3 class="font-mono text-[0.62rem] tracking-[0.06em] text-primary-bright uppercase">
            {{ note.title }}
          </h3>
          <p class="mt-[0.55rem] text-[0.82rem] leading-[1.65]">{{ note.text }}</p>
        </section>
      </div>
    </template>

    <template #panel>
      <slot />
    </template>
  </SharedCaseStudyLayout>
</template>
