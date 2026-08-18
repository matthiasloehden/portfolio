<template>
  <div
    class="ambient-drift pointer-events-none absolute inset-0 -z-2 origin-[50%_20%] bg-[radial-gradient(circle_at_18%_13%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_28rem),radial-gradient(circle_at_82%_31%,color-mix(in_srgb,var(--primary)_5%,transparent),transparent_34rem)]"
    aria-hidden="true"
  />
  <div
    class="pointer-events-none absolute top-0 left-1/2 -z-2 h-full w-px bg-line opacity-35"
    aria-hidden="true"
  />
</template>

<style scoped>
.ambient-drift {
  animation: ambient-drift 16s ease-in-out infinite alternate;
}

@keyframes ambient-drift {
  from {
    opacity: 0.7;
    transform: translate3d(-1.5%, -0.5%, 0) scale(1);
  }

  to {
    opacity: 1;
    transform: translate3d(1.5%, 1%, 0) scale(1.06);
  }
}
</style>
