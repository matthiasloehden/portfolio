<script setup lang="ts">
defineProps<{
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
}>();

const descriptionId = useId();

const emit = defineEmits<{
  change: [checked: boolean];
}>();

function onChange(event: Event): void {
  emit('change', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label
    class="group flex items-center justify-between gap-4"
    :class="disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'"
  >
    <span class="grid gap-1">
      <strong class="font-mono text-[0.65rem] font-semibold text-foreground">{{ label }}</strong>
      <small
        :id="descriptionId"
        class="font-mono text-[0.56rem] leading-[1.45] text-muted"
      >
        {{ description }}
      </small>
    </span>
    <span class="relative h-[1.45rem] w-[2.6rem] shrink-0">
      <input
        class="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        type="checkbox"
        :checked="checked"
        :disabled="disabled"
        :aria-label="label"
        :aria-describedby="descriptionId"
        @change="onChange"
      />
      <span
        class="pointer-events-none absolute inset-0 overflow-hidden border transition-[background-color,border-color,box-shadow] duration-200 ease-out peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary-bright motion-reduce:transition-none"
        :class="[
          checked
            ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_24%,var(--surface))] shadow-[inset_0_0_0.7rem_color-mix(in_srgb,var(--primary)_10%,transparent)]'
            : 'border-line-strong bg-background',
          disabled
            ? undefined
            : 'group-hover:border-primary group-hover:shadow-[0_0_0.65rem_color-mix(in_srgb,var(--primary)_12%,transparent)]',
        ]"
        aria-hidden="true"
      >
        <span
          class="absolute inset-y-0 left-0 w-1/2 bg-primary opacity-0 blur-sm transition-opacity duration-200 motion-reduce:transition-none"
          :class="checked ? 'opacity-25' : undefined"
        />
        <span
          class="toggle-knob absolute top-1/2 left-[0.25rem] grid size-[0.9rem] -translate-y-1/2 place-items-center border border-line-strong bg-muted shadow-sm transition-[translate,scale,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          :class="[
            checked
              ? 'translate-x-[1.05rem] border-primary-bright bg-primary-bright shadow-[0_0_0.45rem_color-mix(in_srgb,var(--primary)_40%,transparent)]'
              : undefined,
            disabled ? undefined : 'group-active:scale-[0.85]',
          ]"
        >
          <span
            class="size-1 bg-primary-foreground transition-[scale,opacity] delay-75 duration-150 motion-reduce:transition-none"
            :class="checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
          />
        </span>
      </span>
    </span>
  </label>
</template>
