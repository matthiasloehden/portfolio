<script setup lang="ts">
import {
  academicClosing,
  academicHero,
  academicMeta,
  academicOverview,
  authenticationPanel,
  itsmCase,
  passkeysCase,
  servicePanel,
  streamingCase,
  streamingPanel,
} from '@/data/academic';

useSeoMeta(academicMeta);
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <SharedDetailHero
        title-id="projects-title"
        :content="academicHero"
      />
      <SharedCaseStudyList v-bind="academicOverview" />

      <AcademicCaseStudy v-bind="streamingCase">
        <AcademicStreamingPanel :content="streamingPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy
        v-bind="passkeysCase"
        reverse
      >
        <AcademicAuthenticationPanel :content="authenticationPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy v-bind="itsmCase">
        <AcademicServicePanel :content="servicePanel" />
      </AcademicCaseStudy>

      <SharedPageClosing
        id="projects-close"
        :content="academicClosing"
        width="narrow"
      />
    </main>
  </div>
</template>
