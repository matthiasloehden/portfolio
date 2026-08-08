<script setup lang="ts">
import CoolingPort from './CoolingPort.vue';
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
          offset: 85,
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

      <div class="gpu-core">
        <span>FULL COVER</span>
        <strong>
          WATER<br />
          BLOCK
        </strong>
      </div>

      <div
        class="gpu-lines"
        aria-hidden="true"
      >
        <i
          v-for="line in 3"
          :key="line"
        />
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
  border: 0.1cqw solid var(--border-strong);
  background: color-mix(in srgb, var(--background-raised) 95%, transparent);
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
    linear-gradient(90deg, transparent 49%, var(--border) 50%, transparent 51%),
    linear-gradient(transparent 49%, var(--border) 50%, transparent 51%);
  background-size: 4cqw 4cqw;
}

.hardware-block {
  position: absolute;
  z-index: 4;
}

/* CPU */

.cpu-block {
  top: 6cqw;
  left: 9.5cqw;
  display: grid;
  width: 11cqw;
  aspect-ratio: 1;
  place-items: center;
  border: 0.1cqw solid var(--accent);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 68%),
    var(--background-raised);
}

.cpu-block small {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.cpu-block i {
  position: absolute;
  inset: 0.9cqw;
  border: 0.1cqw dashed var(--accent);
  border-radius: 50%;
  opacity: 0.65;
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
  border: 0.1cqw solid var(--border-strong);
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--accent) 9%, transparent), transparent 55%),
    var(--background-raised);
}

.ram-label {
  color: var(--accent);
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
  border: 0.1cqw solid var(--border-strong);
  background: linear-gradient(to bottom, var(--accent) 0 0.5cqw, transparent 0.5cqw), var(--background-raised);
}

/* GPU */

.gpu-block {
  right: 6cqw;
  bottom: 4.5cqw;
  left: 6cqw;
  display: grid;
  height: 13cqw;
  grid-template-columns: 5cqw 1fr;
  border: 0.1cqw solid var(--border-strong);
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--accent) 9%, transparent), transparent 55%),
    var(--background-raised);
}

.gpu-edge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.2cqw 0.8cqw;
  border-right: 0.1cqw solid var(--border);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.gpu-edge span {
  color: var(--accent);
}

.gpu-edge small {
  color: var(--muted);
  font-size: 0.65cqw;
  writing-mode: vertical-rl;
}

.gpu-core {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5cqw 2cqw;
}

.gpu-core span {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.gpu-core strong {
  margin-top: 0.4cqw;
  font-family: var(--display-font);
  font-size: 3cqw;
  letter-spacing: -0.035em;
  line-height: 0.82;
  text-transform: uppercase;
}

.gpu-lines {
  position: absolute;
  top: 20%;
  right: 1.5cqw;
  bottom: 20%;
  display: grid;
  width: 22%;
  gap: 0.7cqw;
}

.gpu-lines i {
  border-top: 0.1cqw solid var(--accent);
  opacity: 0.4;
}
</style>
