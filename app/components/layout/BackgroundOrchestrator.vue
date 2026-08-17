<!--
  Resolves the active ambient scene from the current route and visitor
  preference. It keeps every scene mounted, but passes a shared, typed
  animation contract so inactive or disabled work can stop immediately.
-->
<script setup lang="ts">
import type { BackgroundAdvancedSettings, BackgroundAnimationSettings, BackgroundPreference } from '@/types/background';
import ParticleBackground from '@/components/backgrounds/particles/ParticleBackground.vue';
import TriangleMeshBackground from '@/components/backgrounds/triangle-mesh/TriangleMeshBackground.vue';
import TriangleBackground from '@/components/backgrounds/triangles/TriangleBackground.vue';
import WaveGridBackground from '@/components/backgrounds/wave-grid/WaveGridBackground.vue';

const props = defineProps<{
  preference: BackgroundPreference;
  animations: BackgroundAnimationSettings;
  advancedSettings: BackgroundAdvancedSettings;
}>();

const route = useRoute();

const automaticBackgrounds: Record<string, BackgroundPreference> = {
  '/': 'wave',
  '/work': 'triangles',
  '/academic': 'particles',
  '/personal': 'mesh',
};

const normalizedPath = computed(() => route.path.replace(/\/+$/, '') || '/');

const automaticBackground = computed(() => automaticBackgrounds[normalizedPath.value] ?? 'none');

const selectedBackground = computed<BackgroundPreference>(() =>
  props.preference === 'auto' ? automaticBackground.value : props.preference,
);

function isSceneActive(background: BackgroundPreference): boolean {
  return selectedBackground.value === background;
}
</script>

<template>
  <WaveGridBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('wave') }"
    :active="isSceneActive('wave')"
    :animations="animations"
    :settings="advancedSettings.wave"
  />

  <TriangleBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('triangles') }"
    :active="isSceneActive('triangles')"
    :animations="animations"
  />

  <ParticleBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('particles') }"
    :active="isSceneActive('particles')"
    :animations="animations"
  />

  <TriangleMeshBackground
    class="background-scene"
    :class="{ 'background-scene-active': isSceneActive('mesh') }"
    :active="isSceneActive('mesh')"
    :animations="animations"
  />
</template>
