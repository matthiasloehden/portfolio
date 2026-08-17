export interface BackgroundEnvironmentHandlers {
  onMotionPreferenceChange: (reduced: boolean) => void;
  onThemeChange: () => void;
  onVisibilityChange: (visible: boolean) => void;
}

/**
 * Shares browser-level scene signals while leaving rendering decisions inside
 * each background. Construction and disposal are explicit to match GPU and
 * Canvas lifecycle ownership.
 */
export class BackgroundEnvironment {
  private readonly reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  constructor(private readonly handlers: BackgroundEnvironmentHandlers) {
    this.reducedMotionQuery.addEventListener('change', this.handleMotionPreferenceChange);
    window.addEventListener('portfolio-theme-change', this.handleThemeChange);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  get prefersReducedMotion(): boolean {
    return this.reducedMotionQuery.matches;
  }

  get documentVisible(): boolean {
    return !document.hidden;
  }

  dispose(): void {
    this.reducedMotionQuery.removeEventListener('change', this.handleMotionPreferenceChange);
    window.removeEventListener('portfolio-theme-change', this.handleThemeChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private readonly handleMotionPreferenceChange = (): void => {
    this.handlers.onMotionPreferenceChange(this.prefersReducedMotion);
  };

  private readonly handleThemeChange = (): void => {
    this.handlers.onThemeChange();
  };

  private readonly handleVisibilityChange = (): void => {
    this.handlers.onVisibilityChange(this.documentVisible);
  };
}
