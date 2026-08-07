<script setup lang="ts">
import { clientCase, learningCase, retailCase, signageCase, workList } from '@/data/work';

useSeoMeta({
  title: 'Professional Work — Matthias Löhden',
  description:
    'Professional software projects by Matthias Löhden at TopRed Media GmbH, including learning, shop management, digital signage, and communication platforms.',
});
</script>

<template>
  <div class="work-shell relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <WorkHero />
      <SharedCaseStudyList
        id="work-list"
        title-id="work-list-title"
        label="Selected professional work"
        title="Platforms built around real operations."
        :items="workList"
      />

      <WorkCaseStudy v-bind="learningCase">
        <WorkLearningPanel />
      </WorkCaseStudy>

      <WorkCaseStudy
        v-bind="retailCase"
        reverse
      >
        <WorkRetailPanel />
      </WorkCaseStudy>

      <WorkCaseStudy v-bind="signageCase">
        <WorkSignagePanel />
      </WorkCaseStudy>

      <WorkCaseStudy
        v-bind="clientCase"
        reverse
      >
        <WorkClientPlatformPanel />
      </WorkCaseStudy>

      <WorkClosing />
    </main>
  </div>
</template>

<style scoped>
.work-shell::after {
  position: fixed;
  z-index: 10;
  inset: 0;
  background: var(--background);
  content: '';
  pointer-events: none;
  animation: work-page-reveal 760ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
}

@keyframes work-page-reveal {
  from {
    opacity: 1;
    visibility: visible;
  }

  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (hover: hover) and (pointer: fine) {
  .work-shell > main {
    pointer-events: none;
  }

  .work-shell main :deep(:is(a, h1, h2, h3, p, dt, dd, figcaption, .work-panel)) {
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .work-shell::after {
    visibility: hidden;
    animation: none;
  }
}
</style>
