<template>
  <section
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="hero-main grid items-center">
      <div class="hero-copy-block motion-hover">
        <p
          class="eyebrow flex items-center"
          data-reveal="up"
        >
          <span aria-hidden="true"></span> Based in Germany · Building for the web
        </p>
        <h1
          id="hero-title"
          data-reveal="up"
          style="--reveal-delay: 80ms"
        >
          I build <em>web products</em> that feel effortless.
        </h1>
        <p
          class="hero-copy"
          data-reveal="up"
          style="--reveal-delay: 160ms"
        >
          I’m Matthias, a software engineer focused on creating fast, thoughtful, and maintainable web products—from backend architecture to polished frontend experiences.
        </p>
        <div
          class="hero-actions flex flex-wrap items-center"
          data-reveal="up"
          style="--reveal-delay: 240ms"
        >
          <SharedActionLink
            label="Start a conversation"
            href="mailto:m.loehden@yahoo.de"
          />
          <SharedActionLink
            label="Explore profile"
            symbol="↓"
            to="/#about"
            variant="text"
          />
        </div>
      </div>

      <div
        data-reveal="right"
        style="--reveal-delay: 180ms"
      >
        <HomeDeveloperProfileCard />
      </div>
    </div>

    <dl
      class="highlights grid"
      aria-label="Career highlights"
    >
      <div
        class="motion-hover"
        data-reveal="up"
      >
        <dt><span aria-hidden="true">01</span> Since 2019</dt>
        <dd>Professional software development</dd>
      </div>
      <div
        class="motion-hover"
        data-reveal="up"
        style="--reveal-delay: 70ms"
      >
        <dt><span aria-hidden="true">02</span> B.Sc. Informatics</dt>
        <dd>Currently studying at IU</dd>
      </div>
      <div
        class="motion-hover"
        data-reveal="up"
        style="--reveal-delay: 140ms"
      >
        <dt><span aria-hidden="true">03</span> Frontend + backend</dt>
        <dd>From interface to deployment</dd>
      </div>
    </dl>
  </section>
</template>
