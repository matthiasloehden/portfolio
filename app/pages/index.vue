<script setup lang="ts">
import { homeAbout, homeCapabilities, homeHero } from '@/data/home';
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <HomeAmbientBackground />
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
