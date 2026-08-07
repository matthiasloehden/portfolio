<script setup lang="ts">
const isDark = ref(true);
let colorSchemeQuery: MediaQueryList | undefined;

const storedTheme = () => {
  try {
    const theme = localStorage.getItem('portfolio-theme');
    return theme === 'light' || theme === 'dark' ? theme : undefined;
  } catch {
    return undefined;
  }
};

const syncTheme = () => {
  const theme = storedTheme();
  isDark.value = theme ? theme === 'dark' : (colorSchemeQuery?.matches ?? true);
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light';
};

const syncSystemTheme = () => {
  if (!storedTheme()) syncTheme();
};

const toggleTheme = () => {
  const nextTheme = isDark.value ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem('portfolio-theme', nextTheme);
  } catch {
    // The visible theme still works when storage is unavailable.
  }
  isDark.value = !isDark.value;
};

onMounted(() => {
  colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  syncTheme();
  colorSchemeQuery.addEventListener('change', syncSystemTheme);
});

onBeforeUnmount(() => colorSchemeQuery?.removeEventListener('change', syncSystemTheme));
</script>

<template>
  <button
    class="grid size-9 cursor-pointer place-items-center border border-line bg-raised font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
    type="button"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <span
      class="dark:hidden"
      aria-hidden="true"
      >☾</span
    >
    <span
      class="hidden dark:inline"
      aria-hidden="true"
      >☼</span
    >
  </button>
</template>
