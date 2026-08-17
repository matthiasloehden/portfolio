<script setup lang="ts">
type HeadingLevel = 'h1' | 'h2' | 'h3';
type HeadingSize = 'hero' | 'section' | 'card';

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
  section:
    'mt-6 max-w-[16ch] text-[3.2rem] leading-[0.9] tracking-[-0.065em] xs:text-[4rem] sm:text-[5rem] lg:text-[5.5rem] xl:text-[6.2rem]',
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
