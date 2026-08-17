<script setup lang="ts">
import { ref } from 'vue';

import CoolingMainboard from './CoolingMainboard.vue';
import CoolingPump from './CoolingPump.vue';
import CoolingRadiator from './CoolingRadiator.vue';
import CoolingTubing from './CoolingTubing.vue';

import type { TubeConnection } from './cooling.types';
import type { PersonalCoolingPanelContent } from '@/types/content';

defineProps<{
  content: PersonalCoolingPanelContent;
}>();

const diagram = ref<HTMLElement | null>(null);

const tubeConnections: TubeConnection[] = [
  {
    from: 'radiator-bottom-left',
    to: 'gpu-bottom',
    axis: 'y',
    at: 588,
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
    to: 'radiator-03-top',
    axis: 'y',
    at: 115,
  },
  {
    from: 'radiator-03-right',
    to: 'radiator-04-left',
    axis: 'direct',
  },
  {
    from: 'radiator-04-bottom',
    to: 'pump-02-top',
    axis: 'direct',
  },
  {
    from: 'pump-02-left',
    to: 'pump-01-right',
    axis: 'direct',
  },
  {
    from: 'pump-01-bottom',
    to: 'radiator-bottom-right',
    axis: 'y',
    at: 588,
  },
];
</script>

<template>
  <SharedPanelFrame
    class="cooling-panel"
    v-bind="content.frame"
  >
    <div class="diagram-shell">
      <div
        ref="diagram"
        class="loop-diagram"
        :aria-label="content.ariaLabel"
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
                id: 'radiator-03-top',
                side: 'top',
                offset: 50,
                className: 'radiator-port-top',
              },
              {
                id: 'radiator-03-right',
                side: 'right',
                offset: 50,
                className: 'radiator-port-right',
              },
            ]"
          />

          <CoolingRadiator
            class="radiator-four"
            code="R04"
            orientation="vertical"
            :ports="[
              {
                id: 'radiator-04-left',
                side: 'left',
                offset: 50,
                className: 'radiator-port-left',
              },
              {
                id: 'radiator-04-bottom',
                side: 'bottom',
                offset: 50,
                className: 'radiator-port-bottom',
              },
            ]"
          />

          <CoolingPump
            class="pump-one"
            code="P01"
            :ports="[
              {
                id: 'pump-01-right',
                side: 'right',
                offset: 50,
                className: 'pump-port-right',
              },
              {
                id: 'pump-01-bottom',
                side: 'bottom',
                offset: 50,
                className: 'pump-port-bottom',
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
                id: 'pump-02-top',
                side: 'top',
                offset: 50,
                className: 'pump-port-top',
              },
            ]"
          />
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
          <span>{{ content.status.label }}</span>
          <strong>{{ content.status.title }}</strong>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 border-t border-line min-[42.5rem]:grid-cols-3">
      <div
        v-for="(fact, index) in content.facts"
        :key="fact.label"
        :class="[
          'flex items-center justify-between gap-3 px-[0.9rem] py-[0.9rem] font-mono text-[0.55rem]',
          index > 0 && 'border-t border-line min-[42.5rem]:border-t-0 min-[42.5rem]:border-l',
        ]"
      >
        <span class="text-muted">{{ fact.label }}</span>
        <strong class="text-[inherit] text-primary-bright">{{ fact.value }}</strong>
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
    linear-gradient(var(--line) 0.1cqw, transparent 0.1cqw),
    linear-gradient(90deg, var(--line) 0.1cqw, transparent 0.1cqw);
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
  left: 64cqw;
  width: 27cqw;
  height: 41cqw;
}

.radiator-three,
.radiator-four {
  position: absolute;
  top: 0;
  width: 12cqw;
  height: 28cqw;
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
  top: 31cqw;
}

.pump-one {
  left: 1.5cqw;
}

.pump-two {
  left: 16.5cqw;
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
  color: var(--primary);
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
</style>
