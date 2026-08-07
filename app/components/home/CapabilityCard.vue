<script setup lang="ts">
defineProps<{
  number: string;
  layer: string;
  title: string;
  skills: string[];
}>();
</script>

<template>
  <article class="relative overflow-hidden">
    <div class="capability-meta">
      <span>{{ number }}</span
      ><span>{{ layer }}</span>
    </div>
    <h3>{{ title }}</h3>
    <p>
      <template
        v-for="(skill, index) in skills"
        :key="skill"
      >
        <i
          v-if="index > 0"
          aria-hidden="true"
        />
        {{ skill }}
      </template>
    </p>
    <span
      class="card-arrow"
      aria-hidden="true"
    >
      ↗
    </span>
  </article>
</template>
