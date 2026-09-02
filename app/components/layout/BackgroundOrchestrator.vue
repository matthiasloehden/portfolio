<!--
  Loads the active scene with hydration, prewarms the others during idle, and
  keeps every mounted scene available for seamless later transitions.
-->
<script setup lang="ts">
import {
  BACKGROUND_IDS,
  type BackgroundAnimationSettings,
  type BackgroundId,
  type BackgroundPerformanceSettings,
  type BackgroundPerformanceStats,
  type BackgroundSettingOverridesMap,
} from '@/types/background';
import { enqueueIdleTask } from '@/utils/idleTask';
import PerformanceStatsOverlay from '@/components/backgrounds/shared/PerformanceStatsOverlay.vue';

const props = defineProps<{
  background: BackgroundId | 'none';
  animations: BackgroundAnimationSettings;
  settingOverrides: BackgroundSettingOverridesMap;
  performance: BackgroundPerformanceSettings;
}>();

const { performanceStats } = useBackgroundRuntimeStatus();
const initiallyMountedBackgrounds = props.background === 'none' ? [] : [props.background];
const mountedBackgrounds = shallowRef<ReadonlySet<BackgroundId>>(new Set(initiallyMountedBackgrounds));
const pendingBackgrounds: BackgroundId[] = [];
let prewarmingBackground: BackgroundId | undefined;
let cancelBackgroundPrewarm: (() => void) | undefined;

function mountBackground(background: BackgroundId): void {
  if (mountedBackgrounds.value.has(background)) return;
  mountedBackgrounds.value = new Set([...mountedBackgrounds.value, background]);
}

function isSceneMounted(background: BackgroundId): boolean {
  return mountedBackgrounds.value.has(background);
}

function isSceneActive(background: BackgroundId): boolean {
  return props.background === background;
}

function setPerformanceStats(background: BackgroundId, stats: BackgroundPerformanceStats): void {
  if (isSceneActive(background)) performanceStats.value = stats;
}

function scheduleNextBackgroundPrewarm(): void {
  if (cancelBackgroundPrewarm || prewarmingBackground) return;

  let background = pendingBackgrounds.shift();
  while (background && mountedBackgrounds.value.has(background)) background = pendingBackgrounds.shift();
  if (!background) return;
  const nextBackground = background;

  cancelBackgroundPrewarm = enqueueIdleTask(
    () => {
      cancelBackgroundPrewarm = undefined;
      prewarmingBackground = nextBackground;
      mountBackground(nextBackground);
    },
    { priority: 10 },
  );
}

function onBackgroundReady(background: BackgroundId): void {
  if (prewarmingBackground !== background) return;

  prewarmingBackground = undefined;
  scheduleNextBackgroundPrewarm();
}

watch(
  () => props.background,
  (background) => {
    performanceStats.value = null;
    if (background === 'none') return;

    mountBackground(background);
  },
);

onMounted(() => {
  const activeIndex = props.background === 'none' ? -1 : BACKGROUND_IDS.indexOf(props.background);
  const prewarmOrder =
    activeIndex === -1
      ? BACKGROUND_IDS
      : [...BACKGROUND_IDS.slice(activeIndex + 1), ...BACKGROUND_IDS.slice(0, activeIndex)];

  pendingBackgrounds.push(...prewarmOrder);
  scheduleNextBackgroundPrewarm();
});
onBeforeUnmount(() => {
  cancelBackgroundPrewarm?.();
  pendingBackgrounds.length = 0;
});
</script>

<template>
  <LazyBackgroundsWaveBackground
    v-if="isSceneMounted('wave')"
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('wave') }"
    :active="isSceneActive('wave')"
    :animations="animations"
    :setting-overrides="settingOverrides.wave"
    :performance="performance"
    @performance-stats="setPerformanceStats('wave', $event)"
    @ready="onBackgroundReady('wave')"
  />

  <LazyBackgroundsTrianglesTriangleBackground
    v-if="isSceneMounted('triangles')"
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('triangles') }"
    :active="isSceneActive('triangles')"
    :animations="animations"
    :setting-overrides="settingOverrides.triangles"
    :performance="performance"
    @performance-stats="setPerformanceStats('triangles', $event)"
    @ready="onBackgroundReady('triangles')"
  />

  <LazyBackgroundsParticlesParticleBackground
    v-if="isSceneMounted('particles')"
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('particles') }"
    :active="isSceneActive('particles')"
    :animations="animations"
    :setting-overrides="settingOverrides.particles"
    :performance="performance"
    @performance-stats="setPerformanceStats('particles', $event)"
    @ready="onBackgroundReady('particles')"
  />

  <LazyBackgroundsMeshBackground
    v-if="isSceneMounted('mesh')"
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('mesh') }"
    :active="isSceneActive('mesh')"
    :animations="animations"
    :setting-overrides="settingOverrides.mesh"
    :performance="performance"
    @performance-stats="setPerformanceStats('mesh', $event)"
    @ready="onBackgroundReady('mesh')"
  />

  <Teleport to="body">
    <PerformanceStatsOverlay
      :enabled="background !== 'none' && performance.showStats"
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
