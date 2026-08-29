import type {
  BackgroundId,
  BackgroundSettingKey,
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
  value: number,
): BackgroundSettingOverridesMap {
  const backgroundOverrides = { ...overrides[background] } as BackgroundSettingOverrides<Id>;
  (backgroundOverrides as Record<string, number>)[setting] = value;

  return { ...overrides, [background]: backgroundOverrides };
}

export function removeBackgroundSettingOverride<Id extends BackgroundId>(
  overrides: BackgroundSettingOverridesMap,
  background: Id,
  setting: BackgroundSettingKey<Id>,
): BackgroundSettingOverridesMap {
  const backgroundOverrides = { ...overrides[background] } as Record<string, number>;
  delete backgroundOverrides[setting];

  return { ...overrides, [background]: backgroundOverrides } as BackgroundSettingOverridesMap;
}
