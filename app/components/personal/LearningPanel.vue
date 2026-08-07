<script setup lang="ts">
import { learningSources } from '@/data/personal';
</script>

<template>
  <SharedPanelFrame
    class="learning-panel"
    title="watch.list"
    meta="6 favourite creators"
  >
    <ol
      class="creator-grid"
      aria-label="Favourite educational YouTube creators"
    >
      <li
        v-for="(source, index) in learningSources"
        :key="source.name"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <div>
          <h3>{{ source.name }}</h3>
          <p>{{ source.focus }}</p>
        </div>
        <i aria-hidden="true">↗</i>
      </li>
    </ol>
  </SharedPanelFrame>
</template>

<style scoped>
.creator-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  padding: clamp(1rem, 3vw, 1.8rem);
  list-style: none;
}

.creator-grid li {
  display: grid;
  grid-template-columns: 1.8rem 1fr auto;
  gap: 0.7rem;
  min-height: 7.5rem;
  padding: 1rem;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--surface), transparent 75%);
}

.creator-grid li:nth-child(even) {
  border-left: 0;
}

.creator-grid li:nth-child(n + 3) {
  border-top: 0;
}

.creator-grid li > span,
.creator-grid li > i {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
  font-style: normal;
}

.creator-grid li > i {
  color: var(--quiet);
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.creator-grid h3 {
  max-width: 12ch;
  font-size: clamp(1.15rem, 2.3vw, 1.65rem);
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-transform: uppercase;
}

.creator-grid p {
  margin-top: 0.7rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  line-height: 1.5;
}

@media (hover: hover) and (pointer: fine) {
  .creator-grid li:hover > i {
    color: var(--accent-bright);
    transform: translate(0.15rem, -0.15rem);
  }
}

@media (max-width: 520px) {
  .creator-grid {
    grid-template-columns: 1fr;
  }

  .creator-grid li:nth-child(even) {
    border-left: 1px solid var(--border);
  }

  .creator-grid li:nth-child(n + 2) {
    border-top: 0;
  }
}
</style>
