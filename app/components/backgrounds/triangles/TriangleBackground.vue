<script setup lang="ts">
/**
 * Coordinates TriangleRenderer with browser lifecycle, input channels and the
 * shared background performance contract. Canvas geometry and drawing state
 * remain isolated from Vue so this component only owns orchestration.
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
import { TRIANGLE_CONFIG, TRIANGLE_QUALITY_PRESETS } from './config';
import { TriangleRenderer } from './TriangleRenderer';
import type { TrianglePosition } from './types';

const props = withDefaults(defineProps<BackgroundSceneProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
});
const emit = defineEmits<BackgroundSceneEmits>();

const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const failureReason = ref<string | null>(null);

let runtime: TriangleRenderer | null = null;
let environment: BackgroundEnvironment | null = null;
let resizeObserver: ResizeObserver | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof TRIANGLE_QUALITY_PRESETS)[number]> | null = null;

let animationFrame: number | null = null;
let lastFrameTime = 0;
let elapsedTime = 0;

let pointerPresent = false;
let pointerScreenX = 0;
let pointerScreenY = 0;
let lastPointerPosition: TrianglePosition | null = null;
let lastPointerPointTime = 0;
let previousScrollOffset = 0;

function getTheme(): string | undefined {
  return document.documentElement.dataset.theme;
}

function scheduleFrame(): void {
  if (animationFrame !== null) return;

  animationFrame = window.requestAnimationFrame(renderFrame);
}

function renderFrame(now: number): void {
  animationFrame = null;

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

  const qualityChange = performanceRuntime?.recordFrame(now);

  if (qualityChange) {
    runtime.setQuality(qualityChange);
    runtime.setScrollOffset(window.scrollY);
    updatePerformanceStats(now, true);
  }

  updatePerformanceStats(now);

  if (shouldContinue) scheduleFrame();
}

function resize(): void {
  if (!runtime || !performanceRuntime) return;

  runtime.setScrollOffset(window.scrollY);
  runtime.resize(performanceRuntime.currentPreset);
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

  if (!runtime || !props.active) return;

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

  if (visible && props.active) scheduleFrame();
}

function handleThemeChange(): void {
  runtime?.setTheme(getTheme());
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

  emit('performanceStats', {
    name: 'Triangle field',
    renderer: 'Canvas2D',
    mode: props.performance.mode,
    preset: performanceRuntime.currentPreset.id,
    fps: performanceRuntime.fps,
    frameTime: performanceRuntime.averageFrameTime,
    resolution: `${rendererStats.width} × ${rendererStats.height}`,
    dpr: rendererStats.dpr,
    details: {
      Triangles: rendererStats.triangleCount,
      'Trail points': rendererStats.trailPointCount,
      Rotation: `${rendererStats.rotationDegrees}°`,
    },
  });
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  const quality = performanceRuntime.setMode(props.performance.mode);

  runtime?.setQuality(quality);
  runtime?.setScrollOffset(window.scrollY);
  lastFrameTime = 0;
  scheduleFrame();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;
  const quality = performanceRuntime?.currentPreset;

  if (!element || !quality) return;

  try {
    runtime = TriangleRenderer.create(element, quality, getTheme());
    runtime.setScrollOffset(window.scrollY);
    previousScrollOffset = window.scrollY;
    runtime.resize();

    failed.value = false;
    failureReason.value = null;
    lastFrameTime = 0;
    scheduleFrame();
    updatePerformanceStats(performance.now(), true);
  } catch (error: unknown) {
    failed.value = true;
    failureReason.value = error instanceof Error ? error.message : 'Initialization failed';
    cleanup();
  }
}

function cleanup(): void {
  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

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
  ([active, , cursorMovement, cursorClick, scroll]) => {
    if (!active || (!cursorMovement && !cursorClick && !scroll)) resetInteractions();
    if (!active) performanceRuntime?.resetMeasurements();

    lastFrameTime = 0;
    scheduleFrame();

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
  performanceRuntime = new BackgroundPerformanceRuntime(TRIANGLE_QUALITY_PRESETS, props.performance.mode);
  environment = new BackgroundEnvironment({
    onMotionPreferenceChange: handleMotionPreferenceChange,
    onThemeChange: handleThemeChange,
    onVisibilityChange: handleVisibilityChange,
  });
  resizeObserver = new ResizeObserver(resize);

  if (canvas.value) resizeObserver.observe(canvas.value);

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerleave', clearPointer, { passive: true });
  window.addEventListener('blur', clearPointer);

  initialize();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;

  window.removeEventListener('resize', resize);
  window.removeEventListener('orientationchange', resize);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('pointerleave', clearPointer);
  window.removeEventListener('blur', clearPointer);

  environment?.dispose();
  environment = null;
  cleanup();
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
