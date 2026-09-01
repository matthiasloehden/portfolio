import { Script } from 'node:vm';

import { describe, expect, it } from 'vitest';

import { createThemeInitializationScript } from '@/utils/themeInitialization';

describe('theme initialization script', () => {
  it('emits valid JavaScript', () => {
    expect(() => new Script(createThemeInitializationScript())).not.toThrow();
  });
});
