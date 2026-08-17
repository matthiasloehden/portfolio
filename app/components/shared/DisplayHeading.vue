<script setup lang="ts">
type HeadingLevel = 'h1' | 'h2' | 'h3';
type HeadingSize = 'hero' | 'page' | 'overview' | 'section' | 'case' | 'closing' | 'card';

withDefaults(
  defineProps<{
    level?: HeadingLevel;
    size?: HeadingSize;
  }>(),
  {
    level: 'h2',
    size: 'section',
  },
);

const slots = useSlots();

const sizeClasses: Record<HeadingSize, string> = {
  hero: 'mt-6 max-w-[11ch] text-[4rem] leading-[0.82] tracking-[-0.075em] xs:text-[4.75rem] sm:text-[6rem] lg:text-[7rem] xl:text-[8.2rem]',
  page: 'mt-9 max-w-none text-[4.6rem] leading-[0.76] tracking-[-0.075em] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] xl:text-[9rem] 2xl:text-[9.8rem]',
  overview:
    'mt-6 max-w-[10ch] text-[2.8rem] leading-[0.92] tracking-[-0.065em] xs:text-[3.2rem] sm:text-[3.6rem] md:text-[4rem] xl:text-[4.5rem]',
  section:
    'mt-6 max-w-[16ch] text-[3.2rem] leading-[0.9] tracking-[-0.065em] xs:text-[4rem] sm:text-[5rem] lg:text-[5.5rem] xl:text-[6.2rem]',
  case: 'mt-4 max-w-[17ch] text-[3.4rem] leading-[0.9] tracking-[-0.065em] sm:text-[4rem] md:text-[5.4rem] lg:text-[5.9rem] xl:text-[6.3rem] 2xl:text-[6.8rem]',
  closing:
    'text-[3.8rem] leading-[0.9] tracking-[-0.065em] xs:text-[4.5rem] sm:text-[5.25rem] md:text-[6rem] lg:text-[6.75rem] xl:text-[7.2rem] 2xl:text-[7.5rem]',
  card: 'text-[1.8rem] leading-none tracking-[-0.045em] md:text-[2.2rem] xl:text-[2.7rem]',
};
</script>

<template>
  <component
    :is="level"
    :class="['font-display font-bold text-balance uppercase [font-stretch:condensed]', sizeClasses[size]]"
  >
    <slot />
    <em
      v-if="slots.accent"
      class="text-primary-bright not-italic [text-shadow:0_0_3rem_color-mix(in_srgb,var(--primary)_18%,transparent)]"
    >
      <slot name="accent" />
    </em>
  </component>
</template>
