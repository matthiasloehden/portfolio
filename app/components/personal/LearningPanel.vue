<script setup lang="ts">
import type { PersonalLearningPanelContent } from '@/types/content';

const props = defineProps<{
  content: PersonalLearningPanelContent;
}>();

const primarySources = computed(() => props.content.groups[0]?.sources ?? []);
const secondarySources = computed(() => props.content.groups.slice(1).flatMap((group) => group.sources));
</script>

<template>
  <SharedPanelFrame v-bind="content.frame">
    <div
      class="grid grid-cols-1 gap-3 p-4 min-[32.5rem]:grid-cols-2 sm:p-5 md:p-6 xl:p-7"
      :aria-label="content.ariaLabel"
    >
      <section
        v-for="(sources, columnIndex) in [primarySources, secondarySources]"
        :key="columnIndex"
        class="border border-line bg-[linear-gradient(135deg,var(--surface),transparent_75%)]"
      >
        <ol class="m-0 grid list-none p-0">
          <li
            v-for="(source, sourceIndex) in sources"
            :key="source.name"
            class="border-b border-line last:border-b-0"
            data-panel-item
          >
            <a
              class="group relative grid min-h-26 grid-cols-[1.8rem_1fr] gap-[0.7rem] p-4 transition-colors hover:bg-primary/4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              :href="source.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="font-mono text-[0.58rem] text-primary">
                {{ String(sourceIndex + 1).padStart(2, '0') }}
              </span>
              <div>
                <SharedDisplayHeading
                  level="h3"
                  size="label"
                  class="min-[32.5rem]:whitespace-nowrap"
                >
                  {{ source.name }}
                </SharedDisplayHeading>
                <p class="mt-[0.7rem] font-mono text-[0.55rem] leading-[1.5] text-muted">{{ source.focus }}</p>
                <span class="sr-only">{{ $t('common.externalYouTube') }}</span>
              </div>
              <span
                class="absolute top-4 right-4 font-mono text-sm text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
                >↗</span
              >
            </a>
          </li>
        </ol>
      </section>
    </div>
  </SharedPanelFrame>
</template>
