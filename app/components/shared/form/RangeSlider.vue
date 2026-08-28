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
    '--value-position': `${Math.min(100, Math.max(0, getPosition(sliderValue.value)))}%`,
  };
});

const positionedMarkers = computed(() =>
  props.markers
    .filter((marker) => marker.value >= props.min && marker.value <= props.max)
    .map((marker) => ({ ...marker, position: `${getPosition(marker.value)}%` })),
);

function emitAlignedValue(value: number): void {
  if (!Number.isFinite(value)) return;

  const stepBase = props.stepBase ?? props.min;
  const stepped = Math.round((value - stepBase) / effectiveStep.value) * effectiveStep.value + stepBase;
  const clamped = Math.min(props.max, Math.max(props.min, stepped));
  emit('update:modelValue', Number(clamped.toFixed(8)));
}

function onInput(event: Event): void {
  emitAlignedValue(Number((event.target as HTMLInputElement).value));
}

function onKeydown(event: KeyboardEvent): void {
  let direction = 0;

  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') direction = 1;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') direction = -1;

  if (direction !== 0) {
    event.preventDefault();
    emitAlignedValue(sliderValue.value + direction * effectiveStep.value);
    return;
  }

  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault();
    const pageStep = Math.max(effectiveStep.value, span.value / 10);
    emitAlignedValue(sliderValue.value + (event.key === 'PageUp' ? pageStep : -pageStep));
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    emitAlignedValue(event.key === 'Home' ? props.min : props.max);
  }
}
</script>

<template>
  <span
    class="group relative block h-[2.4rem]"
    :style="rangeStyle"
  >
    <input
      class="range-control peer relative z-10 m-0 block h-[2.4rem] w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-45"
      type="range"
      :value="sliderValue"
      :min="min"
      :max="max"
      step="any"
      :disabled="disabled"
      :aria-label="label"
      :aria-valuetext="valueText"
      :aria-describedby="describedBy"
      @input="onInput"
      @keydown="onKeydown"
    />
    <span
      class="pointer-events-none absolute inset-x-[0.45rem] top-1/2 z-0 h-1 -translate-y-1/2 overflow-hidden border border-line bg-[color-mix(in_srgb,var(--primary)_7%,var(--surface))] transition-[height,background-color,border-color,box-shadow] duration-200 peer-focus-visible:h-1.5 peer-focus-visible:border-primary-bright peer-focus-visible:shadow-[0_0_0.6rem_color-mix(in_srgb,var(--primary)_22%,transparent)] peer-disabled:opacity-45 motion-reduce:transition-none"
      :class="
        disabled
          ? undefined
          : 'group-hover:h-1.5 group-hover:border-line-strong group-hover:bg-[color-mix(in_srgb,var(--primary)_11%,var(--surface-hover))]'
      "
      aria-hidden="true"
    >
      <span
        class="absolute inset-y-0 bg-[color-mix(in_srgb,var(--primary)_22%,transparent)]"
        style="left: var(--highlight-start); width: calc(var(--highlight-end) - var(--highlight-start))"
      />
      <span
        class="absolute inset-y-0 left-0 bg-primary shadow-[0_0_0.55rem_color-mix(in_srgb,var(--primary)_38%,transparent)] transition-[width] duration-100 ease-out motion-reduce:transition-none"
        style="width: var(--value-position)"
      />
    </span>
    <span
      class="pointer-events-none absolute inset-x-[0.45rem] inset-y-0 z-[1] transition-opacity peer-disabled:opacity-35 motion-reduce:transition-none"
      aria-hidden="true"
    >
      <span
        v-for="marker in positionedMarkers"
        :key="`${marker.label}-${marker.value}`"
        :class="[
          'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[height,background-color,box-shadow] duration-150 motion-reduce:transition-none',
          marker.active
            ? [
                'h-4 w-0.5 bg-primary-bright shadow-[0_0_0.35rem_color-mix(in_srgb,var(--primary)_55%,transparent)]',
                disabled ? undefined : 'group-hover:h-5',
              ]
            : ['h-3 w-px bg-foreground/45', disabled ? undefined : 'group-hover:bg-foreground/65'],
        ]"
        :style="{ left: marker.position }"
      />
    </span>
  </span>
</template>

<style scoped>
/* The semantic range input owns interaction while browser-specific pseudo
   elements style its thumb above the decorative Tailwind track. */
.range-control::-webkit-slider-runnable-track {
  height: 0.25rem;
  border: 0;
  background: transparent;
}

.range-control:focus-visible {
  outline: none;
}

.range-control::-moz-range-track {
  height: 0.25rem;
  border: 0;
  background: transparent;
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
  box-shadow:
    0 0 0 1px var(--line-strong),
    0 0 0.45rem color-mix(in srgb, var(--primary) 24%, transparent);
  transition:
    scale 160ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 160ms ease-out,
    background-color 160ms ease-out;
}

.range-control::-moz-range-thumb {
  box-sizing: border-box;
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid var(--raised);
  border-radius: 50%;
  background: var(--primary-bright);
  box-shadow:
    0 0 0 1px var(--line-strong),
    0 0 0.45rem color-mix(in srgb, var(--primary) 24%, transparent);
  transition:
    scale 160ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 160ms ease-out,
    background-color 160ms ease-out;
}

.range-control:hover::-webkit-slider-thumb,
.range-control:focus-visible::-webkit-slider-thumb {
  scale: 1.18;
  box-shadow:
    0 0 0 2px var(--raised),
    0 0 0 3px var(--primary-bright),
    0 0 0.8rem color-mix(in srgb, var(--primary) 50%, transparent);
}

.range-control:hover::-moz-range-thumb,
.range-control:focus-visible::-moz-range-thumb {
  scale: 1.18;
  box-shadow:
    0 0 0 2px var(--raised),
    0 0 0 3px var(--primary-bright),
    0 0 0.8rem color-mix(in srgb, var(--primary) 50%, transparent);
}

.range-control:active::-webkit-slider-thumb {
  scale: 0.94;
  background: var(--foreground);
}

.range-control:active::-moz-range-thumb {
  scale: 0.94;
  background: var(--foreground);
}

@media (prefers-reduced-motion: reduce) {
  .range-control::-webkit-slider-thumb,
  .range-control::-moz-range-thumb {
    transition: none;
  }
}
</style>
