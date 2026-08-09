<script setup lang="ts">
type Node = { name: string; desc: string };

const nodes: Node[] = [
  { name: 'Producers', desc: 'Event source' },
  { name: 'Kafka', desc: 'Transport' },
  { name: 'Flink', desc: 'Processing' },
  { name: 'ClickHouse', desc: 'Analytics' },
  { name: 'Grafana', desc: 'Visibility' },
];
</script>

<template>
  <SharedPanelFrame
    title="pipeline.flow"
    meta="event → insight"
  >
    <div
      class="grid grid-cols-1 items-center gap-3 p-[clamp(1.25rem,4vw,2.5rem)] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]"
      aria-label="Data flows from producers through Kafka and Flink into ClickHouse and Grafana"
    >
      <template
        v-for="(node, index) in nodes"
        :key="node.name"
      >
        <i
          v-if="index > 0"
          class="flex items-center justify-center font-mono text-primary not-italic max-sm:rotate-90"
          :class="index === 3 ? 'sm:col-start-2' : ''"
          aria-hidden="true"
          >→</i
        >
        <div class="grid min-h-[7.2rem] min-w-0 content-between border border-line bg-surface p-3">
          <span class="font-mono text-[0.58rem] text-primary">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <strong class="font-display text-base font-bold uppercase">
            {{ node.name }}
          </strong>
          <small class="font-mono text-[0.55rem] leading-[1.45] text-muted">
            {{ node.desc }}
          </small>
        </div>
      </template>
    </div>
    <div
      class="flex flex-wrap gap-[0.45rem] border-t border-line p-[0.9rem_1rem]"
      aria-label="Technologies used"
    >
      <span
        v-for="node in nodes"
        :key="node.name"
        class="border border-line px-2 py-1 font-mono text-[0.55rem] text-muted"
      >
        {{ node.name }}
      </span>
    </div>
  </SharedPanelFrame>
</template>
