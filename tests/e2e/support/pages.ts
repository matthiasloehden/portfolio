import { siteNavigation } from '@/data/site';

export const SITE_PAGES = siteNavigation.flatMap(({ label, to }) => (to ? [{ name: label, path: to }] : []));

export const THEMES = ['light', 'dark'] as const;
