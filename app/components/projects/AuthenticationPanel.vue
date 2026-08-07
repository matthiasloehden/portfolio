<template>
  <SharedPanelFrame
    class="authentication-panel"
    title="authentication.ceremony"
    meta="public-key flow"
  >
    <ol class="auth-flow m-0 list-none">
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
          <strong>Sign</strong><small>The private key signs the challenge without leaving the authenticator.</small>
        </div>
      </li>
      <li>
        <span>04</span>
        <div><strong>Validate</strong><small>The server verifies origin, challenge, and signature.</small></div>
      </li>
    </ol>
    <div class="security-signal flex items-center border-t border-line">
      <i aria-hidden="true" /> No shared password transmitted
    </div>
  </SharedPanelFrame>
</template>

<style scoped>
.auth-flow {
  padding: clamp(1.25rem, 4vw, 2.5rem);
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

.auth-flow > li > span {
  color: var(--accent);
  font-family: var(--mono-font);
  font-size: 0.58rem;
}

.auth-flow strong {
  font-family: var(--display-font);
  font-size: 1rem;
  text-transform: uppercase;
}

.auth-flow small {
  color: var(--muted);
  font-family: var(--mono-font);
  font-size: 0.55rem;
  line-height: 1.45;
}

.security-signal {
  gap: 0.6rem;
  padding: 0.75rem 1rem;
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
</style>
