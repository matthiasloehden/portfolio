<template>
  <div class="site-shell">
    <a
      class="skip-link"
      href="#content"
      >Skip to content</a
    >
    <div
      class="ambient"
      aria-hidden="true"
    />

    <header class="site-header">
      <a
        class="identity"
        href="#content"
        aria-label="Matthias Löhden, home"
      >
        <span class="monogram">ML</span>
        <span>Matthias Löhden</span>
      </a>

      <nav aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#capabilities">Skills</a>
        <a href="mailto:m.loehden@yahoo.de">Contact</a>
      </nav>
    </header>

    <main id="content">
      <section
        class="hero"
        aria-labelledby="hero-title"
      >
        <p class="eyebrow"><span aria-hidden="true" /> Full-stack developer · Germany</p>
        <h1 id="hero-title">I build web products that feel effortless.</h1>
        <p class="hero-copy">
          I’m Matthias, a full-stack developer focused on fast, maintainable web experiences across Laravel, Vue, and
          modern frontend systems.
        </p>

        <div class="hero-actions">
          <a
            class="primary-action"
            href="mailto:m.loehden@yahoo.de"
          >
            Start a conversation
            <span aria-hidden="true">↗</span>
          </a>
          <a
            class="text-action"
            href="#about"
          >
            Explore my profile
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <dl
          class="highlights"
          aria-label="Career highlights"
        >
          <div>
            <dt>Since 2019</dt>
            <dd>Professional software development</dd>
          </div>
          <div>
            <dt>B.Sc. Informatics</dt>
            <dd>Currently studying at IU</dd>
          </div>
          <div>
            <dt>Frontend + backend</dt>
            <dd>From interface to deployment</dd>
          </div>
        </dl>
      </section>

      <section
        id="about"
        class="content-section about-grid"
        aria-labelledby="about-title"
      >
        <div>
          <p class="section-index">01 / About</p>
          <h2 id="about-title">Practical experience, backed by strong fundamentals.</h2>
        </div>
        <div class="section-copy">
          <p>
            I trained and worked at TopRed Media, progressing from application development into a full-stack role. Today
            I pair that hands-on experience with ongoing computer science studies.
          </p>
          <p>
            My focus is straightforward: understand the real problem, choose the simplest durable solution, and deliver
            an experience that is fast for users and pleasant for teams to maintain.
          </p>
        </div>
      </section>

      <section
        id="capabilities"
        class="content-section"
        aria-labelledby="capabilities-title"
      >
        <p class="section-index">02 / Capabilities</p>
        <div class="section-heading">
          <h2 id="capabilities-title">A full-stack toolkit.</h2>
          <p>Initial skills from my résumé. Project case studies and the broader toolkit are coming next.</p>
        </div>

        <div class="capability-grid">
          <article>
            <span>01</span>
            <h3>Frontend</h3>
            <p>JavaScript, Vue.js, CSS, Tailwind CSS</p>
          </article>
          <article>
            <span>02</span>
            <h3>Backend</h3>
            <p>PHP, Laravel, SQL</p>
          </article>
          <article>
            <span>03</span>
            <h3>Engineering</h3>
            <p>DevOps, Laravel Forge, Python, Java</p>
          </article>
        </div>
      </section>
    </main>

    <footer>
      <p>Matthias Löhden <span aria-hidden="true">—</span> Full-stack developer</p>
      <a href="mailto:m.loehden@yahoo.de">m.loehden@yahoo.de</a>
    </footer>
  </div>
</template>
