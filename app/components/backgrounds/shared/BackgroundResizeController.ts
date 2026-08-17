/**
 * Collects every resize signal relevant to a full-screen background.
 *
 * ResizeObserver covers changes to the canvas and its layout container, while
 * viewport and orientation listeners also catch device-pixel-ratio changes that
 * may leave the CSS box unchanged. Multiple observed targets share one callback,
 * and dispose removes both observer and global listeners as a single lifecycle
 * operation for the owning Vue component.
 */
export class BackgroundResizeController {
  private readonly observer: ResizeObserver;

  constructor(
    private readonly callback: () => void,
    targets: readonly (Element | null | undefined)[],
  ) {
    this.observer = new ResizeObserver(this.handleResize);

    for (const target of new Set(targets.filter((value): value is Element => value instanceof Element))) {
      this.observer.observe(target);
    }

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleResize, { passive: true });
  }

  dispose(): void {
    this.observer.disconnect();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
  }

  private readonly handleResize = (): void => {
    this.callback();
  };
}
