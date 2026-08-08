<template>
  <section
    class="work-hero grid items-end"
    aria-labelledby="work-title"
  >
    <div class="work-hero-copy motion-hover">
      <SharedSectionKicker
        prefix="[ 2019—2025 ]"
        label="Client &amp; product systems"
        hide-prefix-from-screen-readers
      />
      <h1
        id="work-title"
        aria-label="Software for work that matters."
        data-reveal="left"
      >
        Software for<br />work that<br /><em>matters.</em>
      </h1>
    </div>

    <aside
      class="work-brief"
      data-reveal="right"
      style="--reveal-delay: 130ms"
    >
      <p class="motion-hover">
        At TopRed Media GmbH, I contributed across the full lifecycle of production enterprise applications, from initial development through years of feature development, refactoring, integrations, and maintenance. Working in a three-developer team, I contributed across the stack as requirements, workflows, and the products themselves continuously evolved.
      </p>
      <dl class="border-t border-line">
        <div class="motion-hover flex justify-between gap-4 border-b border-line">
          <dt>Company</dt>
          <dd>TopRed Media GmbH</dd>
        </div>
        <div class="motion-hover flex justify-between gap-4 border-b border-line">
          <dt>Role</dt>
          <dd>Apprentice → full-stack developer</dd>
        </div>
        <div class="motion-hover flex justify-between gap-4 border-b border-line">
          <dt>Systems</dt>
          <dd>Four selected projects</dd>
        </div>
      </dl>
    </aside>

    <a
      class="scroll-cue inline-flex items-center"
      href="#work-list"
      data-reveal="up"
      style="--reveal-delay: 260ms"
    >
      Explore the systems <span aria-hidden="true">↓</span>
    </a>
  </section>
</template>

<style scoped>
.work-hero {
  grid-template-columns: minmax(0, 1.2fr) minmax(22rem, 0.65fr);
  grid-template-rows: 1fr auto;
  gap: 3rem clamp(3rem, 9vw, 9rem);
  min-height: min(53rem, calc(100svh - 5.5rem));
  padding-block: clamp(5rem, 10vw, 8rem) 2rem;
}

h1 {
  max-width: none;
  margin-top: 2.25rem;
  font-size: clamp(4.8rem, 10vw, 9.8rem);
  line-height: 0.76;
}

.work-brief {
  padding-bottom: 0.5rem;
}

.work-brief > p {
  color: var(--muted);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.75;
}

dl {
  margin: 2.2rem 0 0;
}

dl div {
  padding-block: 0.7rem;
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

dt {
  color: var(--quiet);
  text-transform: uppercase;
}

dd {
  margin: 0;
  text-align: right;
}

.scroll-cue {
  gap: 0.7rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.65rem;
  transition: color 160ms ease;
}

.scroll-cue span {
  color: var(--accent);
}

.scroll-cue:hover,
.scroll-cue:focus-visible {
  color: var(--text);
}

@media (max-width: 820px) {
  .work-hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    align-items: start;
  }

  h1 {
    font-size: clamp(4.6rem, 16vw, 7rem);
  }

  .work-brief {
    max-width: 32rem;
  }
}

@media (max-width: 620px) {
  .work-hero {
    min-height: calc(100svh - 4.75rem);
  }

  h1 {
    font-size: clamp(4rem, 20vw, 6rem);
  }
}
</style>
