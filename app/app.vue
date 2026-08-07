<script setup lang="ts">
import type { TransitionProps } from 'vue';

const transitionCovered = ref(false);

function revealPage(): void {
  // Give newly mounted WebGL backgrounds enough time to paint their first frame
  // before the transition layer becomes transparent.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      transitionCovered.value = false;
    });
  });
}

const pageTransition: TransitionProps = {
  name: 'page',
  mode: 'out-in',
  onBeforeLeave: () => {
    transitionCovered.value = true;
  },
  onEnter: revealPage,
};
</script>

<template>
  <div class="app-shell">
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>

    <div
      class="page-transition-curtain"
      :class="{ 'is-covering': transitionCovered }"
      aria-hidden="true"
    />
  </div>
</template>
