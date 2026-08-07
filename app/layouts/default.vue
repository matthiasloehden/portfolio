<script setup lang="ts">
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
    <LayoutSiteHeader />
    <slot />
    <LayoutSiteFooter />
  </div>
</template>
