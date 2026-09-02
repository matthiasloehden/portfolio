<script setup lang="ts">
/**
 * Vue controller for the Triangles background.
 *
 * This component owns browser input, document visibility, resize observation,
 * adaptive quality and on-demand frame scheduling. Pointer and scroll events
 * are converted into document-space positions before they are passed to the
 * renderer, which keeps the interaction stable while the page moves.
 *
 * State and shared services are declared first; frame control and input handlers
 * follow; setup, teardown and reactive watchers come last. TriangleRenderer is
 * deliberately isolated from Vue and browser listeners and only receives the
 * state required to draw the current frame.
 */

import { onBeforeUnmount, onMounted, watch } from 'vue';

import { createRuntimeBackgroundSettings } from '@/config/backgrounds/settingsRegistry';
import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/domain/backgrounds/preferences';
import { type BackgroundSceneEmits, type BackgroundTheme, type TriangleBackgroundProps } from '@/types/background';

import { AnimationFrameScheduler } from '../shared/AnimationFrameScheduler';
import { BackgroundEnvironment } from '../shared/BackgroundEnvironment';
import { BackgroundPerformanceRuntime } from '../shared/BackgroundPerformanceRuntime';
import { BackgroundResizeController } from '../shared/BackgroundResizeController';
import { useBackgroundCanvas } from '../shared/useBackgroundCanvas';
import { useBackgroundPerformanceSettings } from '../shared/useBackgroundPerformanceSettings';
import { TRIANGLE_CONFIG, TRIANGLE_QUALITY_PRESETS } from './config';
import { TriangleRenderer } from './TriangleRenderer';
import type { TrianglePosition } from './TriangleHighlightTrail';

const props = withDefaults(defineProps<TriangleBackgroundProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
  settingOverrides: () => ({}),
});
const emit = defineEmits<BackgroundSceneEmits>();

const { canvas, failed, failureReason, clearFailure, setFailure } = useBackgroundCanvas();

let runtime: TriangleRenderer | null = null;
let environment: BackgroundEnvironment | null = null;
let resizeController: BackgroundResizeController | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof TRIANGLE_QUALITY_PRESETS)[number]> | null = null;
let frameScheduler: AnimationFrameScheduler | null = null;

let lastFrameTime = 0;
let elapsedTime = 0;

let pointerPresent = false;
let pointerScreenX = 0;
let pointerScreenY = 0;
let lastPointerPosition: TrianglePosition | null = null;
let lastPointerPointTime = 0;
let previousScrollOffset = 0;

function getRuntimeSettings() {
  const preset = performanceRuntime?.currentPreset ?? TRIANGLE_QUALITY_PRESETS[0];
  return createRuntimeBackgroundSettings('triangles', props.settingOverrides, preset.id);
}

function scheduleFrame(): void {
  frameScheduler?.request();
}

function renderFrame(now: number): void {
  if (!runtime) return;

  const documentVisible = environment?.documentVisible !== false;
  const idleMotionEnabled = props.active && props.animations.idle && !environment?.prefersReducedMotion;
  const trailActive = props.active && runtime.hasActiveTrail(now);
  const shouldContinue = documentVisible && (idleMotionEnabled || trailActive);

  if (shouldContinue && lastFrameTime !== 0 && now - lastFrameTime < TRIANGLE_CONFIG.frameBudget.active) {
    scheduleFrame();
    return;
  }

  const delta = lastFrameTime === 0 ? TRIANGLE_CONFIG.frameBudget.active : Math.min(now - lastFrameTime, 48);

  lastFrameTime = now;

  if (idleMotionEnabled) elapsedTime += delta / 1_000;

  runtime.render(now, elapsedTime, idleMotionEnabled);

  const qualityChange = props.active ? performanceRuntime?.recordFrame(now) : null;

  if (qualityChange) {
    applyTriangleSettings();
  }

  if (props.active) updatePerformanceStats(now);

  if (shouldContinue) scheduleFrame();
}

function resize(): void {
  if (!runtime) return;

  runtime.setScrollOffset(window.scrollY);
  runtime.resize();
  previousScrollOffset = window.scrollY;
  lastFrameTime = 0;
  scheduleFrame();
}

function resetInteractions(): void {
  runtime?.resetInteractions();
  pointerPresent = false;
  lastPointerPosition = null;
  lastPointerPointTime = 0;
}

function handlePointerMove(event: PointerEvent): void {
  if (!runtime || !props.active || !props.animations.cursorMovement || environment?.prefersReducedMotion) return;

  const now = performance.now();
  const position = runtime.projectPointer(event.clientX, event.clientY);

  pointerPresent = true;
  pointerScreenX = event.clientX;
  pointerScreenY = event.clientY;

  if (!lastPointerPosition) {
    runtime.addHighlightPoint(position, 1, now);
    lastPointerPosition = position;
    lastPointerPointTime = now;
    scheduleFrame();
    return;
  }

  const distance = Math.hypot(position.x - lastPointerPosition.x, position.worldY - lastPointerPosition.worldY);
  const timeSinceLastPoint = now - lastPointerPointTime;

  if (distance >= TRIANGLE_CONFIG.minPointerDistance || timeSinceLastPoint >= TRIANGLE_CONFIG.minPointerInterval) {
    runtime.addHighlightSegment(lastPointerPosition, position, 1, now);
    lastPointerPosition = position;
    lastPointerPointTime = now;
  }

  scheduleFrame();
}

function handlePointerDown(event: PointerEvent): void {
  if (!runtime || !props.active || !props.animations.cursorClick || environment?.prefersReducedMotion) return;

  const now = performance.now();
  const position = runtime.projectPointer(event.clientX, event.clientY);

  pointerPresent = true;
  pointerScreenX = event.clientX;
  pointerScreenY = event.clientY;
  lastPointerPosition = position;
  lastPointerPointTime = now;

  runtime.addClick(position, now);
  scheduleFrame();
}

function handleScroll(): void {
  const nextScrollOffset = window.scrollY;
  const scrollDelta = nextScrollOffset - previousScrollOffset;

  previousScrollOffset = nextScrollOffset;
  runtime?.setScrollOffset(nextScrollOffset);

  if (!runtime) return;

  if (!props.active) {
    // Keep the mounted canvas synchronized for a flash-free crossfade.
    scheduleFrame();
    return;
  }

  if (
    !props.animations.scroll ||
    environment?.prefersReducedMotion ||
    !pointerPresent ||
    !lastPointerPosition ||
    Math.abs(scrollDelta) < 0.01
  ) {
    scheduleFrame();
    return;
  }

  const position = runtime.projectPointer(pointerScreenX, pointerScreenY);

  runtime.addHighlightSegment(lastPointerPosition, position, 0.95);
  lastPointerPosition = position;
  lastPointerPointTime = performance.now();
  scheduleFrame();
}

function clearPointer(): void {
  pointerPresent = false;
  lastPointerPosition = null;
  scheduleFrame();
}

function handleVisibilityChange(visible: boolean): void {
  lastFrameTime = 0;

  if (!visible) frameScheduler?.cancel();
  else if (props.active) scheduleFrame();
}

function handleThemeChange(theme: BackgroundTheme): void {
  runtime?.setTheme(theme);
  lastFrameTime = 0;
  scheduleFrame();
}

function handleMotionPreferenceChange(): void {
  resetInteractions();
  lastFrameTime = 0;

  if (props.active) scheduleFrame();
}

function updatePerformanceStats(now: number, force = false): void {
  if (!runtime || !performanceRuntime?.shouldPublishStats(now, force)) return;

  const rendererStats = runtime.getPerformanceStats();

  emit(
    'performanceStats',
    performanceRuntime.createStats({ name: 'Triangle field', renderer: 'Canvas2D' }, rendererStats, {
      Triangles: rendererStats.triangleCount,
      'Trail points': rendererStats.trailPointCount,
      Rotation: `${rendererStats.rotationDegrees}°`,
    }),
  );
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  performanceRuntime.setMode(props.performance.mode);
  if (!props.active) return;

  applyTriangleSettings();
}

function syncTriangleRendererSettings(): void {
  runtime?.setSettings(getRuntimeSettings());
  runtime?.setScrollOffset(window.scrollY);
}

function applyTriangleSettings(): void {
  syncTriangleRendererSettings();
  lastFrameTime = 0;
  scheduleFrame();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;
  if (!element) return;

  try {
    runtime = TriangleRenderer.create(element, environment?.theme ?? 'dark', getRuntimeSettings());
    runtime.setScrollOffset(window.scrollY);
    previousScrollOffset = window.scrollY;
    runtime.resize();

    clearFailure();
    lastFrameTime = 0;
    scheduleFrame();
    updatePerformanceStats(performance.now(), true);
  } catch (error: unknown) {
    setFailure(error);
    cleanup();
  }
}

function cleanup(): void {
  frameScheduler?.cancel();

  runtime?.dispose();
  runtime = null;
  resetInteractions();
}

watch(
  () => [
    props.active,
    props.animations.idle,
    props.animations.cursorMovement,
    props.animations.cursorClick,
    props.animations.scroll,
  ],
  ([active, , cursorMovement, cursorClick, scroll], [wasActive]) => {
    if (!active || (!cursorMovement && !cursorClick && !scroll)) resetInteractions();
    if (!active) performanceRuntime?.resetMeasurements();
    else if (!wasActive) syncTriangleRendererSettings();

    lastFrameTime = 0;
    scheduleFrame();

    if (active) updatePerformanceStats(performance.now(), true);
  },
  { flush: 'post' },
);

useBackgroundPerformanceSettings(() => props.performance, {
  onModeChange: applyPerformanceMode,
  onStatsRequested: () => updatePerformanceStats(performance.now(), true),
});

watch(
  () => props.settingOverrides,
  () => {
    if (props.active) applyTriangleSettings();
  },
  { deep: true, flush: 'post' },
);

onMounted(() => {
  frameScheduler = new AnimationFrameScheduler(renderFrame);
  performanceRuntime = new BackgroundPerformanceRuntime(TRIANGLE_QUALITY_PRESETS, props.performance.mode);
  environment = new BackgroundEnvironment({
    onMotionPreferenceChange: handleMotionPreferenceChange,
    onThemeChange: handleThemeChange,
    onVisibilityChange: handleVisibilityChange,
  });
  resizeController = new BackgroundResizeController(resize, [canvas.value]);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerleave', clearPointer, { passive: true });
  window.addEventListener('blur', clearPointer);

  initialize();
  emit('ready');
});

onBeforeUnmount(() => {
  resizeController?.dispose();
  resizeController = null;

  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('pointerleave', clearPointer);
  window.removeEventListener('blur', clearPointer);

  environment?.dispose();
  environment = null;
  cleanup();
  frameScheduler?.dispose();
  frameScheduler = null;
  performanceRuntime = null;
});
</script>

<template>
  <div
    class="triangle-background"
    :class="{ 'is-fallback': failed }"
    :data-triangle-error="failed ? (failureReason ?? 'Unknown Canvas2D failure') : undefined"
    aria-hidden="true"
  >
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.triangle-background {
  position: fixed;
  z-index: 0;
  inset: 0;

  width: 100vw;
  height: 100vh;

  min-width: 100vw;
  min-height: 100vh;

  contain: layout paint style;
  overflow: hidden;

  background: var(--background);

  pointer-events: none;

  transform: translateZ(0);
  backface-visibility: hidden;
  isolation: isolate;
}

.triangle-background canvas {
  position: absolute;
  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  pointer-events: none;
}

.triangle-background.is-fallback canvas {
  display: none;
}
</style>
