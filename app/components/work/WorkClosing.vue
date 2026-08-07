<template>
  <section
    class="work-close border-t border-line text-center"
    aria-labelledby="work-close-title"
  >
    <SharedSectionKicker
      prefix="/ CONTEXT"
      label="A note on client work"
      hide-prefix-from-screen-readers
    />
    <h2
      id="work-close-title"
      class="motion-hover"
      data-reveal="scale"
    >
      Built for the people operating it every day.
    </h2>
    <p
      class="closing-copy motion-hover"
      data-reveal="up"
      style="--reveal-delay: 100ms"
    >
      These projects are described at a system level. The common thread is practical software that connects content,
      workflows, data, and physical operations.
    </p>
    <div
      class="close-actions flex items-center justify-center"
      data-reveal="up"
      style="--reveal-delay: 180ms"
    >
      <SharedActionLink
        label="Start a conversation"
        href="mailto:m.loehden@yahoo.de"
      />
      <SharedActionLink
        label="View university work"
        symbol="→"
        to="/projects"
        variant="text"
      />
    </div>
  </section>
</template>

<style scoped>
.work-close {
  padding-block: clamp(7rem, 13vw, 12rem);
}

h2 {
  max-width: 13ch;
  margin-inline: auto;
  font-size: clamp(3.8rem, 8vw, 7.5rem);
}

.closing-copy {
  max-width: 38rem;
  margin: 1.7rem auto 0;
  color: var(--muted);
  line-height: 1.7;
}

.close-actions {
  gap: 1.5rem;
  margin-top: 2.2rem;
}

@media (max-width: 620px) {
  .close-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .work-close {
    text-align: left;
  }

  h2,
  .closing-copy {
    margin-left: 0;
  }
}
</style>
