/**
 * Provides the browser-level signals every background needs.
 *
 * The environment observes theme changes, reduced-motion preferences and page
 * visibility, then forwards typed values to the owning Vue component. It does
 * not start or stop render loops itself because each scene has different rules
 * for static frames and interaction decay. Explicit disposal mirrors the
 * lifecycle of the renderer and guarantees all global listeners are removed.
 */
import type { BackgroundTheme } from '@/types/background';

export interface BackgroundEnvironmentHandlers {
  onMotionPreferenceChange: (reduced: boolean) => void;
  onThemeChange: (theme: BackgroundTheme) => void;
  onVisibilityChange: (visible: boolean) => void;
}

export function getBackgroundTheme(): BackgroundTheme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

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

  get theme(): BackgroundTheme {
    return getBackgroundTheme();
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
    this.handlers.onThemeChange(this.theme);
  };

  private readonly handleVisibilityChange = (): void => {
    this.handlers.onVisibilityChange(this.documentVisible);
  };
}
