export const APP_ROUTE_NAMES = ['index', 'work', 'academic', 'personal'] as const;

export type AppRouteName = (typeof APP_ROUTE_NAMES)[number];

export interface AppRouteLocation {
  name: AppRouteName;
  hash?: string;
}

export const APP_ROUTES = {
  home: { name: 'index' },
  work: { name: 'work' },
  academic: { name: 'academic' },
  personal: { name: 'personal' },
} as const satisfies Record<string, AppRouteLocation>;

export const APP_ROUTE_PATHS: Readonly<Record<AppRouteName, string>> = {
  index: '/',
  work: '/work',
  academic: '/academic',
  personal: '/personal',
};
