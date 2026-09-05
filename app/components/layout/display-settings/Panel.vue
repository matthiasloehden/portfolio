<!--
  Owns the settings dialog and its internal navigation. The eager parent keeps
  global dismissal and trigger focus available without adding these controls
  to the initial header bundle.
-->
<script setup lang="ts">
import {
  getBackgroundSettingControls,
  resolveBackgroundSettingsForEditor,
} from '@/config/backgrounds/settingsRegistry';
import type {
  BackgroundAnimation,
  BackgroundId,
  BackgroundPerformanceMode,
  BackgroundPreference,
  BackgroundQualityId,
  BackgroundSettingKey,
  BackgroundSettingValue,
} from '@/types/background';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import SharedSettingsResetButton from '@/components/shared/form/SettingsResetButton.vue';
import SharedToggleField from '@/components/shared/form/ToggleField.vue';
import BackgroundSelectField from './BackgroundSelectField.vue';
import LanguageSelectField from './LanguageSelectField.vue';
import SettingsBackgroundFields from './BackgroundSettingsFields.vue';
import SettingsPageButton from './SettingsPageButton.vue';
import ThemeAdvancedSettings from './ThemeAdvancedSettings.vue';
import ThemeSettingsSection from './ThemeSettingsSection.vue';

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
  restoreDefaultSettings: restoreDefaultDisplayPreferences,
} = useDisplayPreferences();
const {
  automaticLocale,
  hasLanguagePreferenceChanges,
  restoreDefaultLanguagePreference,
  selectedPreference: languagePreference,
  setLanguagePreference,
} = useLanguagePreference();

interface FocusableHandle {
  focus: (options?: FocusOptions) => void;
}

type SettingsPage = 'overview' | 'theme' | 'background';
type PendingPageFocus = Exclude<SettingsPage, 'overview'> | 'back' | null;

const panel = ref<HTMLElement | null>(null);
const panelScroller = ref<HTMLElement | null>(null);
const themePageTrigger = ref<FocusableHandle | null>(null);
const backgroundPageTrigger = ref<FocusableHandle | null>(null);
const backButton = ref<HTMLButtonElement | null>(null);
const activePage = ref<SettingsPage>('overview');
const pendingPageFocus = ref<PendingPageFocus>(null);
const backgroundSettingsTitleId = useId();
const open = defineModel<boolean>('open', { default: false });
const { performanceStats } = useBackgroundRuntimeStatus();
const { t } = useI18n();
const hasSettingsChanges = computed(() => hasDisplayPreferenceChanges.value || hasLanguagePreferenceChanges.value);

const animationOptions = computed<
  readonly {
    key: BackgroundAnimation;
    label: string;
    description: string;
  }[]
>(() =>
  (['idle', 'cursorMovement', 'cursorClick', 'scroll'] as const).map((key) => ({
    key,
    label: t(`display.background.animationOptions.${key}.label`),
    description: t(`display.background.animationOptions.${key}.description`),
  })),
);

const activeBackground = computed(() => resolvedBackground.value);
const editableBackground = computed<BackgroundId | null>(() =>
  activeBackground.value === 'none' ? null : activeBackground.value,
);
const activeBackgroundLabel = computed(() =>
  activeBackground.value === 'none'
    ? t('display.shared.none')
    : t(`display.background.scenes.${activeBackground.value}`),
);
const controlsDisabled = computed(() => activeBackground.value === 'none');

const backgroundMeta = computed(() =>
  backgroundPreference.value === 'auto' || backgroundPreference.value === 'random'
    ? activeBackgroundLabel.value
    : undefined,
);

const performanceOptions = computed<readonly { value: BackgroundPerformanceMode; label: string }[]>(() => [
  { value: 'auto', label: t('display.shared.auto') },
  { value: 'high', label: t('display.shared.high') },
  { value: 'medium', label: t('display.shared.medium') },
  { value: 'low', label: t('display.shared.low') },
]);

const activePerformancePreset = computed<BackgroundQualityId>(() => {
  if (backgroundPerformance.value.mode !== 'auto') return backgroundPerformance.value.mode;
  return performanceStats.value?.mode === 'auto' ? performanceStats.value.preset : 'high';
});

const performanceMeta = computed(() => {
  if (backgroundPerformance.value.mode !== 'auto') return undefined;

  const preset = activePerformancePreset.value;
  return t(`display.shared.${preset}`);
});

const activeSettingsControls = computed(() =>
  activeBackground.value === 'none' ? [] : getBackgroundSettingControls(activeBackground.value),
);

const activeSettingsValues = computed<Readonly<Record<string, BackgroundSettingValue>>>(() =>
  activeBackground.value === 'none'
    ? {}
    : resolveBackgroundSettingsForEditor(
        activeBackground.value,
        backgroundSettingOverrides.value,
        activePerformancePreset.value,
      ),
);

const activeSettingOverrides = computed<Readonly<Record<string, BackgroundSettingValue | undefined>>>(() =>
  activeBackground.value === 'none' ? {} : backgroundSettingOverrides.value[activeBackground.value],
);

function onBackgroundChange(value: BackgroundPreference): void {
  setBackgroundPreference(value);
}

async function restoreDefaultSettings(): Promise<void> {
  restoreDefaultDisplayPreferences();
  await restoreDefaultLanguagePreference();
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

function onBackgroundSettingChange(setting: string, value: BackgroundSettingValue): void {
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
  pendingPageFocus.value = 'back';
  panelScroller.value?.scrollTo({ top: 0 });
  activePage.value = page;
}

function returnToOverview(): void {
  if (activePage.value === 'overview') return;

  pendingPageFocus.value = activePage.value;
  panelScroller.value?.scrollTo({ top: 0 });
  activePage.value = 'overview';
}

function onPageTransitionAfterEnter(): void {
  if (!open.value || pendingPageFocus.value === null) return;

  const focusedElement = document.activeElement;
  const focusWasMovedDuringTransition =
    focusedElement instanceof HTMLElement && focusedElement !== panel.value && panel.value?.contains(focusedElement);

  if (focusWasMovedDuringTransition) {
    pendingPageFocus.value = null;
    return;
  }

  if (pendingPageFocus.value === 'back') {
    backButton.value?.focus({ preventScroll: true });
  } else {
    const trigger = pendingPageFocus.value === 'theme' ? themePageTrigger.value : backgroundPageTrigger.value;
    trigger?.focus({ preventScroll: true });
  }

  pendingPageFocus.value = null;
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

onMounted(async () => {
  if (open.value) {
    await nextTick();
    panel.value?.focus({ preventScroll: true });
  }
});
</script>

<template>
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
      :aria-label="t('display.dialogLabel')"
    >
      <div
        ref="panelScroller"
        class="max-h-[calc(100vh-4.75rem)] overflow-x-hidden overflow-y-auto overscroll-contain px-6 py-4 md:-mr-4 md:max-h-[min(44rem,calc(100vh-5rem))] md:w-[calc(100%+1rem)] md:p-0"
      >
        <div class="md:w-[20rem] md:p-4">
          <Transition
            mode="out-in"
            enter-active-class="transition-[opacity] duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-active-class="transition-[opacity] duration-100 ease-in motion-reduce:transition-none"
            leave-to-class="opacity-0"
            @after-enter="onPageTransitionAfterEnter"
          >
            <div :key="activePage">
              <h2
                v-if="activePage === 'overview'"
                class="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3"
              >
                <span class="font-display text-sm tracking-[0.04em] text-foreground uppercase">{{
                  t('display.title')
                }}</span>
                <span class="font-mono text-[0.58rem] text-muted">{{ t('display.subtitle') }}</span>
              </h2>
              <div
                v-else
                class="mb-4 flex items-center gap-3 border-b border-line pb-3"
              >
                <button
                  ref="backButton"
                  class="grid size-7 shrink-0 cursor-pointer place-items-center border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
                  type="button"
                  :aria-label="t('display.back')"
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
                    {{ activePage === 'theme' ? t('display.theme.label') : t('display.background.label') }}
                  </span>
                  <span class="truncate font-mono text-[0.58rem] text-muted">{{ t('display.advanced') }}</span>
                </h2>
              </div>

              <template v-if="activePage === 'overview'">
                <LanguageSelectField
                  :model-value="languagePreference"
                  :automatic-locale="automaticLocale"
                  @update:model-value="setLanguagePreference"
                />
                <ThemeSettingsSection
                  ref="themePageTrigger"
                  class="mt-3"
                  @open-advanced="openSettingsPage('theme')"
                />
                <BackgroundSelectField
                  class="mt-3"
                  :meta="backgroundMeta"
                  :model-value="backgroundPreference"
                  :active-background="activeBackground"
                  @update:model-value="onBackgroundChange"
                />
                <SharedSelectField
                  class="mt-3"
                  :label="t('display.background.performance')"
                  :meta="performanceMeta"
                  :model-value="backgroundPerformance.mode"
                  :options="performanceOptions"
                  :disabled="controlsDisabled"
                  @update:model-value="onPerformanceModeChange"
                />

                <SettingsPageButton
                  ref="backgroundPageTrigger"
                  class="mt-3"
                  :label="t('display.background.advancedLabel')"
                  @select="openSettingsPage('background')"
                />

                <SharedSettingsResetButton
                  class="mt-4"
                  :label="t('display.restore')"
                  :disabled="!hasSettingsChanges"
                  :disabled-reason="t('display.restoreDisabled')"
                  @click="restoreDefaultSettings"
                />
              </template>

              <ThemeAdvancedSettings v-else-if="activePage === 'theme'" />

              <section
                v-else
                :aria-label="t('display.background.advancedLabel')"
              >
                <SharedAccordionGroup
                  class="mt-4"
                  :end-border="false"
                >
                  <SharedToggleField
                    :label="t('display.background.performanceStats')"
                    :description="t('display.background.performanceStatsDescription')"
                    :checked="backgroundPerformance.showStats"
                    :disabled="controlsDisabled"
                    @change="setBackgroundPerformanceStatsEnabled"
                  />
                  <SharedAccordion
                    :label="t('display.background.animations')"
                    :heading-level="3"
                  >
                    <fieldset class="grid gap-3">
                      <legend class="sr-only">{{ t('display.background.animations') }}</legend>
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
                      {{ t('display.background.configure') }}
                    </h3>
                    <span class="truncate text-[0.54rem] text-muted">{{ activeBackgroundLabel }}</span>
                  </div>

                  <SettingsBackgroundFields
                    v-if="editableBackground"
                    :background-label="activeBackgroundLabel"
                    :background="editableBackground"
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
</template>
