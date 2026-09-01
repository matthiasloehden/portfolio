import type { NavigationItem } from '@/types/content';
import type { MaybeRefOrGetter } from 'vue';

export function useActiveNavigation<Item extends NavigationItem>(
  items: MaybeRefOrGetter<readonly Item[]>,
) {
  const route = useRoute();
  const localePath = useLocalePath();

  return computed(() =>
    toValue(items).map((item): Item & { active: boolean } => {
      if (!item.to) return { ...item, active: false };

      const localizedPath = localePath(item.to);
      return { ...item, active: localizedPath === route.path };
    }),
  );
}
