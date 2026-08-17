<script setup lang="ts">
import type { PersonalContributionPanelContent } from '@/types/content';

defineProps<{
  content: PersonalContributionPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <ol
      class="m-0 grid list-none p-4 sm:p-5 md:p-6 xl:p-7"
      :aria-label="content.ariaLabel"
    >
      <li
        v-for="(contribution, index) in content.items"
        :key="contribution.title"
        class="relative border border-line bg-[linear-gradient(110deg,var(--surface),transparent)] px-[1.2rem] pt-[1.15rem] pb-[1.3rem] [&+&]:mt-3"
      >
        <div class="flex items-center justify-between font-mono text-[0.58rem] text-primary">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <small class="inline-flex items-center gap-[0.4rem] text-[inherit] text-muted uppercase">
            <i
              class="size-[0.35rem] animate-[status-pulse_2.2s_ease-in-out_infinite] rounded-full bg-primary shadow-[0_0_0.6rem_var(--primary)]"
              aria-hidden="true"
            />
            {{ contribution.status }}
          </small>
        </div>
        <p class="mt-[1.1rem] font-mono text-[0.58rem] text-quiet uppercase">{{ contribution.category }}</p>
        <SharedDisplayHeading
          level="h3"
          size="panel"
          class="mt-1"
        >
          {{ contribution.title }}
        </SharedDisplayHeading>
        <p class="mt-[0.65rem] max-w-[43rem] text-[0.76rem] leading-[1.65] text-muted">
          {{ contribution.description }}
        </p>
      </li>
    </ol>
  </SharedPanelFrame>
</template>
