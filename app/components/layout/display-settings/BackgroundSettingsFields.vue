<script setup lang="ts">
import type { BackgroundId, BackgroundQualityId, BackgroundSettingValue } from '@/types/background';
import type { BackgroundSettingDefinition } from '@/config/backgrounds/settingsRegistry';
import type { NumericSettingDefinition } from '@/domain/backgrounds/settingsDefinition';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedSettingsResetButton from '@/components/shared/form/SettingsResetButton.vue';
import BackgroundBooleanSettingField from './BackgroundBooleanSettingField.vue';
import BackgroundNumericSettingField from './BackgroundNumericSettingField.vue';

const props = defineProps<{
  backgroundLabel: string;
  background: BackgroundId;
  controls: readonly BackgroundSettingDefinition[];
  values: Readonly<Record<string, BackgroundSettingValue>>;
  overrides: Readonly<Record<string, BackgroundSettingValue | undefined>>;
  performancePreset: BackgroundQualityId;
}>();
const { t, te } = useI18n();

const emit = defineEmits<{
  change: [key: string, value: BackgroundSettingValue];
  reset: [key: string];
  'reset-all': [];
}>();

const groupOptions = computed(
  () =>
    [
      { key: 'appearance', label: t('display.background.appearance') },
      { key: 'interaction', label: t('display.background.interactions') },
    ] as const,
);

const settingGroups = computed(() =>
  groupOptions.value
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
            label: t(`display.shared.${preset}`),
            shortLabel: preset.charAt(0).toUpperCase(),
            value,
            active: preset === props.performancePreset,
          },
        ];
  });
}

function getResetLabel(control: BackgroundSettingDefinition): string {
  if (control.type === 'boolean') return t('display.background.useSceneDefault');

  return control.presetValues?.[props.performancePreset] === undefined
    ? t('display.background.useSceneDefault')
    : t('display.background.usePerformanceValue', { preset: t(`display.shared.${props.performancePreset}`) });
}

function getControlLabel(control: BackgroundSettingDefinition): string {
  const key = `display.background.controls.${props.background}.${control.key}.label`;
  return te(key) ? t(key) : control.label;
}

function getControlDescription(control: BackgroundSettingDefinition): string {
  const key = `display.background.controls.${props.background}.${control.key}.description`;
  return te(key) ? t(key) : control.description;
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
      {{ t('display.background.editing', { background: backgroundLabel }) }}
    </p>

    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 font-mono text-[0.5rem] text-muted">
      <span class="inline-flex items-center gap-1.5">
        <span
          class="h-1 w-3 border border-line bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))]"
          aria-hidden="true"
        />
        {{ t('display.background.extended') }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span
          class="h-1 w-3 border border-line bg-primary"
          aria-hidden="true"
        />
        {{ t('display.background.recommended') }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span
          class="h-3 w-0.5 bg-primary-bright shadow-[0_0_0.3rem_color-mix(in_srgb,var(--primary)_45%,transparent)]"
          aria-hidden="true"
        />
        {{ t('display.background.activePreset') }}
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
              :label="getControlLabel(control)"
              :description="getControlDescription(control)"
              :model-value="getBooleanValue(control)"
              :overridden="overrides[control.key] !== undefined"
              :reset-label="getResetLabel(control)"
              @update:model-value="emit('change', control.key, $event)"
              @reset="emit('reset', control.key)"
            />
            <BackgroundNumericSettingField
              v-else
              :label="getControlLabel(control)"
              :description="getControlDescription(control)"
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
      class="mt-4"
      :label="t('display.background.reset')"
      :disabled="!hasOverrides"
      :disabled-reason="t('display.background.resetDisabled')"
      @click="emit('reset-all')"
    />
  </div>
</template>
