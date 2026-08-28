<script setup lang="ts">
import { onMounted, ref } from 'vue';

import CoolingPort from './CoolingPort.vue';

const memorySequence = ref<number[]>(Array.from({ length: 12 }, (_, index) => index));

function shuffleMemorySequence() {
  const sequence = Array.from({ length: 12 }, (_, index) => index);

  for (let index = sequence.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    const currentValue = sequence[index];

    sequence[index] = sequence[target] ?? index;
    sequence[target] = currentValue ?? target;
  }

  return sequence;
}

function getMemoryAnimationStyle(module: number) {
  const order = memorySequence.value[module - 1] ?? 0;

  return {
    '--memory-delay': `${3 + order * 0.12}s`,
  };
}

onMounted(() => {
  memorySequence.value = shuffleMemorySequence();
});
</script>

<template>
  <div class="motherboard">
    <div class="board-header">
      <span>MB01</span>
      <span>MAINBOARD</span>
    </div>

    <div
      class="board-grid"
      aria-hidden="true"
    />

    <div class="cpu-block hardware-block">
      <CoolingPort
        :port="{
          id: 'cpu-top',
          side: 'top',
          offset: 50,
          className: 'cpu-port-top',
        }"
      />

      <CoolingPort
        :port="{
          id: 'cpu-right',
          side: 'right',
          offset: 50,
          className: 'cpu-port-right',
        }"
      />

      <small>CPU</small>
      <i aria-hidden="true" />
    </div>

    <div class="ram-zone hardware-block">
      <CoolingPort
        :port="{
          id: 'ram-left',
          side: 'left',
          offset: 50,
          className: 'ram-port-left',
        }"
      />

      <CoolingPort
        :port="{
          id: 'ram-bottom',
          side: 'bottom',
          offset: 50,
          className: 'ram-port-bottom',
        }"
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

    <div class="gpu-block hardware-block">
      <CoolingPort
        :port="{
          id: 'gpu-top',
          side: 'top',
          offset: 93.5,
          className: 'gpu-port-top',
        }"
      />

      <CoolingPort
        :port="{
          id: 'gpu-bottom',
          side: 'bottom',
          offset: 6.5,
          className: 'gpu-port-bottom',
        }"
      />

      <div class="gpu-edge">
        <span>GPU</span>
        <small>VERTICAL</small>
      </div>

      <div
        class="gpu-plate"
        aria-hidden="true"
      >
        <div class="gpu-components">
          <div class="gpu-silicon">
            <i
              v-for="module in 12"
              :key="module"
              class="gpu-memory-chip"
              :style="getMemoryAnimationStyle(module)"
            />

            <div class="gpu-package">
              <div class="gpu-die">
                <i class="gpu-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.motherboard {
  position: absolute;
  z-index: 3;
  top: 15cqw;
  left: 9cqw;
  width: 52cqw;
  height: 41cqw;
  overflow: hidden;
  border: 0.1cqw solid var(--line-strong);
  background: color-mix(in srgb, var(--raised) 95%, transparent);
}

.board-header {
  position: absolute;
  z-index: 2;
  top: 1.4cqw;
  right: 1.4cqw;
  left: 1.4cqw;
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.board-grid {
  position: absolute;
  inset: 0;
  opacity: 0.34;
  background:
    linear-gradient(90deg, transparent 49%, var(--line) 50%, transparent 51%),
    linear-gradient(transparent 49%, var(--line) 50%, transparent 51%);
  background-size: 4cqw 4cqw;
}

.hardware-block {
  position: absolute;
  z-index: 4;
}

/* CPU */

.cpu-block {
  top: 6cqw;
  left: 8cqw;
  display: grid;
  width: 11cqw;
  aspect-ratio: 1;
  place-items: center;
  border: 0.1cqw solid var(--primary);
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

/* RAM */

.ram-zone {
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
  background: var(--primary);
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
    transform: translate3d(0, 1.8cqw, 0);
  }
}

/* GPU */

.gpu-block {
  right: 10cqw;
  bottom: 4.5cqw;
  left: 10cqw;
  display: grid;
  height: 13cqw;
  grid-template-columns: 5cqw 1fr;
  border: 0.1cqw solid var(--line-strong);
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--primary) 12%, transparent), transparent 58%), var(--raised);
}

.gpu-edge {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.2cqw 0.8cqw;
  border-right: 0.1cqw solid var(--line);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.gpu-edge span {
  color: var(--primary);
}

.gpu-edge small {
  position: absolute;
  bottom: 2cqw;
  left: 50%;
  transform: translateX(-50%);
  color: var(--muted);
  font-size: 1.15cqw;
  writing-mode: vertical-rl;
}

.gpu-plate {
  position: relative;
  display: grid;
  min-width: 0;
  padding: 0 1.4cqw;
}

.gpu-components {
  display: grid;
  height: 100%;
  grid-template-columns: minmax(0, 1fr) 10cqw minmax(0, 1fr);
  align-items: center;
  gap: 1.2cqw;
}

.gpu-components::before,
.gpu-components::after {
  width: 2.7cqw;
  height: 10.8cqw;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0 1cqw,
    color-mix(in srgb, var(--primary) 28%, var(--line-strong)) 1cqw 1.1cqw
  );
  content: '';
  opacity: 0.45;
}

.gpu-components::before {
  justify-self: center;
  transform: translateX(-0.1cqw);
  mask-image: linear-gradient(to right, transparent, black 42%);
}

.gpu-components::after {
  justify-self: center;
  transform: translateX(0.1cqw);
  mask-image: linear-gradient(to left, transparent, black 42%);
}

.gpu-silicon {
  position: relative;
  width: 10cqw;
  height: 9.2cqw;
}

.gpu-memory-chip {
  --memory-gradient-direction: to bottom;
  --memory-from-x: 0;
  --memory-from-y: -110%;
  --memory-to-x: 0;
  --memory-to-y: 110%;

  position: absolute;
  width: 1.3cqw;
  aspect-ratio: 1;
  overflow: hidden;
  border: 0.1cqw solid var(--line-strong);
  background: color-mix(in srgb, var(--primary) 8%, var(--raised));
}

.gpu-memory-chip::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--memory-gradient-direction),
    transparent 10%,
    color-mix(in srgb, var(--primary) 12%, transparent) 58%,
    color-mix(in srgb, var(--primary) 42%, transparent)
  );
  content: '';
  opacity: 0;
  animation: gpu-memory-scan 6s linear var(--memory-delay) infinite;
}

.gpu-memory-chip:nth-child(-n + 4) {
  top: 0;
}

.gpu-memory-chip:nth-child(1) {
  left: 1.5cqw;
}

.gpu-memory-chip:nth-child(2) {
  left: 3.4cqw;
}

.gpu-memory-chip:nth-child(3) {
  left: 5.3cqw;
}

.gpu-memory-chip:nth-child(4) {
  left: 7.2cqw;
}

.gpu-memory-chip:nth-child(n + 5):nth-child(-n + 8) {
  --memory-gradient-direction: to right;
  --memory-from-x: -110%;
  --memory-from-y: 0;
  --memory-to-x: 110%;
  --memory-to-y: 0;

  left: 0;
}

.gpu-memory-chip:nth-child(n + 9) {
  --memory-gradient-direction: to left;
  --memory-from-x: 110%;
  --memory-from-y: 0;
  --memory-to-x: -110%;
  --memory-to-y: 0;

  right: 0;
}

.gpu-memory-chip:nth-child(5),
.gpu-memory-chip:nth-child(9) {
  top: 1.5cqw;
}

.gpu-memory-chip:nth-child(6),
.gpu-memory-chip:nth-child(10) {
  top: 3.4cqw;
}

.gpu-memory-chip:nth-child(7),
.gpu-memory-chip:nth-child(11) {
  top: 5.3cqw;
}

.gpu-memory-chip:nth-child(8),
.gpu-memory-chip:nth-child(12) {
  top: 7.2cqw;
}

.gpu-package {
  position: relative;
  top: 2.2cqw;
  left: 50%;
  display: grid;
  width: 5.6cqw;
  aspect-ratio: 1;
  place-items: center;
  transform: translateX(-50%);
  border: 0.1cqw solid var(--line-strong);
  background: color-mix(in srgb, var(--primary) 5%, var(--raised));
}

.gpu-die {
  position: relative;
  display: grid;
  width: 4.2cqw;
  aspect-ratio: 1;
  place-items: center;
  overflow: hidden;
  border: 0.1cqw solid var(--line-strong);
  background: color-mix(in srgb, var(--primary) 4%, var(--raised));
}

.gpu-die::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(var(--line) 0.1cqw, transparent 0.1cqw),
    linear-gradient(90deg, var(--line) 0.1cqw, transparent 0.1cqw);
  background-size: 1.1cqw 1.1cqw;
  content: '';
  opacity: 0.2;
}

.gpu-fluid {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: -58%;
  width: 58%;
  border-right: 0.1cqw solid var(--primary);
  background: linear-gradient(
    to right,
    transparent,
    color-mix(in srgb, var(--primary) 8%, transparent) 32%,
    color-mix(in srgb, var(--primary) 36%, transparent)
  );
  box-shadow: 0.2cqw 0 0.4cqw color-mix(in srgb, var(--primary) 18%, transparent);
  opacity: 0;
  animation: gpu-core-scan 6s linear infinite;
}

@keyframes gpu-core-scan {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }

  2% {
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
  }

  44% {
    transform: translate3d(258%, 0, 0);
    opacity: 0.8;
  }

  48%,
  100% {
    transform: translate3d(280%, 0, 0);
    opacity: 0;
  }
}

@keyframes gpu-memory-scan {
  0% {
    transform: translate3d(var(--memory-from-x), var(--memory-from-y), 0);
    opacity: 0;
  }

  1%,
  10% {
    opacity: 0.5;
  }

  13%,
  100% {
    transform: translate3d(var(--memory-to-x), var(--memory-to-y), 0);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cpu-block i,
  .ram-bank i::after,
  .gpu-fluid,
  .gpu-memory-chip::after {
    animation: none;
  }
}
</style>
