<template>
  <div class="site-shell">
    <WaveGridBackground />

    <a
      class="skip-link"
      href="#content"
      >Skip to content</a
    >

    <header class="site-header">
      <a
        class="identity"
        href="#content"
        aria-label="Matthias Löhden, home"
      >
        <span
          class="monogram"
          aria-hidden="true"
          >ML</span
        >
        <span class="identity-copy">
          <strong>Matthias Löhden</strong>
          <small>Full-stack developer</small>
        </span>
      </a>

      <nav aria-label="Main navigation">
        <a href="#about"><span aria-hidden="true">01</span> About</a>
        <a href="#capabilities"><span aria-hidden="true">02</span> Skills</a>
        <NuxtLink to="/work"><span aria-hidden="true">03</span> Work</NuxtLink>
        <NuxtLink to="/projects"><span aria-hidden="true">04</span> University</NuxtLink>
        <a href="mailto:m.loehden@yahoo.de"><span aria-hidden="true">05</span> Contact</a>
      </nav>
    </header>

    <main id="content">
      <section
        class="hero"
        aria-labelledby="hero-title"
      >
        <div class="hero-main">
          <div class="hero-copy-block">
            <p class="eyebrow"><span aria-hidden="true" /> Based in Germany · Building for the web</p>
            <h1 id="hero-title">I build <em>web products</em> that feel effortless.</h1>
            <p class="hero-copy">
              I’m Matthias, a full-stack developer focused on fast, maintainable web experiences across Laravel, Vue,
              and modern frontend systems.
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
                Explore profile
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <aside
            class="system-card"
            aria-label="Developer profile summary"
          >
            <div class="system-card-header">
              <span>profile.ts</span>
              <span
                class="window-controls"
                aria-hidden="true"
                ><i /><i /><i
              /></span>
            </div>
            <div
              class="code-block"
              aria-hidden="true"
            >
              <p><span class="code-line">01</span><span class="code-keyword">const</span> developer = {</p>
              <p><span class="code-line">02</span>&nbsp;&nbsp;name: <span class="code-string">'Matthias'</span>,</p>
              <p>
                <span class="code-line">03</span>&nbsp;&nbsp;discipline: <span class="code-string">'full-stack'</span>,
              </p>
              <p><span class="code-line">04</span>&nbsp;&nbsp;focus: [</p>
              <p>
                <span class="code-line">05</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">'performance'</span>,
              </p>
              <p>
                <span class="code-line">06</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string"
                  >'maintainability'</span
                >,
              </p>
              <p>
                <span class="code-line">07</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string"
                  >'user experience'</span
                >
              </p>
              <p><span class="code-line">08</span>&nbsp;&nbsp;]</p>
              <p><span class="code-line">09</span>};<span class="code-cursor" /></p>
            </div>
            <div class="system-card-footer">
              <span><i aria-hidden="true" /> Systems operational</span>
              <span>DE / CET</span>
            </div>
          </aside>
        </div>

        <dl
          class="highlights"
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

      <section
        id="about"
        class="content-section about-grid"
        aria-labelledby="about-title"
      >
        <div class="section-heading-block">
          <p class="section-index"><span>01</span> About</p>
          <h2 id="about-title">Practical experience, backed by <em>strong fundamentals.</em></h2>
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
          <div
            class="principles"
            aria-label="Development principles"
          >
            <span>Semantic</span>
            <span>Responsive</span>
            <span>Accessible</span>
            <span>Performant</span>
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        class="content-section"
        aria-labelledby="capabilities-title"
      >
        <p class="section-index"><span>02</span> Capabilities</p>
        <div class="section-heading">
          <h2 id="capabilities-title">A full-stack <em>toolkit.</em></h2>
          <p>Core skills from my résumé, applied across client platforms, operational tools, and university work.</p>
        </div>

        <div class="capability-grid">
          <article>
            <div class="capability-meta"><span>01</span><span>Client layer</span></div>
            <h3>Frontend</h3>
            <p>JavaScript <i /> Vue.js <i /> CSS <i /> Tailwind CSS</p>
            <span
              class="card-arrow"
              aria-hidden="true"
              >↗</span
            >
          </article>
          <article>
            <div class="capability-meta"><span>02</span><span>Server layer</span></div>
            <h3>Backend</h3>
            <p>PHP <i /> Laravel <i /> SQL</p>
            <span
              class="card-arrow"
              aria-hidden="true"
              >↗</span
            >
          </article>
          <article>
            <div class="capability-meta"><span>03</span><span>Systems layer</span></div>
            <h3>Engineering</h3>
            <p>DevOps <i /> Laravel Forge <i /> Python <i /> Java</p>
            <span
              class="card-arrow"
              aria-hidden="true"
              >↗</span
            >
          </article>
        </div>
      </section>
    </main>

    <footer>
      <p>© Matthias Löhden <span aria-hidden="true">/</span> Full-stack developer</p>
      <a href="mailto:m.loehden@yahoo.de">m.loehden@yahoo.de <span aria-hidden="true">↗</span></a>
    </footer>
  </div>
</template>
