<script setup lang="ts">
useSeoMeta({
  title: 'University Projects — Matthias Löhden',
  description:
    'Selected university projects by Matthias Löhden across event streaming, passwordless authentication, and IT service management.',
});
</script>

<template>
  <div class="project-shell">
    <ParticleBackground />

    <a
      class="skip-link"
      href="#projects-content"
      >Skip to content</a
    >

    <header class="site-header projects-header">
      <NuxtLink
        class="identity"
        to="/"
        aria-label="Matthias Löhden, home"
      >
        <span
          class="monogram"
          aria-hidden="true"
          >ML</span
        >
        <span class="identity-copy">
          <strong>Matthias Löhden</strong>
          <small>University project archive</small>
        </span>
      </NuxtLink>

      <nav aria-label="Project page navigation">
        <NuxtLink to="/"><span aria-hidden="true">←</span> Portfolio</NuxtLink>
        <NuxtLink to="/work"><span aria-hidden="true">01</span> Work</NuxtLink>
        <a href="#project-index"><span aria-hidden="true">02</span> Index</a>
        <a href="mailto:m.loehden@yahoo.de"><span aria-hidden="true">03</span> Contact</a>
      </nav>
    </header>

    <main id="projects-content">
      <section
        class="projects-hero"
        aria-labelledby="projects-title"
      >
        <p class="project-kicker"><span aria-hidden="true">[ 01—03 ]</span> Selected academic work</p>
        <div class="projects-hero-grid">
          <h1 id="projects-title">Systems,<br /><em>security</em> &amp;<br />service.</h1>
          <div class="projects-intro">
            <p>
              Three university projects exploring how modern software moves data, establishes trust, and supports the
              people who depend on it.
            </p>
            <dl>
              <div>
                <dt>Scope</dt>
                <dd>Prototypes &amp; concepts</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Applied computer science</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>University coursework</dd>
              </div>
            </dl>
          </div>
        </div>
        <a
          class="scroll-cue"
          href="#project-index"
          >View project index <span aria-hidden="true">↓</span></a
        >
      </section>

      <section
        id="project-index"
        class="project-index"
        aria-labelledby="project-index-title"
      >
        <div class="index-heading">
          <p class="project-kicker"><span aria-hidden="true">/ INDEX</span> Areas of study</p>
          <h2 id="project-index-title">Three perspectives on dependable digital systems.</h2>
        </div>
        <ol class="index-list">
          <li>
            <a href="#streaming">
              <span>01</span>
              <strong>Event-streaming analytics</strong>
              <small>Distributed systems</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
          <li>
            <a href="#passkeys">
              <span>02</span>
              <strong>FIDO2 passkeys</strong>
              <small>Web security</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
          <li>
            <a href="#itsm">
              <span>03</span>
              <strong>IT service management</strong>
              <small>ITIL &amp; FitSM</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
        </ol>
      </section>

      <article
        id="streaming"
        class="case-study"
        aria-labelledby="streaming-title"
      >
        <header class="case-header">
          <div
            class="case-number"
            aria-hidden="true"
          >
            01
          </div>
          <div>
            <p class="project-kicker"><span>Distributed systems</span> Streaming prototype</p>
            <h2 id="streaming-title">From raw events to a live operational view.</h2>
          </div>
        </header>

        <div class="case-layout">
          <div class="case-copy">
            <p class="case-lead">
              A proof of concept for processing continuous event data with a pipeline built around Apache Kafka, Apache
              Flink, ClickHouse, and Grafana.
            </p>
            <p>
              Kafka decoupled event producers from downstream consumers. Flink validated, enriched, and aggregated the
              stream before writing query-ready records to ClickHouse. Grafana turned that data into an operational
              dashboard for inspecting volume, trends, and processing health.
            </p>

            <div class="case-notes">
              <section>
                <h3>Question</h3>
                <p>
                  How can a modular pipeline turn an unbounded event stream into information that is useful immediately?
                </p>
              </section>
              <section>
                <h3>What I explored</h3>
                <p>
                  Topic design, stream transformations, event-time thinking, column-oriented analytics, and
                  observability.
                </p>
              </section>
            </div>
          </div>

          <figure class="architecture-panel">
            <figcaption><span>pipeline.flow</span><span>event → insight</span></figcaption>
            <div
              class="pipeline"
              aria-label="Data flows from producers through Kafka and Flink into ClickHouse and Grafana"
            >
              <div><span>01</span><strong>Producers</strong><small>Event source</small></div>
              <i aria-hidden="true">→</i>
              <div><span>02</span><strong>Kafka</strong><small>Transport</small></div>
              <i aria-hidden="true">→</i>
              <div><span>03</span><strong>Flink</strong><small>Processing</small></div>
              <i aria-hidden="true">→</i>
              <div><span>04</span><strong>ClickHouse</strong><small>Analytics</small></div>
              <i aria-hidden="true">→</i>
              <div><span>05</span><strong>Grafana</strong><small>Visibility</small></div>
            </div>
            <div
              class="tech-row"
              aria-label="Technologies used"
            >
              <span>Apache Kafka</span><span>Apache Flink</span><span>ClickHouse</span><span>Grafana</span>
            </div>
          </figure>
        </div>
      </article>

      <article
        id="passkeys"
        class="case-study"
        aria-labelledby="passkeys-title"
      >
        <header class="case-header">
          <div
            class="case-number"
            aria-hidden="true"
          >
            02
          </div>
          <div>
            <p class="project-kicker"><span>Web security</span> Authentication prototype</p>
            <h2 id="passkeys-title">Passwordless sign-in with FIDO2 passkeys.</h2>
          </div>
        </header>

        <div class="case-layout reverse">
          <figure class="authentication-panel">
            <figcaption><span>authentication.ceremony</span><span>public-key flow</span></figcaption>
            <ol class="auth-flow">
              <li>
                <span>01</span>
                <div><strong>Request</strong><small>The server creates a fresh challenge.</small></div>
              </li>
              <li>
                <span>02</span>
                <div><strong>Verify locally</strong><small>The user unlocks a device-bound authenticator.</small></div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Sign</strong
                  ><small>The private key signs the challenge without leaving the authenticator.</small>
                </div>
              </li>
              <li>
                <span>04</span>
                <div><strong>Validate</strong><small>The server verifies origin, challenge, and signature.</small></div>
              </li>
            </ol>
            <div class="security-signal"><i aria-hidden="true" /> No shared password transmitted</div>
          </figure>

          <div class="case-copy">
            <p class="case-lead">
              A prototype examining passkey registration and authentication through WebAuthn and the FIDO2 model.
            </p>
            <p>
              The project replaced password knowledge with asymmetric cryptography. Registration associated a public key
              with the user, while authentication used a scoped challenge-response ceremony protected by the browser and
              authenticator.
            </p>

            <div class="case-notes">
              <section>
                <h3>Question</h3>
                <p>
                  How can authentication become easier for users while reducing exposure to phishing and credential
                  reuse?
                </p>
              </section>
              <section>
                <h3>What I explored</h3>
                <p>
                  WebAuthn ceremonies, relying-party boundaries, challenge validation, credential storage, and recovery
                  UX.
                </p>
              </section>
            </div>
          </div>
        </div>
      </article>

      <article
        id="itsm"
        class="case-study"
        aria-labelledby="itsm-title"
      >
        <header class="case-header">
          <div
            class="case-number"
            aria-hidden="true"
          >
            03
          </div>
          <div>
            <p class="project-kicker"><span>Service management</span> Process concept</p>
            <h2 id="itsm-title">Turning framework guidance into workable service operations.</h2>
          </div>
        </header>

        <div class="case-layout">
          <div class="case-copy">
            <p class="case-lead">
              A service-management concept translating ITIL principles and FitSM requirements into a concise operating
              model for a fictional IT organization.
            </p>
            <p>
              The work defined ownership, escalation paths, service records, and improvement loops without treating the
              frameworks as rigid checklists. ITIL provided the broader practice perspective; FitSM helped reduce it to
              a lightweight and auditable minimum.
            </p>

            <div class="case-notes">
              <section>
                <h3>Question</h3>
                <p>
                  What is the smallest useful process model that still creates clear ownership and repeatable service
                  quality?
                </p>
              </section>
              <section>
                <h3>What I explored</h3>
                <p>
                  Incident flow, service requests, roles, escalation, service-level thinking, and continual improvement.
                </p>
              </section>
            </div>
          </div>

          <figure class="service-panel">
            <figcaption><span>service.model</span><span>framework mapping</span></figcaption>
            <div class="service-stages">
              <div><span>01</span><strong>Capture</strong><small>Record and acknowledge</small></div>
              <div><span>02</span><strong>Classify</strong><small>Prioritize and assign</small></div>
              <div><span>03</span><strong>Resolve</strong><small>Restore or fulfil</small></div>
              <div><span>04</span><strong>Learn</strong><small>Review and improve</small></div>
            </div>
            <dl class="framework-map">
              <div>
                <dt>ITIL</dt>
                <dd>Practices, value, and continual improvement</dd>
              </div>
              <div>
                <dt>FitSM</dt>
                <dd>Lightweight requirements and clear accountability</dd>
              </div>
            </dl>
          </figure>
        </div>
      </article>

      <section
        class="projects-close"
        aria-labelledby="projects-close-title"
      >
        <p class="project-kicker"><span aria-hidden="true">/ END</span> More work ahead</p>
        <h2 id="projects-close-title">Curiosity is the common stack.</h2>
        <p>These projects connect technical implementation with the systems, standards, and people around it.</p>
        <a
          class="primary-action"
          href="mailto:m.loehden@yahoo.de"
          >Start a conversation <span aria-hidden="true">↗</span></a
        >
      </section>
    </main>

    <footer>
      <p>© Matthias Löhden <span aria-hidden="true">/</span> University projects</p>
      <NuxtLink to="/">Back to portfolio <span aria-hidden="true">↖</span></NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.project-shell {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow: hidden;
  background: transparent;
}

.project-shell > main,
.project-shell > footer {
  position: relative;
  z-index: 1;
}

.projects-header {
  position: relative;
  z-index: 2;
}

.projects-hero {
  display: flex;
  min-height: min(53rem, calc(100svh - 5.5rem));
  flex-direction: column;
  justify-content: center;
  padding-block: clamp(5rem, 10vw, 8rem) 2rem;
}

.project-kicker {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-kicker span {
  margin-right: 0.7rem;
  color: var(--accent);
}

.projects-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.55fr);
  align-items: end;
  gap: clamp(3rem, 9vw, 9rem);
  margin-top: 2.25rem;
}

.projects-hero h1 {
  max-width: none;
  margin: 0;
  font-size: clamp(4.8rem, 10vw, 9.8rem);
  line-height: 0.76;
}

.projects-intro {
  padding-bottom: 0.5rem;
}

.projects-intro > p {
  color: var(--muted);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.75;
}

.projects-intro dl {
  display: grid;
  gap: 0;
  margin: 2.2rem 0 0;
  border-top: 1px solid var(--border);
}

.projects-intro dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.7rem;
  border-bottom: 1px solid var(--border);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.projects-intro dt {
  color: var(--quiet);
  text-transform: uppercase;
}

.projects-intro dd {
  margin: 0;
  color: var(--text);
  text-align: right;
}

.scroll-cue {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 0.7rem;
  margin-top: auto;
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

.project-index {
  display: grid;
  grid-template-columns: minmax(15rem, 0.65fr) minmax(0, 1.35fr);
  gap: clamp(3rem, 8vw, 8rem);
  padding-block: clamp(6rem, 10vw, 9rem);
  border-top: 1px solid var(--border);
}

.index-heading h2 {
  margin-top: 1.5rem;
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  line-height: 0.92;
}

.index-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--border);
  list-style: none;
}

.index-list a {
  display: grid;
  grid-template-columns: 2.5rem 1fr minmax(7rem, 0.45fr) auto;
  align-items: center;
  gap: 1rem;
  padding-block: 1.3rem;
  border-bottom: 1px solid var(--border);
  transition:
    color 160ms ease,
    padding 160ms ease;
}

.index-list a:hover,
.index-list a:focus-visible {
  padding-left: 0.6rem;
  color: var(--accent-bright);
}

.index-list span,
.index-list small,
.index-list i {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
  font-style: normal;
}

.index-list span,
.index-list i {
  color: var(--accent);
}

.index-list strong {
  font-family: var(--display-font);
  font-size: 1.3rem;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.case-study {
  padding-block: clamp(6rem, 11vw, 10rem);
  border-top: 1px solid var(--border);
  scroll-margin-top: 1rem;
}

.case-header {
  display: grid;
  grid-template-columns: clamp(4rem, 8vw, 7rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
}

.case-number {
  color: var(--accent);
  font-family: var(--display-font);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 700;
  line-height: 0.8;
  text-shadow: 0 0 2rem rgba(50, 132, 255, 0.25);
}

.case-header h2 {
  max-width: 17ch;
  margin-top: 1rem;
  font-size: clamp(3.3rem, 7vw, 6.8rem);
}

.case-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(3.5rem, 9vw, 9rem);
  align-items: center;
  margin-top: clamp(4rem, 8vw, 7rem);
}

.case-layout.reverse {
  grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.72fr);
}

.case-copy {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.8;
}

.case-copy > p + p {
  margin-top: 1.4rem;
}

.case-lead {
  color: var(--text);
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  line-height: 1.55;
}

.case-notes {
  display: grid;
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.case-notes section {
  padding: 1rem 0 0 1rem;
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--accent);
}

.case-notes h3 {
  color: var(--accent-bright);
  font-family: var(--mono-font);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.case-notes p {
  margin-top: 0.55rem;
  font-size: 0.82rem;
  line-height: 1.65;
}

.architecture-panel,
.authentication-panel,
.service-panel {
  margin: 0;
  border: 1px solid var(--border-strong);
  background: var(--background-raised);
  box-shadow: 1.5rem 1.5rem 0 rgba(50, 132, 255, 0.035);
}

figure figcaption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
}

figure figcaption span:last-child {
  color: var(--quiet);
}

.pipeline {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.pipeline div {
  display: grid;
  min-height: 7.2rem;
  align-content: space-between;
  padding: 0.8rem;
  border: 1px solid var(--border);
  background: var(--surface);
}

.pipeline div:nth-of-type(4),
.pipeline div:nth-of-type(5) {
  grid-row: 2;
  margin-top: 0.5rem;
}

.pipeline div:nth-of-type(4) {
  grid-column: 3;
}

.pipeline div:nth-of-type(5) {
  grid-column: 5;
}

.pipeline i:nth-of-type(4) {
  grid-row: 2;
  grid-column: 4;
}

.pipeline span,
.service-stages span,
.auth-flow > li > span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.pipeline strong,
.service-stages strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.pipeline small,
.service-stages small,
.auth-flow small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  line-height: 1.45;
}

.pipeline > i {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.7rem;
  font-style: normal;
}

.tech-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.9rem 1rem;
  border-top: 1px solid var(--border);
}

.tech-row span {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
}

.auth-flow {
  margin: 0;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  list-style: none;
}

.auth-flow li {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  padding-block: 1rem;
  border-bottom: 1px solid var(--border);
}

.auth-flow li:first-child {
  padding-top: 0;
}

.auth-flow li:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.auth-flow div {
  display: grid;
  gap: 0.3rem;
}

.auth-flow strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.security-signal {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.security-signal i {
  width: 0.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3cdc94;
  box-shadow: 0 0 0.7rem rgba(60, 220, 148, 0.7);
}

.service-stages {
  display: grid;
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

.framework-map {
  margin: 0;
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

.projects-close {
  padding-block: clamp(7rem, 13vw, 12rem);
  border-top: 1px solid var(--border);
  text-align: center;
}

.projects-close .project-kicker {
  justify-content: center;
}

.projects-close h2 {
  max-width: 11ch;
  margin-inline: auto;
  font-size: clamp(3.8rem, 8vw, 7.5rem);
}

.projects-close > p:not(.project-kicker) {
  max-width: 34rem;
  margin: 1.7rem auto 0;
  color: var(--muted);
  line-height: 1.7;
}

.projects-close .primary-action {
  margin-top: 2.2rem;
}

@media (max-width: 820px) {
  .projects-hero-grid,
  .project-index,
  .case-layout,
  .case-layout.reverse {
    grid-template-columns: 1fr;
  }

  .projects-hero h1 {
    font-size: clamp(4.6rem, 16vw, 7rem);
  }

  .projects-intro {
    max-width: 32rem;
  }

  .case-layout.reverse .authentication-panel {
    order: 2;
  }

  .case-layout.reverse .case-copy {
    order: 1;
  }
}

@media (max-width: 620px) {
  .projects-header nav a:nth-child(3) {
    display: none;
  }

  .projects-hero {
    min-height: calc(100svh - 4.75rem);
  }

  .projects-hero h1 {
    font-size: clamp(4rem, 20vw, 6rem);
  }

  .index-list a {
    grid-template-columns: 2rem 1fr auto;
  }

  .index-list small {
    display: none;
  }

  .case-header {
    grid-template-columns: 1fr;
  }

  .case-number {
    font-size: 2.8rem;
  }

  .case-header h2 {
    font-size: clamp(3rem, 14vw, 4.8rem);
  }

  .pipeline {
    grid-template-columns: 1fr;
  }

  .pipeline div,
  .pipeline div:nth-of-type(4),
  .pipeline div:nth-of-type(5),
  .pipeline i:nth-of-type(4) {
    grid-row: auto;
    grid-column: auto;
    margin-top: 0;
  }

  .pipeline div {
    min-height: 5.5rem;
  }

  .pipeline > i {
    transform: rotate(90deg);
    text-align: center;
  }

  .service-stages {
    grid-template-columns: 1fr 1fr;
  }

  .service-stages div:nth-child(3) {
    border-left: 0;
  }

  .projects-close {
    text-align: left;
  }

  .projects-close h2,
  .projects-close > p:not(.project-kicker) {
    margin-left: 0;
  }
}
</style>
