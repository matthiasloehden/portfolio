<script setup lang="ts">
import {
  getBackgroundSettingControls,
  resolveBackgroundSettingsForEditor,
} from '@/components/backgrounds/settings/registry';
import { BACKGROUND_OPTIONS, getBackgroundLabel, resolveBackground } from '@/config/backgrounds';
import type {
  BackgroundAnimation,
  BackgroundId,
  BackgroundPerformanceMode,
  BackgroundPreference,
  BackgroundQualityId,
  BackgroundSettingKey,
} from '@/types/background';
import type { ThemePreference } from '@/types/display';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedPanelTrigger from '@/components/shared/PanelTrigger.vue';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import SharedToggleField from '@/components/shared/form/ToggleField.vue';
import SettingsBackgroundFields from './display-settings/BackgroundSettingsFields.vue';

const {
  themePreference,
  backgroundPreference,
  backgroundAnimations,
  backgroundPerformance,
  backgroundSettingOverrides,
  setThemePreference,
  setBackgroundPreference,
  setBackgroundAnimationEnabled,
  setBackgroundSetting,
  resetBackgroundSetting,
  setBackgroundPerformanceMode,
  setBackgroundPerformanceStatsEnabled,
  restoreDefaultSettings,
} = useDisplayPreferences();

const root = ref<HTMLElement | null>(null);
const open = defineModel<boolean>('open', { default: false });
const route = useRoute();
const { performanceStats } = useBackgroundRuntimeStatus();

const themeOptions: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const animationOptions: readonly {
  key: BackgroundAnimation;
  label: string;
  description: string;
}[] = [
  { key: 'idle', label: 'Idle motion', description: 'Animate the scene while it is idle.' },
  { key: 'cursorMovement', label: 'Pointer movement', description: 'React to mouse, pen and touch movement.' },
  { key: 'cursorClick', label: 'Pointer presses', description: 'React to mouse, pen and touch presses.' },
  { key: 'scroll', label: 'Scroll response', description: 'React to scrolling and wheel gestures.' },
];

const activeBackground = computed(() => resolveBackground(route.path, backgroundPreference.value));
const activeBackgroundLabel = computed(() => getBackgroundLabel(activeBackground.value));
const controlsDisabled = computed(() => activeBackground.value === 'none');

const backgroundOptions = computed(() =>
  BACKGROUND_OPTIONS.map((option) => ({
    ...option,
    label:
      option.value === 'auto' && backgroundPreference.value === 'auto'
        ? `Automatic per page — ${activeBackgroundLabel.value}`
        : option.label,
  })),
);

const performanceOptions = computed<readonly { value: BackgroundPerformanceMode; label: string }[]>(() => {
  const activePreset =
    backgroundPerformance.value.mode === 'auto' && performanceStats.value?.mode === 'auto'
      ? performanceStats.value.preset
      : undefined;
  const autoLabel =
    backgroundPerformance.value.mode !== 'auto'
      ? 'Auto'
      : activePreset
        ? `Auto — ${activePreset.charAt(0).toUpperCase()}${activePreset.slice(1)}`
        : 'Auto — detecting…';

  return [
    { value: 'auto', label: autoLabel },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
});

const activePerformancePreset = computed<BackgroundQualityId>(() => {
  if (backgroundPerformance.value.mode !== 'auto') return backgroundPerformance.value.mode;
  return performanceStats.value?.mode === 'auto' ? performanceStats.value.preset : 'high';
});

const activeSettingsControls = computed(() =>
  activeBackground.value === 'none' ? [] : getBackgroundSettingControls(activeBackground.value),
);

const activeSettingsValues = computed<Readonly<Record<string, number>>>(() =>
  activeBackground.value === 'none'
    ? {}
    : resolveBackgroundSettingsForEditor(
        activeBackground.value,
        backgroundSettingOverrides.value,
        activePerformancePreset.value,
      ),
);

const activeSettingOverrides = computed<Readonly<Record<string, number | undefined>>>(() =>
  activeBackground.value === 'none' ? {} : backgroundSettingOverrides.value[activeBackground.value],
);

function onThemeChange(value: string): void {
  setThemePreference(value as ThemePreference);
}

function onBackgroundChange(value: string): void {
  setBackgroundPreference(value as BackgroundPreference);
}

function onPerformanceModeChange(value: string): void {
  setBackgroundPerformanceMode(value as BackgroundPerformanceMode);
}

function getActiveSetting(setting: string): {
  background: BackgroundId;
  key: BackgroundSettingKey<BackgroundId>;
} | null {
  const background = activeBackground.value;
  if (background === 'none') return null;

  const control = getBackgroundSettingControls(background).find((candidate) => candidate.key === setting);
  return control ? { background, key: control.key as BackgroundSettingKey<BackgroundId> } : null;
}

function onBackgroundSettingChange(setting: string, value: number): void {
  const activeSetting = getActiveSetting(setting);
  if (activeSetting) setBackgroundSetting(activeSetting.background, activeSetting.key, value);
}

function onBackgroundSettingReset(setting: string): void {
  const activeSetting = getActiveSetting(setting);
  if (activeSetting) resetBackgroundSetting(activeSetting.background, activeSetting.key);
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (open.value && !root.value?.contains(event.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown));
</script>

<template>
  <div
    ref="root"
    class="static md:relative"
    @keydown.esc="open = false"
  >
    <SharedPanelTrigger
      :expanded="open"
      controls="display-settings"
      label="Open display settings"
      expanded-label="Close display settings"
      popup="dialog"
      @toggle="open = !open"
    >
      <svg
        class="size-4 stroke-current [stroke-width:1.2] [stroke-linecap:round] [stroke-linejoin:round]"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M2 4h7M12 4h2M2 12h2M7 12h7M2 8h3M8 8h6" />
        <circle
          cx="10.5"
          cy="4"
          r="1.5"
        />
        <circle
          cx="5.5"
          cy="12"
          r="1.5"
        />
        <circle
          cx="6.5"
          cy="8"
          r="1.5"
        />
      </svg>
    </SharedPanelTrigger>

    <Transition
      enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div
        v-if="open"
        id="display-settings"
        class="absolute top-full right-0 left-0 z-50 origin-top-right border-b border-line bg-raised/95 shadow-2xl backdrop-blur-xl md:top-[calc(100%+0.75rem)] md:left-auto md:w-[min(20rem,calc(100vw-2rem))] md:border"
        role="dialog"
        aria-label="Display settings"
      >
        <div
          class="max-h-[calc(100vh-4.75rem)] overflow-x-hidden overflow-y-auto overscroll-contain px-6 py-4 md:-mr-4 md:max-h-[min(44rem,calc(100vh-5rem))] md:w-[calc(100%+1rem)] md:p-0"
        >
          <div class="md:w-[20rem] md:p-4">
            <div class="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
              <strong class="font-display text-sm tracking-[0.04em] text-foreground uppercase">Display</strong>
              <span class="font-mono text-[0.58rem] text-muted">Preferences</span>
            </div>

            <SharedSelectField
              label="Theme"
              :model-value="themePreference"
              :options="themeOptions"
              @update:model-value="onThemeChange"
            />
            <SharedSelectField
              class="mt-3"
              label="Background"
              :model-value="backgroundPreference"
              :options="backgroundOptions"
              @update:model-value="onBackgroundChange"
            />
            <SharedSelectField
              class="mt-3"
              label="Background performance"
              :model-value="backgroundPerformance.mode"
              :options="performanceOptions"
              :disabled="controlsDisabled"
              @update:model-value="onPerformanceModeChange"
            />

            <SharedAccordionGroup class="mt-4">
              <SharedAccordion
                label="Advanced background settings"
                flush
              >
                <SharedToggleField
                  label="Performance stats"
                  description="Show diagnostics for the active background."
                  :checked="backgroundPerformance.showStats"
                  :disabled="controlsDisabled"
                  @change="setBackgroundPerformanceStatsEnabled"
                />

                <SharedAccordionGroup
                  class="mt-4"
                  :end-border="false"
                >
                  <SharedAccordion label="Animations">
                    <fieldset class="grid gap-3">
                      <legend class="sr-only">Animations</legend>
                      <SharedToggleField
                        v-for="option in animationOptions"
                        :key="option.key"
                        :label="option.label"
                        :description="option.description"
                        :checked="backgroundAnimations[option.key]"
                        :disabled="controlsDisabled"
                        @change="setBackgroundAnimationEnabled(option.key, $event)"
                      />
                    </fieldset>
                  </SharedAccordion>

                  <SharedAccordion
                    label="Configure active background"
                    :meta="activeBackgroundLabel"
                    flush
                  >
                    <SettingsBackgroundFields
                      v-if="activeBackground !== 'none'"
                      :controls="activeSettingsControls"
                      :values="activeSettingsValues"
                      :overrides="activeSettingOverrides"
                      :performance-preset="activePerformancePreset"
                      @change="onBackgroundSettingChange"
                      @reset="onBackgroundSettingReset"
                    />
                  </SharedAccordion>
                </SharedAccordionGroup>
              </SharedAccordion>
            </SharedAccordionGroup>

            <button
              class="mt-4 w-full cursor-pointer border border-line px-3 py-2 font-mono text-[0.6rem] text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
              type="button"
              @click="restoreDefaultSettings"
            >
              Restore default settings
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
