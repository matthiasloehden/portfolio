<script setup lang="ts">
defineProps<{
  navigation: string[];
  ariaLabel: string;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[7rem_1fr] sm:p-6 md:p-8 xl:p-10"
    :aria-label="ariaLabel"
  >
    <nav
      :class="[
        'grid content-start gap-[0.35rem] overflow-hidden border-b border-line pb-3 sm:grid-cols-1 sm:border-r sm:border-b-0 sm:pr-4 sm:pb-0',
        navigation.length > 4 ? 'grid-cols-3' : 'grid-cols-4',
      ]"
      :aria-label="`${ariaLabel} navigation`"
    >
      <span
        v-for="(item, index) in navigation"
        :key="item"
        :class="[
          'px-1 py-[0.55rem] text-center font-mono text-[0.55rem] sm:px-[0.55rem] sm:text-left',
          index === 0 ? 'border-l border-primary bg-surface-hover text-foreground' : 'text-muted',
        ]"
      >
        {{ item }}
      </span>
    </nav>

    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>
