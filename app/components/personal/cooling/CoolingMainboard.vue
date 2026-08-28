<script setup lang="ts">
import CoolingCpuBlock from './CoolingCpuBlock.vue';
import CoolingGpuBlock from './CoolingGpuBlock.vue';
import CoolingRamBlock from './CoolingRamBlock.vue';
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

    <CoolingCpuBlock />
    <CoolingRamBlock />
    <CoolingGpuBlock />
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
</style>
