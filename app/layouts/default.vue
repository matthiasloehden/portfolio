<!--
  Provides the application shell and initializes persisted display preferences.
  Background selection and animation dispatch live in LayoutBackgroundOrchestrator
  so this layout remains responsible only for page-level composition.
-->
<script setup lang="ts">
import { createThemeInitializationScript } from '@/utils/themeInitialization';

const {
  backgroundPreference,
  backgroundAnimations,
  backgroundSettingOverrides,
  backgroundPerformance,
  syncThemeForRoute,
  initializePreferences,
  disposePreferences,
} = useDisplayPreferences();
const route = useRoute();

watch(
  () => route.path,
  (path) => syncThemeForRoute(path),
  { flush: 'post' },
);
onMounted(() => initializePreferences(route.path));
onBeforeUnmount(disposePreferences);

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
      :preference="backgroundPreference"
      :animations="backgroundAnimations"
      :setting-overrides="backgroundSettingOverrides"
      :performance="backgroundPerformance"
    />

    <LayoutSiteHeader />

    <slot />

    <LayoutSiteFooter />
  </div>
</template>
