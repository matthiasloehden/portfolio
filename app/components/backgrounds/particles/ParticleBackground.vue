<script setup lang="ts">
/**
 * Vue controller for the Particles background.
 *
 * This component connects reactive scene settings to the imperative rendering
 * code. It owns browser listeners, mount/unmount cleanup, resize handling and
 * the decision whether another animation frame is needed. InteractionManager
 * converts pointer, click and scroll input into renderer-neutral simulation
 * state; ParticleRenderer consumes that state and owns the GPU resources.
 *
 * The file follows the runtime flow: component state and shared services first,
 * then frame/resize control, lifecycle callbacks, reactive watchers and finally
 * the canvas markup. Keeping that boundary here prevents Vue and DOM concerns
 * from leaking into the particle simulation.
 */

import { onBeforeUnmount, onMounted, watch } from 'vue';

import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
  type BackgroundSceneEmits,
  type BackgroundSceneProps,
  type BackgroundTheme,
} from '@/types/background';

import { BackgroundEnvironment } from '../shared/BackgroundEnvironment';
import { BackgroundPerformanceRuntime } from '../shared/BackgroundPerformanceRuntime';
import { BackgroundResizeController } from '../shared/BackgroundResizeController';
import { useBackgroundCanvas } from '../shared/useBackgroundCanvas';
import { useBackgroundPerformanceSettings } from '../shared/useBackgroundPerformanceSettings';
import { WebGLContextLifecycle } from '../shared/WebGLContextLifecycle';
import { PARTICLE_CONFIG, PARTICLE_QUALITY_PRESETS } from './config';
import { InteractionManager } from './InteractionManager';
import { ParticleRenderer } from './ParticleRenderer';

const props = withDefaults(defineProps<BackgroundSceneProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
});
const emit = defineEmits<BackgroundSceneEmits>();

const { canvas, failed, failureReason, clearFailure, setFailure } = useBackgroundCanvas();

let runtime: ParticleRenderer | null = null;
let interaction: InteractionManager | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof PARTICLE_QUALITY_PRESETS)[number]> | null = null;

let previousTime = 0;
let environment: BackgroundEnvironment | null = null;
let resizeController: BackgroundResizeController | null = null;
let webglContext: WebGLContextLifecycle | null = null;

function resize(): void {
  runtime?.resize();
  interaction?.resize();
  runtime?.renderStatic();
}

function renderFrame(now: number): void {
  if (!runtime || !interaction || webglContext?.lost) return;

  const delta = previousTime === 0 ? 1 / 60 : Math.min((now - previousTime) / 1_000, 0.05);
  previousTime = now;

  const interactionState = interaction.update(now, delta);

  runtime.render(now, delta, interactionState, props.animations);

  const qualityChange = performanceRuntime?.recordFrame(now);

  if (qualityChange) {
    runtime.setQuality(qualityChange, environment?.theme ?? 'dark');
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
    !webglContext?.lost &&
    (props.animations.idle || interaction?.hasActiveAnimation() === true);

  previousTime = 0;
  runtime.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !webglContext?.lost) {
    runtime.renderStatic();
  }
}

function updatePerformanceStats(now: number, force = false): void {
  if (!runtime || !interaction || !performanceRuntime?.shouldPublishStats(now, force)) return;

  const rendererStats = runtime.getPerformanceStats();

  emit(
    'performanceStats',
    performanceRuntime.createStats({ name: 'Particle field', renderer: 'WebGL2 / GPGPU' }, rendererStats, {
      Particles: rendererStats.particleCount,
      'Pointer speed': interaction.state.pointerSpeed.toFixed(2),
      'Click pull': interaction.state.clickInfluence.toFixed(2),
      'Scroll velocity': interaction.state.scrollVelocity.toFixed(2),
    }),
  );
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  const quality = performanceRuntime.setMode(props.performance.mode);

  runtime?.setQuality(quality, environment?.theme ?? 'dark');
  resize();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;
  const quality = performanceRuntime?.currentPreset;

  if (!element || !quality) return;

  try {
    runtime = ParticleRenderer.create(element, quality, environment?.theme ?? 'dark');
    interaction = new InteractionManager(props.animations, setAnimationState);

    clearFailure();

    resize();
    setAnimationState();
    updatePerformanceStats(performance.now(), true);
  } catch (error: unknown) {
    setFailure(error);
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

function onThemeChange(theme: BackgroundTheme): void {
  runtime?.setTheme(theme);
  runtime?.renderStatic();
}

function onContextLost(): void {
  setFailure('WebGL context lost');
  runtime?.setAnimationLoop(null);
}

function onContextRestored(): void {
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

useBackgroundPerformanceSettings(() => props.performance, {
  onModeChange: applyPerformanceMode,
  onStatsRequested: () => updatePerformanceStats(performance.now(), true),
});

onMounted(() => {
  performanceRuntime = new BackgroundPerformanceRuntime(PARTICLE_QUALITY_PRESETS, props.performance.mode, {
    warmupFrames: PARTICLE_CONFIG.performanceWarmupFrames,
    sampleFrames: PARTICLE_CONFIG.performanceSampleFrames,
    poorPerformanceWindows: PARTICLE_CONFIG.poorPerformanceWindows,
  });

  environment = new BackgroundEnvironment({
    onMotionPreferenceChange,
    onThemeChange,
    onVisibilityChange,
  });

  resizeController = new BackgroundResizeController(resize, [canvas.value]);

  if (canvas.value) {
    webglContext = new WebGLContextLifecycle(canvas.value, {
      onLost: onContextLost,
      onRestored: onContextRestored,
    });
  }

  initialize();
});

onBeforeUnmount(() => {
  webglContext?.dispose();
  webglContext = null;
  resizeController?.dispose();
  resizeController = null;
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
