<script setup lang="ts">
import type { BackgroundPreference } from '@/composables/usePortfolioPreferences';

const route = useRoute();
const normalizedPath = computed(() => route.path.replace(/\/+$/, '') || '/');
const {
  backgroundPreference,
  backgroundMotionEnabled,
  initializePreferences,
  disposePreferences,
} = usePortfolioPreferences();

const automaticBackground = computed<BackgroundPreference>(() => {
  if (normalizedPath.value === '/') return 'wave';
  if (normalizedPath.value === '/work') return 'triangles';
  if (normalizedPath.value === '/projects') return 'particles';
  if (normalizedPath.value === '/personal') return 'mesh';
  return 'none';
});

const selectedBackground = computed(() =>
  backgroundPreference.value === 'auto' ? automaticBackground.value : backgroundPreference.value,
);
const isWaveBackground = computed(() => selectedBackground.value === 'wave');
const isTriangleBackground = computed(() => selectedBackground.value === 'triangles');
const isParticleBackground = computed(() => selectedBackground.value === 'particles');
const isMeshBackground = computed(() => selectedBackground.value === 'mesh');

onMounted(initializePreferences);
onBeforeUnmount(disposePreferences);

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
    <WaveGridBackground
      class="background-scene"
      :class="{ 'background-scene-active': isWaveBackground }"
      :active="isWaveBackground && backgroundMotionEnabled"
    />
    <TriangleBackground
      class="background-scene"
      :class="{
        'background-scene-active': isTriangleBackground,
        'background-motion-paused': !isTriangleBackground || !backgroundMotionEnabled,
      }"
    />
    <ParticleBackground
      class="background-scene"
      :class="{ 'background-scene-active': isParticleBackground }"
      :active="isParticleBackground && backgroundMotionEnabled"
    />
    <PersonalTriangleMeshBackground
      class="background-scene"
      :class="{ 'background-scene-active': isMeshBackground }"
      :active="isMeshBackground && backgroundMotionEnabled"
    />
    <LayoutSiteHeader />
    <slot />
    <LayoutSiteFooter />
  </div>
</template>
