<script setup lang="ts">
import type {
  BackgroundAnimation,
  BackgroundPerformanceMode,
  BackgroundPreference,
  ThemePreference,
  WaveSetting,
} from '@/composables/usePreferences';
import { BACKGROUND_OPTIONS, resolveBackground } from '@/config/backgrounds';
import { WAVE_SETTING_CONTROLS } from '@/types/background';
import SettingsNumberField from './display-settings/NumberField.vue';
import SettingsSelectField from './display-settings/SelectField.vue';
import SettingsToggleField from './display-settings/ToggleField.vue';

const {
  themePreference,
  backgroundPreference,
  backgroundAnimations,
  backgroundAdvancedSettings,
  backgroundPerformance,
  setThemePreference,
  setBackgroundPreference,
  setBackgroundAnimationEnabled,
  setWaveSetting,
  setBackgroundPerformanceMode,
  setBackgroundPerformanceStatsEnabled,
  restoreDefaultSettings,
} = usePreferences();

const root = ref<HTMLElement | null>(null);
const open = ref(false);

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const performanceOptions: Array<{ value: BackgroundPerformanceMode; label: string }> = [
  { value: 'auto', label: 'Auto' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const animationOptions: Array<{
  key: BackgroundAnimation;
  label: string;
  description: string;
}> = [
  { key: 'idle', label: 'Background idle animation', description: 'Animate the scene while it is idle.' },
  {
    key: 'cursorMovement',
    label: 'Cursor movement animation',
    description: 'React to mouse, pen and touch input.',
  },
  {
    key: 'cursorClick',
    label: 'Cursor click animation',
    description: 'React to mouse, pen and touch presses.',
  },
  { key: 'scroll', label: 'Scroll animation', description: 'React to scrolling and wheel gestures.' },
];

const route = useRoute();
const controlsDisabled = computed(() => backgroundPreference.value === 'none');
const activeBackground = computed(() => resolveBackground(route.path, backgroundPreference.value));

function onThemeChange(value: string): void {
  setThemePreference(value as ThemePreference);
}

function onBackgroundChange(value: string): void {
  setBackgroundPreference(value as BackgroundPreference);
}

function onPerformanceModeChange(value: string): void {
  setBackgroundPerformanceMode(value as BackgroundPerformanceMode);
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
    class="relative"
    @keydown.esc="open = false"
  >
    <button
      class="grid size-9 cursor-pointer place-items-center border border-line bg-raised text-muted transition-[color,border-color,background-color,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06] hover:rotate-5 hover:border-line-strong hover:text-foreground focus-visible:scale-[1.06] focus-visible:rotate-5 focus-visible:border-line-strong focus-visible:text-foreground aria-expanded:scale-[1.06] aria-expanded:rotate-5"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-controls="display-settings"
      aria-label="Display settings"
      title="Display settings"
      @click="open = !open"
    >
      <svg
        class="stroke-current [stroke-width:1.2] [stroke-linecap:round] [stroke-linejoin:round]"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
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
    </button>

    <Transition
      enter-active-class="origin-top-right transition duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="-translate-y-[0.35rem] scale-[0.97] opacity-0"
      leave-active-class="origin-top-right transition duration-150 ease-in"
      leave-to-class="-translate-y-1 scale-[0.98] opacity-0"
    >
      <div
        v-if="open"
        id="display-settings"
        class="absolute top-[calc(100%+0.75rem)] right-0 z-50 max-h-[min(44rem,calc(100vh-5rem))] w-[min(18rem,calc(100vw-2rem))] origin-top-right overflow-y-auto overscroll-contain border border-line bg-raised/95 p-4 shadow-2xl backdrop-blur-xl"
        role="dialog"
        aria-label="Display settings"
      >
        <div class="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
          <strong class="font-display text-sm tracking-[0.04em] text-foreground uppercase">Display</strong>
          <span class="font-mono text-[0.58rem] text-muted">Preferences</span>
        </div>

        <SettingsSelectField
          label="Theme"
          :model-value="themePreference"
          :options="themeOptions"
          @update:model-value="onThemeChange"
        />

        <SettingsSelectField
          class="mt-3"
          label="Background"
          :model-value="backgroundPreference"
          :options="BACKGROUND_OPTIONS"
          @update:model-value="onBackgroundChange"
        />

        <SettingsSelectField
          class="mt-3"
          label="Performance"
          description="Auto lowers scene quality if rendering remains slow."
          :model-value="backgroundPerformance.mode"
          :options="performanceOptions"
          :disabled="controlsDisabled"
          @update:model-value="onPerformanceModeChange"
        />

        <SettingsToggleField
          class="mt-3"
          label="Performance stats"
          description="Show diagnostics for the active background."
          :checked="backgroundPerformance.showStats"
          :disabled="controlsDisabled"
          @change="setBackgroundPerformanceStatsEnabled"
        />

        <fieldset class="mt-4 grid gap-3 border-t border-line pt-4">
          <legend class="sr-only">Background animations</legend>
          <SettingsToggleField
            v-for="option in animationOptions"
            :key="option.key"
            :label="option.label"
            :description="option.description"
            :checked="backgroundAnimations[option.key]"
            :disabled="controlsDisabled"
            @change="setBackgroundAnimationEnabled(option.key, $event)"
          />
        </fieldset>

        <details
          v-if="activeBackground === 'wave'"
          class="mt-4 border-t border-line pt-4"
        >
          <summary class="cursor-pointer font-mono text-[0.65rem] font-semibold text-foreground">
            Wave Grid advanced settings
          </summary>

          <p class="mt-[0.6rem] mb-[0.85rem] font-mono text-[0.56rem] leading-[1.45] text-muted">
            Visual density, ripple capacity and render resolution.
          </p>

          <div class="grid gap-3">
            <SettingsNumberField
              v-for="control in WAVE_SETTING_CONTROLS"
              :key="control.key"
              :label="control.label"
              :description="control.description"
              :model-value="backgroundAdvancedSettings.wave[control.key]"
              :min="control.min"
              :max="control.max"
              :step="control.step"
              :disabled="controlsDisabled"
              @update:model-value="setWaveSetting(control.key as WaveSetting, $event)"
            />
          </div>
        </details>

        <button
          class="mt-4 w-full cursor-pointer border border-line px-3 py-2 font-mono text-[0.6rem] text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
          type="button"
          @click="restoreDefaultSettings"
        >
          Restore default settings
        </button>
      </div>
    </Transition>
  </div>
</template>
