<script setup lang="ts">
import type { BackgroundPreference, ThemePreference } from '@/composables/usePortfolioPreferences';

const {
  themePreference,
  backgroundPreference,
  backgroundMotionEnabled,
  setThemePreference,
  setBackgroundPreference,
  setBackgroundMotionEnabled,
} = usePortfolioPreferences();

const root = ref<HTMLElement | null>(null);
const open = ref(false);

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const backgroundOptions: { value: BackgroundPreference; label: string }[] = [
  { value: 'auto', label: 'Automatic per page' },
  { value: 'wave', label: 'Wave grid' },
  { value: 'particles', label: 'Particles' },
  { value: 'triangles', label: 'Triangles' },
  { value: 'mesh', label: 'Living mesh' },
  { value: 'none', label: 'None' },
];

function onThemeChange(event: Event): void {
  setThemePreference((event.target as HTMLSelectElement).value as ThemePreference);
}

function onBackgroundChange(event: Event): void {
  setBackgroundPreference((event.target as HTMLSelectElement).value as BackgroundPreference);
}

function onMotionChange(event: Event): void {
  setBackgroundMotionEnabled((event.target as HTMLInputElement).checked);
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
      class="settings-trigger grid size-9 cursor-pointer place-items-center border border-line bg-raised text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-controls="display-settings"
      aria-label="Display settings"
      title="Display settings"
      @click="open = !open"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 4h7M12 4h2M2 12h2M7 12h7M2 8h3M8 8h6" />
        <circle cx="10.5" cy="4" r="1.5" />
        <circle cx="5.5" cy="12" r="1.5" />
        <circle cx="6.5" cy="8" r="1.5" />
      </svg>
    </button>

    <div
      v-if="open"
      id="display-settings"
      class="settings-panel absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(18rem,calc(100vw-2rem))] border border-line bg-raised/95 p-4 shadow-2xl backdrop-blur-xl"
      role="dialog"
      aria-label="Display settings"
    >
      <div class="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
        <strong class="font-display text-sm tracking-[0.04em] text-foreground uppercase">Display</strong>
        <span class="font-mono text-[0.58rem] text-muted">Preferences</span>
      </div>

      <label class="settings-field">
        <span>Theme</span>
        <select
          :value="themePreference"
          @change="onThemeChange"
        >
          <option
            v-for="option in themeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="settings-field mt-3">
        <span>Background</span>
        <select
          :value="backgroundPreference"
          @change="onBackgroundChange"
        >
          <option
            v-for="option in backgroundOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="mt-4 flex cursor-pointer items-center justify-between gap-4 border-t border-line pt-4">
        <span class="grid gap-1">
          <strong class="font-mono text-[0.65rem] font-semibold text-foreground">Background motion</strong>
          <small class="font-mono text-[0.56rem] leading-relaxed text-muted">Keep the scene visible but pause it.</small>
        </span>
        <input
          class="motion-toggle"
          type="checkbox"
          :checked="backgroundMotionEnabled"
          :disabled="backgroundPreference === 'none'"
          @change="onMotionChange"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.settings-trigger {
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.settings-trigger:hover,
.settings-trigger:focus-visible,
.settings-trigger[aria-expanded='true'] {
  transform: rotate(5deg) scale(1.06);
}

.settings-trigger svg {
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.2;
}

.settings-panel {
  animation: settings-enter 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transform-origin: top right;
}

.settings-field {
  display: grid;
  gap: 0.45rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
}

.settings-field select {
  width: 100%;
  min-height: 2.4rem;
  padding-inline: 0.7rem 2rem;
  border: 1px solid var(--border);
  border-radius: 0;
  outline: none;
  background: var(--background);
  color: var(--text);
  font: inherit;
  font-size: 0.65rem;
}

.settings-field select:focus-visible {
  border-color: var(--border-strong);
}

.motion-toggle {
  width: 2.35rem;
  height: 1.3rem;
  flex: none;
  cursor: pointer;
  accent-color: var(--accent);
}

.motion-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@keyframes settings-enter {
  from {
    opacity: 0;
    transform: translateY(-0.35rem) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .settings-panel {
    animation: none;
  }
}
</style>
