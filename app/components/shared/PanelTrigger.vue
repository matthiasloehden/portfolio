<script setup lang="ts">
/**
 * Shared trigger for compact header panels.
 *
 * Navigation and settings expose different content, but opening either one is
 * the same interaction. This component centralizes size, active styling, focus
 * treatment, ARIA state, and the icon-to-close transition so those behaviors
 * cannot drift between header features.
 */

const props = defineProps<{
  expanded: boolean;
  controls: string;
  label: string;
  expandedLabel?: string;
  popup?: 'dialog' | 'menu';
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const accessibleLabel = computed(() => (props.expanded ? (props.expandedLabel ?? props.label) : props.label));
</script>

<template>
  <button
    :class="[
      'grid size-9 cursor-pointer place-items-center border bg-raised text-muted transition-[color,border-color,background-color,transform] duration-150 ease-out hover:scale-[1.05] hover:border-line-strong hover:text-foreground focus-visible:scale-[1.05] focus-visible:border-line-strong focus-visible:text-foreground motion-reduce:transition-none',
      expanded ? 'scale-[1.05] border-primary/70 bg-primary/10 text-foreground' : 'border-line',
    ]"
    type="button"
    :aria-haspopup="popup"
    :aria-expanded="expanded"
    :aria-controls="controls"
    :aria-label="accessibleLabel"
    :title="accessibleLabel"
    @click="emit('toggle')"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition-[opacity,transform] duration-[90ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      enter-from-class="-rotate-[35deg] scale-[0.72] opacity-0"
      leave-active-class="transition-[opacity,transform] duration-[90ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      leave-to-class="rotate-[35deg] scale-[0.72] opacity-0"
    >
      <span
        :key="expanded ? 'close' : 'open'"
        class="grid size-4 place-items-center"
        aria-hidden="true"
      >
        <svg
          v-if="expanded"
          class="size-4 stroke-current [stroke-width:1.3] [stroke-linecap:round]"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="m3 3 10 10M13 3 3 13" />
        </svg>
        <slot v-else />
      </span>
    </Transition>
  </button>
</template>
