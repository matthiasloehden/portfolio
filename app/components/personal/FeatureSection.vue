<script setup lang="ts">
import type { PersonalSectionContent } from '@/types/content';

defineProps<
  PersonalSectionContent & {
    reverse?: boolean;
  }
>();
</script>

<template>
  <article
    :id="id"
    class="personal-section"
    :aria-labelledby="`${id}-title`"
  >
    <header class="section-header">
      <span
        class="section-number"
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
      </div>
    </header>

    <div :class="['section-layout', { reverse }]">
      <div class="section-copy">
        <p
          class="section-lead motion-hover"
          data-reveal="up"
        >
          {{ lead }}
        </p>
        <p
          v-for="(paragraph, index) in paragraphs"
          :key="paragraph"
          class="motion-hover"
          data-reveal="up"
          :style="`--reveal-delay: ${70 + index * 65}ms`"
        >
          {{ paragraph }}
        </p>
        <ul
          class="tag-list flex flex-wrap"
          aria-label="Related topics"
          data-reveal="up"
          style="--reveal-delay: 210ms"
        >
          <li
            v-for="tag in tags"
            :key="tag"
          >
            {{ tag }}
          </li>
        </ul>
      </div>

      <div class="panel-slot">
        <slot />
      </div>
    </div>
  </article>
</template>

<style scoped>
.personal-section {
  padding-block: clamp(6rem, 11vw, 10rem);
  border-top: 1px solid var(--border);
  scroll-margin-top: 1rem;
}

.section-header {
  display: grid;
  grid-template-columns: clamp(4rem, 8vw, 7rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
}

.section-number {
  color: var(--accent);
  font-family: var(--display-font);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 700;
  line-height: 0.8;
  text-shadow: 0 0 2rem rgba(50, 132, 255, 0.25);
}

.section-header h2 {
  max-width: 17ch;
  margin-top: 1rem;
  font-size: clamp(3.3rem, 7vw, 6.8rem);
}

.section-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(3.5rem, 9vw, 9rem);
  align-items: center;
  margin-top: clamp(4rem, 8vw, 7rem);
}

.section-layout.reverse {
  grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.72fr);
}

.section-layout.reverse .section-copy {
  grid-column: 2;
}

.section-layout.reverse .panel-slot {
  grid-row: 1;
  grid-column: 1;
}

.section-copy {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.8;
}

.section-copy > p + p {
  margin-top: 1.4rem;
}

.section-lead {
  color: var(--text);
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  line-height: 1.55;
}

.tag-list {
  gap: 0.5rem;
  margin: 2.3rem 0 0;
  padding: 0;
  list-style: none;
}

.tag-list li {
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono-font);
  font-size: 0.6rem;
}

.tag-list li::before {
  margin-right: 0.45rem;
  color: var(--accent);
  content: '/';
}

@media (max-width: 820px) {
  .section-layout,
  .section-layout.reverse {
    grid-template-columns: 1fr;
  }

  .section-layout.reverse .section-copy {
    grid-row: 1;
    grid-column: 1;
  }

  .section-layout.reverse .panel-slot {
    grid-row: 2;
    grid-column: 1;
  }
}

@media (max-width: 620px) {
  .section-header {
    grid-template-columns: 1fr;
  }

  .section-number {
    font-size: 2.8rem;
  }

  .section-header h2 {
    font-size: clamp(3rem, 14vw, 4.8rem);
  }
}
</style>
