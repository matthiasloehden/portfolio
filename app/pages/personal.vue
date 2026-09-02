<script setup lang="ts">
import CoolingLoopPanel from '~/components/personal/cooling/CoolingLoopPanel.vue';

const portfolio = await usePortfolioContent();
const personal = computed(() => portfolio.value.personal);

useSeoMeta({
  title: () => personal.value.personalMeta.title,
  description: () => personal.value.personalMeta.description,
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <SharedDetailHero
        title-id="personal-title"
        :content="personal.personalHero"
      />
      <SharedCaseStudyList v-bind="personal.personalOverview" />

      <PersonalFeatureSection v-bind="personal.openSourceSection">
        <PersonalContributionPanel :content="personal.contributionPanel" />
      </PersonalFeatureSection>

      <PersonalFeatureSection
        v-bind="personal.homelabSection"
        reverse
      >
        <PersonalHomelabPanel :content="personal.homelabPanel" />
      </PersonalFeatureSection>

      <PersonalFeatureSection v-bind="personal.learningSection">
        <PersonalLearningPanel :content="personal.learningPanel" />
      </PersonalFeatureSection>

      <PersonalFeatureSection
        v-bind="personal.hardwareSection"
        reverse
      >
        <CoolingLoopPanel :content="personal.coolingPanel" />
      </PersonalFeatureSection>

      <SharedPageClosing
        id="personal-close"
        :content="personal.personalClosing"
      />
    </main>
  </div>
</template>
