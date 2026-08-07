<script setup lang="ts">
import type { TransitionProps } from 'vue';

const transitionCovered = ref(false);

const pageTransition: TransitionProps = {
  name: 'page',
  mode: 'out-in',
  onBeforeLeave: () => {
    transitionCovered.value = true;
  },
  onBeforeEnter: () => {
    transitionCovered.value = false;
  },
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
