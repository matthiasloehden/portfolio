<template>
  <SharedPanelFrame
    class="work-panel module-panel"
    title="platform.modules"
    meta="configured per client"
  >
    <div class="module-grid grid">
      <div><span>01</span><strong>CMS</strong><small>Publish content</small></div>
      <div><span>02</span><strong>Live chat</strong><small>Stay connected</small></div>
      <div><span>03</span><strong>Events</strong><small>Coordinate activity</small></div>
      <div><span>04</span><strong>Teams</strong><small>Manage groups</small></div>
    </div>
    <div class="audience-row grid items-center text-center">
      <span>Personal training</span><i aria-hidden="true">+</i><span>Kindergarten</span>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.work-panel {
  background: color-mix(in srgb, var(--background-raised) 94%, transparent);
}

.module-grid {
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.module-grid > div {
  display: grid;
  min-height: 8rem;
  align-content: space-between;
  padding: 1rem;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--surface-hover), transparent);
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

.module-grid > div:hover {
  border-color: var(--border-strong);
  transform: translateY(-0.2rem);
}

.module-grid span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.module-grid strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.module-grid small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.54rem;
  line-height: 1.5;
}

.audience-row {
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  padding: 0 1rem 1rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.audience-row span {
  padding: 0.7rem;
  border: 1px solid var(--border);
}

.audience-row i {
  color: var(--accent);
  font-style: normal;
}

@media (max-width: 420px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
