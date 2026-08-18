<script setup lang="ts">
import {
  clientCase,
  clientPanel,
  learningCase,
  learningPanel,
  retailCase,
  retailPanel,
  signageCase,
  signagePanel,
  workClosing,
  workContext,
  workHero,
  workMeta,
  workOverview,
} from '@/data/work';

useSeoMeta(workMeta);
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <WorkHero :content="workHero" />
      <SharedCaseStudyList v-bind="workOverview" />
      <WorkContext :content="workContext" />

      <WorkCaseStudy v-bind="learningCase">
        <WorkLearningPanel :content="learningPanel" />
      </WorkCaseStudy>

      <WorkCaseStudy
        v-bind="retailCase"
        reverse
      >
        <WorkRetailPanel :content="retailPanel" />
      </WorkCaseStudy>

      <WorkCaseStudy v-bind="signageCase">
        <WorkSignagePanel :content="signagePanel" />
      </WorkCaseStudy>

      <WorkCaseStudy
        v-bind="clientCase"
        reverse
      >
        <WorkClientPlatformPanel :content="clientPanel" />
      </WorkCaseStudy>

      <SharedPageClosing
        id="work-close"
        :content="workClosing"
      />
    </main>
  </div>
</template>
