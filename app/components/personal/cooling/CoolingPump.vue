<script setup lang="ts">
import CoolingPort from "./CoolingPort.vue"
import type {
  CoolingPortDefinition,
} from "./cooling.types"

withDefaults(
  defineProps<{
    code: string
    ports?: CoolingPortDefinition[]
  }>(),
  {
    ports: () => [],
  },
)
</script>

<template>
  <div class="pump">
    <CoolingPort
      v-for="port in ports"
      :key="port.id"
      :port="port"
    />

    <span>{{ code }}</span>
    <strong>PUMP</strong>
    <i aria-hidden="true" />
  </div>
</template>

<style scoped>
.pump {
  position: relative;
  z-index: 6;
  display: grid;
  width: 9cqw;
  aspect-ratio: 1;
  place-items: center;
  border: 0.1cqw solid var(--border-strong);
  border-radius: 50%;
  background:
    color-mix(
      in srgb,
      var(--background-raised) 95%,
      transparent
    );
  box-shadow:
    0 0 0 0.6cqw var(--background-raised),
    0 0 0 0.7cqw var(--border);
}

.pump span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.pump strong {
  font-family: var(--display-font);
  font-size: 1cqw;
  letter-spacing: 0.04em;
}

.pump i {
  position: absolute;
  inset: 0.9cqw;
  border: 0.1cqw dashed var(--accent);
  border-radius: inherit;
  opacity: 0.75;
  animation: pump-spin 8s linear infinite;
}

@keyframes pump-spin {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pump i {
    animation: none;
  }
}
</style>
