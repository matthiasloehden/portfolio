/**
 * Scroll Reveal
 * -------------
 * Observes all elements with [data-reveal].
 *
 * - Reveals elements when they enter the reveal area.
 * - Keeps observing elements so they can be hidden again.
 * - Removes `is-revealed` when an element leaves the observer area.
 * - Reveals the element again when it re-enters the area.
 * - Automatically detects elements added dynamically, including
 *   Nuxt SPA navigation and asynchronously rendered components.
 * - Respects the user's `prefers-reduced-motion` setting.
 */

export default defineNuxtPlugin(() => {
  const motionPreference = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );

  /**
   * Defines the reveal area.
   *
   * - -8% bottom margin for the reveal effect.
   * - Extends the top area by 10% so elements are reset only
   *   after they have moved sufficiently outside the viewport.
   *
   * The observer stays active so elements can reveal repeatedly.
   */
  const intersectionObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const element = entry.target as HTMLElement;

              if (entry.isIntersecting) {
                element.classList.add('is-revealed');
              } else {
                element.classList.remove('is-revealed');
              }
            });
          },
          {
            rootMargin: '10% 0px -8% 0px',
            threshold: 0.12,
          },
        )
      : undefined;

  /**
   * Binds a single reveal element to the observer.
   */
  function bindElement(element: HTMLElement): void {
    if (element.dataset.revealBound === 'true') return;

    element.dataset.revealBound = 'true';

    if (motionPreference.matches || !intersectionObserver) {
      element.classList.add('is-revealed');
      return;
    }

    intersectionObserver.observe(element);
  }

  /**
   * Binds all reveal elements inside a DOM scope.
   *
   * Used during initialisation and when new DOM nodes are added.
   */
  function bindScope(scope: ParentNode): void {
    if (
      scope instanceof HTMLElement &&
      scope.matches('[data-reveal]')
    ) {
      bindElement(scope);
    }

    scope
      .querySelectorAll('[data-reveal]')
      .forEach((element) => {
        bindElement(element as HTMLElement);
      });
  }

  /**
   * Watches for dynamically added DOM nodes.
   *
   * This is important for Nuxt SPA navigation and components
   * that are rendered asynchronously.
   */
  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          bindScope(node);
        }
      });
    });
  });

  /**
   * Reveals all elements immediately.
   *
   * Used when reduced motion is enabled.
   */
  function revealAll(): void {
    document
      .querySelectorAll('[data-reveal]')
      .forEach((element) => {
        (element as HTMLElement).classList.add('is-revealed');
      });
  }

  /**
   * Initialise the reveal system once Nuxt is ready.
   */
  onNuxtReady(() => {
    document.documentElement.classList.add('motion-ready');

    // Observe existing elements.
    bindScope(document);

    // Detect dynamically added elements.
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // React to changes in the user's motion preference.
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) {
        revealAll();
      }
    });
  });
});