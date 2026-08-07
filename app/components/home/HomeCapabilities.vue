<script setup lang="ts">
import type { Capability } from '@/types/content';

defineProps<{
  capabilities: Capability[];
}>();
</script>

<template>
  <section
    id="capabilities"
    class="content-section"
    aria-labelledby="capabilities-title"
  >
    <p
      class="section-index"
      data-reveal="up"
    >
      <span>02</span> Capabilities
    </p>
    <div class="section-heading flex items-end justify-between">
      <h2
        id="capabilities-title"
        class="motion-hover"
        data-reveal="left"
      >
        Experience,<br /><em>in context.</em>
      </h2>
      <p
        class="motion-hover"
        data-reveal="right"
        style="--reveal-delay: 100ms"
      >
        Technologies grouped by where I have used them: in production, through academic work, and in projects I pursue
        independently.
      </p>
    </div>

    <div class="capability-grid grid">
      <HomeCapabilityCard
        v-for="(capability, index) in capabilities"
        :key="capability.title"
        v-bind="capability"
        :style="`--reveal-delay: ${index * 80}ms`"
      />
    </div>
  </section>
</template>
