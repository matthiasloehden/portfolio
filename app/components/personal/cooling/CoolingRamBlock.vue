<script setup lang="ts">
import CoolingPort from './CoolingPort.vue';

import type { CoolingPortDefinition } from './cooling.types';

const ports = [
  { id: 'ram-left', side: 'left', offset: 50 },
  { id: 'ram-bottom', side: 'bottom', offset: 50 },
] satisfies CoolingPortDefinition[];
</script>

<template>
  <div class="ram-block">
    <CoolingPort
      v-for="port in ports"
      :key="port.id"
      :port="port"
    />

    <span class="ram-label">RAM</span>

    <div
      class="ram-bank"
      aria-hidden="true"
    >
      <i
        v-for="slot in 4"
        :key="slot"
      />
    </div>
  </div>
</template>

<style scoped>
.ram-block {
  position: absolute;
  z-index: 4;
  top: 7cqw;
  left: 27.5cqw;
  display: flex;
  width: 16.5cqw;
  height: 9cqw;
  align-items: center;
  gap: 1cqw;
  padding: 0.8cqw 1cqw;
  border: 0.1cqw solid var(--line-strong);
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--primary) 9%, transparent), transparent 55%), var(--raised);
}

.ram-label {
  color: var(--primary);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
  line-height: 1;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.ram-bank {
  display: grid;
  width: 10.5cqw;
  height: 6.5cqw;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5cqw;
}

.ram-bank i {
  --ram-duration: 4.2s;
  --ram-delay: 0s;

  position: relative;
  overflow: hidden;
  border: 0.1cqw solid var(--line-strong);
  background: var(--raised);
}

.ram-bank i::after {
  position: absolute;
  top: 0.2cqw;
  right: 0;
  left: 0;
  height: 0.5cqw;
  background: var(--line-strong);
  content: '';
  animation: ram-level var(--ram-duration) ease-in-out var(--ram-delay) infinite alternate;
}

.ram-bank i:nth-child(2) {
  --ram-duration: 5.1s;
  --ram-delay: -2.4s;
}

.ram-bank i:nth-child(3) {
  --ram-duration: 3.7s;
  --ram-delay: -1.1s;
}

.ram-bank i:nth-child(4) {
  --ram-duration: 4.7s;
  --ram-delay: -3.2s;
}

@keyframes ram-level {
  to {
    transform: translate3d(0, 1.2cqw, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ram-bank i::after {
    animation: none;
  }
}
</style>
