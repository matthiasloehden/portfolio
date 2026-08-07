<template>
  <section
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="hero-main grid items-center">
      <div class="hero-copy-block">
        <p class="eyebrow flex items-center"><span aria-hidden="true" /> Based in Germany · Building for the web</p>
        <h1 id="hero-title">I build <em>web products</em> that feel effortless.</h1>
        <p class="hero-copy">
          I’m Matthias, a full-stack developer focused on fast, maintainable web experiences across Laravel, Vue, and
          modern frontend systems.
        </p>

        <div class="hero-actions flex flex-wrap items-center">
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

      <HomeDeveloperProfileCard />
    </div>

    <dl
      class="highlights grid"
      aria-label="Career highlights"
    >
      <div>
        <dt><span aria-hidden="true">01</span> Since 2019</dt>
        <dd>Professional software development</dd>
      </div>
      <div>
        <dt><span aria-hidden="true">02</span> B.Sc. Informatics</dt>
        <dd>Currently studying at IU</dd>
      </div>
      <div>
        <dt><span aria-hidden="true">03</span> Frontend + backend</dt>
        <dd>From interface to deployment</dd>
      </div>
    </dl>
  </section>
</template>
