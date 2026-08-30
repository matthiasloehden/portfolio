<script setup lang="ts">
import CoolingPort from './CoolingPort.vue';

import type { CoolingPortDefinition } from './cooling.types';

const ports = [
  { id: 'cpu-top', side: 'top', offset: 50 },
  { id: 'cpu-right', side: 'right', offset: 50 },
] satisfies CoolingPortDefinition[];
</script>

<template>
  <div class="cpu-block">
    <CoolingPort
      v-for="port in ports"
      :key="port.id"
      :port="port"
    />

    <small>CPU</small>
    <i aria-hidden="true" />
  </div>
</template>

<style scoped>
.cpu-block {
  position: absolute;
  z-index: 4;
  top: 6cqw;
  left: 8cqw;
  display: grid;
  width: 11cqw;
  aspect-ratio: 1;
  place-items: center;
  border: 0.1cqw solid var(--line-strong);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent), transparent 68%), var(--raised);
}

.cpu-block small {
  color: var(--primary);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.cpu-block i {
  position: absolute;
  inset: 1.3cqw;
  border: 0.1cqw dashed var(--primary);
  border-radius: 50%;
  opacity: 0.65;
  animation:
    cpu-pulse 3.6s ease-in-out infinite,
    cpu-spin 10s linear infinite;
}

@keyframes cpu-spin {
  to {
    rotate: -1turn;
  }
}

@keyframes cpu-pulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.4;
    filter: drop-shadow(0 0 0 transparent);
  }

  50% {
    transform: scale(1);
    opacity: 0.85;
    filter: drop-shadow(0 0 0.45cqw color-mix(in srgb, var(--primary) 65%, transparent));
  }
}

@media (prefers-reduced-motion: reduce) {
  .cpu-block i {
    animation: none;
  }
}
</style>
