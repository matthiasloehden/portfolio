import type { BackgroundQualityId } from '@/types/background';

/**
 * Framework-neutral description of one editable numeric scene setting.
 *
 * Three ranges serve different purposes:
 * - `recommended` defines the highlighted section of the editor slider.
 * - `editorRange` may override the automatically balanced slider bounds.
 * - the number input remains intentionally unbounded so visitors can experiment.
 * - `runtime` is the final safety boundary before a value reaches a renderer.
 *
 * Effective values follow one predictable precedence rule: a user override wins,
 * otherwise the selected performance preset wins when the control has preset
 * values, and otherwise the scene default is used.
 */

export type NumericSettingGroup = 'appearance' | 'interaction';

export interface NumericSettingRange {
  min: number;
  max: number;
  step: number;
}

export interface NumericRuntimeRange {
  min: number;
  max: number;
  integer?: boolean;
}

export interface NumericEditorRange {
  min: number;
  max: number;
}

export interface NumericSettingDefinition<Key extends string = string> {
  key: Key;
  group: NumericSettingGroup;
  label: string;
  description: string;
  defaultValue: number;
  recommended: NumericSettingRange;
  runtime: NumericRuntimeRange;
  editorRange?: NumericEditorRange;
  presetValues?: Partial<Record<BackgroundQualityId, number>>;
}

type NumericSettingKey<Settings extends object> = Extract<keyof Settings, string>;

export interface BackgroundSettingsDefinition<Settings extends object> {
  controls: readonly NumericSettingDefinition<NumericSettingKey<Settings>>[];
}

type NumericSettingDefinitionMap<Settings extends Record<keyof Settings, number>> = {
  [Key in NumericSettingKey<Settings>]: Omit<NumericSettingDefinition<Key>, 'key'>;
};

export function defineBackgroundSettings<Settings extends Record<keyof Settings, number>>(
  definitions: NumericSettingDefinitionMap<Settings>,
): BackgroundSettingsDefinition<Settings> {
  // An object map makes every settings-interface key mandatory and inherently
  // unique. Object insertion order then becomes the editor's display order.
  const entries = Object.entries(definitions) as [
    NumericSettingKey<Settings>,
    NumericSettingDefinitionMap<Settings>[NumericSettingKey<Settings>],
  ][];
  const controls = entries.map(([key, definition]) => ({ ...definition, key }));

  return { controls };
}

function setNumericValue<Settings extends object>(
  target: Partial<Settings>,
  key: NumericSettingKey<Settings>,
  value: number,
): void {
  // TypeScript cannot express indexed assignment for a mapped numeric object;
  // keeping the assertion here prevents casts from leaking into consumers.
  (target as Record<string, unknown>)[key] = value;
}

function readFiniteOverride<Settings extends object>(
  overrides: Partial<Settings> | undefined,
  key: NumericSettingKey<Settings>,
): number | undefined {
  const value = overrides?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function createDefaultSettings<Settings extends object>(
  definition: BackgroundSettingsDefinition<Settings>,
): Settings {
  const defaults: Partial<Settings> = {};

  for (const control of definition.controls) {
    setNumericValue(defaults, control.key, control.defaultValue);
  }

  return defaults as Settings;
}

export function resolveSettings<Settings extends object>(
  definition: BackgroundSettingsDefinition<Settings>,
  overrides: Partial<Settings> | undefined,
  preset: BackgroundQualityId,
): Settings {
  const resolved: Partial<Settings> = {};

  for (const control of definition.controls) {
    const override = readFiniteOverride(overrides, control.key);
    const value = override ?? control.presetValues?.[preset] ?? control.defaultValue;
    setNumericValue(resolved, control.key, value);
  }

  return resolved as Settings;
}

export function createRuntimeSettings<Settings extends object>(
  definition: BackgroundSettingsDefinition<Settings>,
  settings: Settings,
): Settings {
  const runtimeSettings: Partial<Settings> = {};

  for (const control of definition.controls) {
    const candidate = readFiniteOverride(settings, control.key) ?? control.defaultValue;
    const bounded = Math.min(control.runtime.max, Math.max(control.runtime.min, candidate));
    setNumericValue(runtimeSettings, control.key, control.runtime.integer ? Math.round(bounded) : bounded);
  }

  return runtimeSettings as Settings;
}

export function sanitizeSettingOverrides<Settings extends object>(
  definition: BackgroundSettingsDefinition<Settings>,
  candidate: unknown,
): Partial<Settings> {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return {};
  }

  const source = candidate as Record<string, unknown>;
  const overrides: Partial<Settings> = {};

  for (const control of definition.controls) {
    const value = source[control.key];

    if (typeof value === 'number' && Number.isFinite(value)) {
      setNumericValue(overrides, control.key, value);
    }
  }

  return overrides;
}
