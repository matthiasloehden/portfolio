<script setup lang="ts">
type StatusTone = 'success' | 'primary';
type StatusSize = 'compact' | 'default';
type StatusTextTone = 'muted' | 'foreground';

withDefaults(
  defineProps<{
    label: string;
    tone?: StatusTone;
    size?: StatusSize;
    textTone?: StatusTextTone;
    pulse?: boolean;
  }>(),
  {
    tone: 'success',
    size: 'default',
    textTone: 'muted',
    pulse: false,
  },
);

const sizeClasses: Record<StatusSize, string> = {
  compact: 'gap-[0.4rem] text-[0.54rem] leading-[1.45]',
  default: 'gap-[0.55rem] text-[0.58rem]',
};

const dotClasses: Record<StatusTone, string> = {
  success: 'bg-success shadow-[0_0_0.65rem_color-mix(in_srgb,var(--success)_75%,transparent)]',
  primary: 'bg-primary shadow-[0_0_0.6rem_var(--primary)]',
};

const textClasses: Record<StatusTextTone, string> = {
  muted: 'text-muted',
  foreground: 'text-foreground',
};
</script>

<template>
  <span :class="['inline-flex items-center font-mono', sizeClasses[size], textClasses[textTone]]">
    <i
      :class="[
        'size-[0.38rem] shrink-0 rounded-full',
        dotClasses[tone],
        pulse && 'animate-[status-pulse_2.2s_ease-in-out_infinite]',
      ]"
      aria-hidden="true"
    />
    {{ label }}
  </span>
</template>
