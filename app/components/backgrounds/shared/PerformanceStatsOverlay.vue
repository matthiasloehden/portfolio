<script setup lang="ts">
import type { BackgroundPerformanceStats } from '@/types/background';

defineProps<{
  enabled: boolean;
  stats: BackgroundPerformanceStats | null;
}>();
</script>

<template>
  <aside
    v-if="enabled"
    class="pointer-events-none fixed right-3 bottom-3 z-40 w-60 border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] p-[0.8rem] font-mono text-[0.58rem] text-foreground backdrop-blur-xl"
    aria-live="off"
  >
    <strong class="mb-[0.65rem] block text-[0.62rem] text-primary-bright uppercase">
      {{ stats?.name ?? 'Background performance' }}
    </strong>

    <dl
      v-if="stats"
      class="m-0 grid grid-cols-2 gap-x-[0.7rem] gap-y-[0.3rem] [&_dd]:m-0 [&_dd]:text-right [&_dd]:capitalize [&_dt]:text-muted [&_dt]:capitalize"
    >
      <dt>Renderer</dt>
      <dd>{{ stats.renderer }}</dd>
      <dt>Mode</dt>
      <dd>{{ stats.mode }}</dd>
      <dt>Preset</dt>
      <dd>{{ stats.preset }}</dd>
      <dt>FPS</dt>
      <dd>{{ stats.fps.toFixed(0) }}</dd>
      <dt>Frame time</dt>
      <dd>{{ stats.frameTime.toFixed(1) }} ms</dd>
      <dt>Resolution</dt>
      <dd>{{ stats.resolution }}</dd>
      <dt>DPR</dt>
      <dd>{{ stats.dpr.toFixed(2) }}</dd>

      <template
        v-for="(value, label) in stats.details"
        :key="label"
      >
        <dt>{{ label }}</dt>
        <dd>{{ value }}</dd>
      </template>
    </dl>

    <span
      v-else
      class="text-muted"
    >
      Collecting diagnostics…
    </span>
  </aside>
</template>
