<script setup lang="ts">
import type { WorkCaseStudyContent } from '@/types/content';

defineProps<
  WorkCaseStudyContent & {
    reverse?: boolean;
  }
>();
</script>

<template>
  <article
    :id="id"
    class="work-case"
    :aria-labelledby="`${id}-title`"
  >
    <header class="work-case-header">
      <span
        aria-hidden="true"
        data-reveal="left"
      >
        {{ number }}
      </span>
      <div
        class="motion-hover"
        data-reveal="up"
        style="--reveal-delay: 80ms"
      >
        <SharedSectionKicker
          :prefix="category"
          :label="type"
        />
        <h2 :id="`${id}-title`">{{ title }}</h2>
        <p>{{ summary }}</p>
      </div>
    </header>

    <div :class="['work-case-layout', { reverse }]">
      <div class="work-case-copy">
        <p
          v-for="(paragraph, index) in paragraphs"
          :key="paragraph"
          class="motion-hover"
          data-reveal="up"
          :style="`--reveal-delay: ${index * 70}ms`"
        >
          {{ paragraph }}
        </p>
        <dl class="work-facts">
          <div
            v-for="(fact, index) in facts"
            :key="fact.label"
            class="motion-hover"
            data-reveal="up"
            :style="`--reveal-delay: ${index * 55}ms`"
          >
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>

      <div class="work-panel-slot">
        <slot />
      </div>
    </div>
  </article>
</template>

<style scoped>
.work-case {
  padding-block: clamp(6rem, 11vw, 10rem);
  border-top: 1px solid var(--border);
  scroll-margin-top: 1rem;
}

.work-case-header {
  display: grid;
  grid-template-columns: clamp(4rem, 8vw, 7rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
}

.work-case-header > span {
  color: var(--accent);
  font-family: var(--display-font);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 700;
  line-height: 0.8;
  text-shadow: 0 0 2rem rgba(50, 132, 255, 0.25);
}

.work-case-header h2 {
  max-width: 17ch;
  margin-top: 1rem;
  font-size: clamp(3.3rem, 7vw, 6.8rem);
}

.work-case-header div > p:last-child {
  max-width: 42rem;
  margin-top: 1.25rem;
  color: var(--muted);
  font-size: clamp(1rem, 1.5vw, 1.12rem);
  line-height: 1.7;
}

.work-case-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(3.5rem, 9vw, 9rem);
  align-items: center;
  margin-top: clamp(4rem, 8vw, 7rem);
}

.work-case-layout.reverse {
  grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.72fr);
}

.work-case-layout.reverse .work-case-copy {
  grid-column: 2;
}

.work-case-layout.reverse .work-panel-slot {
  grid-row: 1;
  grid-column: 1;
}

.work-case-copy {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.8;
}

.work-case-copy > p:first-child {
  color: var(--text);
  font-size: clamp(1.12rem, 1.8vw, 1.34rem);
  line-height: 1.6;
}

.work-case-copy > p + p {
  margin-top: 1.4rem;
}

.work-facts {
  margin: 2.5rem 0 0;
  border-top: 1px solid var(--border);
}

.work-facts div {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1rem;
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--border);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.work-facts dt {
  color: var(--accent-bright);
  text-transform: uppercase;
}

.work-facts dd {
  margin: 0;
}

@media (max-width: 820px) {
  .work-case-layout,
  .work-case-layout.reverse {
    grid-template-columns: 1fr;
  }

  .work-case-layout.reverse .work-case-copy {
    grid-row: 1;
    grid-column: 1;
  }

  .work-case-layout.reverse .work-panel-slot {
    grid-row: 2;
    grid-column: 1;
  }
}

@media (max-width: 620px) {
  .work-case-header {
    grid-template-columns: 1fr;
  }

  .work-case-header > span {
    font-size: 2.8rem;
  }

  .work-case-header h2 {
    font-size: clamp(3rem, 14vw, 4.8rem);
  }
}

@media (max-width: 420px) {
  .work-facts div {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}

@media (hover: hover) and (pointer: fine) {
  .work-case :is(h2, h3, p, dt, dd),
  .work-panel-slot {
    pointer-events: auto;
  }
}
</style>
