<script setup lang="ts">
import { ref } from 'vue';

import CoolingMainboard from './CoolingMainboard.vue';
import CoolingPump from './CoolingPump.vue';
import CoolingRadiator from './CoolingRadiator.vue';
import CoolingTubing from './CoolingTubing.vue';

import type { TubeConnection } from './cooling.types';

const diagram = ref<HTMLElement | null>(null);

const tubeConnections: TubeConnection[] = [
  {
    from: 'radiator-bottom-left',
    to: 'gpu-bottom',
    axis: 'y',
    at: 565,
  },
  {
    from: 'gpu-top',
    to: 'ram-bottom',
    axis: 'y',
    at: 345,
  },
  {
    from: 'ram-left',
    to: 'cpu-right',
    axis: 'direct',
  },
  {
    from: 'cpu-top',
    to: 'radiator-top-left',
    axis: 'y',
    at: 115,
  },
  {
    from: 'radiator-top-right',
    to: 'radiator-04-top',
    axis: 'y',
    at: 100,
  },
  {
    from: 'radiator-04-left',
    to: 'radiator-03-right',
    axis: 'direct',
    at: 800,
  },
  {
    from: 'radiator-03-bottom',
    to: 'pump-01-top',
    axis: 'direct',
    at: 415,
  },
  {
    from: 'pump-01-right',
    to: 'pump-02-left',
    axis: 'direct',
  },
  {
    from: 'pump-02-bottom',
    to: 'radiator-bottom-right',
    axis: 'y',
    at: 590,
  },
];
</script>

<template>
  <SharedPanelFrame
    class="cooling-panel"
    title="cooling.loop"
    meta="4 radiators / 2 pumps"
  >
    <div class="diagram-shell">
      <div
        ref="diagram"
        class="loop-diagram"
        aria-label="Custom PC water-cooling system with four radiators, dual pumps, CPU, RAM and GPU water blocks"
      >
        <CoolingTubing
          :root="diagram"
          :connections="tubeConnections"
        />

        <CoolingRadiator
          class="radiator-top"
          code="R01"
          title="Top radiator"
          orientation="horizontal"
          :ports="[
            {
              id: 'radiator-top-left',
              side: 'bottom',
              offset: 4,
              className: 'radiator-port-bottom-left',
            },
            {
              id: 'radiator-top-right',
              side: 'bottom',
              offset: 96,
              className: 'radiator-port-bottom-right',
            },
          ]"
        />

        <CoolingMainboard />

        <div class="side-cooling">
          <CoolingRadiator
            class="radiator-three"
            code="R03"
            orientation="vertical"
            :ports="[
              {
                id: 'radiator-03-right',
                side: 'right',
                offset: 50,
                className: 'radiator-port-right',
              },
              {
                id: 'radiator-03-bottom',
                side: 'bottom',
                offset: 50,
                className: 'radiator-port-bottom',
              },
            ]"
          />

          <CoolingRadiator
            class="radiator-four"
            code="R04"
            orientation="vertical"
            :ports="[
              {
                id: 'radiator-04-top',
                side: 'top',
                offset: 50,
                className: 'radiator-port-top',
              },
              {
                id: 'radiator-04-left',
                side: 'left',
                offset: 50,
                className: 'radiator-port-left',
              },
            ]"
          />

          <CoolingPump
            class="pump-one"
            code="P01"
            :ports="[
              {
                id: 'pump-01-top',
                side: 'top',
                offset: 50,
                className: 'pump-port-top',
              },
              {
                id: 'pump-01-right',
                side: 'right',
                offset: 50,
                className: 'pump-port-right',
              },
            ]"
          />

          <CoolingPump
            class="pump-two"
            code="P02"
            :ports="[
              {
                id: 'pump-02-left',
                side: 'left',
                offset: 50,
                className: 'pump-port-left',
              },
              {
                id: 'pump-02-bottom',
                side: 'bottom',
                offset: 50,
                className: 'pump-port-bottom',
              },
            ]"
          />

          <span class="side-label"> DUAL LOOP DRIVE </span>
        </div>

        <CoolingRadiator
          class="radiator-bottom"
          code="R02"
          title="Bottom radiator"
          orientation="horizontal"
          :ports="[
            {
              id: 'radiator-bottom-left',
              side: 'top',
              offset: 4,
              className: 'radiator-port-top-left',
            },
            {
              id: 'radiator-bottom-right',
              side: 'top',
              offset: 96,
              className: 'radiator-port-bottom-right',
            },
          ]"
        />

        <div class="diagram-status">
          <span>LIQUID COOLING</span>
          <strong>Custom loop</strong>
        </div>
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
/*
 * This element controls the aspect ratio.
 * Its contents always use the same 1000 × 700 proportions.
 */
.diagram-shell {
  position: relative;
  width: 100%;
  aspect-ratio: 1000 / 700;
  overflow: hidden;
}

.loop-diagram {
  position: absolute;
  inset: 0;

  /*
   * Descendants can use cqw.
   * 1cqw represents 1% of the diagram width.
   *
   * Since the design width is 1000:
   * 1cqw corresponds to 10 design-space units.
   */
  container-type: inline-size;

  overflow: hidden;
  background:
    linear-gradient(var(--border) 0.1cqw, transparent 0.1cqw),
    linear-gradient(90deg, var(--border) 0.1cqw, transparent 0.1cqw);
  background-size: 3.2cqw 3.2cqw;
}

/* Main radiators */

.radiator-top {
  position: absolute;
  top: 2.4cqw;
  left: 9cqw;
  width: 82cqw;
  height: 6cqw;
}

.radiator-bottom {
  position: absolute;
  bottom: 2.4cqw;
  left: 9cqw;
  width: 82cqw;
  height: 6cqw;
}

/* Side components */

.side-cooling {
  position: absolute;
  z-index: 3;
  top: 15cqw;
  left: 69cqw;
  width: 22cqw;
  height: 41cqw;
}

.radiator-three,
.radiator-four {
  position: absolute;
  top: 0;
  width: 10.2cqw;
  height: 23cqw;
}

.radiator-three {
  left: 0;
}

.radiator-four {
  right: 0;
}

.pump-one,
.pump-two {
  position: absolute;
  top: 30cqw;
}

.pump-one {
  left: 0.6cqw;
}

.pump-two {
  right: 0.6cqw;
}

.side-label {
  position: absolute;
  right: 0;
  bottom: -1.8cqw;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

/* Status */

.diagram-status {
  position: absolute;
  z-index: 8;
  top: 10.5cqw;
  left: 2.8cqw;
  display: grid;
  gap: 0.2cqw;
}

.diagram-status span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.8cqw;
  letter-spacing: 0.08em;
}

.diagram-status strong {
  font-family: var(--display-font);
  font-size: 1cqw;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Footer */

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

/*
 * Only the footer layout changes.
 * The diagram itself is never rearranged.
 */
@media (max-width: 680px) {
  .cooling-meta {
    grid-template-columns: 1fr;
  }

  .cooling-meta div + div {
    border-top: 1px solid var(--border);
    border-left: 0;
  }
}
</style>
