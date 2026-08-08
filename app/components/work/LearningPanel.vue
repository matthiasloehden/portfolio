<template>
  <SharedPanelFrame
    class="work-panel content-panel"
    title="content.library"
    meta="access-aware publishing"
  >
    <div class="content-preview grid">
      <div
        class="content-nav grid"
        aria-hidden="true"
      >
        <span class="is-active">Overview</span><span>Events</span><span>Media</span><span>Articles</span>
      </div>
      <div class="content-cards grid">
        <div class="featured-content">
          <i aria-hidden="true"></i>
          <strong>Learning event</strong>
          <small>Registration · badges · feedback</small>
        </div>

        <div>
          <span aria-hidden="true">▶</span>
          <strong>Video</strong>
          <small>On demand</small>
        </div>

        <div>
          <span aria-hidden="true">◉</span>
          <strong>Podcast</strong>
          <small>Audio series</small>
        </div>

        <div>
          <span aria-hidden="true">¶</span>
          <strong>Article</strong>
          <small>Editorial</small>
        </div>
      </div>
    </div>
    <div class="panel-status flex items-center border-t border-line">
      <i aria-hidden="true" /> Role-aware content delivery
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.work-panel {
  background: color-mix(in srgb, var(--background-raised) 94%, transparent);
}

.content-preview {
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.content-nav {
  align-content: start;
  gap: 0.35rem;
  padding-right: 1rem;
  border-right: 1px solid var(--border);
}

.content-nav span {
  padding: 0.55rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
}

.content-nav .is-active {
  border-left: 1px solid var(--accent);
  background: var(--surface-hover);
  color: var(--text);
}

.content-cards {
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
}

.content-cards > div {
  display: grid;
  min-height: 6.3rem;
  align-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--border);
  background: var(--surface);
}

.content-cards .featured-content {
  grid-column: 1 / -1;
  min-height: 8rem;
  background:
    linear-gradient(110deg, var(--surface-hover), transparent),
    repeating-linear-gradient(90deg, transparent, transparent 2rem, var(--border) 2rem, var(--border) calc(2rem + 1px));
}

.content-cards i,
.panel-status i {
  width: 0.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3cdc94;
  box-shadow: 0 0 0.65rem rgba(60, 220, 148, 0.75);
}

.content-cards span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.content-cards strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.content-cards small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.54rem;
  line-height: 1.5;
}

.panel-status {
  gap: 0.55rem;
  padding: 0.75rem 1rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

@media (max-width: 620px) {
  .content-preview {
    grid-template-columns: 1fr;
  }

  .content-nav {
    grid-template-columns: repeat(4, 1fr);
    padding: 0 0 0.75rem;
    overflow: hidden;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .content-nav span {
    padding-inline: 0.25rem;
    text-align: center;
  }

  .content-cards {
    grid-template-columns: 1fr;
  }

  .content-cards .featured-content {
    grid-column: auto;
  }
}
</style>
