import type { NavigationItem } from '@/types/content';

export const site = {
  name: 'Matthias Löhden',
  role: 'Full-stack developer',
  email: 'm.loehden@yahoo.de',
} as const;

export const siteNavigation: NavigationItem[] = [
  { prefix: '01', label: 'Home', to: '/', activePath: '/' },
  { prefix: '02', label: 'Work', to: '/work', activePath: '/work' },
  { prefix: '03', label: 'University', to: '/projects', activePath: '/projects' },
  { prefix: '04', label: 'Contact', href: `mailto:${site.email}` },
];

export const footerNavigation: NavigationItem[] = [
  { label: 'Home', to: '/', activePath: '/' },
  { label: 'Work', to: '/work', activePath: '/work' },
  { label: 'University', to: '/projects', activePath: '/projects' },
];
