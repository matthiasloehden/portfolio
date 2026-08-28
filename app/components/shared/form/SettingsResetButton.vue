<script setup lang="ts">
import SharedTooltip from '@/components/shared/Tooltip.vue';

const props = defineProps<{
  label: string;
  ariaLabel?: string;
  disabled?: boolean;
  disabledReason?: string;
}>();

const emit = defineEmits<{
  click: [];
}>();

function onClick(): void {
  // aria-disabled keeps the reason reachable by keyboard while this guard
  // preserves the behavior of a natively disabled button.
  if (!props.disabled) emit('click');
}
</script>

<template>
  <SharedTooltip
    :text="disabledReason ?? ''"
    :active="disabled && Boolean(disabledReason)"
  >
    <template #default="{ describedBy }">
      <button
        class="w-full border border-line px-3 py-2 font-mono text-[0.56rem] text-muted transition-colors focus-visible:border-line-strong focus-visible:text-foreground"
        :class="
          disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:border-line-strong hover:text-foreground'
        "
        type="button"
        :aria-disabled="disabled || undefined"
        :aria-describedby="describedBy"
        :aria-label="ariaLabel"
        @click="onClick"
      >
        {{ label }}
      </button>
    </template>
  </SharedTooltip>
</template>
