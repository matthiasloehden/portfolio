<script setup lang="ts">
/**
 * Owns dividers for a contiguous accordion stack so adjacent disclosures never
 * paint overlapping borders. Open-ended nested groups delegate their closing
 * divider to the nearest surrounding group instead of drawing another one.
 */
withDefaults(
  defineProps<{
    endBorder?: boolean;
  }>(),
  {
    endBorder: true,
  },
);
</script>

<template>
  <div :class="['divide-y divide-line border-t border-line', endBorder ? 'border-b' : undefined]">
    <slot />
  </div>
</template>
