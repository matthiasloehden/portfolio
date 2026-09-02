<script setup lang="ts">
const portfolio = await usePortfolioContent();
const work = computed(() => portfolio.value.work);

useSeoMeta({
  title: () => work.value.workMeta.title,
  description: () => work.value.workMeta.description,
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <WorkHero :content="work.workHero" />
      <SharedCaseStudyList v-bind="work.workOverview" />
      <WorkContext :content="work.workContext" />

      <WorkCaseStudy v-bind="work.learningCase">
        <WorkLearningPanel :content="work.learningPanel" />
      </WorkCaseStudy>

      <WorkCaseStudy
        v-bind="work.retailCase"
        reverse
      >
        <WorkRetailPanel :content="work.retailPanel" />
      </WorkCaseStudy>

      <WorkCaseStudy v-bind="work.signageCase">
        <WorkSignagePanel :content="work.signagePanel" />
      </WorkCaseStudy>

      <WorkCaseStudy
        v-bind="work.clientCase"
        reverse
      >
        <WorkClientPlatformPanel :content="work.clientPanel" />
      </WorkCaseStudy>

      <SharedPageClosing
        id="work-close"
        :content="work.workClosing"
      />
    </main>
  </div>
</template>
