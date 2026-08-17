/**
 * Owns WebGL context-loss listeners for a single canvas.
 *
 * Browsers may invalidate a GPU context independently of Vue's component
 * lifecycle. This helper records that state, prevents the browser's default
 * permanent loss behavior and asks the scene controller to tear down or rebuild
 * its renderer. It intentionally contains no scene resources itself.
 */
export interface WebGLContextLifecycleHandlers {
  onLost: () => void;
  onRestored: () => void;
}

export class WebGLContextLifecycle {
  lost = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly handlers: WebGLContextLifecycleHandlers,
  ) {
    canvas.addEventListener('webglcontextlost', this.handleContextLost);
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored);
  }

  dispose(): void {
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
  }

  private readonly handleContextLost = (event: Event): void => {
    event.preventDefault();
    this.lost = true;
    this.handlers.onLost();
  };

  private readonly handleContextRestored = (): void => {
    this.lost = false;
    this.handlers.onRestored();
  };
}
