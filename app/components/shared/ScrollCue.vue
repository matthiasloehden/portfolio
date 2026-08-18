<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <a
    class="scroll-cue inline-flex items-center gap-[0.7rem] font-mono text-[0.65rem] text-muted transition-colors duration-[160ms] [--reveal-delay:260ms] hover:text-foreground focus-visible:text-foreground"
    :href="href"
    data-reveal="up"
  >
    {{ label }}
    <span
      class="scroll-cue-arrow inline-block text-primary"
      aria-hidden="true"
      >↓</span
    >
  </a>
</template>

<style scoped>
.scroll-cue-arrow {
  animation: scroll-cue-bounce 1.8s ease-in-out infinite;
}

@keyframes scroll-cue-bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(0.28rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue-arrow {
    animation: none;
  }
}
</style>
