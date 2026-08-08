<script setup lang="ts">
import { computed } from 'vue';
import { learningGroups } from '@/data/personal';

const primarySources = computed(() => learningGroups[0]?.sources ?? []);
const secondarySources = computed(() => learningGroups.slice(1).flatMap((group) => group.sources));
</script>

<template>
  <SharedPanelFrame
    class="learning-panel"
    title="watch.list"
    meta="6 creators / 2 columns"
  >
    <div
      class="learning-groups"
      aria-label="Favourite educational YouTube creators grouped by subject"
    >
      <section class="creator-column">
        <ol class="creator-grid">
          <li
            v-for="(source, sourceIndex) in primarySources"
            :key="source.name"
          >
            <span>{{ String(sourceIndex + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ source.name }}</h3>
              <p>{{ source.focus }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="creator-column">
        <ol class="creator-grid">
          <li
            v-for="(source, sourceIndex) in secondarySources"
            :key="`${source.name}-${sourceIndex}`"
          >
            <span>{{ String(sourceIndex + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ source.name }}</h3>
              <p>{{ source.focus }}</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.learning-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  padding: clamp(1rem, 3vw, 1.8rem);
}

.creator-column {
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--surface), transparent 75%);
}

.creator-grid {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.creator-grid li {
  display: grid;
  grid-template-columns: 1.8rem 1fr;
  gap: 0.7rem;
  min-height: 6.5rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.creator-grid li:last-child {
  border-bottom: 0;
}

.creator-grid li > span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.creator-grid h3 {
  margin: 0;
  font-family: var(--display-font);
  max-width: 12ch;
  font-size: clamp(1.15rem, 2.3vw, 1.65rem);
  font-weight: 700;
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

@media (max-width: 520px) {
  .learning-groups {
    grid-template-columns: 1fr;
  }
}
</style>
