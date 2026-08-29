<script setup lang="ts">
/**
 * Vue controller for the Wave Grid background.
 *
 * This component translates pointer, touch, click and scroll events into a
 * short-lived trail of wave points. The trail's bounded lifetime is kept in a
 * DOM-free domain model, while this controller applies reactive setting overrides,
 * resize/context recovery, adaptive quality and the animation-frame lifecycle.
 * WaveRenderer receives already-normalized settings and trail data and remains
 * responsible only for the Three.js scene and GPU resources.
 *
 * The file is organized in execution order: state, event
 * handlers, render control, runtime setup/teardown and prop watchers. This keeps
 * the interaction policy visible in one place while the shader implementation
 * stays independent from Vue and browser listeners.
 */

import { onBeforeUnmount, onMounted, watch } from 'vue';

import { createRuntimeBackgroundSettings } from '@/config/backgrounds/settingsRegistry';
import { WAVE_MAX_TRAIL_POINTS } from '@/config/backgrounds/definitions/wave';
import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/domain/backgrounds/preferences';
import {
  WaveInteractionTrail,
  type WavePosition,
  type WaveTrailPoint,
} from '@/domain/backgrounds/waveInteractionTrail';
import {
  type BackgroundSceneEmits,
  type BackgroundTheme,
  type WaveBackgroundProps,
  type WaveSettings,
} from '@/types/background';

import { BackgroundEnvironment } from '../shared/BackgroundEnvironment';
import { BackgroundPerformanceRuntime } from '../shared/BackgroundPerformanceRuntime';
import { BackgroundResizeController } from '../shared/BackgroundResizeController';
import { useBackgroundCanvas } from '../shared/useBackgroundCanvas';
import { useBackgroundPerformanceSettings } from '../shared/useBackgroundPerformanceSettings';
import { WebGLContextLifecycle } from '../shared/WebGLContextLifecycle';
import {
  CLICK_RIPPLE_LAYERS,
  DEFAULT_RIPPLE_LAYERS,
  RIPPLE_LAYER_OFFSET,
  SCROLL_RIPPLE_THROTTLE,
  TOUCH_RIPPLE_THROTTLE,
  WAVE_QUALITY_PRESETS,
} from './config';
import { WaveRenderer } from './WaveRenderer';

const props = withDefaults(defineProps<WaveBackgroundProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
  settingOverrides: () => ({}),
});
const emit = defineEmits<BackgroundSceneEmits>();

const { canvas, failed, failureReason, clearFailure, setFailure } = useBackgroundCanvas();

let runtime: WaveRenderer | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof WAVE_QUALITY_PRESETS)[number]> | null = null;
let runtimeSettings: WaveSettings = createRuntimeBackgroundSettings('wave', props.settingOverrides, 'high');
let environment: BackgroundEnvironment | null = null;
let resizeController: BackgroundResizeController | null = null;
let webglContext: WebGLContextLifecycle | null = null;

const interactionTrail = new WaveInteractionTrail();

let lastPoint: WaveTrailPoint | null = null;
let lastWheelEmission = 0;
let lastTouchEmission = 0;
let lastScrollOffset = 0;
let lastPointerPosition: WavePosition | null = null;

let lastTouchSample: {
  x: number;
  y: number;
  time: number;
} | null = null;

function applyTheme(theme: BackgroundTheme): void {
  if (!runtime) return;

  runtime.setTheme(theme);
  runtime.render(performance.now(), interactionTrail.points, runtimeSettings);
}

function syncRuntimeSettings(): void {
  const quality = performanceRuntime?.currentPreset ?? WAVE_QUALITY_PRESETS[0];
  runtimeSettings = createRuntimeBackgroundSettings('wave', props.settingOverrides, quality.id);
}

function addRipple(position: WavePosition, now: number, velocity: number, layers: number): void {
  interactionTrail.addRipple(position, now, velocity, layers, RIPPLE_LAYER_OFFSET, runtimeSettings.trailLength);
}

function resetInteractions(): void {
  interactionTrail.clear();
  lastPoint = null;
  lastPointerPosition = null;
  lastTouchSample = null;
  lastWheelEmission = 0;
  lastTouchEmission = 0;
}

function renderFrame(now: number): void {
  if (!runtime || webglContext?.lost) return;

  interactionTrail.removeExpired(now, runtimeSettings.trailLifetime);
  runtime.render(now, interactionTrail.points, runtimeSettings);

  const qualityChange = performanceRuntime?.recordFrame(now);

  if (qualityChange) {
    applyWaveSettings();
    updatePerformanceStats(now, true);
  }

  updatePerformanceStats(now);

  if (!props.animations.idle && interactionTrail.length === 0) {
    setAnimationState();
  }
}

function resize(): void {
  if (!runtime) return;

  runtime.resize(runtimeSettings);
  runtime.render(performance.now(), interactionTrail.points, runtimeSettings);
}

function syncWaveRendererSettings(): boolean {
  syncRuntimeSettings();

  if (!runtime) return false;

  const resizeRequired = runtime.applySettings(runtimeSettings);
  interactionTrail.trim(runtimeSettings.trailLength);

  return resizeRequired;
}

function applyWaveSettings(): void {
  const resizeRequired = syncWaveRendererSettings();

  if (resizeRequired) resize();
  else setAnimationState();
}

function updatePointerPosition(clientX: number, clientY: number): WavePosition | null {
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

  const point: WaveTrailPoint = {
    ...position,
    createdAt: now,
    velocity: Math.min(1, Math.max(0.18, (distance / elapsed) * 72)),
  };

  interactionTrail.add(point, runtimeSettings.trailLength);

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

function emitScrollRipple(position: WavePosition, distance: number, now: number): void {
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
  const motionAllowed =
    environment?.documentVisible !== false && !environment?.prefersReducedMotion && !webglContext?.lost;
  const shouldAnimate =
    props.active &&
    motionAllowed &&
    (props.animations.idle || interactionTrail.isActive(now, runtimeSettings.trailLifetime));

  runtime.setMotion(props.active && motionAllowed && props.animations.idle, props.active && motionAllowed);
  runtime.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !webglContext?.lost) {
    runtime.render(now, interactionTrail.points, runtimeSettings);
  }
}

function updatePerformanceStats(now: number, force = false): void {
  if (!runtime || !performanceRuntime?.shouldPublishStats(now, force)) return;

  const rendererStats = runtime.getPerformanceStats();

  emit(
    'performanceStats',
    performanceRuntime.createStats({ name: 'Wave Grid', renderer: 'WebGL2 / lines' }, rendererStats, {
      'Trail points': interactionTrail.length,
      'Vertex step': runtimeSettings.vertexStep.toFixed(2),
    }),
  );
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  performanceRuntime.setMode(props.performance.mode);
  if (!props.active) return;

  applyWaveSettings();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;

  if (!element) return;

  try {
    runtime = WaveRenderer.create(element, WAVE_MAX_TRAIL_POINTS, runtimeSettings, environment?.theme ?? 'dark');

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
  runtime?.dispose(forceContextLoss);
  runtime = null;
}

function onMotionPreferenceChange(): void {
  resetInteractions();
  setAnimationState();
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
  ([active, , cursorMovement, cursorClick, scroll], [wasActive]) => {
    if (active && !wasActive) {
      syncWaveRendererSettings();
      resize();
    }

    if (!active) performanceRuntime?.resetMeasurements();

    if (!active || (!cursorMovement && !cursorClick && !scroll)) {
      resetInteractions();
    }

    setAnimationState();
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
    if (props.active) applyWaveSettings();
  },
  { deep: true, flush: 'post' },
);

onMounted(() => {
  performanceRuntime = new BackgroundPerformanceRuntime(WAVE_QUALITY_PRESETS, props.performance.mode);
  syncRuntimeSettings();

  environment = new BackgroundEnvironment({
    onMotionPreferenceChange,
    onThemeChange: applyTheme,
    onVisibilityChange: setAnimationState,
  });
  resizeController = new BackgroundResizeController(resize, [canvas.value]);

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', addPointerRipple, { passive: true });
  window.addEventListener('wheel', addScrollRipple, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('touchstart', startTouchRipple, { passive: true });
  window.addEventListener('touchmove', addTouchRipple, { passive: true });
  window.addEventListener('touchend', endTouchRipple, { passive: true });
  window.addEventListener('touchcancel', endTouchRipple, { passive: true });
  lastScrollOffset = window.scrollY;

  if (canvas.value) {
    webglContext = new WebGLContextLifecycle(canvas.value, {
      onLost: onContextLost,
      onRestored: onContextRestored,
    });
  }

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
  webglContext?.dispose();
  webglContext = null;
  resizeController?.dispose();
  resizeController = null;
  environment?.dispose();
  environment = null;
  resetInteractions();
  performanceRuntime = null;
  cleanup(true);
});
</script>

<template>
  <div
    class="wave-background"
    :class="{ 'is-fallback': failed }"
    :data-wave-error="failed ? (failureReason ?? 'Unknown WebGL failure') : undefined"
    aria-hidden="true"
  >
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.wave-background {
  position: fixed;
  z-index: -1;
  inset: 0;

  contain: strict;
  overflow: hidden;

  background:
    radial-gradient(circle at 73% 24%, color-mix(in srgb, var(--primary) 12%, transparent), transparent 31rem),
    linear-gradient(to bottom, transparent 60%, var(--background) 98%);

  mask-image: linear-gradient(to bottom, black 0%, black 82%, transparent 100%);

  pointer-events: none;
}

.wave-background::before {
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
    linear-gradient(color-mix(in srgb, var(--primary) 30%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--primary) 30%, transparent) 1px, transparent 1px);

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
  .wave-background {
    opacity: 0.82;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wave-background {
    opacity: 0.72;
  }
}
</style>
