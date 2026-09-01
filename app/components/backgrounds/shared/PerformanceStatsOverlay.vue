<script setup lang="ts">
import type { BackgroundPerformanceStats } from '@/types/background';

const props = defineProps<{
  enabled: boolean;
  stats: BackgroundPerformanceStats | null;
}>();
const { t } = useI18n();

const nameKeys: Readonly<Record<string, string>> = {
  'Wave Grid': 'wave',
  'Particle field': 'particles',
  'Triangle field': 'triangles',
  'Living Mesh': 'mesh',
};

const detailKeys: Readonly<Record<string, string>> = {
  'Trail points': 'trailPoints',
  'Vertex step': 'vertexStep',
  Particles: 'particles',
  'Pointer speed': 'pointerSpeed',
  'Click pull': 'clickPull',
  'Scroll velocity': 'scrollVelocity',
  Triangles: 'triangles',
  Rotation: 'rotation',
  Points: 'points',
  Edges: 'edges',
  'Buffered rows': 'bufferedRows',
  'Pointer wake': 'pointerWake',
};

const name = computed(() => {
  const sourceName = props.stats?.name;
  if (!sourceName) return t('diagnostics.backgroundPerformance');

  const key = nameKeys[sourceName];
  return key ? t(`diagnostics.names.${key}`) : sourceName;
});

function getDetailLabel(label: string): string {
  const key = detailKeys[label];
  return key ? t(`diagnostics.details.${key}`) : label;
}
</script>

<template>
  <aside
    v-if="enabled"
    class="pointer-events-none fixed right-3 bottom-3 z-40 w-60 border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] p-[0.8rem] font-mono text-[0.58rem] text-foreground backdrop-blur-xl"
    aria-live="off"
  >
    <strong class="mb-[0.65rem] block text-[0.62rem] text-primary-bright uppercase">
      {{ name }}
    </strong>

    <dl
      v-if="stats"
      class="m-0 grid grid-cols-2 gap-x-[0.7rem] gap-y-[0.3rem] [&_dd]:m-0 [&_dd]:text-right [&_dd]:capitalize [&_dt]:text-muted [&_dt]:capitalize"
    >
      <dt>{{ $t('diagnostics.renderer') }}</dt>
      <dd>{{ stats.renderer }}</dd>
      <dt>{{ $t('diagnostics.mode') }}</dt>
      <dd>{{ $t(`display.shared.${stats.mode}`) }}</dd>
      <dt>{{ $t('diagnostics.preset') }}</dt>
      <dd>{{ $t(`display.shared.${stats.preset}`) }}</dd>
      <dt>{{ $t('diagnostics.fps') }}</dt>
      <dd>{{ stats.fps.toFixed(0) }}</dd>
      <dt>{{ $t('diagnostics.frameTime') }}</dt>
      <dd>{{ stats.frameTime.toFixed(1) }} ms</dd>
      <dt>{{ $t('diagnostics.resolution') }}</dt>
      <dd>{{ stats.resolution }}</dd>
      <dt>{{ $t('diagnostics.dpr') }}</dt>
      <dd>{{ stats.dpr.toFixed(2) }}</dd>

      <template
        v-for="(value, label) in stats.details"
        :key="label"
      >
        <dt>{{ getDetailLabel(label) }}</dt>
        <dd>{{ value }}</dd>
      </template>
    </dl>

    <span
      v-else
      class="text-muted"
    >
      {{ $t('diagnostics.collecting') }}
    </span>
  </aside>
</template>
