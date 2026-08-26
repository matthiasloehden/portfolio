<script setup lang="ts">
/**
 * Accessible disclosure primitive with a compact, content-aware transition.
 *
 * CSS grid animates from zero to the content's intrinsic height, so consumers
 * do not need to measure panels in JavaScript. The content fade starts shortly
 * after the panel begins opening, which keeps nested settings readable without
 * making the interaction feel slow. Reduced-motion preferences remove both
 * transitions while preserving the same button and region semantics.
 */

defineProps<{
  label: string;
  meta?: string;
  flush?: boolean;
}>();

const open = ref(false);
const triggerId = useId();
const panelId = useId();
</script>

<template>
  <section>
    <button
      class="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left font-mono text-[0.62rem] font-semibold text-foreground transition-colors"
      type="button"
      :id="triggerId"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <span class="flex min-w-0 items-baseline gap-2">
        <span class="whitespace-nowrap">{{ label }}</span>
        <span
          v-if="meta"
          class="truncate text-[0.54rem] font-normal text-muted"
        >
          {{ meta }}
        </span>
      </span>
      <svg
        class="size-3 shrink-0 stroke-current transition-transform duration-150 ease-out motion-reduce:transition-none"
        :class="open ? 'rotate-180' : undefined"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
      </svg>
    </button>

    <div
      :id="panelId"
      :class="[
        'grid overflow-hidden transition-[grid-template-rows] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      ]"
      role="region"
      :aria-labelledby="triggerId"
      :aria-hidden="!open"
      :inert="!open"
    >
      <div class="min-h-0 overflow-hidden">
        <div
          :class="[
            'transition-[opacity,transform] duration-100 ease-out motion-reduce:transition-none',
            flush ? undefined : 'pb-3',
            open
              ? 'translate-y-0 opacity-100 delay-[30ms] motion-reduce:delay-0'
              : '-translate-y-[0.2rem] opacity-0 delay-0',
          ]"
        >
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
