<script setup lang="ts">
import { footerNavigation, site } from '@/data/site';

const route = useRoute();
const navigationItems = computed(() =>
  footerNavigation.map((item) => ({
    ...item,
    active: item.activePath === route.path,
  })),
);
</script>

<template>
  <footer
    class="relative z-1 site-container flex flex-col gap-6 border-t border-line py-9 font-mono text-[0.63rem] text-muted sm:flex-row sm:items-center sm:justify-between"
  >
    <p>
      © {{ site.name }}
      <span
        class="mx-1.5 text-primary"
        aria-hidden="true"
        >/</span
      >
      {{ site.role }}
    </p>

    <nav aria-label="Footer navigation">
      <ul class="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-3 p-0">
        <li
          v-for="item in navigationItems"
          :key="item.label"
        >
          <NuxtLink
            class="transition-colors hover:text-foreground focus-visible:text-foreground"
            :class="{ 'text-foreground underline decoration-primary underline-offset-4': item.active }"
            :to="item.to"
            :aria-current="item.active ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
        <li>
          <a
            class="transition-colors hover:text-foreground focus-visible:text-foreground"
            :href="`mailto:${site.email}`"
          >
            Contact
            <span
              class="ml-1 text-primary"
              aria-hidden="true"
              >↗</span
            >
          </a>
        </li>
      </ul>
    </nav>
  </footer>
</template>
