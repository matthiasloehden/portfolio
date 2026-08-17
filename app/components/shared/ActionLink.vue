<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    symbol?: string;
    to?: string;
    href?: string;
    variant?: 'primary' | 'text';
  }>(),
  {
    symbol: '↗',
    variant: 'primary',
  },
);

const baseClasses =
  'action-link inline-flex items-center gap-2.5 font-mono text-[0.72rem] font-semibold transition duration-150 ease-out';
const variantClasses = {
  primary:
    'action-link-primary border border-primary bg-primary px-5 py-3.5 text-foreground hover:-translate-y-0.5 hover:bg-primary-bright focus-visible:-translate-y-0.5 focus-visible:bg-primary-bright',
  text: 'text-muted hover:text-foreground focus-visible:text-foreground',
};
</script>

<template>
  <NuxtLink
    v-if="to"
    :class="[baseClasses, variantClasses[variant]]"
    :to="to"
  >
    {{ label }} <span aria-hidden="true">{{ symbol }}</span>
  </NuxtLink>
  <a
    v-else
    :class="[baseClasses, variantClasses[variant]]"
    :href="href"
  >
    {{ label }} <span aria-hidden="true">{{ symbol }}</span>
  </a>
</template>

<style scoped>
.action-link-primary {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transition-duration: 240ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.action-link span {
  display: inline-block;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.action-link:hover span,
.action-link:focus-visible span {
  transform: translate(0.18rem, -0.18rem);
}

.action-link-primary::before {
  background: linear-gradient(100deg, transparent 20%, rgb(255 255 255 / 28%) 50%, transparent 80%);
  transform: translateX(-180%) skewX(-18deg);
  transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.action-link-primary:hover::before,
.action-link-primary:focus-visible::before {
  transform: translateX(380%) skewX(-18deg);
}

.action-link-primary::before,
.action-link-primary::after {
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  content: '';
}

.action-link-primary::before {
  top: -2px;
  left: -2px;
  width: 35%;
  height: calc(100% + 4px);
  border-top: 1px solid var(--foreground);
  border-left: 1px solid var(--foreground);
}

.action-link-primary::after {
  right: -2px;
  bottom: -2px;
  border-right: 1px solid var(--foreground);
  border-bottom: 1px solid var(--foreground);
}
</style>
