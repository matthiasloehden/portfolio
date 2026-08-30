<script setup lang="ts">
import type { BackgroundQualityId, BackgroundSettingValue } from '@/types/background';
import type { BackgroundSettingDefinition } from '@/config/backgrounds/settingsRegistry';
import type { NumericSettingDefinition } from '@/domain/backgrounds/settingsDefinition';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedSettingsResetButton from '@/components/shared/form/SettingsResetButton.vue';
import BackgroundBooleanSettingField from './BackgroundBooleanSettingField.vue';
import BackgroundNumericSettingField from './BackgroundNumericSettingField.vue';

const props = defineProps<{
  backgroundLabel: string;
  controls: readonly BackgroundSettingDefinition[];
  values: Readonly<Record<string, BackgroundSettingValue>>;
  overrides: Readonly<Record<string, BackgroundSettingValue | undefined>>;
  performancePreset: BackgroundQualityId;
}>();

const emit = defineEmits<{
  change: [key: string, value: BackgroundSettingValue];
  reset: [key: string];
  'reset-all': [];
}>();

const groupOptions = [
  { key: 'appearance', label: 'Appearance' },
  { key: 'interaction', label: 'Interactions' },
] as const;

const settingGroups = computed(() =>
  groupOptions
    .map((group) => ({
      ...group,
      controls: props.controls.filter((control) => control.group === group.key),
    }))
    .filter((group) => group.controls.length > 0),
);
const hasOverrides = computed(() => Object.values(props.overrides).some((value) => value !== undefined));

function getPerformanceMarkers(
  control: NumericSettingDefinition,
): readonly { label: string; shortLabel: string; value: number; active: boolean }[] {
  if (!control.presetValues) return [];

  return (['low', 'medium', 'high'] as const).flatMap((preset) => {
    const value = control.presetValues?.[preset];
    return value === undefined
      ? []
      : [
          {
            label: `${preset.charAt(0).toUpperCase()}${preset.slice(1)}`,
            shortLabel: preset.charAt(0).toUpperCase(),
            value,
            active: preset === props.performancePreset,
          },
        ];
  });
}

function getResetLabel(control: BackgroundSettingDefinition): string {
  if (control.type === 'boolean') return 'Use scene default';

  return control.presetValues?.[props.performancePreset] === undefined
    ? 'Use scene default'
    : `Use ${props.performancePreset} performance value`;
}

function getNumericValue(control: NumericSettingDefinition): number {
  const value = props.values[control.key];
  return typeof value === 'number' ? value : control.defaultValue;
}

function getBooleanValue(control: BackgroundSettingDefinition): boolean {
  const value = props.values[control.key];
  return typeof value === 'boolean' ? value : control.defaultValue === true;
}
</script>

<template>
  <div>
    <p class="py-2 font-mono text-[0.54rem] leading-[1.4] text-muted">
      Editing {{ backgroundLabel }} settings. Overrides stay active when performance presets change.
    </p>

    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 font-mono text-[0.5rem] text-muted">
      <span class="inline-flex items-center gap-1.5">
        <span
          class="h-1 w-3 border border-line bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))]"
          aria-hidden="true"
        />
        Extended
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span
          class="h-1 w-3 border border-line bg-primary"
          aria-hidden="true"
        />
        Recommended
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span
          class="h-3 w-0.5 bg-primary-bright shadow-[0_0_0.3rem_color-mix(in_srgb,var(--primary)_45%,transparent)]"
          aria-hidden="true"
        />
        Active preset
      </span>
    </div>

    <SharedAccordionGroup :end-border="false">
      <SharedAccordion
        v-for="group in settingGroups"
        :key="group.key"
        :label="group.label"
        :heading-level="4"
      >
        <div class="grid gap-3">
          <template
            v-for="control in group.controls"
            :key="control.key"
          >
            <BackgroundBooleanSettingField
              v-if="control.type === 'boolean'"
              :label="control.label"
              :description="control.description"
              :model-value="getBooleanValue(control)"
              :overridden="overrides[control.key] !== undefined"
              :reset-label="getResetLabel(control)"
              @update:model-value="emit('change', control.key, $event)"
              @reset="emit('reset', control.key)"
            />
            <BackgroundNumericSettingField
              v-else
              :label="control.label"
              :description="control.description"
              :model-value="getNumericValue(control)"
              :min="control.recommended.min"
              :max="control.recommended.max"
              :step="control.recommended.step"
              :runtime-min="control.runtime.min"
              :runtime-max="control.runtime.max"
              :editor-range="control.editorRange"
              :markers="getPerformanceMarkers(control)"
              :overridden="overrides[control.key] !== undefined"
              :reset-label="getResetLabel(control)"
              @update:model-value="emit('change', control.key, $event)"
              @reset="emit('reset', control.key)"
            />
          </template>
        </div>
      </SharedAccordion>
    </SharedAccordionGroup>

    <SharedSettingsResetButton
      class="my-4"
      label="Reset current background settings"
      :disabled="!hasOverrides"
      disabled-reason="No settings have been changed for the current background."
      @click="emit('reset-all')"
    />
  </div>
</template>
