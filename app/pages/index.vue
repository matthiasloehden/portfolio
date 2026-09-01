<script setup lang="ts">
const portfolio = usePortfolioContent();
const home = computed(() => portfolio.value.home);

useSeoMeta({
  title: () => home.value.homeMeta.title,
  description: () => home.value.homeMeta.description,
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <HomeAmbientBackground />
    <main
      id="content"
      class="site-container"
    >
      <HomeHero :content="home.homeHero" />
      <HomeAbout :content="home.homeAbout" />
      <HomeCapabilities :content="home.homeCapabilities" />
    </main>
  </div>
</template>
