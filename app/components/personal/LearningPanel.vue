<script setup lang="ts">
import { learningGroups } from '@/data/personal';
</script>

<template>
  <SharedPanelFrame
    class="learning-panel"
    title="watch.list"
    meta="6 creators / 3 fields"
  >
    <div
      class="learning-groups"
      aria-label="Favourite educational YouTube creators grouped by subject"
    >
      <section
        v-for="(group, groupIndex) in learningGroups"
        :key="group.category"
        class="creator-group"
      >
        <header>
          <span>{{ String(groupIndex + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ group.category }}</h3>
            <p>{{ group.description }}</p>
          </div>
        </header>
        <ol class="creator-grid">
          <li
            v-for="(source, sourceIndex) in group.sources"
            :key="source.name"
          >
            <span>{{ String(sourceIndex + 1).padStart(2, '0') }}</span>
            <div>
              <h4>{{ source.name }}</h4>
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
  gap: 0.75rem;
  padding: clamp(1rem, 3vw, 1.8rem);
}

.creator-group {
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--surface), transparent 75%);
}

.creator-group > header {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.creator-group > header > span,
.creator-grid li > span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.creator-group h3 {
  font-size: clamp(1.35rem, 2.5vw, 1.9rem);
  letter-spacing: -0.03em;
  line-height: 1;
  text-transform: uppercase;
}

.creator-group p {
  margin-top: 0.45rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  line-height: 1.5;
}

.creator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
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
  border-right: 1px solid var(--border);
}

.creator-grid li:last-child {
  border-right: 0;
}

.creator-grid h4 {
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
}

@media (max-width: 520px) {
  .creator-grid {
    grid-template-columns: 1fr;
  }

  .creator-grid li {
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .creator-grid li:last-child {
    border-bottom: 0;
  }
}
</style>
