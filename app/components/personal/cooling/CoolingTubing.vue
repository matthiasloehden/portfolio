<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { TubeConnection } from './cooling.types';

interface Point {
  x: number;
  y: number;
}

const props = defineProps<{
  root: HTMLElement | null;
  connections: TubeConnection[];
}>();

const paths = ref<string[]>([]);

let observer: ResizeObserver | undefined;

function getPortPoint(root: HTMLElement, id: string): Point | null {
  const element = root.querySelector<HTMLElement>(`[data-port="${id}"]`);

  if (!element) {
    return null;
  }

  const rootRect = root.getBoundingClientRect();
  const portRect = element.getBoundingClientRect();

  if (!rootRect.width || !rootRect.height) {
    return null;
  }

  const centerX = portRect.left - rootRect.left + portRect.width / 2;

  const centerY = portRect.top - rootRect.top + portRect.height / 2;

  // Convert browser pixels into the 1000 × 700 design space.
  return {
    x: centerX * (1000 / rootRect.width),
    y: centerY * (700 / rootRect.height),
  };
}

function removeDuplicatePoints(points: Point[]) {
  return points.filter((point, index) => {
    const previous = points[index - 1];

    if (!previous) {
      return true;
    }

    return Math.abs(point.x - previous.x) > 0.01 || Math.abs(point.y - previous.y) > 0.01;
  });
}

function createConnectionPoints(start: Point, end: Point, connection: TubeConnection): Point[] {
  if (connection.axis === 'direct' || !connection.axis) {
    return [start, end];
  }

  if (connection.axis === 'x') {
    const x = connection.at ?? (start.x + end.x) / 2;

    return removeDuplicatePoints([start, { x, y: start.y }, { x, y: end.y }, end]);
  }

  const y = connection.at ?? (start.y + end.y) / 2;

  return removeDuplicatePoints([start, { x: start.x, y }, { x: end.x, y }, end]);
}

function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function moveToward(from: Point, to: Point, amount: number): Point {
  const total = distance(from, to);

  if (!total) {
    return from;
  }

  const ratio = amount / total;

  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio,
  };
}

function createRoundedPath(points: Point[], radius = 12) {
  if (points.length < 2) {
    return '';
  }

  const first = points[0];

  if (!first) {
    return '';
  }

  let path = `M ${first.x} ${first.y}`;

  for (let index = 1; index < points.length - 1; index++) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];

    if (!previous || !current || !next) {
      continue;
    }

    const cornerRadius = Math.min(radius, distance(previous, current) / 2, distance(current, next) / 2);

    const beforeCorner = moveToward(current, previous, cornerRadius);

    const afterCorner = moveToward(current, next, cornerRadius);

    path += ` L ${beforeCorner.x} ${beforeCorner.y}`;
    path += ` Q ${current.x} ${current.y}`;
    path += ` ${afterCorner.x} ${afterCorner.y}`;
  }

  const last = points[points.length - 1];

  if (!last) {
    return path;
  }

  path += ` L ${last.x} ${last.y}`;

  return path;
}

function updatePaths() {
  const root = props.root;

  if (!root) {
    paths.value = [];
    return;
  }

  paths.value = props.connections.flatMap((connection) => {
    const start = getPortPoint(root, connection.from);
    const end = getPortPoint(root, connection.to);

    if (!start || !end) {
      return [];
    }

    const points = createConnectionPoints(start, end, connection);

    return [createRoundedPath(points)];
  });
}

async function connectObserver() {
  observer?.disconnect();

  await nextTick();

  if (!props.root) {
    return;
  }

  observer = new ResizeObserver(updatePaths);
  observer.observe(props.root);

  updatePaths();
}

watch(() => props.root, connectObserver, { immediate: true });

watch(() => props.connections, updatePaths, { deep: true });

onMounted(connectObserver);

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <svg
    class="loop-tubing"
    viewBox="0 0 1000 700"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <g
      v-for="(path, index) in paths"
      :key="index"
    >
      <path
        class="tube tube-base"
        :d="path"
      />

      <path
        class="tube tube-flow"
        :d="path"
        pathLength="100"
      />
    </g>
  </svg>
</template>

<style scoped>
.loop-tubing {
  position: absolute;
  z-index: 5;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.tube {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tube-base {
  stroke: var(--line-strong);
  stroke-width: 4;
}

.tube-flow {
  stroke: var(--primary-bright);
  stroke-width: 2;
  stroke-dasharray: 1 7;
  filter: drop-shadow(0 0 5px var(--primary));
  animation: coolant-flow 4s linear infinite;
}

@keyframes coolant-flow {
  to {
    stroke-dashoffset: -100;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tube-flow {
    animation: none;
  }
}
</style>
