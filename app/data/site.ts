import type { NavigationItem } from '@/types/content';

export const site = {
  name: 'Matthias Löhden',
  role: 'Software Engineer',
  email: 'm.loehden@proton.me',
  sourceUrl: 'https://github.com/matthiasloehden/portfolio',
} as const;

export const siteNavigation: NavigationItem[] = [
  { prefix: '01', label: 'Home', to: '/', activePath: '/' },
  { prefix: '02', label: 'Work', to: '/work', activePath: '/work' },
  { prefix: '03', label: 'University', to: '/academic', activePath: '/academic' },
  { prefix: '04', label: 'Personal', to: '/personal', activePath: '/personal' },
  { prefix: '05', label: 'Contact', href: `mailto:${site.email}` },
];

export const footerNavigation: NavigationItem[] = siteNavigation.flatMap(({ prefix: _, ...item }) =>
  item.to ? [item] : [],
);
