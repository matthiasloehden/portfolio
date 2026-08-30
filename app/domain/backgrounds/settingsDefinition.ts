import type { BackgroundQualityId, BackgroundSettingValue } from '@/types/background';

/**
 * Framework-neutral descriptions of editable scene settings.
 *
 * Numeric settings use three ranges for different purposes:
 * - `recommended` defines the highlighted section of the editor slider.
 * - `editorRange` may override the automatically balanced slider bounds.
 * - the number input remains intentionally unbounded so visitors can experiment.
 * - `runtime` is the final safety boundary before a value reaches a renderer.
 *
 * Effective values follow one predictable precedence rule: a user override wins,
 * otherwise the selected performance preset wins when the control has preset
 * values, and otherwise the scene default is used.
 */

export type BackgroundSettingGroup = 'appearance' | 'interaction';

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
  type?: 'number';
  group: BackgroundSettingGroup;
  label: string;
  description: string;
  defaultValue: number;
  recommended: NumericSettingRange;
  runtime: NumericRuntimeRange;
  editorRange?: NumericEditorRange;
  presetValues?: Partial<Record<BackgroundQualityId, number>>;
}

export interface BooleanSettingDefinition<Key extends string = string> {
  key: Key;
  type: 'boolean';
  group: BackgroundSettingGroup;
  label: string;
  description: string;
  defaultValue: boolean;
}

export type SettingDefinition<Key extends string = string> =
  | NumericSettingDefinition<Key>
  | BooleanSettingDefinition<Key>;

type SettingKey<Settings extends object> = Extract<keyof Settings, string>;

export interface BackgroundSettingsDefinition<Settings extends object> {
  controls: readonly SettingDefinition<SettingKey<Settings>>[];
}

type SettingDefinitionInput<Key extends string, Value> = Value extends boolean
  ? Omit<BooleanSettingDefinition<Key>, 'key'>
  : Value extends number
    ? Omit<NumericSettingDefinition<Key>, 'key'>
    : never;

type SettingDefinitionMap<Settings extends object> = {
  [Key in SettingKey<Settings>]: SettingDefinitionInput<Key, Settings[Key]>;
};

export function defineBackgroundSettings<Settings extends object>(
  definitions: SettingDefinitionMap<Settings>,
): BackgroundSettingsDefinition<Settings> {
  // An object map makes every settings-interface key mandatory and inherently
  // unique. Object insertion order then becomes the editor's display order.
  const entries = Object.entries(definitions) as [
    SettingKey<Settings>,
    SettingDefinitionMap<Settings>[SettingKey<Settings>],
  ][];
  const controls = entries.map(([key, definition]) => ({ ...definition, key })) as SettingDefinition<
    SettingKey<Settings>
  >[];

  return { controls };
}

function setSettingValue<Settings extends object>(
  target: Partial<Settings>,
  key: SettingKey<Settings>,
  value: BackgroundSettingValue,
): void {
  // TypeScript cannot express indexed assignment for a mapped settings object;
  // keeping the assertion here prevents casts from leaking into consumers.
  (target as Record<string, unknown>)[key] = value;
}

function readValidOverride<Settings extends object>(
  overrides: Partial<Settings> | undefined,
  control: SettingDefinition<SettingKey<Settings>>,
): BackgroundSettingValue | undefined {
  const value = overrides?.[control.key];

  if (control.type === 'boolean') return typeof value === 'boolean' ? value : undefined;
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function createDefaultSettings<Settings extends object>(
  definition: BackgroundSettingsDefinition<Settings>,
): Settings {
  const defaults: Partial<Settings> = {};

  for (const control of definition.controls) {
    setSettingValue(defaults, control.key, control.defaultValue);
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
    const override = readValidOverride(overrides, control);
    const presetValue = control.type === 'boolean' ? undefined : control.presetValues?.[preset];
    setSettingValue(resolved, control.key, override ?? presetValue ?? control.defaultValue);
  }

  return resolved as Settings;
}

export function createRuntimeSettings<Settings extends object>(
  definition: BackgroundSettingsDefinition<Settings>,
  settings: Settings,
): Settings {
  const runtimeSettings: Partial<Settings> = {};

  for (const control of definition.controls) {
    const candidate = readValidOverride(settings, control) ?? control.defaultValue;

    if (control.type === 'boolean') {
      setSettingValue(runtimeSettings, control.key, candidate);
      continue;
    }

    const numericCandidate = typeof candidate === 'number' ? candidate : control.defaultValue;
    const bounded = Math.min(control.runtime.max, Math.max(control.runtime.min, numericCandidate));
    setSettingValue(runtimeSettings, control.key, control.runtime.integer ? Math.round(bounded) : bounded);
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

    if (control.type === 'boolean') {
      if (typeof value === 'boolean') setSettingValue(overrides, control.key, value);
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      setSettingValue(overrides, control.key, value);
    }
  }

  return overrides;
}
