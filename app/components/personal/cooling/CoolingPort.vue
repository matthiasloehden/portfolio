<script setup lang="ts">
import { computed } from 'vue';
import type { CoolingPortDefinition } from './cooling.types';

const props = defineProps<{
  port: CoolingPortDefinition;
}>();

const portStyle = computed(() => ({
  '--port-offset': `${props.port.offset ?? 50}%`,
}));
</script>

<template>
  <span
    class="component-port"
    :class="[`component-port--${port.side}`, port.className]"
    :style="portStyle"
    :data-port="port.id"
    aria-hidden="true"
  />
</template>

<style scoped>
.component-port {
  position: absolute;
  z-index: 20;
  width: 1cqw;
  aspect-ratio: 1;
  border: 0.1cqw solid var(--primary-bright);
  border-radius: 50%;
  background: var(--raised);
  box-shadow:
    0 0 0 0.2cqw var(--raised),
    0 0 0.8cqw color-mix(in srgb, var(--primary) 65%, transparent);
}

.component-port--top {
  top: 0;
  left: var(--port-offset);
  transform: translate(-50%, -50%);
}

.component-port--right {
  top: var(--port-offset);
  right: 0;
  transform: translate(50%, -50%);
}

.component-port--bottom {
  bottom: 0;
  left: var(--port-offset);
  transform: translate(-50%, 50%);
}

.component-port--left {
  top: var(--port-offset);
  left: 0;
  transform: translate(-50%, -50%);
}
</style>
