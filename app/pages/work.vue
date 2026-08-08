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
        class="work-context grid border-t border-line"
        aria-labelledby="work-context-title"
      >
        <div
          class="motion-hover"
          data-reveal="left"
        >
          <SharedSectionKicker label="Core stack across these products" />
          <h2 id="work-context-title">One foundation, different systems.</h2>
          <ul
            class="stack-list flex flex-wrap"
            aria-label="Core professional stack"
          >
            <li
              v-for="item in coreWorkStack"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </div>

        <div
          class="highlight-block"
          data-reveal="right"
          style="--reveal-delay: 100ms"
        >
          <h3>Highlights</h3>
          <ul>
            <li
              v-for="highlight in workHighlights"
              :key="highlight"
              class="motion-hover"
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
.work-context {
  grid-template-columns: minmax(15rem, 0.65fr) minmax(0, 1.35fr);
  gap: clamp(3rem, 8vw, 8rem);
  padding-block: clamp(5rem, 8vw, 7rem);
}

.work-context h2 {
  max-width: 10ch;
  margin-top: 1.5rem;
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  line-height: 0.92;
}

.stack-list {
  gap: 0.55rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.stack-list li {
  border: 1px solid var(--border);
  padding: 0.5rem 0.7rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.highlight-block {
  align-self: end;
}

.highlight-block h3 {
  color: var(--accent-bright);
  font-family: var(--mono-font);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.highlight-block ul {
  margin: 1rem 0 0;
  padding: 0;
  border-top: 1px solid var(--border);
  list-style: none;
}

.highlight-block li {
  padding-block: 0.8rem;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  line-height: 1.55;
}

@media (max-width: 820px) {
  .work-context {
    grid-template-columns: 1fr;
  }
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
