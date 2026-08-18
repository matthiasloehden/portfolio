<script setup lang="ts">
import type { LabeledValue } from '@/types/content';

defineProps<{
  facts: LabeledValue[];
}>();
</script>

<template>
  <dl class="mt-9 border-t border-line">
    <div
      v-for="fact in facts"
      :key="fact.label"
      class="motion-hover flex justify-between gap-4 border-b border-line py-[0.7rem] font-mono text-[0.62rem]"
    >
      <dt class="text-quiet uppercase">{{ fact.label }}</dt>
      <dd class="m-0 text-right text-foreground">{{ fact.value }}</dd>
    </div>
  </dl>
</template>
