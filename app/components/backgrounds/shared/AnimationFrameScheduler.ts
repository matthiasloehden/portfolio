/**
 * Coalesces repeated render requests into one animation-frame callback.
 *
 * Canvas backgrounds often receive resize, scroll and pointer events within the
 * same browser frame. Keeping a single pending slot prevents redundant draws.
 * The slot is cleared before invoking the callback, which lets the callback
 * safely request the next frame when an animation still needs to continue.
 */
export class AnimationFrameScheduler {
  private frame: number | null = null;

  constructor(private readonly callback: FrameRequestCallback) {}

  get pending(): boolean {
    return this.frame !== null;
  }

  request(): boolean {
    if (this.frame !== null) return false;

    this.frame = window.requestAnimationFrame(this.run);
    return true;
  }

  cancel(): void {
    if (this.frame === null) return;

    window.cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  dispose(): void {
    this.cancel();
  }

  private readonly run = (now: number): void => {
    this.frame = null;
    this.callback(now);
  };
}
