<script setup lang="ts">
import { hardwareSection, homelabSection, learningSection, openSourceSection, personalList } from '@/data/personal';
import CoolingLoopPanel from '~/components/personal/cooling/CoolingLoopPanel.vue';

useSeoMeta({
  title: 'Personal Projects & Interests — Matthias Löhden',
  description:
    'Open-source contributions, self-hosted systems, local AI, favourite educational creators, and custom PC hardware by Matthias Löhden.',
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <PersonalHero />

      <SharedCaseStudyList
        id="personal-list"
        title-id="personal-list-title"
        label="Outside client & university work"
        title="Four ways curiosity becomes practice."
        :items="personalList"
      />

      <PersonalFeatureSection v-bind="openSourceSection">
        <PersonalContributionPanel />
      </PersonalFeatureSection>

      <PersonalFeatureSection
        v-bind="homelabSection"
        reverse
      >
        <PersonalHomelabPanel />
      </PersonalFeatureSection>

      <PersonalFeatureSection v-bind="learningSection">
        <PersonalLearningPanel />
      </PersonalFeatureSection>

      <PersonalFeatureSection
        v-bind="hardwareSection"
        reverse
      >
        <CoolingLoopPanel />
      </PersonalFeatureSection>

      <PersonalClosing />
    </main>
  </div>
</template>
