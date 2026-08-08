<script setup lang="ts">
import type { BackgroundPreference } from '@/composables/usePortfolioPreferences';

const route = useRoute();

const { backgroundPreference, backgroundMotionEnabled, initializePreferences, disposePreferences } =
  usePortfolioPreferences();

const normalizedPath = computed(() => route.path.replace(/\/+$/, '') || '/');

const automaticBackgrounds: Record<string, BackgroundPreference> = {
  '/': 'wave',
  '/work': 'triangles',
  '/academic': 'particles',
  '/personal': 'mesh',
};

const automaticBackground = computed(() => automaticBackgrounds[normalizedPath.value] ?? 'none');

const selectedBackground = computed<BackgroundPreference>(() =>
  backgroundPreference.value === 'auto' ? automaticBackground.value : backgroundPreference.value,
);

const isBackgroundActive = (background: BackgroundPreference) => selectedBackground.value === background;

const isMotionEnabled = (background: BackgroundPreference) =>
  isBackgroundActive(background) && backgroundMotionEnabled.value;

onMounted(initializePreferences);
onBeforeUnmount(disposePreferences);

useHead({
  script: [
    {
      key: 'theme-init',
      innerHTML: `(() => {
        let theme;

        try {
          theme = localStorage.getItem('portfolio-theme');
        } catch {}

        document.documentElement.dataset.theme =
          theme === 'light' || theme === 'dark'
            ? theme
            : matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
      })();`,
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
      :class="{
        'background-scene-active': isBackgroundActive('wave'),
      }"
      :active="isMotionEnabled('wave')"
    />

    <TriangleBackground
      class="background-scene"
      :class="{
        'background-scene-active': isBackgroundActive('triangles'),
        'background-motion-paused': !isMotionEnabled('triangles'),
      }"
    />

    <ParticleBackground
      class="background-scene"
      :class="{
        'background-scene-active': isBackgroundActive('particles'),
      }"
      :active="isMotionEnabled('particles')"
    />

    <PersonalTriangleMeshBackground
      class="background-scene"
      :class="{
        'background-scene-active': isBackgroundActive('mesh'),
      }"
      :active="isMotionEnabled('mesh')"
    />

    <LayoutSiteHeader />

    <slot />

    <LayoutSiteFooter />
  </div>
</template>
