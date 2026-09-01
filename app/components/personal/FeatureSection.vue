<script setup lang="ts">
import type { PersonalSectionContent } from '@/types/content';

defineProps<
  PersonalSectionContent & {
    reverse?: boolean;
  }
>();

const paragraphDelayClasses = ['[--reveal-delay:70ms]', '[--reveal-delay:135ms]'];
</script>

<template>
  <SharedCaseStudyLayout
    :id="id"
    :number="number"
    :category="category"
    :type="type"
    :title="title"
    :accent="accent"
    :reverse="reverse"
  >
    <template #copy>
      <p
        class="motion-hover text-[1.15rem] leading-[1.55] text-foreground first-letter:font-display first-letter:text-[3.4rem] first-letter:leading-[0.8] first-letter:font-bold first-letter:text-primary-bright xl:text-[1.4rem]"
        data-reveal="up"
      >
        {{ lead }}
      </p>
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="paragraph"
        :class="['motion-hover mt-7', paragraphDelayClasses[index]]"
        data-reveal="up"
      >
        {{ paragraph }}
      </p>
      <ul
        class="mt-9 flex list-none flex-wrap gap-2 p-0 [--reveal-delay:210ms]"
        :aria-label="$t('accessibility.relatedTopics')"
        data-reveal="up"
      >
        <li
          v-for="tag in tags"
          :key="tag"
          class="border border-line px-[0.6rem] py-[0.45rem] font-mono text-[0.6rem] text-foreground before:mr-[0.45rem] before:text-primary before:content-['/']"
        >
          {{ tag }}
        </li>
      </ul>
    </template>

    <template #panel>
      <slot />
    </template>
  </SharedCaseStudyLayout>
</template>
