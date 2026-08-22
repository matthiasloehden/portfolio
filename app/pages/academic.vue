<script setup lang="ts">
import {
  academicClosing,
  academicHero,
  academicMeta,
  academicOverview,
  authenticationPanel,
  engineeringPanel,
  itsmCase,
  passkeysCase,
  servicePanel,
  softwareEngineeringCase,
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

      <AcademicCaseStudy v-bind="softwareEngineeringCase">
        <AcademicEngineeringPanel :content="engineeringPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy
        v-bind="streamingCase"
        reverse
      >
        <AcademicStreamingPanel :content="streamingPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy v-bind="passkeysCase">
        <AcademicAuthenticationPanel :content="authenticationPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy
        v-bind="itsmCase"
        reverse
      >
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
