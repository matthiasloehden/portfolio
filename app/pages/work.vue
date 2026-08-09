<script setup lang="ts">
import {
  clientCase,
  coreWorkStack,
  learningCase,
  retailCase,
  signageCase,
  workHighlights,
  workList,
} from '@/data/work';

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

      <section
        class="grid border-t border-line grid-cols-1 gap-12 py-20 md:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] md:gap-[6vw] md:py-[6vw]"
        aria-labelledby="work-context-title"
      >
        <div
          class="motion-hover"
          data-reveal="left"
        >
          <SharedSectionKicker label="Core stack across these products" />
          <h2
            id="work-context-title"
            class="work-title mt-6 max-w-[10ch]"
          >
            One foundation, different systems.
          </h2>

          <div class="flex flex-col gap-2 mt-8">
            <ul
              v-for="(items, category) in coreWorkStack"
              :key="category"
              class="flex flex-wrap gap-[0.55rem] list-none p-0"
              :aria-label="category"
            >
              <li
                v-for="item in items"
                :key="item"
                class="border border-line px-[0.7rem] py-2 text-muted font-mono text-[0.62rem]"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <div
          class="self-end"
          data-reveal="right"
          style="--reveal-delay: 100ms"
        >
        <h3 class="highlight-h3">
  Highlights
</h3>
          <ul class="mt-4 border-t border-line list-none p-0">
            <li
              v-for="highlight in workHighlights"
              :key="highlight"
              class="motion-hover border-b border-line py-[0.8rem] text-muted leading-[1.55]"
            >
              {{ highlight }}
            </li>
          </ul>
        </div>
      </section>

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
.highlight-h3 {
  color: var(--accent-bright);
  font-family: var(--mono-font);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.work-title {
  margin-top: 1.5rem;
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  line-height: 0.92;
}

@media (hover: hover) and (pointer: fine) {
  .work-shell > main {
    pointer-events: none;
  }

  .work-shell main :deep(:is(a, h1, h2, h3, p, dt, dd, li, figcaption, .work-panel, .work-context)) {
    pointer-events: auto;
  }
}
</style>