<script setup lang="ts">
import type { BackgroundId } from '@/types/background';

defineProps<{
  background: BackgroundId | 'none';
}>();
</script>

<template>
  <svg
    class="shrink-0 border border-line-strong bg-surface p-0.5 text-primary-bright"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    :data-background-preview="background"
  >
    <g
      v-if="background === 'wave'"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="1.25"
    >
      <path d="M2 5.2c2.4-2.1 4.8 2.1 7.2 0s4.8-2.1 8.8 0" />
      <path
        d="M2 9.8c2.4-2.1 4.8 2.1 7.2 0s4.8-2.1 8.8 0"
        opacity="0.72"
      />
      <path
        d="M2 14.4c2.4-2.1 4.8 2.1 7.2 0s4.8-2.1 8.8 0"
        opacity="0.42"
      />
    </g>

    <g
      v-else-if="background === 'particles'"
      fill="currentColor"
    >
      <circle
        cx="5"
        cy="5"
        r="1.25"
      />
      <circle
        cx="13.8"
        cy="4"
        r="0.8"
        opacity="0.58"
      />
      <circle
        cx="10"
        cy="9.6"
        r="1.55"
      />
      <circle
        cx="16"
        cy="12.4"
        r="1"
        opacity="0.72"
      />
      <circle
        cx="4.2"
        cy="15"
        r="0.85"
        opacity="0.5"
      />
      <circle
        cx="11.2"
        cy="16.2"
        r="0.6"
        opacity="0.38"
      />
    </g>

    <g
      v-else-if="background === 'triangles'"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="1.1"
    >
      <path
        d="m2.5 15.8 4.2-11 3.7 7.2Z"
        fill="currentColor"
        fill-opacity="0.24"
      />
      <path
        d="m8.4 15.8 4.8-12 4.3 12Z"
        fill="currentColor"
        fill-opacity="0.08"
      />
      <path d="m6.7 4.8 6.5-1.2-2.8 8.4Z" />
    </g>

    <g v-else-if="background === 'mesh'">
      <path
        d="m3.2 14.8 3.1-9.5 5.1 3 5.2-3.2-1 10.1-4.2-6.9-8.2 6.5 12.4.4"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        opacity="0.72"
      />
      <g fill="currentColor">
        <circle
          cx="3.2"
          cy="14.8"
          r="1"
        />
        <circle
          cx="6.3"
          cy="5.3"
          r="1.15"
        />
        <circle
          cx="11.4"
          cy="8.3"
          r="1.35"
        />
        <circle
          cx="16.6"
          cy="5.1"
          r="0.85"
        />
        <circle
          cx="15.6"
          cy="15.2"
          r="1.1"
        />
      </g>
    </g>

    <g
      v-else
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="1.2"
    >
      <path
        d="M4.3 4.3h11.4v11.4H4.3z"
        opacity="0.38"
      />
      <path d="m4.5 15.5 11-11" />
    </g>
  </svg>
</template>
