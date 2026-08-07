<script setup lang="ts">
import { itsmCase, passkeysCase, projectList, streamingCase } from '@/data/projects';

useSeoMeta({
  title: 'University Projects — Matthias Löhden',
  description:
    'Selected university projects by Matthias Löhden across event streaming, passwordless authentication, and IT service management.',
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <ProjectsHero />
      <SharedCaseStudyList
        id="project-list"
        title-id="project-list-title"
        label="Selected university projects"
        title="Three perspectives on dependable digital systems."
        :items="projectList"
      />

      <ProjectsProjectCaseStudy v-bind="streamingCase">
        <ProjectsStreamingPanel />
      </ProjectsProjectCaseStudy>

      <ProjectsProjectCaseStudy
        v-bind="passkeysCase"
        reverse
      >
        <ProjectsAuthenticationPanel />
      </ProjectsProjectCaseStudy>

      <ProjectsProjectCaseStudy v-bind="itsmCase">
        <ProjectsServicePanel />
      </ProjectsProjectCaseStudy>

      <ProjectsClosing />
    </main>
  </div>
</template>
