import { APP_ROUTES } from '@/config/routes';
import type { AppRouteLocation } from '@/config/routes';

type SiteNavigationBase = {
  prefix?: string;
  label: string;
  labelKey: string;
};

type InternalSiteNavigationDefinition = SiteNavigationBase & { to: AppRouteLocation; href?: never };
type ExternalSiteNavigationDefinition = SiteNavigationBase & { href: string; to?: never };
type SiteNavigationDefinition = InternalSiteNavigationDefinition | ExternalSiteNavigationDefinition;

export const site = {
  name: 'Matthias Löhden',
  role: 'Software Engineer',
  email: 'm.loehden@proton.me',
  sourceUrl: 'https://github.com/matthiasloehden/portfolio',
} as const;

export const siteNavigation: SiteNavigationDefinition[] = [
  { prefix: '01', label: 'Home', labelKey: 'navigation.home', to: APP_ROUTES.home },
  { prefix: '02', label: 'Work', labelKey: 'navigation.work', to: APP_ROUTES.work },
  { prefix: '03', label: 'University', labelKey: 'navigation.academic', to: APP_ROUTES.academic },
  { prefix: '04', label: 'Personal', labelKey: 'navigation.personal', to: APP_ROUTES.personal },
  { prefix: '05', label: 'Contact', labelKey: 'navigation.contact', href: `mailto:${site.email}` },
];

function isInternalNavigation(item: SiteNavigationDefinition): item is InternalSiteNavigationDefinition {
  return item.to !== undefined;
}

export const footerNavigation: InternalSiteNavigationDefinition[] = siteNavigation
  .filter(isInternalNavigation)
  .map(({ prefix: _, ...item }) => item);
