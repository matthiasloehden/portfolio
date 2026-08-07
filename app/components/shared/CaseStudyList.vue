<script setup lang="ts">
import type { CaseStudyListItem } from '@/types/content';

defineProps<{
  id: string;
  titleId: string;
  label: string;
  title: string;
  items: CaseStudyListItem[];
}>();
</script>

<template>
  <section
    :id="id"
    class="case-study-list grid border-t border-line"
    :aria-labelledby="titleId"
  >
    <div
      class="motion-hover"
      data-reveal="left"
    >
      <SharedSectionKicker :label="label" />
      <h2 :id="titleId">{{ title }}</h2>
    </div>
    <ol>
      <li
        v-for="(item, index) in items"
        :key="item.href"
        data-reveal="right"
        :style="`--reveal-delay: ${index * 75}ms`"
      >
        <a :href="item.href">
          <span>{{ item.number }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.category }}</small>
          <i aria-hidden="true">↓</i>
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.case-study-list {
  grid-template-columns: minmax(15rem, 0.65fr) minmax(0, 1.35fr);
  gap: clamp(3rem, 8vw, 8rem);
  padding-block: clamp(6rem, 10vw, 9rem);
}

h2 {
  margin-top: 1.5rem;
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  line-height: 0.92;
}

ol {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--border);
  list-style: none;
}

a {
  display: grid;
  grid-template-columns: 2.5rem 1fr minmax(7rem, 0.45fr) auto;
  align-items: center;
  gap: 1rem;
  padding-block: 1.3rem;
  border-bottom: 1px solid var(--border);
  transition:
    color 160ms ease,
    padding 160ms ease;
}

a:hover,
a:focus-visible {
  padding-left: 0.6rem;
  color: var(--accent-bright);
}

a > span,
small,
i {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
  font-style: normal;
}

a > span,
i {
  color: var(--accent);
}

strong {
  font-family: var(--display-font);
  font-size: 1.3rem;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

@media (max-width: 820px) {
  .case-study-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  a {
    grid-template-columns: 2rem 1fr auto;
  }

  small {
    display: none;
  }
}
</style>
