import type {
  BackgroundId,
  BackgroundSettingKey,
  BackgroundSettingValue,
  BackgroundSettingOverrides,
  BackgroundSettingOverridesMap,
} from '@/types/background';

export function createBackgroundSettingOverrides(): BackgroundSettingOverridesMap {
  return { wave: {}, particles: {}, triangles: {}, mesh: {} };
}

export function updateBackgroundSettingOverride<Id extends BackgroundId>(
  overrides: BackgroundSettingOverridesMap,
  background: Id,
  setting: BackgroundSettingKey<Id>,
  value: BackgroundSettingValue,
): BackgroundSettingOverridesMap {
  const backgroundOverrides = { ...overrides[background] } as BackgroundSettingOverrides<Id>;
  (backgroundOverrides as Record<string, unknown>)[setting] = value;

  return { ...overrides, [background]: backgroundOverrides };
}

export function removeBackgroundSettingOverride<Id extends BackgroundId>(
  overrides: BackgroundSettingOverridesMap,
  background: Id,
  setting: BackgroundSettingKey<Id>,
): BackgroundSettingOverridesMap {
  const backgroundOverrides = { ...overrides[background] } as Record<string, unknown>;
  delete backgroundOverrides[setting];

  return { ...overrides, [background]: backgroundOverrides } as BackgroundSettingOverridesMap;
}
