export default defineNuxtPlugin(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  function reveal(element: HTMLElement): void {
    element.classList.add('is-revealed');
    intersectionObserver?.unobserve(element);
  }

  function bindElement(element: HTMLElement): void {
    if (element.dataset.revealBound === 'true') return;

    element.dataset.revealBound = 'true';

    if (motionPreference.matches || !intersectionObserver) {
      reveal(element);
      return;
    }

    intersectionObserver.observe(element);
  }

  function bindScope(scope: ParentNode): void {
    if (scope instanceof HTMLElement && scope.matches('[data-reveal]')) bindElement(scope);
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach(bindElement);
  }

  const intersectionObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) reveal(entry.target as HTMLElement);
            });
          },
          {
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.12,
          },
        )
      : undefined;

  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) bindScope(node);
      });
    });
  });

  function revealAll(): void {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(reveal);
  }

  onNuxtReady(() => {
    document.documentElement.classList.add('motion-ready');
    bindScope(document);
    domObserver.observe(document.body, { childList: true, subtree: true });
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) revealAll();
    });
  });
});
