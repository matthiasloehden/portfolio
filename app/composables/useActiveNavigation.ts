import type { NavigationItem } from '@/types/content';

export function useActiveNavigation(items: readonly NavigationItem[]) {
  const route = useRoute();

  return computed(() =>
    items.map((item) => ({
      ...item,
      active: item.activePath === route.path,
    })),
  );
}
