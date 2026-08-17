<script setup lang="ts">
/**
 * Coordinates the particle renderer, interaction state and browser lifecycle.
 * Three.js resources stay inside ParticleRenderer and adaptive performance is
 * handled through the same typed contract as every other background scene.
 */

import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
  type BackgroundSceneEmits,
  type BackgroundSceneProps,
} from '@/types/background';

import { BackgroundEnvironment } from '../shared/BackgroundEnvironment';
import { BackgroundPerformanceRuntime } from '../shared/BackgroundPerformanceRuntime';
import { PARTICLE_CONFIG, PARTICLE_QUALITY } from './config';
import { InteractionManager } from './InteractionManager';
import { ParticleRenderer } from './ParticleRenderer';

const props = withDefaults(defineProps<BackgroundSceneProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
});
const emit = defineEmits<BackgroundSceneEmits>();

const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const failureReason = ref<string | null>(null);

let runtime: ParticleRenderer | null = null;
let interaction: InteractionManager | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof PARTICLE_QUALITY)[number]> | null = null;

let previousTime = 0;
let environment: BackgroundEnvironment | null = null;
let contextLost = false;

function getParticleColor(): string {
  return document.documentElement.dataset.theme === 'light' ? PARTICLE_CONFIG.lightColor : PARTICLE_CONFIG.darkColor;
}

function resize(): void {
  runtime?.resize();
  interaction?.resize();
  runtime?.renderStatic();
}

function renderFrame(now: number): void {
  if (!runtime || !interaction || contextLost) return;

  const delta = previousTime === 0 ? 1 / 60 : Math.min((now - previousTime) / 1_000, 0.05);
  previousTime = now;

  const interactionState = interaction.update(now, delta);

  runtime.render(now, delta, interactionState, props.animations);

  const qualityChange = performanceRuntime?.recordFrame(now);

  if (qualityChange) {
    runtime.setQuality(qualityChange, getParticleColor());
    resize();
    updatePerformanceStats(now, true);
  }

  updatePerformanceStats(now);

  if (!props.animations.idle && !interaction.hasActiveAnimation()) {
    setAnimationState();
  }
}

function setAnimationState(): void {
  if (!runtime) return;

  const shouldAnimate =
    props.active &&
    environment?.documentVisible !== false &&
    !environment?.prefersReducedMotion &&
    !contextLost &&
    (props.animations.idle || interaction?.hasActiveAnimation() === true);

  previousTime = 0;
  runtime.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !contextLost) {
    runtime.renderStatic();
  }
}

function updatePerformanceStats(now: number, force = false): void {
  if (!runtime || !interaction || !performanceRuntime?.shouldPublishStats(now, force)) return;

  const rendererStats = runtime.getPerformanceStats();

  emit('performanceStats', {
    name: 'Particle field',
    renderer: 'WebGL2 / GPGPU',
    mode: props.performance.mode,
    preset: performanceRuntime.currentPreset.id,
    fps: performanceRuntime.fps,
    frameTime: performanceRuntime.averageFrameTime,
    resolution: `${rendererStats.width} × ${rendererStats.height}`,
    dpr: rendererStats.dpr,
    details: {
      Particles: rendererStats.particleCount,
      'Pointer speed': interaction.state.pointerSpeed.toFixed(2),
      'Click pull': interaction.state.clickInfluence.toFixed(2),
      'Scroll velocity': interaction.state.scrollVelocity.toFixed(2),
    },
  });
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  const quality = performanceRuntime.setMode(props.performance.mode);

  runtime?.setQuality(quality, getParticleColor());
  resize();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;
  const quality = performanceRuntime?.currentPreset;

  if (!element || !quality) return;

  try {
    runtime = ParticleRenderer.create(element, quality, getParticleColor());
    interaction = new InteractionManager(props.animations, setAnimationState);

    failed.value = false;
    failureReason.value = null;

    resize();
    setAnimationState();
    updatePerformanceStats(performance.now(), true);
  } catch (error: unknown) {
    failed.value = true;
    failureReason.value = error instanceof Error ? error.message : 'Initialization failed';
    cleanup(false);
  }
}

function cleanup(forceContextLoss: boolean): void {
  interaction?.dispose();
  interaction = null;

  runtime?.dispose(forceContextLoss);
  runtime = null;
}

function onVisibilityChange(): void {
  setAnimationState();
}

function onMotionPreferenceChange(): void {
  setAnimationState();
}

function onColorSchemeChange(): void {
  runtime?.setColor(getParticleColor());
  runtime?.renderStatic();
}

function onContextLost(event: Event): void {
  event.preventDefault();

  contextLost = true;
  failed.value = true;
  failureReason.value = 'WebGL context lost';
  runtime?.setAnimationLoop(null);
}

function onContextRestored(): void {
  contextLost = false;
  cleanup(false);
  initialize();
}

watch(
  () => [
    props.active,
    props.animations.idle,
    props.animations.cursorMovement,
    props.animations.cursorClick,
    props.animations.scroll,
  ],
  ([active]) => {
    interaction?.setAnimations(props.animations);

    if (!active) performanceRuntime?.resetMeasurements();
    if (active) resize();

    setAnimationState();
    if (active) updatePerformanceStats(performance.now(), true);
  },
  { flush: 'post' },
);

watch(() => props.performance.mode, applyPerformanceMode, { flush: 'post' });
watch(
  () => props.performance.showStats,
  (showStats) => {
    if (showStats) updatePerformanceStats(performance.now(), true);
  },
  { flush: 'post' },
);

onMounted(() => {
  performanceRuntime = new BackgroundPerformanceRuntime(
    PARTICLE_QUALITY,
    props.performance.mode,
    {
      warmupFrames: PARTICLE_CONFIG.performanceWarmupFrames,
      sampleFrames: PARTICLE_CONFIG.performanceSampleFrames,
      poorPerformanceWindows: PARTICLE_CONFIG.poorPerformanceWindows,
    },
  );

  environment = new BackgroundEnvironment({
    onMotionPreferenceChange,
    onThemeChange: onColorSchemeChange,
    onVisibilityChange,
  });

  canvas.value?.addEventListener('webglcontextlost', onContextLost);
  canvas.value?.addEventListener('webglcontextrestored', onContextRestored);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });
  initialize();
});

onBeforeUnmount(() => {
  canvas.value?.removeEventListener('webglcontextlost', onContextLost);
  canvas.value?.removeEventListener('webglcontextrestored', onContextRestored);
  window.removeEventListener('resize', resize);
  window.removeEventListener('orientationchange', resize);
  environment?.dispose();
  environment = null;

  cleanup(true);
  performanceRuntime = null;
});
</script>

<template>
  <div
    class="particle-background"
    :class="{ 'is-fallback': failed }"
    :data-particle-error="failed ? (failureReason ?? 'Unknown WebGL failure') : undefined"
    aria-hidden="true"
  >
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.particle-background {
  position: fixed;
  z-index: 0;
  inset: 0;

  overflow: hidden;
  pointer-events: none;
}

.particle-background::before {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(circle at 18% 20%, rgba(28, 94, 190, 0.08), transparent 36%),
    radial-gradient(circle at 78% 68%, rgba(22, 72, 148, 0.06), transparent 42%);

  content: '';
  opacity: 0.65;
}

canvas {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  pointer-events: none;
}

.is-fallback::after {
  position: absolute;
  inset: 0;

  background-image: radial-gradient(circle, rgba(109, 159, 232, 0.3) 0 0.6px, transparent 0.8px);
  background-size: 22px 22px;

  content: '';
  mask-image: linear-gradient(to bottom, black, transparent 92%);
  opacity: 0.24;
}

.is-fallback canvas {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .particle-background::before {
    opacity: 0.45;
  }
}
</style>
