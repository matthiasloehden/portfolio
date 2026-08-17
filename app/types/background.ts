/**
 * Defines the shared contract between background orchestration, persisted
 * preferences and individual scenes. General animation controls stay separate
 * from scene-specific advanced settings so new backgrounds can add their own
 * validated configuration without widening every component's API.
 */

export const BACKGROUND_IDS = ['wave', 'particles', 'triangles', 'mesh'] as const;

export type BackgroundId = (typeof BACKGROUND_IDS)[number];

export type BackgroundPreference = 'auto' | BackgroundId | 'none';

export type BackgroundAnimation = 'idle' | 'cursorMovement' | 'cursorClick' | 'scroll';

export interface BackgroundAnimationSettings {
  idle: boolean;
  cursorMovement: boolean;
  cursorClick: boolean;
  scroll: boolean;
}

export type BackgroundQualityId = 'high' | 'medium' | 'low';

export type BackgroundTheme = 'dark' | 'light';

export const BACKGROUND_PERFORMANCE_MODES = ['auto', 'high', 'medium', 'low'] as const;

export type BackgroundPerformanceMode = (typeof BACKGROUND_PERFORMANCE_MODES)[number];

export interface BackgroundPerformanceSettings {
  mode: BackgroundPerformanceMode;
  showStats: boolean;
}

export interface BackgroundQualityPreset {
  id: BackgroundQualityId;
  slowFrameThreshold: number;
  pixelRatioCap: number;
}

/** Resolution data every background renderer exposes to diagnostics. */
export interface BackgroundRendererStats {
  width: number;
  height: number;
  dpr: number;
}

/** Minimum renderer API shared by every background implementation. */
export interface BackgroundRendererContract<Stats extends BackgroundRendererStats = BackgroundRendererStats> {
  setTheme(theme: BackgroundTheme): void;
  getPerformanceStats(): Stats;
}

export interface BackgroundPerformanceDescriptor {
  name: string;
  renderer: string;
}

export interface BackgroundPerformanceStats {
  name: string;
  renderer: string;
  mode: BackgroundPerformanceMode;
  preset: BackgroundQualityId;
  fps: number;
  frameTime: number;
  resolution: string;
  dpr: number;
  details?: Readonly<Record<string, string | number>>;
}

export type BackgroundSceneEmits = {
  performanceStats: [stats: BackgroundPerformanceStats];
};

export interface BackgroundSceneProps {
  active?: boolean;
  animations?: BackgroundAnimationSettings;
  performance?: BackgroundPerformanceSettings;
}

export interface WaveSettings {
  gridWidth: number;
  gridDepth: number;
  gridSpacing: number;
  vertexStep: number;
  trailLength: number;
  trailLifetime: number;
  pixelRatioCap: number;
}

export interface WaveBackgroundProps extends BackgroundSceneProps {
  settings?: WaveSettings;
}

export interface BackgroundAdvancedSettings {
  wave: WaveSettings;
}

export type WaveSetting = keyof WaveSettings;

export interface NumericSettingControl<Key extends string = string> {
  key: Key;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
}

/** Texture capacity used by the Wave Grid shader; trailLength is capped here. */
export const WAVE_MAX_TRAIL_POINTS = 48;

export const WAVE_SETTING_CONTROLS = [
  {
    key: 'gridWidth',
    label: 'Grid width',
    description: 'Horizontal extent of the grid.',
    min: 16,
    max: 52,
    step: 1,
  },
  {
    key: 'gridDepth',
    label: 'Grid depth',
    description: 'Visible depth of the grid.',
    min: 16,
    max: 52,
    step: 1,
  },
  {
    key: 'gridSpacing',
    label: 'Grid spacing',
    description: 'Distance between grid lines; lower values draw more lines.',
    min: 0.4,
    max: 1.6,
    step: 0.05,
  },
  {
    key: 'vertexStep',
    label: 'Line detail',
    description: 'Distance between line vertices; lower values cost more GPU work.',
    min: 0.16,
    max: 0.64,
    step: 0.04,
  },
  {
    key: 'trailLength',
    label: 'Trail points',
    description: 'Maximum simultaneous pointer and ripple points.',
    min: 8,
    max: WAVE_MAX_TRAIL_POINTS,
    step: 1,
  },
  {
    key: 'trailLifetime',
    label: 'Trail lifetime',
    description: 'How long ripples remain visible in milliseconds.',
    min: 600,
    max: 5_000,
    step: 100,
  },
  {
    key: 'pixelRatioCap',
    label: 'Pixel-ratio cap',
    description: 'Maximum render resolution; lower values improve GPU performance.',
    min: 1,
    max: 2,
    step: 0.25,
  },
] as const satisfies readonly NumericSettingControl<WaveSetting>[];

const WAVE_DEFAULTS: WaveSettings = {
  gridWidth: 34,
  gridDepth: 32,
  gridSpacing: 0.8,
  vertexStep: 0.32,
  trailLength: 32,
  trailLifetime: 2_300,
  pixelRatioCap: 1.5,
};

function clampSettingValue(value: number, control: NumericSettingControl): number {
  const normalized = Number.isFinite(value) ? value : control.min;
  const clamped = Math.min(control.max, Math.max(control.min, normalized));
  const stepped = Math.round((clamped - control.min) / control.step) * control.step + control.min;

  return Number(stepped.toFixed(4));
}

export function createDefaultBackgroundAnimationSettings(): BackgroundAnimationSettings {
  return createBackgroundAnimationSettings();
}

export function createDefaultBackgroundPerformanceSettings(): BackgroundPerformanceSettings {
  return {
    mode: 'auto',
    showStats: false,
  };
}

export function createBackgroundAnimationSettings(
  settings: Partial<BackgroundAnimationSettings> = {},
): BackgroundAnimationSettings {
  const cursorMovement = settings.cursorMovement ?? true;
  const cursorClick = settings.cursorClick ?? true;

  return {
    idle: settings.idle ?? true,
    cursorMovement,
    cursorClick,
    scroll: settings.scroll ?? true,
  };
}

export function createWaveSettings(settings: Partial<WaveSettings> = {}): WaveSettings {
  const candidate = {
    ...WAVE_DEFAULTS,
    ...settings,
  };

  return WAVE_SETTING_CONTROLS.reduce<WaveSettings>((normalized, control) => {
    normalized[control.key] = clampSettingValue(candidate[control.key], control);
    return normalized;
  }, {} as WaveSettings);
}

export function createDefaultWaveSettings(): WaveSettings {
  return createWaveSettings();
}

export function createDefaultBackgroundAdvancedSettings(): BackgroundAdvancedSettings {
  return {
    wave: createDefaultWaveSettings(),
  };
}
