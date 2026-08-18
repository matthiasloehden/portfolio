<script setup lang="ts">
import type { PersonalHomelabPanelContent } from '@/types/content';

defineProps<{
  content: PersonalHomelabPanelContent;
}>();

const pulseDelayClasses = ['', '[animation-delay:-0.8s]', '[animation-delay:-1.6s]'];
const nodeClasses = 'grid min-h-[7.5rem] content-between border border-line bg-surface p-[0.9rem]';
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <div
      class="grid grid-cols-1 items-center p-5 sm:grid-cols-[minmax(8rem,0.55fr)_2.5rem_minmax(12rem,1fr)] sm:p-6 md:grid-cols-[minmax(8rem,0.55fr)_3.5rem_minmax(12rem,1fr)] md:p-8 xl:grid-cols-[minmax(8rem,0.55fr)_5rem_minmax(12rem,1fr)] xl:p-10"
      :aria-label="content.ariaLabel"
    >
      <div
        :class="[
          nodeClasses,
          'min-h-[7.5rem] border-line-strong bg-[linear-gradient(145deg,rgb(50_132_255/12%),transparent_60%),var(--surface)] sm:min-h-56',
        ]"
        data-panel-item
      >
        <span class="font-mono text-[0.55rem] text-primary">{{ content.host.code }}</span>
        <strong class="font-display text-[1.15rem] uppercase sm:text-[1.35rem] md:text-[1.5rem] xl:text-[1.7rem]">
          {{ content.host.title }}
        </strong>
        <small class="font-mono text-[0.55rem] text-muted">{{ content.host.description }}</small>
      </div>

      <div
        class="relative mx-auto h-10 w-px overflow-hidden bg-line-strong [--travel-distance:2.5rem] sm:mx-0 sm:h-px sm:w-auto md:[--travel-distance:3.5rem] xl:[--travel-distance:5rem]"
        aria-hidden="true"
      >
        <i
          v-for="(_, index) in 3"
          :key="index"
          :class="[
            'data-pulse absolute top-[-0.35rem] left-[-0.15rem] size-[0.35rem] rounded-full bg-primary-bright shadow-[0_0_0.7rem_var(--primary)] sm:top-[-0.15rem] sm:left-[-0.35rem]',
            pulseDelayClasses[index],
          ]"
        />
      </div>

      <div class="grid gap-[0.65rem]">
        <div
          v-for="service in content.services"
          :key="service.title"
          :class="nodeClasses"
          data-panel-item
        >
          <span class="font-mono text-[0.55rem] text-primary">{{ service.type }}</span>
          <strong class="font-display text-[1.15rem] uppercase sm:text-[1.35rem] md:text-[1.5rem] xl:text-[1.7rem]">
            {{ service.title }}
          </strong>
          <small class="font-mono text-[0.55rem] text-muted">{{ service.description }}</small>
        </div>
      </div>
    </div>

    <div
      class="flex flex-wrap justify-between gap-3 border-t border-line px-4 py-[0.9rem] font-mono text-[0.55rem] text-muted"
    >
      <SharedStatusIndicator
        :label="content.status"
        tone="primary"
        size="compact"
        text-tone="foreground"
      />
      <span>{{ content.process }}</span>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.data-pulse {
  animation: data-travel-mobile 2.4s linear infinite;
}

@keyframes data-travel-mobile {
  to {
    transform: translateY(var(--travel-distance));
  }
}

@media (min-width: 38.75rem) {
  .data-pulse {
    animation-name: data-travel;
  }

  @keyframes data-travel {
    to {
      transform: translateX(var(--travel-distance));
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .data-pulse {
    animation: none;
  }
}
</style>
