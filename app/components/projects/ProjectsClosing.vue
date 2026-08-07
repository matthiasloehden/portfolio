<template>
  <section
    class="projects-close border-t border-line text-center"
    aria-labelledby="projects-close-title"
  >
    <SharedSectionKicker
      prefix="/ END"
      label="More work ahead"
      hide-prefix-from-screen-readers
    />
    <h2 id="projects-close-title">Curiosity is the common stack.</h2>
    <p class="closing-copy">
      These projects connect technical implementation with the systems, standards, and people around it.
    </p>
    <SharedActionLink
      class="mt-9"
      label="Start a conversation"
      href="mailto:m.loehden@yahoo.de"
    />
  </section>
</template>

<style scoped>
.projects-close {
  padding-block: clamp(7rem, 13vw, 12rem);
}

h2 {
  max-width: 11ch;
  margin-inline: auto;
  font-size: clamp(3.8rem, 8vw, 7.5rem);
}

.closing-copy {
  max-width: 34rem;
  margin: 1.7rem auto 0;
  color: var(--muted);
  line-height: 1.7;
}

@media (max-width: 620px) {
  .projects-close {
    text-align: left;
  }

  h2,
  .closing-copy {
    margin-left: 0;
  }
}
</style>
