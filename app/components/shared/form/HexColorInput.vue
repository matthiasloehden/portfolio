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
          :aria-label="`${label}: ${resetLabel ?? 'reset override'}`"
          @click.prevent="emit('reset')"
        >
          Reset
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

    <span class="grid grid-cols-[2.4rem_minmax(0,1fr)]">
      <span
        class="grid place-items-center border border-r-0 border-line bg-background"
        aria-hidden="true"
      >
        <span
          class="size-4 border border-line-strong"
          :style="{ backgroundColor: valid ? draft : modelValue }"
        />
      </span>
      <input
        class="min-h-[2.4rem] w-full rounded-none border bg-background px-[0.7rem] text-[0.65rem] text-foreground uppercase outline-none focus-visible:border-line-strong"
        :class="valid ? 'border-line' : 'border-red-500'"
        type="text"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        maxlength="9"
        pattern="#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?"
        :value="draft"
        :aria-label="`${label} hex color`"
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
      Enter #RRGGBB or #RRGGBBAA.
    </small>
  </fieldset>
</template>
