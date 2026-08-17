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
  createDefaultWaveGridSettings,
  WAVE_GRID_MAX_TRAIL_POINTS,
  type WaveGridBackgroundProps,
} from '@/types/background';

import {
  CLICK_RIPPLE_LAYERS,
  DEFAULT_RIPPLE_LAYERS,
  getWaveGridPalette,
  RIPPLE_LAYER_OFFSET,
  SCROLL_RIPPLE_THROTTLE,
  TOUCH_RIPPLE_THROTTLE,
} from './config';
import type { GridPosition, TrailPoint } from './types';
import { WaveGridRenderer } from './WaveGridRenderer';

const props = withDefaults(defineProps<WaveGridBackgroundProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  settings: createDefaultWaveGridSettings,
});

const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const failureReason = ref<string | null>(null);

let runtime: WaveGridRenderer | null = null;
let reducedMotion: MediaQueryList | null = null;
let colorScheme: MediaQueryList | null = null;
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
  runtime.render(performance.now(), trail, props.settings);
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
  while (trail.length > props.settings.trailLength) {
    trail.shift();
  }
}

function removeExpiredTrailPoints(now: number): void {
  let oldestPoint = trail[0];

  while (oldestPoint && now - oldestPoint.createdAt > props.settings.trailLifetime) {
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
  runtime.render(now, trail, props.settings);

  if (!props.animations.idle && trail.length === 0) {
    setAnimationState();
  }
}

function resize(): void {
  if (!runtime) return;

  runtime.resize(props.settings);
  runtime.render(performance.now(), trail, props.settings);
}

function applyWaveGridSettings(): void {
  if (!runtime) return;

  runtime.applySettings(props.settings);
  trimTrail();
  resize();
  setAnimationState();
}

function updatePointerPosition(clientX: number, clientY: number): GridPosition | null {
  const position = runtime?.projectPointer(clientX, clientY, props.settings) ?? null;

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

  if (!position || !props.animations.cursorMovement || reducedMotion?.matches) return;

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

  if (!position || !props.animations.cursorClick || reducedMotion?.matches) return;

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
  if (!props.active || !props.animations.scroll || reducedMotion?.matches) return;

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
    reducedMotion?.matches ||
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
    reducedMotion?.matches ||
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
  const motionAllowed = !document.hidden && !reducedMotion?.matches && !contextLost;
  const shouldAnimate = props.active && motionAllowed && (props.animations.idle || hasActiveTrail(now));

  runtime.setMotion(props.active && motionAllowed && props.animations.idle, props.active && motionAllowed);
  runtime.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !contextLost) {
    runtime.render(now, trail, props.settings);
  }
}

function initialize(): void {
  const element = canvas.value;

  if (!element) return;

  try {
    runtime = WaveGridRenderer.create(
      element,
      WAVE_GRID_MAX_TRAIL_POINTS,
      props.settings,
      getWaveGridPalette(document.documentElement.dataset.theme),
    );

    failed.value = false;
    failureReason.value = null;

    resize();
    setAnimationState();
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

    if (!active || (!cursorMovement && !cursorClick && !scroll)) {
      resetInteractions();
    }

    setAnimationState();
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
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  colorScheme = window.matchMedia('(prefers-color-scheme: light)');
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
  window.addEventListener('portfolio-theme-change', applyPalette);
  document.addEventListener('visibilitychange', setAnimationState);

  lastScrollOffset = window.scrollY;

  reducedMotion.addEventListener('change', onMotionPreferenceChange);
  colorScheme.addEventListener('change', applyPalette);
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
  window.removeEventListener('portfolio-theme-change', applyPalette);
  document.removeEventListener('visibilitychange', setAnimationState);

  reducedMotion?.removeEventListener('change', onMotionPreferenceChange);
  colorScheme?.removeEventListener('change', applyPalette);
  canvas.value?.removeEventListener('webglcontextlost', onContextLost);
  canvas.value?.removeEventListener('webglcontextrestored', onContextRestored);

  resizeObserver?.disconnect();
  resetInteractions();
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
