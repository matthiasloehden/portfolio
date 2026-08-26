<script setup lang="ts">
import type { DisplayHeadingLine } from '@/types/content';
import { getDisplayHeadingText } from '@/utils/displayHeading';

type HeadingLevel = 'h1' | 'h2' | 'h3';
type HeadingSize = 'hero' | 'page' | 'overview' | 'section' | 'case' | 'closing' | 'card' | 'panel' | 'label';

const props = withDefaults(
  defineProps<{
    level?: HeadingLevel;
    size?: HeadingSize;
    lines?: DisplayHeadingLine[];
  }>(),
  {
    level: 'h2',
    size: 'section',
  },
);

const linesLabel = computed(() => (props.lines ? getDisplayHeadingText(props.lines) : undefined));

const accentClasses =
  'text-primary-bright not-italic [text-shadow:0_0_3rem_color-mix(in_srgb,var(--primary)_18%,transparent)]';

const sizeClasses: Record<HeadingSize, string> = {
  hero: 'mt-6 max-w-[11ch] text-[4rem] leading-[0.82] tracking-[-0.075em] xs:text-[4.75rem] sm:text-[6rem] lg:text-[7rem] xl:text-[8.2rem]',
  page: 'mt-9 max-w-none text-[4rem] leading-[0.76] tracking-[-0.075em] min-[23rem]:text-[4.875rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] xl:text-[9rem] 2xl:text-[9.8rem]',
  overview:
    'mt-6 max-w-[16ch] text-[2.8rem] leading-[0.92] tracking-[-0.065em] xs:text-[3.2rem] sm:text-[3.6rem] md:text-[4rem] xl:text-[4.5rem]',
  section:
    'mt-6 max-w-[16ch] text-[3.2rem] leading-[0.9] tracking-[-0.065em] xs:text-[4rem] sm:text-[5rem] lg:text-[5.5rem] xl:text-[6.2rem]',
  case: 'mt-4 max-w-[17ch] text-[3.4rem] leading-[0.9] tracking-[-0.065em] sm:text-[4rem] md:text-[5.4rem] lg:text-[5.9rem] xl:text-[6.3rem] 2xl:text-[6.8rem]',
  closing:
    'text-[3.8rem] leading-[0.9] tracking-[-0.065em] xs:text-[4.5rem] sm:text-[5.25rem] md:text-[6rem] lg:text-[6.75rem] xl:text-[7.2rem] 2xl:text-[7.5rem]',
  card: 'text-[1.8rem] leading-none tracking-[-0.045em] md:text-[2.2rem] xl:text-[2.7rem]',
  panel: 'text-[1.45rem] leading-none tracking-[-0.035em] sm:text-[1.7rem] md:text-[1.9rem] xl:text-[2.15rem]',
  label:
    'max-w-[12ch] text-[1.15rem] leading-[0.95] tracking-[-0.03em] sm:text-[1.35rem] md:text-[1.5rem] xl:text-[1.65rem]',
};
</script>

<template>
  <component
    :is="level"
    :class="['font-display font-bold text-balance uppercase [font-stretch:condensed]', sizeClasses[size]]"
    :aria-label="linesLabel"
  >
    <template v-if="lines">
      <template
        v-for="(line, index) in lines"
        :key="`${line.text}-${index}`"
      >
        <em
          v-if="line.accent"
          :class="accentClasses"
          >{{ line.text }}</em
        ><template v-else>{{ line.text }}</template
        >{{ line.suffix }}<br v-if="index < lines.length - 1" />
      </template>
    </template>
    <slot v-else />
  </component>
</template>
