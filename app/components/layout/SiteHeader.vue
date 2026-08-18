<script setup lang="ts">
import { useActiveNavigation } from '@/composables/useActiveNavigation';
import { site, siteNavigation } from '@/data/site';

const menuOpen = ref(false);
const header = ref<HTMLElement | null>(null);
const navigationItems = useActiveNavigation(siteNavigation);

const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);

function onDocumentPointerDown(event: PointerEvent): void {
  if (menuOpen.value && !header.value?.contains(event.target as Node)) menuOpen.value = false;
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown));
</script>

<template>
  <header
    ref="header"
    class="relative z-20 site-container flex min-h-19 items-center justify-between border-b border-line md:min-h-22"
    data-reveal="down"
    @keydown.esc="menuOpen = false"
  >
    <NuxtLink
      class="group inline-flex items-center gap-3.5 transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[0.12rem] hover:scale-[1.015] focus-visible:-translate-y-[0.12rem] focus-visible:scale-[1.015]"
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
            'absolute top-full right-0 left-0 z-20 m-0 list-none flex-col border-b border-line bg-background/95 px-6 py-4 shadow-xl backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-4 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none lg:gap-6 xl:gap-9',
            menuOpen ? 'flex' : 'hidden md:flex',
          ]"
        >
          <li
            v-for="item in navigationItems"
            :key="item.label"
          >
            <LayoutHeaderNavigationLink
              :item="item"
              :active="item.active"
            />
          </li>
        </ul>
      </nav>

      <LayoutDisplaySettings class="md:ml-3" />
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
