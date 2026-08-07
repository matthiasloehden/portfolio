<script setup lang="ts">
import type { ProjectCaseStudyContent } from '@/types/content';

defineProps<
  ProjectCaseStudyContent & {
    reverse?: boolean;
  }
>();
</script>

<template>
  <article
    :id="id"
    class="case-study"
    :aria-labelledby="`${id}-title`"
  >
    <header class="case-header">
      <div
        class="case-number"
        aria-hidden="true"
      >
        {{ number }}
      </div>
      <div>
        <SharedSectionKicker
          :prefix="category"
          :label="type"
        />
        <h2 :id="`${id}-title`">{{ title }}</h2>
      </div>
    </header>

    <div :class="['case-layout', { reverse }]">
      <div class="case-copy">
        <p class="case-lead">{{ lead }}</p>
        <p>{{ description }}</p>

        <div class="case-notes">
          <section
            v-for="note in notes"
            :key="note.title"
          >
            <h3>{{ note.title }}</h3>
            <p>{{ note.text }}</p>
          </section>
        </div>
      </div>

      <div class="case-panel-slot">
        <slot />
      </div>
    </div>
  </article>
</template>

<style scoped>
.case-study {
  padding-block: clamp(6rem, 11vw, 10rem);
  border-top: 1px solid var(--border);
  scroll-margin-top: 1rem;
}

.case-header {
  display: grid;
  grid-template-columns: clamp(4rem, 8vw, 7rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
}

.case-number {
  color: var(--accent);
  font-family: var(--display-font);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 700;
  line-height: 0.8;
  text-shadow: 0 0 2rem rgba(50, 132, 255, 0.25);
}

.case-header h2 {
  max-width: 17ch;
  margin-top: 1rem;
  font-size: clamp(3.3rem, 7vw, 6.8rem);
}

.case-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(3.5rem, 9vw, 9rem);
  align-items: center;
  margin-top: clamp(4rem, 8vw, 7rem);
}

.case-layout.reverse {
  grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.72fr);
}

.case-layout.reverse .case-copy {
  grid-column: 2;
}

.case-layout.reverse .case-panel-slot {
  grid-row: 1;
  grid-column: 1;
}

.case-copy {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.8;
}

.case-copy > p + p {
  margin-top: 1.4rem;
}

.case-lead {
  color: var(--text);
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  line-height: 1.55;
}

.case-notes {
  display: grid;
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.case-notes section {
  padding: 1rem 0 0 1rem;
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--accent);
}

.case-notes h3 {
  color: var(--accent-bright);
  font-family: var(--mono-font);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.case-notes p {
  margin-top: 0.55rem;
  font-size: 0.82rem;
  line-height: 1.65;
}

@media (max-width: 820px) {
  .case-layout,
  .case-layout.reverse {
    grid-template-columns: 1fr;
  }

  .case-layout.reverse .case-copy {
    grid-row: 1;
    grid-column: 1;
  }

  .case-layout.reverse .case-panel-slot {
    grid-row: 2;
    grid-column: 1;
  }
}

@media (max-width: 620px) {
  .case-header {
    grid-template-columns: 1fr;
  }

  .case-number {
    font-size: 2.8rem;
  }

  .case-header h2 {
    font-size: clamp(3rem, 14vw, 4.8rem);
  }
}
</style>
