<script setup lang="ts">
import SharedNumberInput from '@/components/shared/form/NumberInput.vue';
import SharedRangeSlider from '@/components/shared/form/RangeSlider.vue';

interface NumericSettingMarker {
  label: string;
  shortLabel?: string;
  value: number;
  active?: boolean;
}

interface NumericSettingMarkerGroup {
  label: string;
  shortLabel: string;
  value: number;
  active: boolean;
}

const props = defineProps<{
  label: string;
  description?: string;
  modelValue: number;
  min: number;
  max: number;
  step: number;
  runtimeMin: number;
  runtimeMax: number;
  editorRange?: { min: number; max: number };
  markers?: readonly NumericSettingMarker[];
  overridden?: boolean;
  resetLabel?: string;
  disabled?: boolean;
}>();

const descriptionId = useId();
const { t } = useI18n();

const emit = defineEmits<{
  'update:modelValue': [value: number];
  reset: [];
}>();

function includePresetValues(bounds: { min: number; max: number }): { min: number; max: number } {
  const presetValues = (props.markers ?? []).map((marker) => marker.value).filter(Number.isFinite);

  return {
    min: Math.max(props.runtimeMin, Math.min(bounds.min, ...presetValues)),
    max: Math.min(props.runtimeMax, Math.max(bounds.max, ...presetValues)),
  };
}

/**
 * The slider targets 15% of its width for each extreme zone. Runtime limits
 * may remove one side; its unused width is transferred to the other side so
 * the recommended section remains visually stable. Explicit editor bounds are
 * reserved for settings whose useful extremes cannot be derived numerically.
 */
const sliderBounds = computed(() => {
  if (props.editorRange) {
    return includePresetValues({
      min: Math.max(props.runtimeMin, Math.min(props.editorRange.min, props.min)),
      max: Math.min(props.runtimeMax, Math.max(props.editorRange.max, props.max)),
    });
  }

  const span = Math.max(props.max - props.min, props.step);
  const extensionPerSide = (span * 15) / 70;
  const totalExtension = extensionPerSide * 2;
  const leftCapacity = Math.max(0, props.min - props.runtimeMin);
  const rightCapacity = Math.max(0, props.runtimeMax - props.max);
  let leftExtension = Math.min(extensionPerSide, leftCapacity);
  let rightExtension = Math.min(extensionPerSide, rightCapacity);
  let remainingExtension = totalExtension - leftExtension - rightExtension;

  const additionalRightExtension = Math.min(remainingExtension, rightCapacity - rightExtension);
  rightExtension += additionalRightExtension;
  remainingExtension -= additionalRightExtension;
  leftExtension += Math.min(remainingExtension, leftCapacity - leftExtension);

  return includePresetValues({ min: props.min - leftExtension, max: props.max + rightExtension });
});

const sliderValue = computed(() =>
  Math.min(sliderBounds.value.max, Math.max(sliderBounds.value.min, props.modelValue)),
);

const presetGroups = computed<readonly NumericSettingMarkerGroup[]>(() => {
  const groups: NumericSettingMarkerGroup[] = [];

  for (const marker of props.markers ?? []) {
    const existing = groups.find((group) => group.value === marker.value);

    if (existing) {
      existing.label = `${existing.label} / ${marker.label}`;
      existing.shortLabel = `${existing.shortLabel}/${marker.shortLabel ?? marker.label}`;
      existing.active ||= marker.active === true;
      continue;
    }

    groups.push({
      label: marker.label,
      shortLabel: marker.shortLabel ?? marker.label,
      value: marker.value,
      active: marker.active === true,
    });
  }

  return groups;
});

const markerDescription = computed(() =>
  presetGroups.value
    .map((marker) => `${marker.label} ${marker.value}${marker.active ? ` ${t('display.shared.active')}` : ''}`)
    .join(', '),
);

const sliderValueText = computed(() =>
  t('display.background.sliderValue', {
    value: sliderValue.value,
    min: props.min,
    max: props.max,
    presets: markerDescription.value ? t('display.background.sliderPresets', { presets: markerDescription.value }) : '',
  }),
);
</script>

<template>
  <fieldset class="grid min-w-0 gap-[0.45rem] font-mono text-[0.6rem] text-muted">
    <legend class="sr-only">{{ label }}</legend>
    <div class="grid gap-[0.2rem]">
      <span class="flex items-start justify-between gap-2">
        <span class="text-[0.62rem] font-semibold text-foreground">{{ label }}</span>
        <button
          v-if="overridden"
          class="cursor-pointer text-[0.54rem] text-muted underline decoration-line underline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground"
          type="button"
          :title="resetLabel"
          :aria-label="`${label}: ${resetLabel ?? t('display.shared.resetOverride')}`"
          @click="emit('reset')"
        >
          {{ t('form.reset') }}
        </button>
      </span>
      <small
        v-if="description"
        :id="descriptionId"
        class="text-[0.56rem] leading-[1.4] text-muted"
      >
        {{ description }}
      </small>
    </div>

    <div class="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1">
      <SharedNumberInput
        :model-value="modelValue"
        :label="t('display.shared.value', { label })"
        :described-by="description ? descriptionId : undefined"
        :step="step"
        :disabled="disabled"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <SharedRangeSlider
        :model-value="sliderValue"
        :min="sliderBounds.min"
        :max="sliderBounds.max"
        :step="step"
        :step-base="min"
        :label="t('display.shared.range', { label })"
        :described-by="description ? descriptionId : undefined"
        :value-text="sliderValueText"
        :highlighted-range="{ min, max }"
        :markers="presetGroups"
        :disabled="disabled"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <div
        v-if="presetGroups.length > 0"
        class="col-start-2 flex min-w-0 items-start justify-between gap-2 text-[0.5rem] leading-[1.35]"
      >
        <span class="shrink-0 tracking-[0.04em] text-muted uppercase">{{ t('display.shared.presets') }}</span>
        <span
          class="flex min-w-0 flex-wrap justify-end gap-x-2 gap-y-0.5"
          role="list"
          :aria-label="t('display.background.performancePresets', { label })"
        >
          <span
            v-for="marker in presetGroups"
            :key="`${marker.label}-${marker.value}`"
            :class="marker.active ? 'font-semibold text-primary-bright' : 'text-muted'"
            role="listitem"
            :aria-label="
              t('display.background.presetValue', {
                preset: marker.label,
                value: marker.value,
                active: marker.active ? ` (${t('display.shared.active')})` : '',
              })
            "
          >
            {{ marker.shortLabel }} {{ marker.value }}
          </span>
        </span>
      </div>
    </div>
  </fieldset>
</template>
