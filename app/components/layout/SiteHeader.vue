<script setup lang="ts">
import { site, siteNavigation } from '@/data/site';

const route = useRoute();
const menuOpen = ref(false);

const navigationItems = computed(() =>
  siteNavigation.map((item) => ({
    ...item,
    active: item.activePath === route.path,
  })),
);

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <header
    class="relative z-20 site-container flex min-h-19 items-center justify-between border-b border-line md:min-h-22"
    @keydown.esc="menuOpen = false"
  >
    <NuxtLink
      class="group inline-flex items-center gap-3.5"
      to="/"
      :aria-label="`${site.name}, home`"
    >
      <span
        class="grid size-8 place-items-center border border-primary font-mono text-[0.65rem] tracking-[-0.06em] text-primary-bright shadow-[inset_0_0_1rem_rgb(50_132_255/0.12)] transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
        aria-hidden="true"
      >
        ML
      </span>
      <span class="grid gap-0.5">
        <strong class="font-display text-[0.82rem] tracking-[0.03em] uppercase">{{ site.name }}</strong>
        <small class="hidden font-mono text-[0.58rem] text-muted xs:block">{{ site.role }}</small>
      </span>
    </NuxtLink>

    <div class="flex items-center gap-2">
      <nav aria-label="Main navigation">
        <ul
          id="site-navigation"
          :class="[
            'absolute top-full right-0 left-0 z-20 m-0 list-none flex-col border-b border-line bg-background/95 px-6 py-4 shadow-xl backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-[clamp(1.25rem,3vw,3.25rem)] md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none',
            menuOpen ? 'flex' : 'hidden md:flex',
          ]"
        >
          <li
            v-for="item in navigationItems"
            :key="item.label"
          >
            <NuxtLink
              v-if="item.to"
              class="nav-link group relative block py-3 font-mono text-[0.69rem] tracking-[0.03em] text-muted transition-colors hover:text-foreground focus-visible:text-foreground md:py-2"
              :class="{ 'text-foreground': item.active }"
              :to="item.to"
              :aria-current="item.active ? 'page' : undefined"
              exact-active-class="is-active"
            >
              <span
                v-if="item.prefix"
                class="mr-1.5 text-primary"
                aria-hidden="true"
                >{{ item.prefix }}</span
              >
              {{ item.label }}
              <span
                class="nav-indicator absolute inset-x-0 bottom-0 h-0.5 bg-transparent transition-colors group-hover:bg-primary group-focus-visible:bg-primary"
                aria-hidden="true"
              />
            </NuxtLink>
            <a
              v-else
              class="group relative block py-3 font-mono text-[0.69rem] tracking-[0.03em] text-muted transition-colors hover:text-foreground focus-visible:text-foreground md:py-2"
              :href="item.href"
            >
              <span
                v-if="item.prefix"
                class="mr-1.5 text-primary"
                aria-hidden="true"
                >{{ item.prefix }}</span
              >
              {{ item.label }}
              <span
                class="absolute inset-x-0 bottom-0 h-0.5 bg-transparent transition-colors group-hover:bg-primary group-focus-visible:bg-primary"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>
      </nav>

      <LayoutThemeToggle class="md:ml-3" />
      <button
        class="grid size-9 cursor-pointer place-items-center border border-line bg-raised font-mono text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground md:hidden"
        type="button"
        aria-controls="site-navigation"
        :aria-expanded="menuOpen"
        :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
        @click="menuOpen = !menuOpen"
      >
        <span aria-hidden="true">{{ menuOpen ? '×' : '≡' }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav-link.is-active {
  color: var(--text);
}

.nav-link.is-active .nav-indicator {
  background: var(--accent);
}
</style>
