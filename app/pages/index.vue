<script setup lang="ts">
import { capabilities } from '@/data/home';
</script>

<template>
  <div class="site-shell">
    <main
      id="content"
      class="site-container"
    >
      <HomeHero />
      <HomeAbout />
      <HomeCapabilities :capabilities="capabilities" />
    </main>
  </div>
</template>
