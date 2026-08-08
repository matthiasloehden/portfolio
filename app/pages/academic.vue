<script setup lang="ts">
import { itsmCase, passkeysCase, academicList, streamingCase } from '@/data/academic';

useSeoMeta({
  title: 'University Projects — Matthias Löhden',
  description:
    'Selected computer science work by Matthias Löhden across scalable event processing, FIDO2 authentication, service operations, and applied software design.',
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <AcademicHero />
      <SharedCaseStudyList
        id="academic-list"
        title-id="academic-list-title"
        label="Selected university projects"
        title="Three perspectives on dependable digital systems."
        :items="academicList"
      />

      <AcademicCaseStudy v-bind="streamingCase">
        <AcademicStreamingPanel />
      </AcademicCaseStudy>

      <AcademicCaseStudy
        v-bind="passkeysCase"
        reverse
      >
        <AcademicAuthenticationPanel />
      </AcademicCaseStudy>

      <AcademicCaseStudy v-bind="itsmCase">
        <AcademicServicePanel />
      </AcademicCaseStudy>

      <AcademicClosing />
    </main>
  </div>
</template>
