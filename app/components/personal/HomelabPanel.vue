<template>
  <SharedPanelFrame
    class="homelab-panel"
    title="home.systems"
    meta="local infrastructure"
  >
    <div
      class="system-map"
      aria-label="A personal computer hosts Docker workloads, server services, and local large language models"
    >
      <div class="host-node">
        <span>HOST / 01</span>
        <strong>Personal PC</strong>
        <small>Local hardware</small>
      </div>

      <div
        class="data-line"
        aria-hidden="true"
      >
        <i /><i /><i />
      </div>

      <div class="service-grid">
        <div>
          <span>CONTAINER</span>
          <strong>Docker</strong>
          <small>Isolated workloads</small>
        </div>
        <div>
          <span>SERVICE</span>
          <strong>Hosting</strong>
          <small>Server workloads</small>
        </div>
        <div>
          <span>MODEL</span>
          <strong>Local LLM</strong>
          <small>AI on-device</small>
        </div>
      </div>
    </div>

    <div class="system-status flex flex-wrap justify-between gap-3 border-t border-line">
      <span><i aria-hidden="true" /> Self-managed</span>
      <span>Experiment → understand → improve</span>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.system-map {
  display: grid;
  grid-template-columns: minmax(8rem, 0.55fr) clamp(2.5rem, 6vw, 5rem) minmax(12rem, 1fr);
  align-items: center;
  padding: clamp(1.2rem, 4vw, 2.5rem);
}

.host-node,
.service-grid > div {
  display: grid;
  align-content: space-between;
  min-height: 7.5rem;
  padding: 0.9rem;
  border: 1px solid var(--border);
  background: var(--surface);
}

.host-node {
  min-height: 14rem;
  border-color: var(--border-strong);
  background: linear-gradient(145deg, rgb(50 132 255 / 12%), transparent 60%), var(--surface);
}

.system-map span,
.system-map small,
.system-status {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
}

.system-map span {
  color: var(--accent);
}

.system-map strong {
  font-family: var(--display-font);
  font-size: clamp(1.15rem, 2.3vw, 1.7rem);
  text-transform: uppercase;
}

.service-grid {
  display: grid;
  gap: 0.65rem;
}

.data-line {
  position: relative;
  height: 1px;
  overflow: hidden;
  background: var(--border-strong);
}

.data-line i {
  position: absolute;
  top: -0.15rem;
  left: -0.35rem;
  width: 0.35rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent-bright);
  box-shadow: 0 0 0.7rem var(--accent);
  animation: data-travel 2.4s linear infinite;
}

.data-line i:nth-child(2) {
  animation-delay: -0.8s;
}

.data-line i:nth-child(3) {
  animation-delay: -1.6s;
}

.system-status {
  padding: 0.9rem 1rem;
}

.system-status span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text);
}

.system-status i {
  width: 0.35rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
}

@keyframes data-travel {
  to {
    transform: translateX(clamp(2.5rem, 6vw, 5rem));
  }
}

@media (max-width: 620px) {
  .system-map {
    grid-template-columns: 1fr;
  }

  .host-node {
    min-height: 7.5rem;
  }

  .data-line {
    width: 1px;
    height: 2.5rem;
    margin-inline: auto;
  }

  .data-line i {
    top: -0.35rem;
    left: -0.15rem;
    animation-name: data-travel-mobile;
  }
}

@keyframes data-travel-mobile {
  to {
    transform: translateY(2.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .data-line i {
    animation: none;
  }
}
</style>
