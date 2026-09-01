import { describe, expect, it } from 'vitest';

import { resolveBrowserLocale } from '@/utils/languageDetection';

describe('browser language detection', () => {
  it('resolves the first supported browser language in preference order', () => {
    expect(resolveBrowserLocale(['pt-BR', 'es-MX', 'en-US'])).toBe('es');
    expect(resolveBrowserLocale(['sv-SE', 'it-IT', 'de-DE'])).toBe('it');
  });

  it('supports exact tags, base-language matches and underscore separators', () => {
    expect(resolveBrowserLocale(['de-DE'])).toBe('de');
    expect(resolveBrowserLocale(['fr-CA'])).toBe('fr');
    expect(resolveBrowserLocale(['it_IT'])).toBe('it');
  });

  it('falls back to English when no browser language is supported', () => {
    expect(resolveBrowserLocale(['ja-JP', 'pt-BR'])).toBe('en');
    expect(resolveBrowserLocale([])).toBe('en');
  });
});
