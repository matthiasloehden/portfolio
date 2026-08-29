<script setup lang="ts">
const props = defineProps<{
  text: string;
  active?: boolean;
}>();

defineSlots<{
  default(props: { describedBy: string | undefined }): unknown;
}>();

const tooltipId = useId();
const trigger = ref<HTMLElement | null>(null);
const dismissed = ref(false);
const describedBy = computed(() => (props.active && !dismissed.value ? tooltipId : undefined));

function dismiss(): void {
  if (props.active) dismissed.value = true;
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !props.active || dismissed.value) return;

  event.preventDefault();
  event.stopPropagation();
  dismiss();
}

function restore(): void {
  dismissed.value = false;
}

function restoreWhenInactive(): void {
  nextTick(() => {
    if (!trigger.value?.matches(':focus-within') && !trigger.value?.matches(':hover')) restore();
  });
}

watch(() => props.active, restore);
</script>

<template>
  <span
    ref="trigger"
    class="tooltip-trigger relative block"
    @keydown="onKeydown"
    @focusout="restoreWhenInactive"
    @pointerleave="restoreWhenInactive"
  >
    <slot :described-by="describedBy" />
    <span
      v-if="active && !dismissed"
      :id="tooltipId"
      class="tooltip pointer-events-auto absolute right-0 bottom-[calc(100%+0.45rem)] z-[70] w-max max-w-[min(14rem,calc(100vw-2rem))] border border-line-strong bg-raised px-2.5 py-2 font-mono text-[0.54rem] leading-[1.4] text-foreground shadow-xl"
      role="tooltip"
    >
      {{ text }}
    </span>
  </span>
</template>

<style scoped>
.tooltip {
  visibility: hidden;
  opacity: 0;
  transform: translateY(0.2rem);
  transition:
    opacity 140ms ease-out,
    transform 140ms ease-out,
    visibility 0s linear 140ms;
}

.tooltip-trigger:hover > .tooltip {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  transition-delay: 700ms;
}

.tooltip-trigger:focus-visible > .tooltip,
.tooltip-trigger:focus-within > .tooltip {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  transition-delay: 100ms;
}

@media (prefers-reduced-motion: reduce) {
  .tooltip {
    transform: none;
    transition-property: visibility;
    transition-duration: 0s;
  }
}
</style>
