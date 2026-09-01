<script setup lang="ts">
import { isHexColor } from '@/utils/color';

const props = defineProps<{
  label: string;
  description?: string;
  modelValue: string;
  overridden?: boolean;
  resetLabel?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  reset: [];
}>();

const descriptionId = useId();
const errorId = useId();
const draft = ref(props.modelValue);
const valid = computed(() => isHexColor(draft.value));
const displayedColor = computed(() => (valid.value ? draft.value : props.modelValue));
const pickerValue = computed(() => displayedColor.value.slice(0, 7).toLowerCase());
const { t } = useI18n();

watch(
  () => props.modelValue,
  (value) => {
    draft.value = value;
  },
);

function onInput(event: Event): void {
  draft.value = (event.target as HTMLInputElement).value;
  if (valid.value) emit('update:modelValue', draft.value.toLowerCase());
}

function onBlur(): void {
  if (!valid.value) draft.value = props.modelValue;
}

function onPickerInput(event: Event): void {
  const hex = (event.target as HTMLInputElement).value.toLowerCase();
  const alpha = displayedColor.value.length === 9 ? displayedColor.value.slice(7) : '';
  const value = `${hex}${alpha}`;

  draft.value = value;
  emit('update:modelValue', value);
}
</script>

<template>
  <fieldset class="grid gap-[0.45rem] font-mono text-[0.6rem] text-muted">
    <legend class="sr-only">{{ label }}</legend>
    <span class="grid gap-[0.2rem]">
      <span class="flex items-start justify-between gap-2">
        <span class="text-[0.62rem] font-semibold text-foreground">{{ label }}</span>
        <button
          v-if="overridden"
          class="cursor-pointer text-[0.54rem] text-muted underline decoration-line underline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground"
          type="button"
          :title="resetLabel"
          :aria-label="`${label}: ${resetLabel ?? t('display.shared.resetOverride')}`"
          @click.prevent="emit('reset')"
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
    </span>

    <span
      class="group grid grid-cols-[2.4rem_minmax(0,1fr)] border bg-background transition-[border-color,box-shadow] duration-150 focus-within:shadow-[0_0_0.65rem_color-mix(in_srgb,var(--primary)_20%,transparent)] hover:shadow-[0_0_0.65rem_color-mix(in_srgb,var(--primary)_14%,transparent)] motion-reduce:transition-none"
      :class="
        valid
          ? 'border-line focus-within:border-primary-bright hover:border-primary'
          : 'border-red-500 focus-within:border-red-400 hover:border-red-400'
      "
    >
      <span
        class="relative border-r border-line bg-background transition-colors duration-150 group-focus-within:border-primary/60 group-hover:border-primary/60 motion-reduce:transition-none"
      >
        <input
          class="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0"
          type="color"
          :value="pickerValue"
          :aria-label="t('form.chooseColor', { label })"
          :aria-describedby="description ? descriptionId : undefined"
          @input="onPickerInput"
        />
        <span
          class="color-swatch absolute inset-[0.38rem] overflow-hidden border border-line-strong shadow-sm transition-[inset,scale,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:inset-[0.28rem] group-hover:border-primary-bright group-hover:shadow-[0_0_0.45rem_color-mix(in_srgb,var(--primary)_25%,transparent)] peer-active:scale-90 motion-reduce:transition-none"
          aria-hidden="true"
        >
          <span
            class="absolute inset-0"
            :style="{ backgroundColor: displayedColor }"
          />
          <span
            class="absolute inset-y-[-30%] left-[-75%] w-1/2 -skew-x-[20deg] bg-white/25 opacity-0 blur-[1px] transition-[translate,opacity] duration-300 ease-out group-hover:translate-x-[350%] group-hover:opacity-100 motion-reduce:hidden"
          />
        </span>
      </span>
      <input
        class="min-h-[2.4rem] w-full rounded-none border-0 bg-background px-[0.7rem] text-[0.65rem] text-foreground uppercase outline-none"
        type="text"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        maxlength="9"
        pattern="#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?"
        :value="draft"
        :aria-label="t('form.hexColor', { label })"
        :aria-describedby="
          [description ? descriptionId : undefined, !valid ? errorId : undefined].filter(Boolean).join(' ')
        "
        :aria-invalid="!valid"
        @input="onInput"
        @blur="onBlur"
      />
    </span>
    <small
      v-if="!valid"
      :id="errorId"
      class="text-[0.54rem] text-red-400"
      role="alert"
    >
      {{ t('form.invalidHex') }}
    </small>
  </fieldset>
</template>

<style scoped>
.color-swatch {
  background-color: var(--raised);
  background-image:
    linear-gradient(45deg, var(--line) 25%, transparent 25%), linear-gradient(-45deg, var(--line) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--line) 75%), linear-gradient(-45deg, transparent 75%, var(--line) 75%);
  background-position:
    0 0,
    0 0.25rem,
    0.25rem -0.25rem,
    -0.25rem 0;
  background-size: 0.5rem 0.5rem;
}
</style>
