/**
 * Shared background contracts.
 *
 * Scene-specific defaults, editor metadata and runtime limits deliberately do
 * not live here. They are executable configuration and belong to the settings
 * registry; this module only describes the values crossing component and
 * renderer boundaries.
 */

export const BACKGROUND_IDS = ['wave', 'particles', 'triangles', 'mesh'] as const;

export type BackgroundId = (typeof BACKGROUND_IDS)[number];
export type BackgroundPreference = 'auto' | BackgroundId | 'none' | 'random';
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
  ready: [];
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
  opacity: number;
  idleStrength: number;
  rippleStrength: number;
  vertexStep: number;
  trailLength: number;
  trailLifetime: number;
  pixelRatioCap: number;
}

export interface ParticleSettings {
  particleCount: number;
  pointSize: number;
  opacity: number;
  idleStrength: number;
  noiseSpeed: number;
  boundaryCollisions: boolean;
  interactionRadius: number;
  repulsionStrength: number;
  vortexStrength: number;
  clickStrength: number;
  scrollStrength: number;
  pixelRatioCap: number;
}

export interface TriangleSettings {
  densityScale: number;
  opacity: number;
  idleStrength: number;
  interactionRadiusScale: number;
  highlightStrength: number;
  highlightLifetime: number;
  pixelRatioCap: number;
}

export interface MeshSettings {
  densityScale: number;
  opacity: number;
  idleStrength: number;
  idleSpeed: number;
  interactionRadiusScale: number;
  interactionStrength: number;
  interactionDuration: number;
  pixelRatioCap: number;
}

export type BackgroundSettingValue = number | boolean;

export interface BackgroundSettingsMap {
  wave: WaveSettings;
  particles: ParticleSettings;
  triangles: TriangleSettings;
  mesh: MeshSettings;
}

export type BackgroundSettingsFor<Id extends BackgroundId> = BackgroundSettingsMap[Id];
export type BackgroundSettingKey<Id extends BackgroundId> = Id extends BackgroundId
  ? Extract<keyof BackgroundSettingsFor<Id>, string>
  : never;
export type BackgroundSettingOverrides<Id extends BackgroundId> = Partial<BackgroundSettingsFor<Id>>;

export type BackgroundSettingOverridesMap = {
  [Id in BackgroundId]: BackgroundSettingOverrides<Id>;
};

export type WaveSettingOverrides = BackgroundSettingOverrides<'wave'>;
export type ParticleSettingOverrides = BackgroundSettingOverrides<'particles'>;
export type TriangleSettingOverrides = BackgroundSettingOverrides<'triangles'>;
export type MeshSettingOverrides = BackgroundSettingOverrides<'mesh'>;

export interface WaveBackgroundProps extends BackgroundSceneProps {
  settingOverrides?: WaveSettingOverrides;
}

export interface ParticleBackgroundProps extends BackgroundSceneProps {
  settingOverrides?: ParticleSettingOverrides;
}

export interface TriangleBackgroundProps extends BackgroundSceneProps {
  settingOverrides?: TriangleSettingOverrides;
}

export interface MeshBackgroundProps extends BackgroundSceneProps {
  settingOverrides?: MeshSettingOverrides;
}
