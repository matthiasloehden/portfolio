<script setup lang="ts">
import { homeAbout, homeCapabilities, homeHero } from '@/data/home';
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 -z-2 origin-[50%_20%] animate-[ambient-drift_16s_ease-in-out_infinite_alternate] bg-[radial-gradient(circle_at_18%_13%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_28rem),radial-gradient(circle_at_82%_31%,color-mix(in_srgb,var(--primary)_5%,transparent),transparent_34rem)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute top-0 left-1/2 -z-2 h-full w-px bg-line opacity-35"
      aria-hidden="true"
    />
    <main
      id="content"
      class="site-container"
    >
      <HomeHero :content="homeHero" />
      <HomeAbout :content="homeAbout" />
      <HomeCapabilities :content="homeCapabilities" />
    </main>
  </div>
</template>
