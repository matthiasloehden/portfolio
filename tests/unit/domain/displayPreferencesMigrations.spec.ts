import { describe, expect, it } from 'vitest';

import { migrateLegacyDisplayPreferences } from '@/domain/displayPreferences/migrations';

describe('legacy display preference migrations', () => {
  it('retains only settings marked as explicit overrides', () => {
    const preferences = migrateLegacyDisplayPreferences({
      background: 'wave',
      animations: undefined,
      settings: { wave: { opacity: 0.42, idleStrength: 0.75 } },
      overrideFlags: { wave: { opacity: true, idleStrength: false } },
      performance: undefined,
      motion: null,
    });

    expect(preferences.backgroundPreference).toBe('wave');
    expect(preferences.backgroundSettingOverrides.wave).toEqual({ opacity: 0.42 });
  });

  it('translates the former global motion switch into every animation channel', () => {
    const preferences = migrateLegacyDisplayPreferences({
      background: null,
      animations: undefined,
      settings: undefined,
      overrideFlags: undefined,
      performance: undefined,
      motion: 'false',
    });

    expect(preferences.backgroundAnimations).toEqual({
      idle: false,
      cursorMovement: false,
      cursorClick: false,
      scroll: false,
    });
  });
});
