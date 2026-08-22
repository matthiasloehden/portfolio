<script setup lang="ts">
import type { WorkCaseStudyContent } from '@/types/content';

defineProps<
  WorkCaseStudyContent & {
    reverse?: boolean;
  }
>();

const paragraphDelayClasses = ['[--reveal-delay:0ms]', '[--reveal-delay:70ms]', '[--reveal-delay:140ms]'];
const factDelayClasses = ['[--reveal-delay:0ms]', '[--reveal-delay:55ms]', '[--reveal-delay:110ms]'];
</script>

<template>
  <SharedCaseStudyLayout
    :id="id"
    :number="number"
    :category="category"
    :type="type"
    :title="title"
    :summary="summary"
    :reverse="reverse"
  >
    <template #copy>
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
    </template>

    <template #panel>
      <slot />
    </template>
  </SharedCaseStudyLayout>
</template>
