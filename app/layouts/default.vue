<!--
  Provides the application shell and initializes browser preference runtimes.
  Display state resolves the active background, while language detection stays
  available independently from the lazy settings interface.
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
const { initializeLanguagePreference, disposeLanguagePreference } = useLanguagePreference();
const route = useRoute();
const nuxtApp = useNuxtApp();
const localeHead = useLocaleHead();
const removeThemeRouteHook = nuxtApp.hook('page:transition:finish', syncThemeForRoute);

syncDisplayForRoute(route.path);

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}));

watch(
  () => route.path,
  (path) => syncDisplayForRoute(path),
  { flush: 'post' },
);
onMounted(() => {
  initializePreferences(route.path);
  initializeLanguagePreference();
});
onBeforeUnmount(() => {
  removeThemeRouteHook();
  disposePreferences();
  disposeLanguagePreference();
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
