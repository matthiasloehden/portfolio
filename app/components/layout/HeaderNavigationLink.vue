<script setup lang="ts">
import type { NavigationItem } from '@/types/content';

const props = defineProps<{
  item: NavigationItem;
  active: boolean;
}>();

const NuxtLinkComponent = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const linkComponent = computed(() => (props.item.to ? NuxtLinkComponent : 'a'));
const linkAttributes = computed(() => (props.item.to ? { to: localePath(props.item.to) } : { href: props.item.href }));
</script>

<template>
  <component
    :is="linkComponent"
    v-bind="linkAttributes"
    :class="[
      'group relative -mx-2 block px-3 py-3 font-mono text-[0.69rem] tracking-[0.03em] transition-[color,background-color] hover:bg-primary/5 hover:text-foreground focus-visible:bg-primary/5 focus-visible:text-foreground md:mx-0 md:px-0 md:py-2 md:hover:bg-transparent md:focus-visible:bg-transparent',
      active ? 'bg-primary/10 text-foreground md:bg-transparent' : 'text-muted',
    ]"
    :aria-current="active ? 'page' : undefined"
  >
    <span
      v-if="item.prefix"
      class="mr-1.5 text-primary"
      aria-hidden="true"
      >{{ item.prefix }}</span
    >
    {{ item.label }}
    <span
      data-navigation-active-indicator
      :class="[
        'absolute inset-x-0 bottom-0 h-0.5 transition-[background-color,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        active
          ? 'origin-left scale-x-100 bg-primary'
          : 'origin-right scale-x-0 bg-transparent group-hover:origin-left group-hover:scale-x-100 group-hover:bg-primary group-focus-visible:origin-left group-focus-visible:scale-x-100 group-focus-visible:bg-primary',
      ]"
      aria-hidden="true"
    />
  </component>
</template>
