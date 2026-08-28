<script setup lang="ts">
import { onMounted, ref } from 'vue';

import CoolingPort from './CoolingPort.vue';

import type { CoolingPortDefinition } from './cooling.types';

type MemorySide = 'top' | 'left' | 'right';

interface MemoryModule {
  side: MemorySide;
  x: number;
  y: number;
}

const ports = [
  { id: 'gpu-top', side: 'top', offset: 93.5 },
  { id: 'gpu-bottom', side: 'bottom', offset: 6.5 },
] satisfies CoolingPortDefinition[];

const memoryModules: MemoryModule[] = [
  { side: 'top', x: 1.5, y: 0 },
  { side: 'top', x: 3.4, y: 0 },
  { side: 'top', x: 5.3, y: 0 },
  { side: 'top', x: 7.2, y: 0 },
  { side: 'left', x: 0, y: 1.5 },
  { side: 'left', x: 0, y: 3.4 },
  { side: 'left', x: 0, y: 5.3 },
  { side: 'left', x: 0, y: 7.2 },
  { side: 'right', x: 8.7, y: 1.5 },
  { side: 'right', x: 8.7, y: 3.4 },
  { side: 'right', x: 8.7, y: 5.3 },
  { side: 'right', x: 8.7, y: 7.2 },
];

const memoryAnimationOrder = ref(memoryModules.map((_, index) => index));

function shuffledIndices(length: number) {
  const indices = Array.from({ length }, (_, index) => index);

  for (let index = indices.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    const currentValue = indices[index];
    const targetValue = indices[target];

    if (currentValue === undefined || targetValue === undefined) continue;

    indices[index] = targetValue;
    indices[target] = currentValue;
  }

  return indices;
}

function memoryModuleStyle(module: MemoryModule, index: number) {
  const animationOrder = memoryAnimationOrder.value[index] ?? index;

  return {
    '--memory-x': `${module.x}cqw`,
    '--memory-y': `${module.y}cqw`,
    '--memory-delay': `${3 + animationOrder * 0.12}s`,
  };
}

onMounted(() => {
  memoryAnimationOrder.value = shuffledIndices(memoryModules.length);
});
</script>

<template>
  <div class="gpu-block">
    <CoolingPort
      v-for="port in ports"
      :key="port.id"
      :port="port"
    />

    <div class="gpu-edge">
      <span>GPU</span>
      <small>VERTICAL</small>
    </div>

    <div
      class="gpu-plate"
      aria-hidden="true"
    >
      <div class="gpu-layout">
        <div class="gpu-silicon">
          <i
            v-for="(module, index) in memoryModules"
            :key="`${module.side}-${module.x}-${module.y}`"
            class="gpu-memory-chip"
            :class="`gpu-memory-chip--${module.side}`"
            :style="memoryModuleStyle(module, index)"
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
</template>

<style scoped>
.gpu-block {
  position: absolute;
  z-index: 4;
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

.gpu-layout {
  display: grid;
  height: 100%;
  grid-template-columns: minmax(0, 1fr) 10cqw minmax(0, 1fr);
  align-items: center;
  gap: 1.2cqw;
}

.gpu-layout::before,
.gpu-layout::after {
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

.gpu-layout::before {
  justify-self: center;
  transform: translateX(-0.1cqw);
  mask-image: linear-gradient(to right, transparent, black 42%);
}

.gpu-layout::after {
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
  top: var(--memory-y);
  left: var(--memory-x);
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

.gpu-memory-chip--left {
  --memory-gradient-direction: to right;
  --memory-from-x: -110%;
  --memory-from-y: 0;
  --memory-to-x: 110%;
  --memory-to-y: 0;
}

.gpu-memory-chip--right {
  --memory-gradient-direction: to left;
  --memory-from-x: 110%;
  --memory-from-y: 0;
  --memory-to-x: -110%;
  --memory-to-y: 0;
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
  .gpu-fluid,
  .gpu-memory-chip::after {
    animation: none;
  }
}
</style>
