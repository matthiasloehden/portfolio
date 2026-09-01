import { describe, expect, it } from 'vitest';

import { loadPortfolioContent } from '@/data/content';

describe('portfolio content loading', () => {
  it('loads and caches one complete locale bundle', async () => {
    const english = await loadPortfolioContent('en');
    const cachedEnglish = await loadPortfolioContent('en');
    const german = await loadPortfolioContent('de');

    expect(cachedEnglish).toBe(english);
    expect(german).not.toBe(english);
    expect(Object.keys(english)).toEqual(['academic', 'home', 'personal', 'work']);
    expect(Object.keys(german)).toEqual(Object.keys(english));
  });
});
