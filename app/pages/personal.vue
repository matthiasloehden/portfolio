<script setup lang="ts">
import {
  contributionPanel,
  coolingPanel,
  hardwareSection,
  homelabPanel,
  homelabSection,
  learningPanel,
  learningSection,
  openSourceSection,
  personalClosing,
  personalHero,
  personalMeta,
  personalOverview,
} from '@/data/personal';
import CoolingLoopPanel from '~/components/personal/cooling/CoolingLoopPanel.vue';

useSeoMeta(personalMeta);
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <SharedDetailHero
        title-id="personal-title"
        :content="personalHero"
      />
      <SharedCaseStudyList v-bind="personalOverview" />

      <PersonalFeatureSection v-bind="openSourceSection">
        <PersonalContributionPanel :content="contributionPanel" />
      </PersonalFeatureSection>

      <PersonalFeatureSection
        v-bind="homelabSection"
        reverse
      >
        <PersonalHomelabPanel :content="homelabPanel" />
      </PersonalFeatureSection>

      <PersonalFeatureSection v-bind="learningSection">
        <PersonalLearningPanel :content="learningPanel" />
      </PersonalFeatureSection>

      <PersonalFeatureSection
        v-bind="hardwareSection"
        reverse
      >
        <CoolingLoopPanel :content="coolingPanel" />
      </PersonalFeatureSection>

      <SharedPageClosing
        id="personal-close"
        :content="personalClosing"
      />
    </main>
  </div>
</template>
