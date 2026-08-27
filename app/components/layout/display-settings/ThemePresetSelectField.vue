<script setup lang="ts">
import { THEME_PRESETS, getThemePreset } from '@/config/themes';
import type { ThemeMode, ThemePalette, ThemePresetId } from '@/types/theme';

const props = defineProps<{
  modelValue: ThemePresetId;
  mode: ThemeMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ThemePresetId];
}>();

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const optionElements = ref<HTMLElement[]>([]);
const open = ref(false);
const labelId = useId();
const listboxId = useId();
const selectedPreset = computed(() => getThemePreset(props.modelValue));
const selectedPreviewColors = computed(() => getPreviewColors(selectedPreset.value.palettes[props.mode]));

function getPreviewColors(palette: ThemePalette): readonly string[] {
  return [palette.background, palette.primary, palette.foreground];
}

function setOptionElement(element: unknown, index: number): void {
  if (element instanceof HTMLElement) optionElements.value[index] = element;
}

function openAndFocus(index: number): void {
  open.value = true;
  nextTick(() => optionElements.value[index]?.focus());
}

function onTriggerKeydown(event: KeyboardEvent): void {
  const selectedIndex = THEME_PRESETS.findIndex((preset) => preset.id === props.modelValue);

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    openAndFocus(Math.min(THEME_PRESETS.length - 1, selectedIndex + 1));
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    openAndFocus(Math.max(0, selectedIndex - 1));
  } else if (event.key === 'Escape' && open.value) {
    event.preventDefault();
    event.stopPropagation();
    open.value = false;
  }
}

function onOptionKeydown(event: KeyboardEvent, index: number): void {
  let targetIndex: number | undefined;

  if (event.key === 'ArrowDown') targetIndex = Math.min(THEME_PRESETS.length - 1, index + 1);
  else if (event.key === 'ArrowUp') targetIndex = Math.max(0, index - 1);
  else if (event.key === 'Home') targetIndex = 0;
  else if (event.key === 'End') targetIndex = THEME_PRESETS.length - 1;
  else if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    open.value = false;
    nextTick(() => trigger.value?.focus());
    return;
  }

  if (targetIndex !== undefined) {
    event.preventDefault();
    optionElements.value[targetIndex]?.focus();
  }
}

function selectPreset(preset: ThemePresetId): void {
  emit('update:modelValue', preset);
  open.value = false;
  nextTick(() => trigger.value?.focus());
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (open.value && event.target instanceof Node && !root.value?.contains(event.target)) open.value = false;
}

function onFocusOut(event: FocusEvent): void {
  if (!(event.relatedTarget instanceof Node) || !root.value?.contains(event.relatedTarget)) open.value = false;
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown));
</script>

<template>
  <div
    ref="root"
    class="relative grid gap-[0.45rem] font-mono text-[0.6rem] text-muted"
    @focusout="onFocusOut"
  >
    <span
      :id="labelId"
      class="text-[0.62rem] font-semibold text-foreground"
    >
      Color scheme
    </span>
    <button
      ref="trigger"
      class="grid min-h-[3.6rem] w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-line bg-background px-3 py-2 text-left transition-colors outline-none hover:border-line-strong focus-visible:border-line-strong"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-label="`Color scheme: ${selectedPreset.label}`"
      @click="open = !open"
      @keydown="onTriggerKeydown"
    >
      <span
        class="flex -space-x-1"
        aria-hidden="true"
      >
        <span
          v-for="color in selectedPreviewColors"
          :key="color"
          class="size-5 rounded-full border border-line-strong"
          :style="{ backgroundColor: color }"
        />
      </span>
      <span class="min-w-0">
        <span class="block text-[0.65rem] text-foreground">{{ selectedPreset.label }}</span>
        <span class="mt-0.5 block truncate text-[0.54rem] text-muted">{{ selectedPreset.description }}</span>
      </span>
      <svg
        class="size-3 shrink-0 stroke-current transition-transform duration-150 motion-reduce:transition-none"
        :class="open ? 'rotate-180' : undefined"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out motion-reduce:transition-none"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-75 ease-in motion-reduce:transition-none"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div
        v-if="open"
        :id="listboxId"
        class="absolute top-full right-0 left-0 z-20 mt-1 grid gap-1 border border-line-strong bg-raised p-1.5 shadow-2xl"
        role="listbox"
        :aria-labelledby="labelId"
      >
        <button
          v-for="(preset, index) in THEME_PRESETS"
          :key="preset.id"
          :ref="(element) => setOptionElement(element, index)"
          class="group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border px-2.5 py-2 text-left transition-colors outline-none"
          :class="
            modelValue === preset.id
              ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_8%,var(--surface))]'
              : 'border-transparent bg-background hover:border-line-strong focus-visible:border-line-strong'
          "
          type="button"
          role="option"
          :tabindex="modelValue === preset.id ? 0 : -1"
          :aria-selected="modelValue === preset.id"
          @click="selectPreset(preset.id)"
          @keydown="onOptionKeydown($event, index)"
        >
          <span
            class="flex -space-x-1"
            aria-hidden="true"
          >
            <span
              v-for="color in getPreviewColors(preset.palettes[mode])"
              :key="color"
              class="size-4 rounded-full border border-line-strong"
              :style="{ backgroundColor: color }"
            />
          </span>
          <span class="min-w-0">
            <span class="block text-[0.6rem] text-foreground">{{ preset.label }}</span>
            <span class="mt-0.5 block text-[0.52rem] leading-[1.3] text-muted">{{ preset.description }}</span>
          </span>
          <span
            class="size-1.5 rounded-full"
            :class="modelValue === preset.id ? 'bg-primary shadow-[0_0_0.4rem_var(--primary)]' : 'bg-line'"
            aria-hidden="true"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>
