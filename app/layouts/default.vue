<script setup lang="ts">
const route = useRoute();
const isWorkPage = computed(() => route.path === '/work' || route.path === '/work/');

useHead({
  script: [
    {
      key: 'theme-init',
      innerHTML:
        "(()=>{let theme;try{theme=localStorage.getItem('portfolio-theme')}catch{}document.documentElement.dataset.theme=theme==='light'||theme==='dark'?theme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})();",
    },
  ],
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <NuxtRouteAnnouncer />
    <LayoutSiteSkipLink target="#content" />
    <TriangleBackground v-if="isWorkPage" />
    <LayoutSiteHeader />
    <slot />
    <LayoutSiteFooter />
  </div>
</template>
