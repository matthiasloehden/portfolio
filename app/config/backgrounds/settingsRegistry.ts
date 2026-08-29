/**
 * Application-level registry for the background settings system.
 *
 * Each scene has a small declarative definition in `config/backgrounds/definitions`.
 * Those definitions contain the default value, editor metadata, performance
 * presets and runtime safety limits for every public setting. This registry
 * combines them behind a typed API used by the editor, persistence layer and scenes.
 *
 * The data flow is intentionally one-way:
 *
 *   scene definition -> registry -> editor / storage / renderer adapter
 *
 * Only explicit user overrides are persisted. At runtime the registry resolves
 * each value as `user override -> performance preset -> scene default`, then
 * applies the wider runtime bounds before a renderer receives it. Adding a setting
 * therefore requires one definition and one renderer integration, rather than
 * synchronized changes across several switch statements and validation maps.
 */

import { meshSettingsDefinition } from '@/config/backgrounds/definitions/mesh';
import { particleSettingsDefinition } from '@/config/backgrounds/definitions/particles';
import {
  createDefaultSettings,
  createRuntimeSettings,
  resolveSettings,
  sanitizeSettingOverrides,
  type BackgroundSettingsDefinition,
  type NumericSettingDefinition,
} from '@/domain/backgrounds/settingsDefinition';
import { createBackgroundSettingOverrides } from '@/domain/backgrounds/settingOverrides';
import type { BackgroundSettingsPersistencePolicy } from '@/domain/displayPreferences/contracts';
import { triangleSettingsDefinition } from '@/config/backgrounds/definitions/triangles';
import { waveSettingsDefinition } from '@/config/backgrounds/definitions/wave';
import {
  BACKGROUND_IDS,
  type BackgroundId,
  type BackgroundQualityId,
  type BackgroundSettingOverrides,
  type BackgroundSettingOverridesMap,
  type BackgroundSettingsFor,
  type BackgroundSettingsMap,
} from '@/types/background';

type SettingsRegistry = {
  [Id in BackgroundId]: BackgroundSettingsDefinition<BackgroundSettingsFor<Id>>;
};

export const BACKGROUND_SETTINGS_REGISTRY = {
  wave: waveSettingsDefinition,
  particles: particleSettingsDefinition,
  triangles: triangleSettingsDefinition,
  mesh: meshSettingsDefinition,
} satisfies SettingsRegistry;

export type BackgroundNumericSettingDefinition = NumericSettingDefinition<string>;

function getDefinition<Id extends BackgroundId>(
  background: Id,
): BackgroundSettingsDefinition<BackgroundSettingsFor<Id>> {
  // Indexed access loses the correlation between a background ID and its
  // settings interface. This single boundary keeps the public API fully typed.
  return BACKGROUND_SETTINGS_REGISTRY[background] as BackgroundSettingsDefinition<BackgroundSettingsFor<Id>>;
}

export function getBackgroundSettingControls(background: BackgroundId): readonly BackgroundNumericSettingDefinition[] {
  return getDefinition(background).controls;
}

export function getDefaultBackgroundSettings<Id extends BackgroundId>(background: Id): BackgroundSettingsFor<Id> {
  return createDefaultSettings(getDefinition(background));
}

export function resolveBackgroundSettings<Id extends BackgroundId>(
  background: Id,
  overrides: BackgroundSettingOverrides<Id> | undefined,
  preset: BackgroundQualityId,
): BackgroundSettingsFor<Id> {
  return resolveSettings(getDefinition(background), overrides, preset);
}

export function resolveBackgroundSettingsForEditor(
  background: BackgroundId,
  overrides: BackgroundSettingOverridesMap,
  preset: BackgroundQualityId,
): Readonly<Record<string, number>> {
  const resolved = resolveSettings(getDefinition(background), overrides[background], preset);

  // The editor deliberately addresses controls by a dynamic string key. Scene
  // definitions guarantee that every value exposed through this boundary is numeric.
  return resolved as unknown as Readonly<Record<string, number>>;
}

export function createRuntimeBackgroundSettings<Id extends BackgroundId>(
  background: Id,
  overrides: BackgroundSettingOverrides<Id> | undefined,
  preset: BackgroundQualityId,
): BackgroundSettingsFor<Id> {
  const resolved = resolveBackgroundSettings(background, overrides, preset);
  return createRuntimeSettings(getDefinition(background), resolved);
}

export function sanitizeBackgroundSettingOverrides(candidate: unknown): BackgroundSettingOverridesMap {
  const source =
    candidate && typeof candidate === 'object' && !Array.isArray(candidate)
      ? (candidate as Record<string, unknown>)
      : {};
  const sanitized = createBackgroundSettingOverrides();

  for (const background of BACKGROUND_IDS) {
    sanitized[background] = sanitizeSettingOverrides(getDefinition(background), source[background]) as never;
  }

  return sanitized;
}

export function getDefaultBackgroundSettingsMap(): BackgroundSettingsMap {
  return {
    wave: getDefaultBackgroundSettings('wave'),
    particles: getDefaultBackgroundSettings('particles'),
    triangles: getDefaultBackgroundSettings('triangles'),
    mesh: getDefaultBackgroundSettings('mesh'),
  };
}

export const BACKGROUND_SETTINGS_PERSISTENCE_POLICY = {
  sanitizeOverrides: sanitizeBackgroundSettingOverrides,
  getDefaults: getDefaultBackgroundSettingsMap,
} satisfies BackgroundSettingsPersistencePolicy;
