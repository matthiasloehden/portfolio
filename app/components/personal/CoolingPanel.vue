<template>
  <SharedPanelFrame
    class="cooling-panel"
    title="cooling.loop"
    meta="4 radiators / 2 pumps"
  >
    <div
      class="loop-diagram"
      aria-label="Custom PC water-cooling system with four radiators, dual pumps, CPU, RAM and GPU water blocks"
    >
      <!--
        Tubing — single serial loop:
        bottom radiator → GPU port → RAM port → CPU port → top radiator
        → right radiator → left radiator → left pump → right pump → bottom radiator
      -->
      <svg
        class="loop-tubing"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          class="tube tube-base"
          d="
            M 249 640
            V 424
            Q 249 399 274 399
            H 443
            V 292
            Q 443 267 418 267
            H 250
            Q 225 267 225 242
            V 85
            Q 225 60 250 60
            H 807
            Q 832 60 832 85
            V 275
            Q 832 300 807 300
            H 741
            Q 716 300 716 325
            V 448
            Q 716 473 741 473
            H 807
            Q 832 473 832 498
            V 615
            Q 832 640 807 640
            H 249
            Z
          "
        />

        <path
          class="tube tube-flow"
          d="
            M 249 640
            V 424
            Q 249 399 274 399
            H 443
            V 292
            Q 443 267 418 267
            H 250
            Q 225 267 225 242
            V 85
            Q 225 60 250 60
            H 807
            Q 832 60 832 85
            V 275
            Q 832 300 807 300
            H 741
            Q 716 300 716 325
            V 448
            Q 716 473 741 473
            H 807
            Q 832 473 832 498
            V 615
            Q 832 640 807 640
            H 249
            Z
          "
        />
      </svg>

      <!-- Top radiator -->
      <div class="radiator radiator-top">
        <span class="component-port radiator-port-bottom-left" aria-hidden="true" />
        <span class="component-port radiator-port-bottom-right" aria-hidden="true" />

        <div class="radiator-label">
          <span>R01</span>
          <strong>Top radiator</strong>
        </div>

        <div
          class="radiator-fins"
          aria-hidden="true"
        >
          <i v-for="n in 14" :key="n" />
        </div>
      </div>

      <!-- Motherboard -->
      <div class="motherboard">
        <div class="board-header">
          <span>MB01</span>
          <span>MAINBOARD</span>
        </div>

        <div class="board-grid" aria-hidden="true" />

        <div class="cpu-ram-group">
          <div class="cpu-block hardware-block">
            <span class="component-port cpu-port-top" aria-hidden="true" />
            <span class="component-port cpu-port-right" aria-hidden="true" />

            <small>CPU</small>
            <i />
          </div>

          <div class="ram-zone hardware-block">
            <span class="component-port ram-port-left" aria-hidden="true" />
            <span class="component-port ram-port-bottom" aria-hidden="true" />

            <span class="ram-label">RAM</span>

            <div
              class="ram-bank"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>


          </div>
        </div>

        <div class="gpu-block hardware-block">
          <span class="component-port gpu-port-top" aria-hidden="true" />
          <span class="component-port gpu-port-bottom" aria-hidden="true" />

          <div class="gpu-edge">
            <span>GPU</span>
            <small>VERTICAL</small>
          </div>

          <div class="gpu-core">
            <span>FULL COVER</span>
            <strong>WATER<br />BLOCK</strong>
          </div>

          <div class="gpu-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <!-- Side cooling -->
      <div class="side-cooling">
        <div class="rear-radiators">
          <div class="radiator radiator-rear radiator-three">
            <span class="component-port radiator-port-right" aria-hidden="true" />
            <span class="component-port radiator-port-bottom" aria-hidden="true" />
            <span>R03</span>

            <div
              class="vertical-fins"
              aria-hidden="true"
            >
              <i v-for="n in 7" :key="n" />
            </div>
          </div>

          <div class="radiator radiator-rear radiator-four">
            <span class="component-port radiator-port-top" aria-hidden="true" />
            <span class="component-port radiator-port-left" aria-hidden="true" />
            <span>R04</span>

            <div
              class="vertical-fins"
              aria-hidden="true"
            >
              <i v-for="n in 7" :key="n" />
            </div>
          </div>
        </div>

        <div class="pump-bank">
          <div class="pump">
            <span class="component-port pump-port-top" aria-hidden="true" />
            <span class="component-port pump-port-right" aria-hidden="true" />
            <span>P01</span>
            <strong>PUMP</strong>
            <i aria-hidden="true" />
          </div>

          <div class="pump">
            <span class="component-port pump-port-left" aria-hidden="true" />
            <span class="component-port pump-port-bottom" aria-hidden="true" />
            <span>P02</span>
            <strong>PUMP</strong>
            <i aria-hidden="true" />
          </div>
        </div>

        <span class="side-label">DUAL LOOP DRIVE</span>
      </div>

      <!-- Bottom radiator -->
      <div class="radiator radiator-bottom">
        <span class="component-port radiator-port-top-left" aria-hidden="true" />
        <span class="component-port radiator-port-bottom-right" aria-hidden="true" />

        <div class="radiator-label">
          <span>R02</span>
          <strong>Bottom radiator</strong>
        </div>

        <div
          class="radiator-fins"
          aria-hidden="true"
        >
          <i v-for="n in 14" :key="n" />
        </div>
      </div>

      <div class="diagram-status">
        <span>LIQUID COOLING</span>
        <strong>Custom loop</strong>
      </div>
    </div>

    <div class="cooling-meta grid border-t border-line">
      <div>
        <span>Radiators</span>
        <strong>04×</strong>
      </div>

      <div>
        <span>Pumps</span>
        <strong>02×</strong>
      </div>

      <div>
        <span>Blocks</span>
        <strong>CPU / RAM / GPU</strong>
      </div>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.loop-diagram {
  position: relative;
  display: grid;
  width: 100%;
  aspect-ratio: 1000 / 700;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr) repeat(8, minmax(0, 1fr)) minmax(0, 1fr);
  gap: 0.9%;
  padding: 2.4%;
  overflow: hidden;
  background:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 2rem 2rem;
}

/* ---------------------------------
   Cooling loop
   --------------------------------- */

.loop-tubing {
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tube {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tube-base {
  stroke: var(--border-strong);
  stroke-width: 2;
}

.tube-flow {
  stroke: var(--accent-bright);
  stroke-width: 1.5;
  stroke-dasharray: 2 18;
  filter: drop-shadow(0 0 0.35rem var(--accent));
  animation: coolant-flow 8s linear infinite;
}

/* ---------------------------------
   Component ports (tube <-> block connection points)
   --------------------------------- */

.component-port {
  position: absolute;
  z-index: 8;
  width: clamp(0.45rem, 0.8%, 0.7rem);
  aspect-ratio: 1;
  border: 1px solid var(--accent-bright);
  border-radius: 50%;
  background: var(--background-raised);
  box-shadow:
    0 0 0 2px var(--background-raised),
    0 0 0.45rem color-mix(in srgb, var(--accent) 65%, transparent);
}

.cpu-port-top {
  top: -0.3rem;
  left: 50%;
  transform: translateX(-50%);
}

.cpu-port-right {
  top: 50%;
  right: -0.3rem;
  transform: translateY(-50%);
}

.ram-port-left {
  top: 50%;
  left: -0.3rem;
  transform: translateY(-50%);
}

.ram-port-bottom {
  bottom: -0.3rem;
  left: 50%;
  transform: translateX(-50%);
}

.gpu-port-top {
  top: -0.3rem;
  left: 64%;
  transform: translateX(-50%);
}

.gpu-port-bottom {
  bottom: -0.3rem;
  left: 18%;
  transform: translateX(-50%);
}

.radiator-port-left {
  top: 50%;
  left: -0.3rem;
  transform: translateY(-50%);
}

.radiator-port-right {
  top: 50%;
  right: -0.3rem;
  transform: translateY(-50%);
}

.pump-port-top {
  top: -0.3rem;
  left: 50%;
  transform: translateX(-50%);
}

.pump-port-bottom {
  bottom: -0.3rem;
  left: 50%;
  transform: translateX(-50%);
}

/* ---------------------------------
   Shared components
   --------------------------------- */

.radiator,
.motherboard,
.pump {
  border: 1px solid var(--border-strong);
  background: color-mix(
    in srgb,
    var(--background-raised) 95%,
    transparent
  );
}

.radiator {
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.radiator-label {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  transform: translateY(-50%);
}

.radiator-label span,
.radiator-rear > span,
.board-header,
.cpu-block small,
.ram-zone > span,
.ram-zone small,
.gpu-edge,
.gpu-core span,
.side-label,
.diagram-status span,
.pump span {
  font-family: var(--mono-font);
  font-size: 0.5rem;
  letter-spacing: 0.08em;
}

.radiator-label span,
.radiator-rear > span,
.cpu-block small,
.ram-zone > span,
.gpu-edge span,
.diagram-status span,
.pump span {
  color: var(--accent);
}

.radiator-label strong {
  font-family: var(--display-font);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ---------------------------------
   Top / bottom radiators
   --------------------------------- */

.radiator-top {
  grid-row: 1;
  grid-column: 2 / 12;
}

.radiator-bottom {
  grid-row: 10;
  grid-column: 2 / 12;
}

.radiator-fins {
  position: absolute;
  inset: 0.5rem 0.65rem;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 0.28rem;
  opacity: 0.5;
}

.radiator-fins i {
  border-right: 1px solid var(--border-strong);
  border-left: 1px solid var(--border-strong);
  background:
    repeating-linear-gradient(
      180deg,
      transparent 0,
      transparent 3px,
      var(--border) 3px,
      var(--border) 4px
    );
}

/* ---------------------------------
   Motherboard
   --------------------------------- */

.motherboard {
  position: relative;
  z-index: 1;
  grid-row: 3 / 9;
  grid-column: 2 / 8;
  min-height: 0;
  padding: 0.8rem;
  overflow: hidden;
}

.board-header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  color: var(--muted);
}

.board-grid {
  position: absolute;
  inset: 0;
  opacity: 0.34;
  background:
    linear-gradient(
      90deg,
      transparent 49%,
      var(--border) 50%,
      transparent 51%
    ),
    linear-gradient(
      transparent 49%,
      var(--border) 50%,
      transparent 51%
    );
  background-size: 2.4rem 2.4rem;
}

.hardware-block {
  z-index: 4;

}

/* ---------------------------------
   CPU + RAM group
   --------------------------------- */

.cpu-ram-group {
  position: absolute;
  top: 12%;
  left: 18%;
  display: flex;
  align-items: center;
  gap: 14%;
  width: 100%;
}

/* ---------------------------------
   CPU block
   --------------------------------- */

.cpu-block {
  position: relative;
  display: grid;
  width: 24%;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--accent);
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--accent) 18%, transparent),
      transparent 68%
    ),
    var(--background-raised);
}

.cpu-block strong {
  font-family: var(--display-font);
  font-size: 0.8rem;
}

.cpu-block i {
  position: absolute;
  inset: 0.45rem;
  border: 1px dashed var(--accent);
  border-radius: 50%;
  opacity: 0.65;
}

/* ---------------------------------
   RAM
   --------------------------------- */

.ram-zone {
  margin-right: 36%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--accent);
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--accent) 14%, transparent),
      transparent 72%
    ),
    var(--background-raised);
}

.ram-label {
  color: var(--muted);
  font-size: 0.7rem;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  line-height: 1;
}

.ram-bank {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.22rem;
  width: clamp(3.6rem, 8vw, 4.6rem);
  height: clamp(2.6rem, 6vw, 3.4rem);
}

.ram-bank i {
  border: 1px solid var(--border-strong);
  background:
    linear-gradient(
      to bottom,
      var(--accent) 0 3px,
      transparent 3px
    ),
    color-mix(
      in srgb,
      var(--background-raised) 90%,
      transparent
    );
}

.ram-zone small {
  color: var(--muted);
}

/* ---------------------------------
   GPU
   --------------------------------- */

.gpu-block {
  position: absolute;
  z-index: 4;
  right: 12%;
  bottom: 8%;
  left: 12%;
  display: grid;
  width: auto;
  min-height: 28%;
  grid-template-columns: auto 1fr;
  border: 1px solid var(--border-strong);
  background:
    linear-gradient(
      110deg,
      color-mix(in srgb, var(--accent) 9%, transparent),
      transparent 55%
    ),
    var(--background-raised);
}

.gpu-edge {
  display: flex;
  width: 3rem;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.45rem;
  border-right: 1px solid var(--border);
}

.gpu-edge small {
  color: var(--muted);
  font-size: 0.42rem;
  writing-mode: vertical-rl;
}

.gpu-core {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 1.25rem;
}

.gpu-core span {
  color: var(--muted);
}

.gpu-core strong {
  margin-top: 0.2rem;
  font-family: var(--display-font);
  font-size: clamp(1.3rem, 3vw, 2.3rem);
  letter-spacing: -0.035em;
  line-height: 0.82;
  text-transform: uppercase;
}

.gpu-lines {
  position: absolute;
  top: 20%;
  right: 1rem;
  bottom: 20%;
  display: grid;
  width: 22%;
  gap: 0.35rem;
}

.gpu-lines i {
  border-top: 1px solid var(--accent);
  opacity: 0.4;
}

/* ---------------------------------
   Side radiators + pumps
   --------------------------------- */

.side-cooling {
  position: relative;
  z-index: 2;
  grid-row: 3 / 9;
  grid-column: 9 / 12;
}

.rear-radiators {
  position: absolute;
  inset: 0 0 38%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
}

.radiator-rear {
  min-width: 0;
  opacity: 0.68;
}

.radiator-rear > span {
  position: absolute;
  top: 0.45rem;
  left: 0.45rem;
  z-index: 2;
}

.vertical-fins {
  position: absolute;
  inset: 1.4rem 0.45rem 0.45rem;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 0.3rem;
}

.vertical-fins i {
  border-top: 1px solid var(--border-strong);
  border-bottom: 1px solid var(--border-strong);
}

.pump-bank {
  position: absolute;
  z-index: 4;
  inset: auto 0 0;
  display: grid;
  height: 34%;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  place-items: center;
}

.pump {
  position: relative;
  display: grid;
  width: clamp(3.8rem, 8vw, 5.3rem);
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  box-shadow:
    0 0 0 0.35rem var(--background-raised),
    0 0 0 0.4rem var(--border);
}

.pump strong {
  font-family: var(--display-font);
  font-size: 0.65rem;
  letter-spacing: 0.04em;
}

.pump i {
  position: absolute;
  inset: 0.45rem;
  border: 1px dashed var(--accent);
  border-radius: inherit;
  opacity: 0.75;
  animation: pump-spin 8s linear infinite;
}

.side-label {
  position: absolute;
  right: 0;
  bottom: -1.1rem;
  color: var(--muted);
}

/* ---------------------------------
   Status
   --------------------------------- */

.diagram-status {
  position: absolute;
  z-index: 5;
  top: 6.8rem;
  left: clamp(1rem, 3vw, 1.8rem);
  display: grid;
  gap: 0.1rem;
}

.diagram-status strong {
  font-family: var(--display-font);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ---------------------------------
   Footer
   --------------------------------- */

.cooling-meta {
  grid-template-columns: repeat(3, 1fr);
}

.cooling-meta div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem;
  font-family: var(--mono-font);
  font-size: 0.55rem;
}

.cooling-meta div + div {
  border-left: 1px solid var(--border);
}

.cooling-meta span {
  color: var(--muted);
}

.cooling-meta strong {
  color: var(--accent-bright);
  font-size: inherit;
}

/* ---------------------------------
   Motion
   --------------------------------- */

@keyframes coolant-flow {
  to {
    stroke-dashoffset: -100;
  }
}

@keyframes pump-spin {
  to {
    transform: rotate(1turn);
  }
}

/* ---------------------------------
   Responsive
   --------------------------------- */

@media (max-width: 680px) {
  .loop-diagram {
    grid-template-rows: 4rem repeat(10, 1fr) 4rem;
    min-height: 34rem;
    padding: 0.8rem;
  }

  .radiator-top,
  .radiator-bottom {
    grid-column: 1 / 13;
  }

  .motherboard {
    grid-row: 3 / 9;
    grid-column: 1 / 9;
  }

  .side-cooling {
    grid-row: 3 / 9;
    grid-column: 9 / 13;
  }

  .pump {
    width: 3.5rem;
  }

  .gpu-core {
    padding: 0.7rem;
  }

  .gpu-core strong {
    font-size: 1.3rem;
  }

  .ram-zone {
    width: 32%;
  }

  .cooling-meta {
    grid-template-columns: 1fr;
  }

  .cooling-meta div + div {
    border-top: 1px solid var(--border);
    border-left: 0;
  }
}

@media (max-width: 460px) {
  .diagram-status {
    display: none;
  }

  .motherboard {
    grid-column: 1 / 10;
  }

  .side-cooling {
    grid-column: 10 / 13;
  }

  .rear-radiators {
    grid-template-columns: 1fr;
  }

  .radiator-four {
    display: none;
  }

  .pump {
    width: 3rem;
  }

  .radiator-label strong {
    display: none;
  }

  .gpu-edge {
    width: 2rem;
  }

  .gpu-core strong {
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tube-flow,
  .pump i {
    animation: none;
  }

}
</style>