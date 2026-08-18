<script setup lang="ts">
defineProps<{
  title: string;
  meta: string;
}>();
</script>

<template>
  <figure
    class="motion-panel m-0 border border-line-strong bg-raised shadow-panel"
    data-reveal="scale"
  >
    <figcaption class="flex justify-between gap-4 border-b border-line px-4 py-3 font-mono text-[0.6rem] text-muted">
      <span>{{ title }}</span
      ><span class="text-quiet">{{ meta }}</span>
    </figcaption>
    <slot />
  </figure>
</template>

<style>
.motion-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transition:
    border-color 260ms ease,
    box-shadow 420ms ease,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.motion-panel::after {
  position: absolute;
  z-index: 0;
  inset: -40% 55% -40% -45%;
  background: linear-gradient(100deg, transparent, rgb(50 132 255 / 8%), transparent);
  content: '';
  pointer-events: none;
  transform: translateX(-85%) skewX(-14deg);
  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
}

.motion-panel > * {
  position: relative;
  z-index: 1;
}

.motion-panel.is-revealed > :not(figcaption) {
  animation: panel-content-arrive 720ms cubic-bezier(0.22, 1, 0.36, 1) 130ms both;
}

.motion-panel.is-revealed figcaption span:first-child {
  animation: panel-caption-arrive 600ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
}

@media (hover: hover) and (pointer: fine) {
  .motion-panel.is-revealed:hover,
  .motion-panel.is-revealed:focus-within {
    border-color: var(--primary-bright);
    box-shadow:
      1.75rem 1.75rem 0 rgb(50 132 255 / 5%),
      0 2rem 6rem rgb(0 0 0 / 24%);
    transform: translateY(-0.35rem) scale(1.008);
  }

  .motion-panel:hover::after,
  .motion-panel:focus-within::after {
    transform: translateX(240%) skewX(-14deg);
  }

  .motion-panel [data-panel-item] {
    transition:
      background-color 220ms ease,
      border-color 220ms ease,
      transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .motion-panel [data-panel-item]:hover {
    z-index: 1;
    border-color: var(--line-strong);
    background-color: var(--surface-hover);
    transform: translateY(-0.16rem) scale(1.018);
  }
}

@keyframes panel-content-arrive {
  from {
    opacity: 0;
    transform: translateY(0.9rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes panel-caption-arrive {
  from {
    opacity: 0;
    transform: translateX(-0.8rem);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
