<script setup lang="ts">
type KickerVariant = 'plain' | 'line' | 'status';
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

const props = withDefaults(
  defineProps<{
    prefix?: string;
    label: string;
    hidePrefixFromScreenReaders?: boolean;
    variant?: KickerVariant;
    reveal?: RevealDirection | false;
  }>(),
  {
    hidePrefixFromScreenReaders: false,
    variant: 'plain',
    reveal: 'up',
  },
);

const variantClasses: Record<KickerVariant, string> = {
  plain: '',
  line: "flex items-center gap-3 after:h-px after:w-10 after:bg-line-strong after:content-['']",
  status: 'flex items-center gap-2.5',
};
</script>

<template>
  <p
    :class="['font-mono text-[0.66rem] tracking-[0.08em] text-muted uppercase', variantClasses[variant]]"
    :data-reveal="reveal || undefined"
  >
    <span
      v-if="variant === 'status'"
      class="size-[0.42rem] animate-[status-pulse_2.4s_ease-in-out_infinite] rounded-full bg-primary shadow-[0_0_0.75rem_var(--primary)]"
      aria-hidden="true"
    />
    <span
      v-if="prefix"
      :class="['text-primary', variant === 'plain' && 'mr-2.5']"
      :aria-hidden="props.hidePrefixFromScreenReaders || undefined"
    >
      {{ prefix }}
    </span>
    {{ label }}
  </p>
</template>
