<script setup lang="ts">
import type { AcademicEngineeringPanelContent } from '@/types/content';

defineProps<{
  content: AcademicEngineeringPanelContent;
}>();
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <SharedAppPreview
      :navigation="content.navigation"
      :aria-label="content.ariaLabel"
    >
      <div class="grid content-start gap-4">
        <header class="border-b border-line pb-2">
          <h3 class="font-display text-lg uppercase sm:text-xl">Learning progress overview</h3>
        </header>

        <dl class="grid grid-cols-3 gap-2">
          <div
            v-for="metric in content.metrics"
            :key="metric.label"
            class="grid min-h-20 content-between border border-line bg-surface p-2.5"
            data-panel-item
          >
            <dt class="font-mono text-[0.48rem] leading-[1.35] text-muted">{{ metric.label }}</dt>
            <dd class="m-0 font-display text-xl">{{ metric.value }}</dd>
          </div>
        </dl>

        <div class="grid gap-3 md:grid-cols-2">
          <section class="border border-line bg-surface p-3">
            <span class="font-mono text-[0.5rem] text-primary uppercase">Active learning goals</span>
            <div
              v-for="goal in content.goals"
              :key="goal.title"
              class="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2"
              data-panel-item
            >
              <strong class="min-w-0 truncate text-[0.68rem]">{{ goal.title }}</strong>
              <small class="shrink-0 font-mono text-[0.45rem] text-muted">{{ goal.status }}</small>
            </div>
          </section>

          <section class="border border-line bg-surface p-3">
            <span class="font-mono text-[0.5rem] text-primary uppercase">Planned blocks</span>
            <div
              v-for="item in content.schedule"
              :key="`${item.date}-${item.title}`"
              class="mt-2 grid grid-cols-[2.5rem_1fr] gap-2 border-t border-line pt-2"
              data-panel-item
            >
              <span class="font-mono text-[0.48rem] text-primary">{{ item.date }}</span>
              <strong class="truncate text-[0.62rem]">{{ item.title }}</strong>
            </div>
          </section>
        </div>
      </div>
    </SharedAppPreview>

    <dl class="grid border-t border-line sm:grid-cols-3">
      <div
        v-for="(fact, index) in content.facts"
        :key="fact.label"
        :class="['grid gap-1 p-3', index > 0 && 'border-t border-line sm:border-t-0 sm:border-l']"
        data-panel-item
      >
        <dt class="font-mono text-[0.5rem] text-primary uppercase">{{ fact.label }}</dt>
        <dd class="m-0 text-[0.65rem] leading-5">{{ fact.value }}</dd>
      </div>
    </dl>

    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
      <SharedStatusIndicator :label="content.status" />
      <a
        :href="content.demo.href"
        target="_blank"
        rel="noreferrer"
        class="font-mono text-[0.58rem] text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary-bright"
      >
        {{ content.demo.label }} ↗
      </a>
    </div>
  </SharedPanelFrame>
</template>
