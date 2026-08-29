import { describe, expect, it } from 'vitest';

import {
  createBackgroundSettingOverrides,
  removeBackgroundSettingOverride,
  updateBackgroundSettingOverride,
} from '@/domain/backgrounds/settingOverrides';

describe('background setting overrides', () => {
  it('creates isolated empty override maps', () => {
    const first = createBackgroundSettingOverrides();
    const second = createBackgroundSettingOverrides();

    first.wave.opacity = 0.4;

    expect(second).toEqual({ wave: {}, particles: {}, triangles: {}, mesh: {} });
  });

  it('updates one scene immutably without disturbing other scenes', () => {
    const original = createBackgroundSettingOverrides();
    original.mesh.opacity = 0.6;

    const updated = updateBackgroundSettingOverride(original, 'wave', 'gridSpacing', 1.25);

    expect(updated).not.toBe(original);
    expect(updated.wave).not.toBe(original.wave);
    expect(updated.mesh).toBe(original.mesh);
    expect(updated.wave).toEqual({ gridSpacing: 1.25 });
    expect(updated.mesh).toEqual({ opacity: 0.6 });
  });

  it('removes only the selected override', () => {
    const original = createBackgroundSettingOverrides();
    original.particles = { opacity: 0.5, pointSize: 2 };

    const updated = removeBackgroundSettingOverride(original, 'particles', 'opacity');

    expect(updated.particles).toEqual({ pointSize: 2 });
    expect(original.particles).toEqual({ opacity: 0.5, pointSize: 2 });
  });
});
