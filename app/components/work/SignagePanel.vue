<template>
  <SharedPanelFrame
    class="work-panel display-panel"
    title="display.control"
    meta="player online"
  >
    <div class="display-flow grid justify-items-center">
      <div class="flow-node remote"><small>REMOTE</small><strong>Administration</strong></div>
      <i aria-hidden="true">↓</i>
      <div class="player-node grid items-center">
        <div><small>CONTROL UI</small><strong>Electron</strong></div>
        <span aria-hidden="true">↕</span>
        <div><small>SERVICE</small><strong>Python</strong></div>
      </div>
      <div class="flow-split grid">
        <span><i aria-hidden="true">RS-232 →</i><strong>Display</strong><small>Playback control</small></span>
        <span><i aria-hidden="true">Status →</i><strong>Operations</strong><small>Analytics</small></span>
      </div>
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.work-panel {
  background: color-mix(in srgb, var(--background-raised) 94%, transparent);
}

.display-flow {
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.display-flow > i {
  padding-block: 0.5rem;
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.7rem;
  font-style: normal;
}

.flow-node,
.player-node > div,
.flow-split span {
  display: grid;
  gap: 0.35rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  background: var(--surface);
}

.flow-node {
  width: min(100%, 15rem);
}

.player-node {
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  gap: 0.8rem;
  padding: 0.8rem;
  border: 1px solid var(--border-strong);
}

.player-node > span {
  color: var(--accent);
}

.flow-split {
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
}

.display-flow strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.display-flow small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.54rem;
  line-height: 1.5;
}

.flow-split span i {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  font-style: normal;
}

@media (max-width: 620px) {
  .player-node,
  .flow-split {
    grid-template-columns: 1fr;
  }

  .player-node > span {
    transform: rotate(90deg);
    text-align: center;
  }
}
</style>
