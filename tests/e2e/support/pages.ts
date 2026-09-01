import { siteNavigation } from '@/data/site';
import { APP_ROUTE_PATHS } from '@/config/routes';

export const SITE_PAGES = siteNavigation.flatMap(({ label, to }) =>
  to ? [{ name: label, path: APP_ROUTE_PATHS[to.name] }] : [],
);

export const THEMES = ['light', 'dark'] as const;
