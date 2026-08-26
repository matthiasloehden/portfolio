<script setup lang="ts">
import { useActiveNavigation } from '@/composables/useActiveNavigation';
import { site, siteNavigation } from '@/data/site';
import SharedPanelTrigger from '@/components/shared/PanelTrigger.vue';

const menuOpen = ref(false);
const settingsOpen = ref(false);
const header = ref<HTMLElement | null>(null);
const navigationItems = useActiveNavigation(siteNavigation);

const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
    settingsOpen.value = false;
  },
);

watch(settingsOpen, (open) => {
  if (open) menuOpen.value = false;
});

function closeHeaderPanels(): void {
  menuOpen.value = false;
  settingsOpen.value = false;
}

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value) settingsOpen.value = false;
}

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
    @keydown.esc="closeHeaderPanels"
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
            'absolute top-full right-0 left-0 z-20 m-0 flex list-none flex-col border-b border-line bg-raised/95 px-6 py-4 shadow-xl backdrop-blur-xl transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none md:pointer-events-auto md:visible md:static md:translate-y-0 md:flex-row md:items-center md:gap-4 md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:shadow-none md:backdrop-blur-none md:transition-none lg:gap-6 xl:gap-9',
            menuOpen ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-1 opacity-0',
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

      <LayoutDisplaySettings
        v-model:open="settingsOpen"
        class="md:ml-3"
      />
      <SharedPanelTrigger
        class="md:hidden"
        :expanded="menuOpen"
        controls="site-navigation"
        label="Open navigation"
        expanded-label="Close navigation"
        @toggle="toggleMenu"
      >
        <svg
          class="size-4 stroke-current [stroke-width:1.3] [stroke-linecap:round]"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M2 4h12M2 8h12M2 12h12" />
        </svg>
      </SharedPanelTrigger>
    </div>
  </header>
</template>
