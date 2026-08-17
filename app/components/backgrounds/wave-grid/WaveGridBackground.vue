<script setup lang="ts">
/**
 * Interactive WebGL background with independent idle, cursor-movement,
 * cursor-click and scroll channels.
 *
 * Vue owns browser input and lifecycle orchestration. WaveGridRenderer owns the
 * Three.js scene and GPU resources. Rendering pauses while inactive, hidden or
 * static, and WebGL failure falls back to CSS.
 */

import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
  createDefaultWaveGridSettings,
  WAVE_GRID_MAX_TRAIL_POINTS,
  type BackgroundSceneEmits,
  type WaveGridBackgroundProps,
  type WaveGridSettings,
} from '@/types/background';

import { BackgroundEnvironment } from '../shared/BackgroundEnvironment';
import { BackgroundPerformanceRuntime } from '../shared/BackgroundPerformanceRuntime';
import {
  CLICK_RIPPLE_LAYERS,
  DEFAULT_RIPPLE_LAYERS,
  getWaveGridPalette,
  RIPPLE_LAYER_OFFSET,
  SCROLL_RIPPLE_THROTTLE,
  TOUCH_RIPPLE_THROTTLE,
  WAVE_GRID_QUALITY_PRESETS,
} from './config';
import type { GridPosition, TrailPoint } from './types';
import { WaveGridRenderer } from './WaveGridRenderer';

const props = withDefaults(defineProps<WaveGridBackgroundProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
  settings: createDefaultWaveGridSettings,
});
const emit = defineEmits<BackgroundSceneEmits>();

const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const failureReason = ref<string | null>(null);

let runtime: WaveGridRenderer | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof WAVE_GRID_QUALITY_PRESETS)[number]> | null = null;
let runtimeSettings: WaveGridSettings = props.settings;
let environment: BackgroundEnvironment | null = null;
let resizeObserver: ResizeObserver | null = null;
let contextLost = false;

const trail: TrailPoint[] = [];

let lastPoint: TrailPoint | null = null;
let lastWheelEmission = 0;
let lastTouchEmission = 0;
let lastScrollOffset = 0;
let lastPointerPosition: GridPosition | null = null;

let lastTouchSample: {
  x: number;
  y: number;
  time: number;
} | null = null;

function applyPalette(): void {
  if (!runtime) return;

  runtime.applyPalette(getWaveGridPalette(document.documentElement.dataset.theme));
  runtime.render(performance.now(), trail, runtimeSettings);
}

function syncRuntimeSettings(): void {
  const quality = performanceRuntime?.currentPreset ?? WAVE_GRID_QUALITY_PRESETS[0];

  runtimeSettings = {
    ...props.settings,
    vertexStep: props.settings.vertexStep * quality.vertexStepScale,
    trailLength: Math.min(props.settings.trailLength, quality.trailLengthCap),
    pixelRatioCap: Math.min(props.settings.pixelRatioCap, quality.pixelRatioCap),
  };
}

function addRipple(position: GridPosition, now: number, velocity: number, layers: number): void {
  for (let layer = layers - 1; layer >= 0; layer -= 1) {
    trail.push({
      ...position,
      createdAt: now - layer * RIPPLE_LAYER_OFFSET,
      velocity: velocity * (layer === 0 ? 1 : 0.9),
    });
  }

  trimTrail();
}

function trimTrail(): void {
  while (trail.length > runtimeSettings.trailLength) {
    trail.shift();
  }
}

function removeExpiredTrailPoints(now: number): void {
  let oldestPoint = trail[0];

  while (oldestPoint && now - oldestPoint.createdAt > runtimeSettings.trailLifetime) {
    trail.shift();
    oldestPoint = trail[0];
  }
}

function hasActiveTrail(now: number): boolean {
  removeExpiredTrailPoints(now);
  return trail.length > 0;
}

function resetInteractions(): void {
  trail.length = 0;
  lastPoint = null;
  lastPointerPosition = null;
  lastTouchSample = null;
  lastWheelEmission = 0;
  lastTouchEmission = 0;
}

function renderFrame(now: number): void {
  if (!runtime || contextLost) return;

  removeExpiredTrailPoints(now);
  runtime.render(now, trail, runtimeSettings);

  const qualityChange = performanceRuntime?.recordFrame(now);

  if (qualityChange) {
    applyWaveGridSettings();
    updatePerformanceStats(now, true);
  }

  updatePerformanceStats(now);

  if (!props.animations.idle && trail.length === 0) {
    setAnimationState();
  }
}

function resize(): void {
  if (!runtime) return;

  runtime.resize(runtimeSettings);
  runtime.render(performance.now(), trail, runtimeSettings);
}

function applyWaveGridSettings(): void {
  syncRuntimeSettings();

  if (!runtime) return;

  runtime.applySettings(runtimeSettings);
  trimTrail();
  resize();
  setAnimationState();
}

function updatePointerPosition(clientX: number, clientY: number): GridPosition | null {
  const position = runtime?.projectPointer(clientX, clientY, runtimeSettings) ?? null;

  if (position) {
    lastPointerPosition = position;
  }

  return position;
}

function handlePointerMove(event: PointerEvent): void {
  if (
    !props.active ||
    (!props.animations.cursorMovement && !props.animations.scroll) ||
    event.pointerType === 'touch'
  ) {
    return;
  }

  const position = updatePointerPosition(event.clientX, event.clientY);

  if (!position || !props.animations.cursorMovement || environment?.prefersReducedMotion) return;

  const now = performance.now();
  const distance = lastPoint ? Math.hypot(position.x - lastPoint.x, position.z - lastPoint.z) : 1;
  const elapsed = lastPoint ? Math.max(now - lastPoint.createdAt, 16) : 16;

  if (lastPoint && distance < 0.24 && elapsed < 54) return;

  const point: TrailPoint = {
    ...position,
    createdAt: now,
    velocity: Math.min(1, Math.max(0.18, (distance / elapsed) * 72)),
  };

  trail.push(point);
  trimTrail();

  lastPoint = point;
  setAnimationState();
}

function addPointerRipple(event: PointerEvent): void {
  if (!props.active || (!props.animations.cursorClick && !props.animations.scroll)) return;

  const position = updatePointerPosition(event.clientX, event.clientY);

  if (!position || !props.animations.cursorClick || environment?.prefersReducedMotion) return;

  addRipple(position, performance.now(), 1, CLICK_RIPPLE_LAYERS);

  // Prevent the next pointer movement from creating a velocity spike.
  lastPoint = null;
  setAnimationState();
}

function emitScrollRipple(position: GridPosition, distance: number, now: number): void {
  if (now - lastWheelEmission < SCROLL_RIPPLE_THROTTLE) return;

  const velocity = Math.min(1, Math.max(0.72, distance / 65));

  addRipple(position, now, velocity, DEFAULT_RIPPLE_LAYERS);

  lastWheelEmission = now;
  setAnimationState();
}

function addScrollRipple(event: WheelEvent): void {
  if (!props.active || !props.animations.scroll || environment?.prefersReducedMotion) return;

  const position = updatePointerPosition(event.clientX, event.clientY);

  if (!position) return;

  emitScrollRipple(position, Math.hypot(event.deltaX, event.deltaY), performance.now());
}

function handleScroll(): void {
  const nextScrollOffset = window.scrollY;
  const scrollDistance = Math.abs(nextScrollOffset - lastScrollOffset);

  lastScrollOffset = nextScrollOffset;

  if (
    !props.active ||
    !props.animations.scroll ||
    environment?.prefersReducedMotion ||
    !lastPointerPosition ||
    scrollDistance < 1
  ) {
    return;
  }

  emitScrollRipple(lastPointerPosition, scrollDistance, performance.now());
}

function startTouchRipple(event: TouchEvent): void {
  if (
    !props.active ||
    (!props.animations.cursorMovement && !props.animations.cursorClick && !props.animations.scroll)
  ) {
    return;
  }

  const touch = event.touches[0];

  if (!touch) return;

  lastPointerPosition = updatePointerPosition(touch.clientX, touch.clientY);
  lastTouchSample = {
    x: touch.clientX,
    y: touch.clientY,
    time: performance.now(),
  };
}

function addTouchRipple(event: TouchEvent): void {
  if (!props.active || (!props.animations.cursorMovement && !props.animations.scroll)) return;

  const touch = event.touches[0];

  if (!touch) return;

  const position = updatePointerPosition(touch.clientX, touch.clientY);
  const now = performance.now();
  const previousSample = lastTouchSample;

  lastTouchSample = {
    x: touch.clientX,
    y: touch.clientY,
    time: now,
  };

  if (
    !props.animations.cursorMovement ||
    environment?.prefersReducedMotion ||
    !previousSample ||
    now - lastTouchEmission < TOUCH_RIPPLE_THROTTLE ||
    !position
  ) {
    return;
  }

  const distance = Math.hypot(touch.clientX - previousSample.x, touch.clientY - previousSample.y);
  const elapsed = Math.max(now - previousSample.time, 16);
  const velocity = Math.min(1, Math.max(0.62, (distance / elapsed) * 0.8));

  addRipple(position, now, velocity, DEFAULT_RIPPLE_LAYERS);

  lastTouchEmission = now;
  setAnimationState();
}

function endTouchRipple(): void {
  lastTouchSample = null;
}

function setAnimationState(): void {
  if (!runtime) return;

  const now = performance.now();
  const motionAllowed = environment?.documentVisible !== false && !environment?.prefersReducedMotion && !contextLost;
  const shouldAnimate = props.active && motionAllowed && (props.animations.idle || hasActiveTrail(now));

  runtime.setMotion(props.active && motionAllowed && props.animations.idle, props.active && motionAllowed);
  runtime.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !contextLost) {
    runtime.render(now, trail, runtimeSettings);
  }
}

function updatePerformanceStats(now: number, force = false): void {
  if (!runtime || !performanceRuntime?.shouldPublishStats(now, force)) return;

  const rendererStats = runtime.getPerformanceStats();

  emit('performanceStats', {
    name: 'Wave grid',
    renderer: 'WebGL2 / lines',
    mode: props.performance.mode,
    preset: performanceRuntime.currentPreset.id,
    fps: performanceRuntime.fps,
    frameTime: performanceRuntime.averageFrameTime,
    resolution: `${rendererStats.width} × ${rendererStats.height}`,
    dpr: rendererStats.dpr,
    details: {
      'Trail points': trail.length,
      'Vertex step': runtimeSettings.vertexStep.toFixed(2),
    },
  });
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  performanceRuntime.setMode(props.performance.mode);
  applyWaveGridSettings();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;

  if (!element) return;

  try {
    runtime = WaveGridRenderer.create(
      element,
      WAVE_GRID_MAX_TRAIL_POINTS,
      runtimeSettings,
      getWaveGridPalette(document.documentElement.dataset.theme),
    );

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
  runtime?.dispose(forceContextLoss);
  runtime = null;
}

function onMotionPreferenceChange(): void {
  resetInteractions();
  setAnimationState();
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
  ([active, , cursorMovement, cursorClick, scroll]) => {
    if (active) resize();

    if (!active) performanceRuntime?.resetMeasurements();

    if (!active || (!cursorMovement && !cursorClick && !scroll)) {
      resetInteractions();
    }

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

watch(
  () => [
    props.settings.gridWidth,
    props.settings.gridDepth,
    props.settings.gridSpacing,
    props.settings.vertexStep,
    props.settings.trailLength,
    props.settings.trailLifetime,
    props.settings.pixelRatioCap,
  ],
  applyWaveGridSettings,
  { flush: 'post' },
);

onMounted(() => {
  performanceRuntime = new BackgroundPerformanceRuntime(
    WAVE_GRID_QUALITY_PRESETS,
    props.performance.mode,
  );
  syncRuntimeSettings();

  environment = new BackgroundEnvironment({
    onMotionPreferenceChange,
    onThemeChange: applyPalette,
    onVisibilityChange: setAnimationState,
  });
  resizeObserver = new ResizeObserver(resize);

  if (canvas.value) {
    resizeObserver.observe(canvas.value);
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', addPointerRipple, { passive: true });
  window.addEventListener('wheel', addScrollRipple, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('touchstart', startTouchRipple, { passive: true });
  window.addEventListener('touchmove', addTouchRipple, { passive: true });
  window.addEventListener('touchend', endTouchRipple, { passive: true });
  window.addEventListener('touchcancel', endTouchRipple, { passive: true });
  lastScrollOffset = window.scrollY;

  canvas.value?.addEventListener('webglcontextlost', onContextLost);
  canvas.value?.addEventListener('webglcontextrestored', onContextRestored);

  initialize();
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerdown', addPointerRipple);
  window.removeEventListener('wheel', addScrollRipple);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('touchstart', startTouchRipple);
  window.removeEventListener('touchmove', addTouchRipple);
  window.removeEventListener('touchend', endTouchRipple);
  window.removeEventListener('touchcancel', endTouchRipple);
  canvas.value?.removeEventListener('webglcontextlost', onContextLost);
  canvas.value?.removeEventListener('webglcontextrestored', onContextRestored);

  resizeObserver?.disconnect();
  environment?.dispose();
  environment = null;
  resetInteractions();
  performanceRuntime = null;
  cleanup(true);
});
</script>

<template>
  <div
    class="wave-grid-background"
    :class="{ 'is-fallback': failed }"
    :data-wave-error="failed ? (failureReason ?? 'Unknown WebGL failure') : undefined"
    aria-hidden="true"
  >
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.wave-grid-background {
  position: fixed;
  z-index: -1;
  inset: 0;

  contain: strict;
  overflow: hidden;

  background:
    radial-gradient(circle at 73% 24%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 31rem),
    linear-gradient(to bottom, transparent 60%, var(--background) 98%);

  mask-image: linear-gradient(to bottom, black 0%, black 82%, transparent 100%);

  pointer-events: none;
}

.wave-grid-background::before {
  position: absolute;
  z-index: 1;
  inset: 0;

  background: radial-gradient(
    circle at 38% 39%,
    transparent 8rem,
    color-mix(in srgb, var(--background) 22%, transparent) 36rem
  );

  content: '';
}

canvas {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
}

.is-fallback::after {
  position: absolute;
  inset: 24% -18% -25%;

  background-image:
    linear-gradient(color-mix(in srgb, var(--accent) 30%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--accent) 30%, transparent) 1px, transparent 1px);

  background-size: 3.25rem 3.25rem;

  content: '';
  opacity: 0.7;

  transform: perspective(34rem) rotateX(58deg) scale(1.22);

  transform-origin: center bottom;
}

.is-fallback canvas {
  display: none;
}

@media (max-width: 720px) {
  .wave-grid-background {
    opacity: 0.82;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wave-grid-background {
    opacity: 0.72;
  }
}
</style>
