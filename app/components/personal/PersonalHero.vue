<template>
  <section
    class="personal-hero flex flex-col justify-center"
    aria-labelledby="personal-title"
  >
    <SharedSectionKicker
      prefix="[ OPEN—CURIOUS ]"
      label="Personal projects & interests"
      hide-prefix-from-screen-readers
    />

    <div class="hero-grid grid items-end">
      <h1
        id="personal-title"
        class="motion-hover"
        data-reveal="left"
      >
        Built from<br /><em>curiosity.</em>
      </h1>

      <div
        class="hero-intro"
        data-reveal="right"
        style="--reveal-delay: 130ms"
      >
        <p class="motion-hover">
          Beyond professional and university work, I contribute to tools I use, run systems at home, keep learning, and
          build PCs down to the cooling loop.
        </p>
        <dl class="border-t border-line">
          <div class="motion-hover flex justify-between gap-4 border-b border-line">
            <dt>Code</dt>
            <dd>C#, Unity &amp; open source</dd>
          </div>
          <div class="motion-hover flex justify-between gap-4 border-b border-line">
            <dt>Systems</dt>
            <dd>Docker, hosting &amp; local AI</dd>
          </div>
          <div class="motion-hover flex justify-between gap-4 border-b border-line">
            <dt>Hardware</dt>
            <dd>Custom-built &amp; water-cooled</dd>
          </div>
        </dl>
      </div>
    </div>

    <a
      class="scroll-cue mt-auto inline-flex items-center self-start"
      href="#personal-list"
      data-reveal="up"
      style="--reveal-delay: 260ms"
    >
      Explore personal work <span aria-hidden="true">↓</span>
    </a>
  </section>
</template>

<style scoped>
.personal-hero {
  min-height: min(53rem, calc(100svh - 5.5rem));
  padding-block: clamp(5rem, 10vw, 8rem) 2rem;
}

.hero-grid {
  grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.55fr);
  gap: clamp(3rem, 9vw, 9rem);
  margin-top: 2.25rem;
}

h1 {
  max-width: none;
  margin: 0;
  font-size: clamp(4.8rem, 10vw, 9.8rem);
  line-height: 0.76;
}

.hero-intro {
  padding-bottom: 0.5rem;
}

.hero-intro > p {
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
  color: var(--text);
  text-align: right;
}

.scroll-cue {
  gap: 0.7rem;
  padding-top: 3rem;
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
  .hero-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: clamp(4.6rem, 16vw, 7rem);
  }

  .hero-intro {
    max-width: 32rem;
  }
}

@media (max-width: 620px) {
  .personal-hero {
    min-height: calc(100svh - 4.75rem);
  }

  h1 {
    font-size: clamp(4rem, 20vw, 6rem);
  }
}
</style>
