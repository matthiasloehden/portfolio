<script setup lang="ts">
import { enqueueIdleTask } from '@/utils/idleTask';
import SharedPanelTrigger from '@/components/shared/PanelTrigger.vue';

interface PanelTriggerHandle {
  focus: (options?: FocusOptions) => void;
}

const root = ref<HTMLElement | null>(null);
const panelTrigger = ref<PanelTriggerHandle | null>(null);
const panelMounted = ref(false);
const open = defineModel<boolean>('open', { default: false });
const { t } = useI18n();
let cancelPanelPrewarm: (() => void) | undefined;

function mountPanel(): void {
  panelMounted.value = true;
  cancelPanelPrewarm?.();
  cancelPanelPrewarm = undefined;
}

function togglePanel(): void {
  if (!panelMounted.value) mountPanel();
  open.value = !open.value;
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (open.value && event.target instanceof Node && !root.value?.contains(event.target)) open.value = false;
}

function onEscape(): void {
  if (!open.value) return;

  open.value = false;
  nextTick(() => panelTrigger.value?.focus({ preventScroll: true }));
}

watch(open, (isOpen) => {
  if (isOpen && !panelMounted.value) mountPanel();
});

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  cancelPanelPrewarm = enqueueIdleTask(mountPanel, { priority: 20 });
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  cancelPanelPrewarm?.();
});
</script>

<template>
  <div
    ref="root"
    class="static md:relative"
    @keydown.esc.prevent="onEscape"
  >
    <SharedPanelTrigger
      ref="panelTrigger"
      :expanded="open"
      controls="display-settings"
      :label="t('display.open')"
      :expanded-label="t('display.close')"
      popup="dialog"
      @toggle="togglePanel"
    >
      <svg
        class="size-4 stroke-current [stroke-width:1.2] [stroke-linecap:round] [stroke-linejoin:round]"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M2 4h7M12 4h2M2 12h2M7 12h7M2 8h3M8 8h6" />
        <circle
          cx="10.5"
          cy="4"
          r="1.5"
        />
        <circle
          cx="5.5"
          cy="12"
          r="1.5"
        />
        <circle
          cx="6.5"
          cy="8"
          r="1.5"
        />
      </svg>
    </SharedPanelTrigger>

    <LazyLayoutDisplaySettingsPanel
      v-if="panelMounted"
      v-model:open="open"
    />
  </div>
</template>
