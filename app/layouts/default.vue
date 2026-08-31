<!--
  Provides the application shell and initializes persisted display preferences.
  Display-preference state resolves the active background, while
  LayoutBackgroundOrchestrator presents it alongside the page composition.
-->
<script setup lang="ts">
import { createThemeInitializationScript } from '@/utils/themeInitialization';

const {
  resolvedBackground,
  backgroundAnimations,
  backgroundSettingOverrides,
  backgroundPerformance,
  syncDisplayForRoute,
  syncThemeForRoute,
  initializePreferences,
  disposePreferences,
} = useDisplayPreferences();
const route = useRoute();
const nuxtApp = useNuxtApp();
const removeThemeRouteHook = nuxtApp.hook('page:transition:finish', syncThemeForRoute);

watch(
  () => route.path,
  (path) => syncDisplayForRoute(path),
  { flush: 'post' },
);
onMounted(() => initializePreferences(route.path));
onBeforeUnmount(() => {
  removeThemeRouteHook();
  disposePreferences();
});

useHead({
  script: [
    {
      key: 'theme-init',
      innerHTML: createThemeInitializationScript(),
    },
  ],
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <NuxtRouteAnnouncer />

    <LayoutSiteSkipLink target="#content" />

    <LayoutBackgroundOrchestrator
      :background="resolvedBackground"
      :animations="backgroundAnimations"
      :setting-overrides="backgroundSettingOverrides"
      :performance="backgroundPerformance"
    />

    <LayoutSiteHeader />

    <slot />

    <LayoutSiteFooter />
  </div>
</template>
