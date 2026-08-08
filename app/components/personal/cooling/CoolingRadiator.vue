<script setup lang="ts">
import { computed } from 'vue';
import CoolingPort from './CoolingPort.vue';
import type { CoolingPortDefinition } from './cooling.types';

const props = withDefaults(
  defineProps<{
    code: string;
    title?: string;
    orientation?: 'horizontal' | 'vertical';
    ports?: CoolingPortDefinition[];
  }>(),
  {
    title: '',
    orientation: 'horizontal',
    ports: () => [],
  },
);

const finCount = computed(() => (props.orientation === 'horizontal' ? 14 : 7));
</script>

<template>
  <div
    class="radiator"
    :class="`radiator--${orientation}`"
  >
    <CoolingPort
      v-for="port in ports"
      :key="port.id"
      :port="port"
    />

    <div class="radiator-label">
      <span>{{ code }}</span>
      <strong v-if="title">{{ title }}</strong>
    </div>

    <div
      class="radiator-fins"
      aria-hidden="true"
    >
      <i
        v-for="fin in finCount"
        :key="fin"
      />
    </div>
  </div>
</template>

<style scoped>
.radiator {
  position: relative;
  z-index: 4;
  overflow: visible;
  border: 0.1cqw solid var(--border-strong);
  background: color-mix(in srgb, var(--background-raised) 95%, transparent);
}

.radiator-label {
  color: var(--accent);
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.8cqw;
  font-family: var(--mono-font);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.radiator-label span {
  color: var(--accent);
  font-size: 0.8cqw;
}

.radiator-label strong {
  font-family: var(--display-font);
  font-size: 1cqw;
  letter-spacing: 0.04em;
}

/* Horizontal */

.radiator--horizontal .radiator-label {
  top: 50%;
  left: 1.6cqw;
  transform: translateY(-50%);
}

.radiator--horizontal .radiator-fins {
  position: absolute;
  inset: 0.8cqw 1cqw;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 0.5cqw;
  opacity: 0.5;
}

.radiator--horizontal .radiator-fins i {
  border-right: 0.1cqw solid var(--border-strong);
  border-left: 0.1cqw solid var(--border-strong);
  background: repeating-linear-gradient(
    180deg,
    transparent 0,
    transparent 0.4cqw,
    var(--border) 0.4cqw,
    var(--border) 0.5cqw
  );
}

/* Vertical */

.radiator--vertical .radiator-label {
  top: 1cqw;
  left: 1cqw;
}

.radiator--vertical .radiator-label strong {
  display: none;
}

.radiator--vertical .radiator-fins {
  position: absolute;
  inset: 2.8cqw 0.8cqw 0.8cqw;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 0.6cqw;
  opacity: 0.6;
}

.radiator--vertical .radiator-fins i {
  border-top: 0.1cqw solid var(--border-strong);
  border-bottom: 0.1cqw solid var(--border-strong);
}
</style>
