<script setup lang="ts">
import { contributions } from '@/data/personal';
</script>

<template>
  <SharedPanelFrame
    class="contribution-panel"
    title="contributions.log"
    meta="3 selected changes"
  >
    <ol
      class="contribution-list"
      aria-label="Selected open-source contributions"
    >
      <li
        v-for="(contribution, index) in contributions"
        :key="contribution.title"
      >
        <div class="contribution-meta">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <small><i aria-hidden="true" />{{ contribution.status }}</small>
        </div>
        <p>{{ contribution.category }}</p>
        <h3>{{ contribution.title }}</h3>
        <p>{{ contribution.description }}</p>
      </li>
    </ol>
  </SharedPanelFrame>
</template>

<style scoped>
.contribution-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: clamp(1rem, 3vw, 1.8rem);
  list-style: none;
}

.contribution-list li {
  position: relative;
  padding: 1.15rem 1.2rem 1.3rem;
  border: 1px solid var(--border);
  background: linear-gradient(110deg, var(--surface), transparent);
}

.contribution-list li + li {
  margin-top: 0.75rem;
}

.contribution-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.contribution-meta small {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--muted);
  font-size: inherit;
  text-transform: uppercase;
}

.contribution-meta i {
  width: 0.35rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0.6rem var(--accent);
  animation: contribution-pulse 2.2s ease-in-out infinite;
}

.contribution-list li > p:first-of-type {
  margin-top: 1.1rem;
  color: var(--quiet);
  font-family: var(--mono-font);
  font-size: 0.58rem;
  text-transform: uppercase;
}

h3 {
  margin-top: 0.25rem;
  font-size: clamp(1.45rem, 3vw, 2.15rem);
  letter-spacing: -0.035em;
  text-transform: uppercase;
}

.contribution-list li > p:last-child {
  max-width: 43rem;
  margin-top: 0.65rem;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.65;
}

@keyframes contribution-pulse {
  50% {
    opacity: 0.45;
    transform: scale(0.72);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contribution-meta i {
    animation: none;
  }
}
</style>
