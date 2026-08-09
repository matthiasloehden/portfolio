<template>
  <section
    class="personal-close border-t border-line text-center"
    aria-labelledby="personal-close-title"
  >
    <SharedSectionKicker
      prefix="/ ALWAYS LEARNING"
      label="Curiosity in practice"
      hide-prefix-from-screen-readers
    />
    <h2
      id="personal-close-title"
      class="motion-hover"
      data-reveal="scale"
    >
      The best projects start with wanting to know more.
    </h2>
    <p
      class="closing-copy motion-hover"
      data-reveal="up"
      style="--reveal-delay: 100ms"
    >
      Whether it is a pull request, a container, or a cooling loop, I learn by understanding the system and making it
      work for a real purpose.
    </p>
    <div
      class="close-actions flex items-center justify-center"
      data-reveal="up"
      style="--reveal-delay: 180ms"
    >
      <SharedActionLink
        label="Start a conversation"
        href="mailto:m.loehden@proton.me"
      />
      <SharedActionLink
        label="View source"
        symbol="→"
        href="https://github.com/matthiasloehden/portfolio"
        variant="text"
      />
    </div>
  </section>
</template>

<style scoped>
.personal-close {
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
  .personal-close {
    text-align: left;
  }

  h2,
  .closing-copy {
    margin-left: 0;
  }

}
</style>
