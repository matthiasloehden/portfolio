<script setup lang="ts">
const portfolio = usePortfolioContent();
const academic = computed(() => portfolio.value.academic);

useSeoMeta({
  title: () => academic.value.academicMeta.title,
  description: () => academic.value.academicMeta.description,
});
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <main
      id="content"
      class="relative z-1 site-container"
    >
      <SharedDetailHero
        title-id="projects-title"
        :content="academic.academicHero"
      />
      <SharedCaseStudyList v-bind="academic.academicOverview" />

      <AcademicCaseStudy v-bind="academic.softwareEngineeringCase">
        <AcademicEngineeringPanel :content="academic.engineeringPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy
        v-bind="academic.streamingCase"
        reverse
      >
        <AcademicStreamingPanel :content="academic.streamingPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy v-bind="academic.passkeysCase">
        <AcademicAuthenticationPanel :content="academic.authenticationPanel" />
      </AcademicCaseStudy>

      <AcademicCaseStudy
        v-bind="academic.itsmCase"
        reverse
      >
        <AcademicServicePanel :content="academic.servicePanel" />
      </AcademicCaseStudy>

      <SharedPageClosing
        id="projects-close"
        :content="academic.academicClosing"
        width="narrow"
      />
    </main>
  </div>
</template>
