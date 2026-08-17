<script setup lang="ts">
import type { Capability } from '@/types/content';

defineProps<Capability>();
</script>

<template>
  <article
    class="relative flex min-h-56 flex-col overflow-hidden bg-[linear-gradient(135deg,var(--surface),transparent_70%)] p-[1.35rem] transition-[background-color,transform] duration-200 group-hover:-translate-y-1.5 group-hover:bg-surface-hover after:pointer-events-none after:absolute after:right-[-3rem] after:bottom-[-5rem] after:size-40 after:scale-65 after:rounded-full after:border after:border-line-strong after:opacity-0 after:transition-[opacity,transform] after:duration-300 after:content-[''] group-hover:after:scale-100 group-hover:after:opacity-65 md:min-h-72"
    data-reveal="up"
  >
    <div class="flex justify-between font-mono text-[0.6rem] tracking-[0.04em] text-muted uppercase">
      <span class="text-primary">{{ number }}</span
      ><span>{{ layer }}</span>
    </div>
    <div class="mt-auto pt-15 pb-2">
      <SharedDisplayHeading
        level="h3"
        size="card"
      >
        {{ title }}
      </SharedDisplayHeading>
      <p class="mt-5 flex flex-wrap items-center gap-[0.55rem] pr-6 font-mono text-[0.66rem] leading-[1.6] text-muted">
        <template
          v-for="(skill, index) in skills"
          :key="skill"
        >
          <i
            v-if="index > 0"
            class="size-[0.2rem] rounded-full bg-primary"
            aria-hidden="true"
          />
          {{ skill }}
        </template>
      </p>
    </div>
    <span
      class="absolute right-[1.35rem] bottom-[1.35rem] font-mono text-[0.8rem] text-quiet transition-[color,transform] duration-200 group-hover:translate-x-[0.15rem] group-hover:-translate-y-[0.15rem] group-hover:text-primary-bright"
      aria-hidden="true"
    >
      ↗
    </span>
  </article>
</template>
