<!--
  Resolves the active ambient scene from the current route and visitor
  preference. Scenes remain mounted so route and preference changes can
  crossfade without an empty frame; inactive render loops are paused.
-->
<script setup lang="ts">
import type {
  BackgroundAnimationSettings,
  BackgroundId,
  BackgroundPerformanceSettings,
  BackgroundPerformanceStats,
  BackgroundPreference,
  BackgroundSettingOverridesMap,
} from '@/types/background';
import { resolveBackground } from '@/config/backgrounds/selection';
import ParticleBackground from '@/components/backgrounds/particles/ParticleBackground.vue';
import MeshBackground from '@/components/backgrounds/mesh/MeshBackground.vue';
import TriangleBackground from '@/components/backgrounds/triangles/TriangleBackground.vue';
import WaveBackground from '@/components/backgrounds/wave/WaveBackground.vue';
import PerformanceStatsOverlay from '@/components/backgrounds/shared/PerformanceStatsOverlay.vue';

const props = defineProps<{
  preference: BackgroundPreference;
  animations: BackgroundAnimationSettings;
  settingOverrides: BackgroundSettingOverridesMap;
  performance: BackgroundPerformanceSettings;
}>();

const route = useRoute();

const selectedBackground = computed(() => resolveBackground(route.path, props.preference));
const { performanceStats } = useBackgroundRuntimeStatus();

function isSceneActive(background: BackgroundId): boolean {
  return selectedBackground.value === background;
}

function setPerformanceStats(background: BackgroundId, stats: BackgroundPerformanceStats): void {
  if (!isSceneActive(background)) return;

  performanceStats.value = stats;
}

watch(selectedBackground, () => {
  performanceStats.value = null;
});
</script>

<template>
  <WaveBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('wave') }"
    :active="isSceneActive('wave')"
    :animations="animations"
    :setting-overrides="settingOverrides.wave"
    :performance="performance"
    @performance-stats="setPerformanceStats('wave', $event)"
  />

  <TriangleBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('triangles') }"
    :active="isSceneActive('triangles')"
    :animations="animations"
    :setting-overrides="settingOverrides.triangles"
    :performance="performance"
    @performance-stats="setPerformanceStats('triangles', $event)"
  />

  <ParticleBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('particles') }"
    :active="isSceneActive('particles')"
    :animations="animations"
    :setting-overrides="settingOverrides.particles"
    :performance="performance"
    @performance-stats="setPerformanceStats('particles', $event)"
  />

  <MeshBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('mesh') }"
    :active="isSceneActive('mesh')"
    :animations="animations"
    :setting-overrides="settingOverrides.mesh"
    :performance="performance"
    @performance-stats="setPerformanceStats('mesh', $event)"
  />

  <Teleport to="body">
    <PerformanceStatsOverlay
      :enabled="selectedBackground !== 'none' && performance.showStats"
      :stats="performanceStats"
    />
  </Teleport>
</template>

<style scoped>
.background-scene {
  transition:
    opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0s linear 280ms;
  will-change: opacity;
}

.background-scene-active {
  visibility: visible;
  transition-delay: 0s;
}

.background-scene:not(.background-scene-active) {
  visibility: hidden;
  opacity: 0;
}
</style>
