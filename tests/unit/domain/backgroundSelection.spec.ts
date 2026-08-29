import { describe, expect, it } from 'vitest';

import { resolveBackground } from '@/config/backgrounds/selection';

describe('background selection', () => {
  it('resolves automatic backgrounds from the current route', () => {
    expect(resolveBackground('/', 'auto')).toBe('wave');
    expect(resolveBackground('/work/', 'auto')).toBe('triangles');
    expect(resolveBackground('/academic', 'auto')).toBe('mesh');
    expect(resolveBackground('/personal', 'auto')).toBe('particles');
  });

  it('resolves random backgrounds from a stable random value', () => {
    expect(resolveBackground('/', 'random', 0)).toBe('wave');
    expect(resolveBackground('/', 'random', 0.999)).toBe('mesh');
  });
});
