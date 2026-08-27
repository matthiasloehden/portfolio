<script setup lang="ts">
/**
 * Reusable bounded numeric input with optional visual context. Highlight and
 * marker values are intentionally domain-neutral: a consumer may use them for
 * recommended ranges, presets, thresholds, or any other reference values.
 * Values emitted from pointer and keyboard interaction are aligned to `step`
 * around `stepBase`, avoiding floating-point drift in consuming components.
 */

interface RangeSliderMarker {
  label: string;
  value: number;
  active?: boolean;
}

interface RangeSliderHighlight {
  min: number;
  max: number;
}

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min: number;
    max: number;
    step: number;
    label: string;
    stepBase?: number;
    describedBy?: string;
    valueText?: string;
    highlightedRange?: RangeSliderHighlight;
    markers?: readonly RangeSliderMarker[];
    disabled?: boolean;
  }>(),
  {
    markers: () => [],
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const span = computed(() => Math.max(0, props.max - props.min));
const effectiveStep = computed(() => (props.step > 0 ? props.step : 1));
const sliderValue = computed(() => Math.min(props.max, Math.max(props.min, props.modelValue)));

function getPosition(value: number): number {
  if (span.value === 0) return 0;
  return ((value - props.min) / span.value) * 100;
}

const rangeStyle = computed(() => {
  const highlightedMin = props.highlightedRange?.min ?? props.min;
  const highlightedMax = props.highlightedRange?.max ?? props.max;

  return {
    '--highlight-start': `${Math.min(100, Math.max(0, getPosition(highlightedMin)))}%`,
    '--highlight-end': `${Math.min(100, Math.max(0, getPosition(highlightedMax)))}%`,
  };
});

const positionedMarkers = computed(() =>
  props.markers
    .filter((marker) => marker.value >= props.min && marker.value <= props.max)
    .map((marker) => ({ ...marker, position: `${getPosition(marker.value)}%` })),
);

function onInput(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;

  const stepBase = props.stepBase ?? props.min;
  const stepped = Math.round((value - stepBase) / effectiveStep.value) * effectiveStep.value + stepBase;
  const clamped = Math.min(props.max, Math.max(props.min, stepped));
  emit('update:modelValue', Number(clamped.toFixed(8)));
}
</script>

<template>
  <span class="relative block h-[2.4rem]">
    <input
      class="range-control relative z-10 m-0 block h-[2.4rem] w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed disabled:opacity-45"
      type="range"
      :value="sliderValue"
      :min="min"
      :max="max"
      step="any"
      :disabled="disabled"
      :style="rangeStyle"
      :aria-label="label"
      :aria-valuetext="valueText"
      :aria-describedby="describedBy"
      @input="onInput"
    />
    <span
      class="pointer-events-none absolute inset-x-[0.45rem] inset-y-0 z-0"
      aria-hidden="true"
    >
      <span
        v-for="marker in positionedMarkers"
        :key="`${marker.label}-${marker.value}`"
        :class="[
          'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
          marker.active
            ? 'h-4 w-0.5 bg-primary-bright shadow-[0_0_0.35rem_color-mix(in_srgb,var(--primary)_55%,transparent)]'
            : 'h-3 w-px bg-foreground/45',
        ]"
        :style="{ left: marker.position }"
      />
    </span>
  </span>
</template>

<style scoped>
/* Native range internals require browser-specific pseudo-elements; the input
   itself is styled exclusively with Tailwind utilities in the template. */
.range-control::-webkit-slider-runnable-track {
  height: 0.25rem;
  border: 1px solid var(--line);
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--primary) 10%, var(--surface)) 0 var(--highlight-start),
    var(--primary) var(--highlight-start) var(--highlight-end),
    color-mix(in srgb, var(--primary) 10%, var(--surface)) var(--highlight-end) 100%
  );
}

.range-control::-moz-range-track {
  height: 0.25rem;
  border: 1px solid var(--line);
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--primary) 10%, var(--surface)) 0 var(--highlight-start),
    var(--primary) var(--highlight-start) var(--highlight-end),
    color-mix(in srgb, var(--primary) 10%, var(--surface)) var(--highlight-end) 100%
  );
}

.range-control::-webkit-slider-thumb {
  box-sizing: border-box;
  width: 0.9rem;
  height: 0.9rem;
  margin-top: -0.325rem;
  appearance: none;
  border: 2px solid var(--raised);
  border-radius: 50%;
  background: var(--primary-bright);
  box-shadow: 0 0 0 1px var(--line-strong);
}

.range-control::-moz-range-thumb {
  box-sizing: border-box;
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid var(--raised);
  border-radius: 50%;
  background: var(--primary-bright);
  box-shadow: 0 0 0 1px var(--line-strong);
}
</style>
