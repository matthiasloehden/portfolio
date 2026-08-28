import { describe, expect, it } from 'vitest';

import { createDefaultDisplayPreferences } from '@/domain/displayPreferences/defaults';
import {
  DISPLAY_PREFERENCES_STORAGE_KEY,
  DISPLAY_PREFERENCES_VERSION,
  THEME_PREFERENCE_STORAGE_KEY,
} from '@/config/displayPreferences';
import { createDefaultThemeSettings } from '@/domain/themeSettings';
import {
  createDisplayPreferencesStorage,
  type DisplayPreferencesStorageAdapter,
} from '@/utils/displayPreferencesStorage';

import { MemoryStorage } from '../support/MemoryStorage';

describe('display preferences storage', () => {
  it('materializes and persists the default document when storage is empty', () => {
    const adapter = new MemoryStorage();
    const storage = createDisplayPreferencesStorage(adapter);

    expect(storage.readPreferences()).toEqual(createDefaultDisplayPreferences());
    expect(JSON.parse(adapter.getItem(DISPLAY_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({
      version: DISPLAY_PREFERENCES_VERSION,
      backgroundPreference: 'auto',
    });
  });

  it('upgrades version one documents without inventing theme settings', () => {
    const adapter = new MemoryStorage();
    const defaults = createDefaultDisplayPreferences();
    adapter.setItem(
      DISPLAY_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        ...defaults,
        themeSettings: { preset: 'crimson' },
      }),
    );

    const preferences = createDisplayPreferencesStorage(adapter).readPreferences();
    const rewritten = JSON.parse(adapter.getItem(DISPLAY_PREFERENCES_STORAGE_KEY) ?? '');

    expect(preferences.themeSettings).toEqual(createDefaultThemeSettings());
    expect(rewritten.version).toBe(DISPLAY_PREFERENCES_VERSION);
    expect(rewritten.themeSettings).toEqual(createDefaultThemeSettings());
  });

  it('persists a migrated document before removing consumed legacy keys', () => {
    const adapter = new MemoryStorage();
    adapter.setItem('portfolio-background', 'wave');

    const preferences = createDisplayPreferencesStorage(adapter).readPreferences();

    expect(preferences.backgroundPreference).toBe('wave');
    expect(adapter.getItem('portfolio-background')).toBeNull();
    expect(JSON.parse(adapter.getItem(DISPLAY_PREFERENCES_STORAGE_KEY) ?? '').version).toBe(
      DISPLAY_PREFERENCES_VERSION,
    );
  });

  it('uses a compact scalar key for explicit theme modes', () => {
    const adapter = new MemoryStorage();
    const storage = createDisplayPreferencesStorage(adapter);

    storage.writeThemePreference('dark');
    expect(storage.readThemePreference()).toBe('dark');
    expect(adapter.getItem(THEME_PREFERENCE_STORAGE_KEY)).toBe('dark');

    storage.writeThemePreference('system');
    expect(storage.readThemePreference()).toBe('system');
    expect(adapter.getItem(THEME_PREFERENCE_STORAGE_KEY)).toBeNull();
  });

  it('degrades to defaults when browser policies deny every storage operation', () => {
    const deniedStorage: DisplayPreferencesStorageAdapter = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    };
    const storage = createDisplayPreferencesStorage(deniedStorage);

    expect(storage.readThemePreference()).toBe('system');
    expect(storage.readPreferences()).toEqual(createDefaultDisplayPreferences());
    expect(() => storage.writePreferences(createDefaultDisplayPreferences())).not.toThrow();
    expect(() => storage.clear()).not.toThrow();
  });
});
