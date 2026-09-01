import { describe, expect, it } from 'vitest';

import { resolveBackground } from '@/config/backgrounds/selection';

describe('background selection', () => {
  it('resolves automatic backgrounds from the current route', () => {
    expect(resolveBackground('/', 'auto')).toBe('wave');
    expect(resolveBackground('/work/', 'auto')).toBe('triangles');
    expect(resolveBackground('/academic', 'auto')).toBe('mesh');
    expect(resolveBackground('/personal', 'auto')).toBe('particles');
    expect(resolveBackground('/de', 'auto')).toBe('wave');
    expect(resolveBackground('/de/work/', 'auto')).toBe('triangles');
    expect(resolveBackground('/de/academic', 'auto')).toBe('mesh');
    expect(resolveBackground('/de/personal', 'auto')).toBe('particles');
    expect(resolveBackground('/fr/work', 'auto')).toBe('triangles');
    expect(resolveBackground('/es/academic', 'auto')).toBe('mesh');
    expect(resolveBackground('/pl/personal', 'auto')).toBe('particles');
    expect(resolveBackground('/it/work', 'auto')).toBe('triangles');
  });

  it('resolves random backgrounds from a stable random value', () => {
    expect(resolveBackground('/', 'random', 0)).toBe('wave');
    expect(resolveBackground('/', 'random', 0.999)).toBe('mesh');
  });
});
