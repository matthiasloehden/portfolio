<template>
  <SharedPanelFrame
    class="work-panel shop-panel"
    title="shop.record"
    meta="operational source of truth"
  >
    <div class="shop-preview">
      <div class="shop-summary grid">
        <span>SHOP / 042</span>
        <strong>Location profile</strong>
        <small><i aria-hidden="true" /> Record active</small>
      </div>
      <div class="shop-fields grid border border-line">
        <div><small>Opening hours</small><strong>Configured</strong></div>
        <div><small>Floor layout</small><strong>Available</strong></div>
        <div><small>Postal data</small><strong>Managed</strong></div>
        <div><small>Tasks</small><strong>Assigned</strong></div>
      </div>
      <div
        class="sheet-sync grid items-center border border-line-strong text-center"
        aria-label="Excel sheets could export data and synchronize uploaded changes"
      >
        <span>Database</span><i aria-hidden="true">⇄</i><strong>.XLSX</strong>
      </div>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.work-panel {
  background: color-mix(in srgb, var(--background-raised) 94%, transparent);
}

.shop-preview {
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.shop-summary {
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 0.4rem 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.shop-summary > span {
  grid-column: 1 / -1;
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.shop-summary small {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.shop-summary small i {
  width: 0.38rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3cdc94;
  box-shadow: 0 0 0.65rem rgba(60, 220, 148, 0.75);
}

.shop-fields {
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
}

.shop-fields div {
  display: grid;
  gap: 0.6rem;
  padding: 1rem;
}

.shop-fields div:nth-child(even) {
  border-left: 1px solid var(--border);
}

.shop-fields div:nth-child(n + 3) {
  border-top: 1px solid var(--border);
}

.shop-summary strong,
.shop-fields strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.shop-preview small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.54rem;
  line-height: 1.5;
}

.sheet-sync {
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.8rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.sheet-sync i {
  color: var(--accent);
  font-size: 1rem;
  font-style: normal;
}

.sheet-sync strong {
  color: var(--accent-bright);
}

@media (max-width: 420px) {
  .shop-fields {
    grid-template-columns: 1fr;
  }

  .shop-fields div:nth-child(even) {
    border-left: 0;
  }

  .shop-fields div + div {
    border-top: 1px solid var(--border);
  }
}
</style>
