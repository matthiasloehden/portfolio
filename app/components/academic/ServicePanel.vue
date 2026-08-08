<template>
  <SharedPanelFrame
    class="service-panel"
    title="service.model"
    meta="framework mapping"
  >
    <div class="service-stages grid">
      <div><span>01</span><strong>Capture</strong><small>Record and acknowledge</small></div>
      <div><span>02</span><strong>Classify</strong><small>Prioritize and assign</small></div>
      <div><span>03</span><strong>Resolve</strong><small>Restore or fulfil</small></div>
      <div><span>04</span><strong>Learn</strong><small>Review and improve</small></div>
    </div>
    <dl class="framework-map m-0">
      <div>
        <dt>ITIL</dt>
        <dd>Practices, value, and continual improvement</dd>
      </div>
      <div>
        <dt>FitSM</dt>
        <dd>Lightweight requirements and clear accountability</dd>
      </div>
    </dl>
  </SharedPanelFrame>
</template>

<style scoped>
.service-stages {
  grid-template-columns: repeat(4, 1fr);
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.service-stages div {
  position: relative;
  display: grid;
  gap: 1.15rem;
  padding: 0.9rem;
  border-top: 1px solid var(--accent);
  border-bottom: 1px solid var(--border);
}

.service-stages div + div {
  border-left: 1px solid var(--border);
}

.service-stages div::before {
  position: absolute;
  top: -0.22rem;
  left: 0.8rem;
  width: 0.38rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  content: '';
  box-shadow: 0 0 0.6rem var(--accent);
}

.service-stages span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.service-stages strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.service-stages small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  line-height: 1.45;
}

.framework-map {
  padding: 0 1rem 1rem;
}

.framework-map div {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 1rem;
  padding: 0.8rem;
  border: 1px solid var(--border);
}

.framework-map div + div {
  border-top: 0;
}

.framework-map dt {
  color: var(--accent-bright);
  font-family: var(--display-font);
  font-size: 1rem;
  font-weight: 700;
}

.framework-map dd {
  margin: 0;
  color: var(--muted);
  font-size: 0.72rem;
  line-height: 1.5;
}

@media (max-width: 620px) {
  .service-stages {
    grid-template-columns: 1fr 1fr;
  }

  .service-stages div:nth-child(3) {
    border-left: 0;
  }
}
</style>
