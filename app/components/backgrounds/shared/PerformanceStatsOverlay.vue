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
    class="background-performance-stats"
    aria-live="off"
  >
    <strong>{{ stats?.name ?? 'Background performance' }}</strong>

    <dl v-if="stats">
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
      class="background-performance-stats-pending"
    >
      Collecting diagnostics…
    </span>
  </aside>
</template>

<style scoped>
.background-performance-stats {
  position: fixed;
  z-index: 40;
  right: 0.75rem;
  bottom: 0.75rem;

  width: 15rem;
  padding: 0.8rem;

  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);

  background: color-mix(in srgb, var(--background) 92%, transparent);
  color: var(--text);

  font-family: var(--mono-font);
  font-size: 0.58rem;

  pointer-events: none;
  backdrop-filter: blur(12px);
}

.background-performance-stats strong {
  display: block;

  margin-bottom: 0.65rem;

  color: var(--accent-bright);

  font-size: 0.62rem;
  text-transform: uppercase;
}

.background-performance-stats dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem 0.7rem;

  margin: 0;
}

.background-performance-stats dt {
  color: var(--muted);
  text-transform: capitalize;
}

.background-performance-stats dd {
  margin: 0;
  text-align: right;
  text-transform: capitalize;
}

.background-performance-stats-pending {
  color: var(--muted);
}
</style>
