<script setup lang="ts">
import type { HomeCapabilitiesContent } from '@/types/content';

defineProps<{
  content: HomeCapabilitiesContent;
}>();

const revealDelayClasses = ['', '[--reveal-delay:75ms]', '[--reveal-delay:150ms]'];
</script>

<template>
  <section
    id="capabilities"
    class="border-t border-line py-24 sm:py-28 md:py-32 xl:py-40"
    aria-labelledby="capabilities-title"
  >
    <SharedSectionKicker
      :prefix="content.number"
      :label="content.label"
      variant="line"
    />
    <div class="grid items-end gap-12 md:grid-cols-[minmax(0,1fr)_minmax(18rem,27rem)] md:justify-between">
      <SharedDisplayHeading
        id="capabilities-title"
        class="motion-hover"
        data-reveal="left"
      >
        {{ content.title }}<br />
        <template #accent>{{ content.titleAccent }}</template>
      </SharedDisplayHeading>
      <p
        class="motion-hover border-l border-primary pl-5 text-[0.88rem] leading-[1.7] text-muted [--reveal-delay:100ms]"
        data-reveal="right"
      >
        {{ content.introduction }}
      </p>
    </div>

    <div class="mt-16 grid grid-cols-1 border-y border-line md:grid-cols-3">
      <NuxtLink
        v-for="(capability, index) in content.items"
        :key="capability.title"
        :to="capability.to"
        class="group border-t border-line first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0"
        :aria-label="`View ${capability.title} section`"
      >
        <HomeCapabilityCard
          v-bind="capability"
          :class="revealDelayClasses[index]"
        />
      </NuxtLink>
    </div>
  </section>
</template>
