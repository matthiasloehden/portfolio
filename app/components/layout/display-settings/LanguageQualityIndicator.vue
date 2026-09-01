<script setup lang="ts">
import type { LocaleTranslationQuality } from '@/config/locales';
import SharedTooltip from '@/components/shared/Tooltip.vue';

defineProps<{
  quality: LocaleTranslationQuality;
  label: string;
}>();
</script>

<template>
  <SharedTooltip
    v-if="quality !== 'reviewed'"
    class="shrink-0"
    :text="label"
    active
  >
    <template #default="{ describedBy }">
      <span
        class="inline-grid size-5 place-items-center text-primary-bright"
        role="img"
        :aria-label="label"
        :aria-describedby="describedBy"
      >
        <svg
          v-if="quality === 'recommended'"
          class="size-4 fill-none stroke-current [stroke-width:1.2] [stroke-linecap:round] [stroke-linejoin:round]"
          viewBox="0 0 18 18"
          aria-hidden="true"
        >
          <path d="m3 6 2.5 2L9 3l3.5 5L15 6l-1 7H4L3 6Z" />
          <path d="M4.25 15h9.5" />
        </svg>
        <svg
          v-else
          class="size-4 fill-none stroke-current [stroke-width:1.7] [stroke-linecap:round] [stroke-linejoin:round]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      </span>
    </template>
  </SharedTooltip>
</template>
