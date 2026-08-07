<template>
  <SharedPanelFrame
    class="cooling-panel"
    title="cooling.loop"
    meta="4 radiators / 2 pumps"
  >
    <div
      class="loop-diagram"
      aria-label="Custom PC water-cooling loop with four radiators and two pumps"
    >
      <div class="loop-path loop-path-top"><i /><i /><i /></div>
      <div class="loop-path loop-path-right"><i /><i /></div>
      <div class="loop-path loop-path-bottom"><i /><i /><i /></div>
      <div class="loop-path loop-path-left"><i /><i /></div>

      <div class="radiator radiator-one"><span>R01</span><strong>Radiator</strong></div>
      <div class="radiator radiator-two"><span>R02</span><strong>Radiator</strong></div>
      <div class="radiator radiator-three"><span>R03</span><strong>Radiator</strong></div>
      <div class="radiator radiator-four"><span>R04</span><strong>Radiator</strong></div>

      <div class="pump pump-one"><span>P01</span><strong>Pump</strong><i aria-hidden="true" /></div>
      <div class="pump pump-two"><span>P02</span><strong>Pump</strong><i aria-hidden="true" /></div>

      <div class="loop-core">
        <small>CUSTOM PC</small>
        <strong>Water<br />cooling</strong>
        <span>Closed loop</span>
      </div>
    </div>

    <div class="cooling-meta grid border-t border-line">
      <div><span>Heat exchange</span><strong>04×</strong></div>
      <div><span>Flow</span><strong>02×</strong></div>
      <div><span>Build</span><strong>Custom</strong></div>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.loop-diagram {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, minmax(3rem, 1fr));
  gap: 0.55rem;
  min-height: clamp(24rem, 45vw, 32rem);
  padding: clamp(1.2rem, 4vw, 2.3rem);
}

.loop-path {
  position: absolute;
  border-color: var(--border-strong);
  pointer-events: none;
}

.loop-path-top,
.loop-path-bottom {
  right: 13%;
  left: 13%;
  height: 1px;
  border-top: 1px solid var(--border-strong);
}

.loop-path-top {
  top: 15%;
}

.loop-path-bottom {
  bottom: 15%;
}

.loop-path-left,
.loop-path-right {
  top: 15%;
  bottom: 15%;
  width: 1px;
  border-left: 1px solid var(--border-strong);
}

.loop-path-left {
  left: 13%;
}

.loop-path-right {
  right: 13%;
}

.loop-path i {
  position: absolute;
  width: 0.35rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent-bright);
  box-shadow: 0 0 0.7rem var(--accent);
}

.loop-path-top i,
.loop-path-bottom i {
  top: -0.2rem;
  animation: coolant-x 3.8s linear infinite;
}

.loop-path-left i,
.loop-path-right i {
  left: -0.2rem;
  animation: coolant-y 3.8s linear infinite;
}

.loop-path i:nth-child(2) {
  animation-delay: -1.27s;
}

.loop-path i:nth-child(3) {
  animation-delay: -2.54s;
}

.radiator,
.pump,
.loop-core {
  z-index: 1;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--background-raised) 92%, transparent);
  text-align: center;
}

.radiator {
  align-self: center;
  min-height: 4.3rem;
}

.radiator-one {
  grid-row: 1;
  grid-column: 2;
}

.radiator-two {
  grid-row: 1;
  grid-column: 4;
}

.radiator-three {
  grid-row: 5;
  grid-column: 2;
}

.radiator-four {
  grid-row: 5;
  grid-column: 4;
}

.pump {
  position: relative;
  align-self: center;
  width: clamp(4.6rem, 9vw, 6rem);
  aspect-ratio: 1;
  border-color: var(--border-strong);
  border-radius: 50%;
}

.pump-one {
  grid-row: 3;
  grid-column: 1;
}

.pump-two {
  grid-row: 3;
  grid-column: 5;
}

.pump i {
  position: absolute;
  inset: 0.5rem;
  border: 1px dashed var(--accent);
  border-radius: 50%;
  animation: pump-spin 8s linear infinite;
}

.loop-core {
  grid-row: 2 / 5;
  grid-column: 2 / 5;
  border-color: var(--border-strong);
  background:
    radial-gradient(circle, rgb(50 132 255 / 12%), transparent 65%),
    color-mix(in srgb, var(--background-raised) 94%, transparent);
}

.loop-core strong {
  font-family: var(--display-font);
  font-size: clamp(2.4rem, 6vw, 4.8rem);
  letter-spacing: -0.055em;
  line-height: 0.78;
  text-transform: uppercase;
}

.radiator span,
.pump span,
.loop-core small,
.loop-core span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.52rem;
}

.radiator strong,
.pump strong {
  font-family: var(--display-font);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.loop-core span {
  color: var(--muted);
}

.cooling-meta {
  grid-template-columns: repeat(3, 1fr);
}

.cooling-meta div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem;
  font-family: var(--mono-font);
  font-size: 0.55rem;
}

.cooling-meta div + div {
  border-left: 1px solid var(--border);
}

.cooling-meta span {
  color: var(--muted);
}

.cooling-meta strong {
  color: var(--accent-bright);
  font-size: inherit;
}

@keyframes coolant-x {
  from {
    left: 0;
  }

  to {
    left: 100%;
  }
}

@keyframes coolant-y {
  from {
    top: 0;
  }

  to {
    top: 100%;
  }
}

@keyframes pump-spin {
  to {
    transform: rotate(1turn);
  }
}

@media (max-width: 520px) {
  .loop-diagram {
    gap: 0.35rem;
    padding: 0.9rem;
  }

  .pump {
    width: 3.8rem;
  }

  .loop-core {
    grid-row: 2 / 5;
  }

  .cooling-meta {
    grid-template-columns: 1fr;
  }

  .cooling-meta div + div {
    border-top: 1px solid var(--border);
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loop-path i,
  .pump i {
    animation: none;
  }
}
</style>
