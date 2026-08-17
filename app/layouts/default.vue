<!--
  Provides the application shell and initializes persisted display preferences.
  Background selection and animation dispatch live in LayoutBackgroundOrchestrator
  so this layout remains responsible only for page-level composition.
-->
<script setup lang="ts">
const {
  backgroundPreference,
  backgroundAnimations,
  backgroundAdvancedSettings,
  backgroundPerformance,
  initializePreferences,
  disposePreferences,
} = usePreferences();

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

    <LayoutBackgroundOrchestrator
      :preference="backgroundPreference"
      :animations="backgroundAnimations"
      :advanced-settings="backgroundAdvancedSettings"
      :performance="backgroundPerformance"
    />

    <LayoutSiteHeader />

    <slot />

    <LayoutSiteFooter />
  </div>
</template>
