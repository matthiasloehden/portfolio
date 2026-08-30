<script setup lang="ts">
import {
  getBackgroundSettingControls,
  resolveBackgroundSettingsForEditor,
} from '@/config/backgrounds/settingsRegistry';
import { getBackgroundLabel } from '@/config/backgrounds/selection';
import type {
  BackgroundAnimation,
  BackgroundId,
  BackgroundPerformanceMode,
  BackgroundPreference,
  BackgroundQualityId,
  BackgroundSettingKey,
} from '@/types/background';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedPanelTrigger from '@/components/shared/PanelTrigger.vue';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import SharedSettingsResetButton from '@/components/shared/form/SettingsResetButton.vue';
import SharedToggleField from '@/components/shared/form/ToggleField.vue';
import BackgroundSelectField from './display-settings/BackgroundSelectField.vue';
import SettingsBackgroundFields from './display-settings/BackgroundSettingsFields.vue';
import SettingsPageButton from './display-settings/SettingsPageButton.vue';
import ThemeAdvancedSettings from './display-settings/ThemeAdvancedSettings.vue';
import ThemeSettingsSection from './display-settings/ThemeSettingsSection.vue';

const {
  backgroundPreference,
  resolvedBackground,
  backgroundAnimations,
  backgroundPerformance,
  backgroundSettingOverrides,
  hasDisplayPreferenceChanges,
  setBackgroundPreference,
  setBackgroundAnimationEnabled,
  setBackgroundSetting,
  resetBackgroundSetting,
  resetBackgroundSettings,
  setBackgroundPerformanceMode,
  setBackgroundPerformanceStatsEnabled,
  restoreDefaultSettings,
} = useDisplayPreferences();

interface PanelTriggerHandle {
  focus: (options?: FocusOptions) => void;
}

type SettingsPage = 'overview' | 'theme' | 'background';
type PendingPageFocus = Exclude<SettingsPage, 'overview'> | 'back' | null;

const root = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const panelScroller = ref<HTMLElement | null>(null);
const panelTrigger = ref<PanelTriggerHandle | null>(null);
const themePageTrigger = ref<PanelTriggerHandle | null>(null);
const backgroundPageTrigger = ref<PanelTriggerHandle | null>(null);
const backButton = ref<HTMLButtonElement | null>(null);
const activePage = ref<SettingsPage>('overview');
const pageTransitionDirection = ref<'forward' | 'back'>('forward');
const pendingPageFocus = ref<PendingPageFocus>(null);
const backgroundSettingsTitleId = useId();
const open = defineModel<boolean>('open', { default: false });
const { performanceStats } = useBackgroundRuntimeStatus();

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

const pageEnterFromClass = computed(() => (pageTransitionDirection.value === 'forward' ? 'opacity-0' : 'opacity-0'));
const pageLeaveToClass = computed(() => (pageTransitionDirection.value === 'forward' ? 'opacity-0' : 'opacity-0'));

const activeBackground = computed(() => resolvedBackground.value);
const activeBackgroundLabel = computed(() => getBackgroundLabel(activeBackground.value));
const controlsDisabled = computed(() => activeBackground.value === 'none');

const backgroundMeta = computed(() =>
  backgroundPreference.value === 'auto' || backgroundPreference.value === 'random'
    ? activeBackgroundLabel.value
    : undefined,
);

const performanceOptions: readonly { value: BackgroundPerformanceMode; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const activePerformancePreset = computed<BackgroundQualityId>(() => {
  if (backgroundPerformance.value.mode !== 'auto') return backgroundPerformance.value.mode;
  return performanceStats.value?.mode === 'auto' ? performanceStats.value.preset : 'high';
});

const performanceMeta = computed(() => {
  if (backgroundPerformance.value.mode !== 'auto') return undefined;

  const preset = activePerformancePreset.value;
  return `${preset.charAt(0).toUpperCase()}${preset.slice(1)}`;
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

function onBackgroundChange(value: BackgroundPreference): void {
  setBackgroundPreference(value);
}

function onPerformanceModeChange(value: BackgroundPerformanceMode): void {
  setBackgroundPerformanceMode(value);
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

function onActiveBackgroundSettingsReset(): void {
  const background = activeBackground.value;
  if (background !== 'none') resetBackgroundSettings(background);
}

function openSettingsPage(page: Exclude<SettingsPage, 'overview'>): void {
  pageTransitionDirection.value = 'forward';
  pendingPageFocus.value = 'back';
  panelScroller.value?.scrollTo({ top: 0 });
  activePage.value = page;
}

function returnToOverview(): void {
  if (activePage.value === 'overview') return;

  pageTransitionDirection.value = 'back';
  pendingPageFocus.value = activePage.value;
  panelScroller.value?.scrollTo({ top: 0 });
  activePage.value = 'overview';
}

function onPageTransitionAfterEnter(): void {
  if (!open.value || pendingPageFocus.value === null) return;

  if (pendingPageFocus.value === 'back') {
    backButton.value?.focus({ preventScroll: true });
  } else {
    const trigger = pendingPageFocus.value === 'theme' ? themePageTrigger.value : backgroundPageTrigger.value;
    trigger?.focus({ preventScroll: true });
  }

  pendingPageFocus.value = null;
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (open.value && event.target instanceof Node && !root.value?.contains(event.target)) open.value = false;
}

function onEscape(): void {
  if (!open.value) return;

  open.value = false;
  nextTick(() => panelTrigger.value?.focus({ preventScroll: true }));
}

watch(open, async (isOpen) => {
  if (!isOpen) {
    pendingPageFocus.value = null;
    activePage.value = 'overview';
    return;
  }

  await nextTick();
  panel.value?.focus({ preventScroll: true });
});

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown));
</script>

<template>
  <div
    ref="root"
    class="static md:relative"
    @keydown.esc.prevent="onEscape"
  >
    <SharedPanelTrigger
      ref="panelTrigger"
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
        v-show="open"
        id="display-settings"
        ref="panel"
        class="absolute top-full right-0 left-0 z-50 origin-top-right border-b border-line bg-raised/95 shadow-2xl backdrop-blur-xl md:top-[calc(100%+0.75rem)] md:left-auto md:w-[min(20rem,calc(100vw-2rem))] md:border"
        role="dialog"
        tabindex="-1"
        aria-label="Display settings"
      >
        <div
          ref="panelScroller"
          class="max-h-[calc(100vh-4.75rem)] overflow-x-hidden overflow-y-auto overscroll-contain px-6 py-4 md:-mr-4 md:max-h-[min(44rem,calc(100vh-5rem))] md:w-[calc(100%+1rem)] md:p-0"
        >
          <div class="md:w-[20rem] md:p-4">
            <Transition
              mode="out-in"
              enter-active-class="transition-[opacity] duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              :enter-from-class="pageEnterFromClass"
              leave-active-class="transition-[opacity] duration-100 ease-in motion-reduce:transition-none"
              :leave-to-class="pageLeaveToClass"
              @after-enter="onPageTransitionAfterEnter"
            >
              <div :key="activePage">
                <h2
                  v-if="activePage === 'overview'"
                  class="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3"
                >
                  <span class="font-display text-sm tracking-[0.04em] text-foreground uppercase">Display</span>
                  <span class="font-mono text-[0.58rem] text-muted">Preferences</span>
                </h2>
                <div
                  v-else
                  class="mb-4 flex items-center gap-3 border-b border-line pb-3"
                >
                  <button
                    ref="backButton"
                    class="grid size-7 shrink-0 cursor-pointer place-items-center border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
                    type="button"
                    aria-label="Back to display settings"
                    @click="returnToOverview"
                  >
                    <svg
                      class="size-3 stroke-current [stroke-linecap:round] [stroke-linejoin:round]"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M9.5 6h-7m3-3.5L2 6l3.5 3.5" />
                    </svg>
                  </button>
                  <h2 class="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                    <span class="font-display text-sm tracking-[0.04em] text-foreground uppercase">
                      {{ activePage === 'theme' ? 'Theme' : 'Background' }}
                    </span>
                    <span class="truncate font-mono text-[0.58rem] text-muted">Advanced settings</span>
                  </h2>
                </div>

                <template v-if="activePage === 'overview'">
                  <ThemeSettingsSection
                    ref="themePageTrigger"
                    @open-advanced="openSettingsPage('theme')"
                  />
                  <BackgroundSelectField
                    class="mt-3"
                    :meta="backgroundMeta"
                    :model-value="backgroundPreference"
                    :active-background="activeBackground"
                    @update:model-value="onBackgroundChange"
                  />
                  <SettingsPageButton
                    ref="backgroundPageTrigger"
                    class="mt-3"
                    label="Advanced background settings"
                    @select="openSettingsPage('background')"
                  />

                  <SharedSettingsResetButton
                    class="mt-4"
                    label="Restore default settings"
                    :disabled="!hasDisplayPreferenceChanges"
                    disabled-reason="All display settings already use their defaults."
                    @click="restoreDefaultSettings"
                  />
                </template>

                <ThemeAdvancedSettings v-else-if="activePage === 'theme'" />

                <section
                  v-else
                  aria-label="Advanced background settings"
                >
                  <SharedSelectField
                    label="Background performance"
                    :meta="performanceMeta"
                    :model-value="backgroundPerformance.mode"
                    :options="performanceOptions"
                    :disabled="controlsDisabled"
                    @update:model-value="onPerformanceModeChange"
                  />

                  <SharedToggleField
                    class="mt-4"
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
                    <SharedAccordion
                      label="Animations"
                      :heading-level="3"
                    >
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
                  </SharedAccordionGroup>

                  <section
                    class="border-t border-line"
                    :aria-labelledby="backgroundSettingsTitleId"
                  >
                    <div class="flex items-baseline justify-between gap-3 py-3 font-mono font-normal">
                      <h3
                        :id="backgroundSettingsTitleId"
                        class="text-[0.6rem] text-foreground"
                      >
                        Configure active background
                      </h3>
                      <span class="truncate text-[0.54rem] text-muted">{{ activeBackgroundLabel }}</span>
                    </div>

                    <SettingsBackgroundFields
                      v-if="activeBackground !== 'none'"
                      :background-label="activeBackgroundLabel"
                      :controls="activeSettingsControls"
                      :values="activeSettingsValues"
                      :overrides="activeSettingOverrides"
                      :performance-preset="activePerformancePreset"
                      @change="onBackgroundSettingChange"
                      @reset="onBackgroundSettingReset"
                      @reset-all="onActiveBackgroundSettingsReset"
                    />
                  </section>
                </section>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
