<template>
  <SharedPanelFrame
    class="architecture-panel"
    title="pipeline.flow"
    meta="event → insight"
  >
    <div
      class="pipeline grid items-center"
      aria-label="Data flows from producers through Kafka and Flink into ClickHouse and Grafana"
    >
      <div><span>01</span><strong>Producers</strong><small>Event source</small></div>
      <i aria-hidden="true">→</i>
      <div><span>02</span><strong>Kafka</strong><small>Transport</small></div>
      <i aria-hidden="true">→</i>
      <div><span>03</span><strong>Flink</strong><small>Processing</small></div>
      <i aria-hidden="true">→</i>
      <div><span>04</span><strong>ClickHouse</strong><small>Analytics</small></div>
      <i aria-hidden="true">→</i>
      <div><span>05</span><strong>Grafana</strong><small>Visibility</small></div>
    </div>
    <div
      class="tech-row flex flex-wrap border-t border-line"
      aria-label="Technologies used"
    >
      <span>Apache Kafka</span><span>Apache Flink</span><span>ClickHouse</span><span>Grafana</span>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.pipeline {
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: 0.75rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.pipeline div {
  display: grid;
  min-height: 7.2rem;
  align-content: space-between;
  padding: 0.8rem;
  border: 1px solid var(--border);
  background: var(--surface);
}

.pipeline div:nth-of-type(4),
.pipeline div:nth-of-type(5) {
  grid-row: 2;
  margin-top: 0.5rem;
}

.pipeline div:nth-of-type(4) {
  grid-column: 3;
}

.pipeline div:nth-of-type(5) {
  grid-column: 5;
}

.pipeline i:nth-of-type(4) {
  grid-row: 2;
  grid-column: 4;
}

.pipeline span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.pipeline strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.pipeline small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  line-height: 1.45;
}

.pipeline > i {
  color: var(--accent);
  font-family: var(--mono-font);
  font-style: normal;
}

.tech-row {
  gap: 0.45rem;
  padding: 0.9rem 1rem;
}

.tech-row span {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
}

@media (max-width: 620px) {
  .pipeline {
    grid-template-columns: 1fr;
  }

  .pipeline div,
  .pipeline div:nth-of-type(4),
  .pipeline div:nth-of-type(5),
  .pipeline i:nth-of-type(4) {
    grid-row: auto;
    grid-column: auto;
    margin-top: 0;
  }

  .pipeline div {
    min-height: 5.5rem;
  }

  .pipeline > i {
    transform: rotate(90deg);
    text-align: center;
  }
}
</style>
