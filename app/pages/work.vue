<script setup lang="ts">
useSeoMeta({
  title: 'Professional Work — Matthias Löhden',
  description:
    'Professional software projects by Matthias Löhden at TopRed Media GmbH, including learning, shop management, digital signage, and communication platforms.',
});
</script>

<template>
  <div class="work-shell">
    <TriangleBackground />

    <a
      class="skip-link"
      href="#work-content"
      >Skip to content</a
    >

    <header class="site-header work-header">
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
          <small>Professional work</small>
        </span>
      </NuxtLink>

      <nav aria-label="Work page navigation">
        <NuxtLink to="/"><span aria-hidden="true">←</span> Portfolio</NuxtLink>
        <a href="#work-index"><span aria-hidden="true">01</span> Index</a>
        <NuxtLink to="/projects"><span aria-hidden="true">02</span> University</NuxtLink>
        <a href="mailto:m.loehden@yahoo.de"><span aria-hidden="true">03</span> Contact</a>
      </nav>
    </header>

    <main id="work-content">
      <section
        class="work-hero"
        aria-labelledby="work-title"
      >
        <div class="work-hero-copy">
          <p class="work-kicker"><span aria-hidden="true">[ 2019—2025 ]</span> Client &amp; product systems</p>
          <h1
            id="work-title"
            aria-label="Software for work that matters."
          >
            Software for<br />work that<br /><em>matters.</em>
          </h1>
        </div>

        <aside class="work-brief">
          <p>
            At TopRed Media GmbH, I helped deliver operational software for an enterprise telecommunications and retail
            client—and worked on a flexible platform for TopRed’s own clients.
          </p>
          <dl>
            <div>
              <dt>Company</dt>
              <dd>TopRed Media GmbH</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>Apprentice → full-stack developer</dd>
            </div>
            <div>
              <dt>Systems</dt>
              <dd>Four selected projects</dd>
            </div>
          </dl>
        </aside>

        <a
          class="scroll-cue"
          href="#work-index"
          >Explore the systems <span aria-hidden="true">↓</span></a
        >
      </section>

      <section
        id="work-index"
        class="work-index"
        aria-labelledby="work-index-title"
      >
        <div>
          <p class="work-kicker"><span aria-hidden="true">/ INDEX</span> Selected work</p>
          <h2 id="work-index-title">Platforms built around real operations.</h2>
        </div>
        <ol>
          <li>
            <a href="#learning-platform">
              <span>01</span>
              <strong>Learning platform</strong>
              <small>Learning platform</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
          <li>
            <a href="#retail-operations">
              <span>02</span>
              <strong>Retail operations</strong>
              <small>Shop operations</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
          <li>
            <a href="#signage-control">
              <span>03</span>
              <strong>Signage control</strong>
              <small>Digital signage</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
          <li>
            <a href="#client-platform">
              <span>04</span>
              <strong>Client platform</strong>
              <small>CMS &amp; communication</small>
              <i aria-hidden="true">↓</i>
            </a>
          </li>
        </ol>
      </section>

      <article
        id="learning-platform"
        class="work-case"
        aria-labelledby="learning-platform-title"
      >
        <header class="work-case-header">
          <span aria-hidden="true">01</span>
          <div>
            <p class="work-kicker"><span>Enterprise client</span> Learning &amp; content</p>
            <h2 id="learning-platform-title">Enterprise learning platform</h2>
            <p>A learning platform backed by a purpose-built publishing and permissions system.</p>
          </div>
        </header>

        <div class="work-case-layout">
          <div class="work-case-copy">
            <p>
              Our team at TopRed Media was responsible for a platform that brought multiple learning formats into one
              managed experience. Its custom CMS supported events, videos, podcasts, and articles instead of forcing
              very different content into one generic model.
            </p>
            <p>
              Custom access rights controlled who could reach specific parts of the platform, making permissions a core
              product capability alongside publishing.
            </p>
            <dl class="work-facts">
              <div>
                <dt>Purpose</dt>
                <dd>Learning and knowledge</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>Custom CMS and access rights</dd>
              </div>
              <div>
                <dt>Formats</dt>
                <dd>Events, video, podcasts, articles</dd>
              </div>
            </dl>
          </div>

          <figure class="work-panel content-panel">
            <figcaption><span>content.library</span><span>access-aware publishing</span></figcaption>
            <div class="content-preview">
              <div
                class="content-nav"
                aria-hidden="true"
              >
                <span class="is-active">Overview</span><span>Events</span><span>Media</span><span>Articles</span>
              </div>
              <div class="content-cards">
                <div class="featured-content"><i /><strong>Learning event</strong><small>Scheduled content</small></div>
                <div><span aria-hidden="true">▶</span><strong>Video</strong><small>On demand</small></div>
                <div><span aria-hidden="true">◉</span><strong>Podcast</strong><small>Audio series</small></div>
                <div><span aria-hidden="true">¶</span><strong>Article</strong><small>Editorial</small></div>
              </div>
            </div>
            <div class="panel-status"><i aria-hidden="true" /> Role-aware content delivery</div>
          </figure>
        </div>
      </article>

      <article
        id="retail-operations"
        class="work-case"
        aria-labelledby="retail-operations-title"
      >
        <header class="work-case-header">
          <span aria-hidden="true">02</span>
          <div>
            <p class="work-kicker"><span>Enterprise client</span> Retail operations</p>
            <h2 id="retail-operations-title">Retail operations platform</h2>
            <p>A shared operational workspace for tasks, shop data, changes, and reporting.</p>
          </div>
        </header>

        <div class="work-case-layout work-case-layout-reverse">
          <figure class="work-panel shop-panel">
            <figcaption><span>shop.record</span><span>operational source of truth</span></figcaption>
            <div class="shop-preview">
              <div class="shop-summary">
                <span>SHOP / 042</span>
                <strong>Location profile</strong>
                <small><i aria-hidden="true" /> Record active</small>
              </div>
              <div class="shop-fields">
                <div><small>Opening hours</small><strong>Configured</strong></div>
                <div><small>Floor layout</small><strong>Available</strong></div>
                <div><small>Postal data</small><strong>Managed</strong></div>
                <div><small>Tasks</small><strong>Assigned</strong></div>
              </div>
              <div
                class="sheet-sync"
                aria-label="Excel sheets could export data and synchronize uploaded changes"
              >
                <span>Database</span><i aria-hidden="true">⇄</i><strong>.XLSX</strong>
              </div>
            </div>
          </figure>

          <div class="work-case-copy">
            <p>
              The platform gave employees a central place to receive and complete tasks while maintaining the
              operational record for each shop. Individual shop pages collected opening times, floor layouts, location
              data, and location or postal-change workflows.
            </p>
            <p>
              Its analytics brought shop, task, and related platform data together in Excel reports. The flow also
              worked in reverse: edited spreadsheets could be uploaded and synchronized back to the database.
            </p>
            <dl class="work-facts">
              <div>
                <dt>Purpose</dt>
                <dd>Shop and task management</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>Locations, layouts, hours, tasks</dd>
              </div>
              <div>
                <dt>Reporting</dt>
                <dd>Excel export and import sync</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      <article
        id="signage-control"
        class="work-case"
        aria-labelledby="signage-control-title"
      >
        <header class="work-case-header">
          <span aria-hidden="true">03</span>
          <div>
            <p class="work-kicker"><span>Enterprise client</span> Digital signage</p>
            <h2 id="signage-control-title">Digital signage control system</h2>
            <p>Player software connecting remote operations, physical displays, and platform analytics.</p>
          </div>
        </header>

        <div class="work-case-layout">
          <div class="work-case-copy">
            <p>
              I was responsible for a Python service with an Electron frontend that ran on digital-signage players and
              controlled their connected displays while advertisements were playing.
            </p>
            <p>
              The service communicated with each display over RS-232 and sent player status back to the central retail
              operations platform for analytics. Operators could connect through remote administration and use the
              Electron interface to control the service.
            </p>
            <dl class="work-facts">
              <div>
                <dt>My responsibility</dt>
                <dd>Python service and Electron UI</dd>
              </div>
              <div>
                <dt>Hardware link</dt>
                <dd>RS-232 display control</dd>
              </div>
              <div>
                <dt>Operations</dt>
                <dd>Status reporting and remote control</dd>
              </div>
            </dl>
          </div>

          <figure class="work-panel display-panel">
            <figcaption><span>display.control</span><span>player online</span></figcaption>
            <div class="display-flow">
              <div class="flow-node remote"><small>REMOTE</small><strong>Administration</strong></div>
              <i aria-hidden="true">↓</i>
              <div class="player-node">
                <div><small>CONTROL UI</small><strong>Electron</strong></div>
                <span aria-hidden="true">↕</span>
                <div><small>SERVICE</small><strong>Python</strong></div>
              </div>
              <div class="flow-split">
                <span><i aria-hidden="true">RS-232 →</i><strong>Display</strong><small>Playback control</small></span>
                <span><i aria-hidden="true">Status →</i><strong>Operations</strong><small>Analytics</small></span>
              </div>
            </div>
          </figure>
        </div>
      </article>

      <article
        id="client-platform"
        class="work-case"
        aria-labelledby="client-platform-title"
      >
        <header class="work-case-header">
          <span aria-hidden="true">04</span>
          <div>
            <p class="work-kicker"><span>TopRed Media</span> Internal product</p>
            <h2 id="client-platform-title">One platform, different communities.</h2>
            <p>A configurable CMS and communication product designed for different client contexts.</p>
          </div>
        </header>

        <div class="work-case-layout work-case-layout-reverse">
          <figure class="work-panel module-panel">
            <figcaption><span>platform.modules</span><span>configured per client</span></figcaption>
            <div class="module-grid">
              <div><span>01</span><strong>CMS</strong><small>Publish content</small></div>
              <div><span>02</span><strong>Live chat</strong><small>Stay connected</small></div>
              <div><span>03</span><strong>Events</strong><small>Coordinate activity</small></div>
              <div><span>04</span><strong>Teams</strong><small>Manage groups</small></div>
            </div>
            <div class="audience-row">
              <span>Personal training</span><i aria-hidden="true">+</i><span>Kindergarten</span>
            </div>
          </figure>

          <div class="work-case-copy">
            <p>
              Alongside the client work, our team developed an internal platform combining a custom CMS with live chat,
              event management, team management, and related communication tools.
            </p>
            <p>
              It was adaptable to very different organizations: examples included a personal trainer communicating with
              customers and a kindergarten coordinating its community. The shared product foundation could serve both
              without reducing them to the same workflow.
            </p>
            <dl class="work-facts">
              <div>
                <dt>Purpose</dt>
                <dd>Content and communication</dd>
              </div>
              <div>
                <dt>Modules</dt>
                <dd>CMS, live chat, events, teams</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>Configurable for client contexts</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      <section
        class="work-close"
        aria-labelledby="work-close-title"
      >
        <p class="work-kicker"><span aria-hidden="true">/ CONTEXT</span> A note on client work</p>
        <h2 id="work-close-title">Built for the people operating it every day.</h2>
        <p>
          These projects are described at a system level. The common thread is practical software that connects content,
          workflows, data, and physical operations.
        </p>
        <div class="close-actions">
          <a
            class="primary-action"
            href="mailto:m.loehden@yahoo.de"
            >Start a conversation <span aria-hidden="true">↗</span></a
          >
          <NuxtLink
            class="text-action"
            to="/projects"
            >View university work <span aria-hidden="true">→</span></NuxtLink
          >
        </div>
      </section>
    </main>

    <footer>
      <p>© Matthias Löhden <span aria-hidden="true">/</span> Professional work</p>
      <NuxtLink to="/">Back to portfolio <span aria-hidden="true">↖</span></NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.work-shell {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow: hidden;
}

.work-shell::after {
  position: fixed;
  z-index: 10;
  inset: 0;
  background: var(--background);
  content: '';
  pointer-events: none;
  animation: work-page-reveal 760ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
}

.work-shell > main,
.work-shell > footer {
  position: relative;
  z-index: 1;
}

.work-header {
  position: relative;
  z-index: 2;
}

.work-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.52fr);
  grid-template-rows: 1fr auto;
  gap: 3rem clamp(3rem, 9vw, 9rem);
  align-items: end;
  min-height: min(53rem, calc(100svh - 5.5rem));
  padding-block: clamp(5rem, 10vw, 8rem) 2rem;
}

.work-kicker {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.work-kicker span {
  margin-right: 0.7rem;
  color: var(--accent);
}

.work-hero h1 {
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

.work-brief dl {
  margin: 2.2rem 0 0;
  border-top: 1px solid var(--border);
}

.work-brief dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.7rem;
  border-bottom: 1px solid var(--border);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.work-brief dt {
  color: var(--quiet);
  text-transform: uppercase;
}

.work-brief dd {
  margin: 0;
  text-align: right;
}

.scroll-cue {
  display: inline-flex;
  align-items: center;
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

.work-index {
  display: grid;
  grid-template-columns: minmax(15rem, 0.65fr) minmax(0, 1.35fr);
  gap: clamp(3rem, 8vw, 8rem);
  padding-block: clamp(6rem, 10vw, 9rem);
  border-top: 1px solid var(--border);
}

.work-index h2 {
  margin-top: 1.5rem;
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  line-height: 0.92;
}

.work-index ol {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--border);
  list-style: none;
}

.work-index a {
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

.work-index a:hover,
.work-index a:focus-visible {
  padding-left: 0.6rem;
  color: var(--accent-bright);
}

.work-index a > span,
.work-index small,
.work-index i {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
  font-style: normal;
}

.work-index a > span,
.work-index i {
  color: var(--accent);
}

.work-index strong {
  font-family: var(--display-font);
  font-size: 1.3rem;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.work-case {
  padding-block: clamp(6rem, 11vw, 10rem);
  border-top: 1px solid var(--border);
  scroll-margin-top: 1rem;
}

.work-case-header {
  display: grid;
  grid-template-columns: clamp(4rem, 8vw, 7rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
}

.work-case-header > span {
  color: var(--accent);
  font-family: var(--display-font);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 700;
  line-height: 0.8;
  text-shadow: 0 0 2rem rgba(50, 132, 255, 0.25);
}

.work-case-header h2 {
  max-width: 17ch;
  margin-top: 1rem;
  font-size: clamp(3.3rem, 7vw, 6.8rem);
}

.work-case-header div > p:last-child {
  max-width: 42rem;
  margin-top: 1.25rem;
  color: var(--muted);
  font-size: clamp(1rem, 1.5vw, 1.12rem);
  line-height: 1.7;
}

.work-case-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(3.5rem, 9vw, 9rem);
  align-items: center;
  margin-top: clamp(4rem, 8vw, 7rem);
}

.work-case-layout-reverse {
  grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.72fr);
}

.work-case-copy {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.8;
}

.work-case-copy > p:first-child {
  color: var(--text);
  font-size: clamp(1.12rem, 1.8vw, 1.34rem);
  line-height: 1.6;
}

.work-case-copy > p + p {
  margin-top: 1.4rem;
}

.work-facts {
  margin: 2.5rem 0 0;
  border-top: 1px solid var(--border);
}

.work-facts div {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1rem;
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--border);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.work-facts dt {
  color: var(--accent-bright);
  text-transform: uppercase;
}

.work-facts dd {
  margin: 0;
}

.work-panel {
  margin: 0;
  border: 1px solid var(--border-strong);
  background: color-mix(in srgb, var(--background-raised) 94%, transparent);
  box-shadow: 1.5rem 1.5rem 0 rgba(50, 132, 255, 0.035);
}

.work-panel figcaption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.6rem;
}

.work-panel figcaption span:last-child {
  color: var(--quiet);
}

.content-preview,
.shop-preview,
.display-flow,
.module-grid {
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.content-preview {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
}

.content-nav {
  display: grid;
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
  display: grid;
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

.content-cards i {
  width: 0.45rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0.8rem var(--accent);
}

.content-cards span,
.module-grid span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.62rem;
}

.content-cards strong,
.shop-summary strong,
.shop-fields strong,
.display-flow strong,
.module-grid strong {
  font-family: var(--display-font);
  font-size: 1rem;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.content-cards small,
.shop-preview small,
.display-flow small,
.module-grid small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.54rem;
  line-height: 1.5;
}

.panel-status {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.panel-status i,
.shop-summary small i {
  display: inline-block;
  width: 0.38rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3cdc94;
  box-shadow: 0 0 0.65rem rgba(60, 220, 148, 0.75);
}

.shop-summary {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 0.4rem 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.shop-summary > span {
  grid-column: 1 / -1;
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.shop-summary small {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.shop-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
  border: 1px solid var(--border);
}

.shop-fields div {
  display: grid;
  gap: 0.6rem;
  padding: 1rem;
}

.shop-fields div:nth-child(even) {
  border-left: 1px solid var(--border);
}

.shop-fields div:nth-child(n + 3) {
  border-top: 1px solid var(--border);
}

.sheet-sync {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.8rem;
  border: 1px solid var(--border-strong);
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.62rem;
  text-align: center;
}

.sheet-sync i {
  color: var(--accent);
  font-size: 1rem;
  font-style: normal;
}

.sheet-sync strong {
  color: var(--accent-bright);
}

.display-flow {
  display: grid;
  justify-items: center;
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  gap: 0.8rem;
  padding: 0.8rem;
  border: 1px solid var(--border-strong);
}

.player-node > span {
  color: var(--accent);
}

.flow-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
}

.flow-split span i {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  font-style: normal;
}

.module-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.module-grid > div {
  display: grid;
  min-height: 8rem;
  align-content: space-between;
  padding: 1rem;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--surface-hover), transparent);
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

.module-grid > div:hover {
  border-color: var(--border-strong);
  transform: translateY(-0.2rem);
}

.audience-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem 1rem;
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.58rem;
  text-align: center;
}

.audience-row span {
  padding: 0.7rem;
  border: 1px solid var(--border);
}

.audience-row i {
  color: var(--accent);
  font-style: normal;
}

.work-close {
  padding-block: clamp(7rem, 13vw, 12rem);
  border-top: 1px solid var(--border);
  text-align: center;
}

.work-close h2 {
  max-width: 13ch;
  margin-inline: auto;
  font-size: clamp(3.8rem, 8vw, 7.5rem);
}

.work-close > p:not(.work-kicker) {
  max-width: 38rem;
  margin: 1.7rem auto 0;
  color: var(--muted);
  line-height: 1.7;
}

.close-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.2rem;
}

@keyframes work-page-reveal {
  from {
    opacity: 1;
    visibility: visible;
  }

  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (max-width: 820px) {
  .work-hero,
  .work-index,
  .work-case-layout,
  .work-case-layout-reverse {
    grid-template-columns: 1fr;
  }

  .work-hero {
    grid-template-rows: auto;
    align-items: start;
  }

  .work-hero h1 {
    font-size: clamp(4.6rem, 16vw, 7rem);
  }

  .work-brief {
    max-width: 32rem;
  }

  .work-case-layout-reverse .work-panel {
    order: 2;
  }

  .work-case-layout-reverse .work-case-copy {
    order: 1;
  }
}

@media (max-width: 620px) {
  .work-header nav a:nth-child(2) {
    display: none;
  }

  .work-hero {
    min-height: calc(100svh - 4.75rem);
  }

  .work-hero h1 {
    font-size: clamp(4rem, 20vw, 6rem);
  }

  .work-index a {
    grid-template-columns: 2rem 1fr auto;
  }

  .work-index small {
    display: none;
  }

  .work-case-header {
    grid-template-columns: 1fr;
  }

  .work-case-header > span {
    font-size: 2.8rem;
  }

  .work-case-header h2 {
    font-size: clamp(3rem, 14vw, 4.8rem);
  }

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

  .player-node,
  .flow-split {
    grid-template-columns: 1fr;
  }

  .player-node > span {
    transform: rotate(90deg);
    text-align: center;
  }

  .close-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .work-close {
    text-align: left;
  }

  .work-close h2,
  .work-close > p:not(.work-kicker) {
    margin-left: 0;
  }
}

@media (max-width: 420px) {
  .work-facts div {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .shop-fields,
  .module-grid {
    grid-template-columns: 1fr;
  }

  .shop-fields div:nth-child(even) {
    border-left: 0;
  }

  .shop-fields div + div {
    border-top: 1px solid var(--border);
  }
}

@media (hover: hover) and (pointer: fine) {
  .work-header,
  .work-shell > main,
  .work-shell > footer {
    pointer-events: none;
  }

  .work-header .identity,
  .work-header nav,
  .work-shell main :is(a, h1, h2, h3, p, dt, dd, figcaption, .work-panel),
  .work-shell footer :is(a, p) {
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .work-shell::after {
    visibility: hidden;
    animation: none;
  }
}
</style>
