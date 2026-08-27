<script setup lang="ts">
/**
 * Vue controller for the Living Mesh background.
 *
 * This component bridges Vue props and browser state with the imperative mesh
 * renderer. It observes resize, visibility, pointer and scroll changes, applies
 * performance presets and requests frames only while motion or an interaction
 * transition still needs rendering. Inactive backgrounds remain mounted for a
 * flash-free scene transition, but their animation work is paused.
 *
 * Runtime state and shared services come first, followed by frame scheduling,
 * browser handlers, renderer setup/teardown and watchers. MeshRenderer therefore
 * stays focused on geometry, animation and Canvas2D drawing.
 */

import { onBeforeUnmount, onMounted, watch } from 'vue';

import { createRuntimeBackgroundSettings } from '@/components/backgrounds/settings/registry';
import {
  createDefaultBackgroundAnimationSettings,
  createDefaultBackgroundPerformanceSettings,
} from '@/config/backgrounds';
import { type BackgroundSceneEmits, type BackgroundTheme, type MeshBackgroundProps } from '@/types/background';

import { AnimationFrameScheduler } from '../shared/AnimationFrameScheduler';
import { BackgroundEnvironment } from '../shared/BackgroundEnvironment';
import { BackgroundPerformanceRuntime } from '../shared/BackgroundPerformanceRuntime';
import { BackgroundResizeController } from '../shared/BackgroundResizeController';
import { useBackgroundCanvas } from '../shared/useBackgroundCanvas';
import { useBackgroundPerformanceSettings } from '../shared/useBackgroundPerformanceSettings';
import { MESH_QUALITY_PRESETS } from './config';
import { MeshRenderer } from './MeshRenderer';

const props = withDefaults(defineProps<MeshBackgroundProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
  settingOverrides: () => ({}),
});
const emit = defineEmits<BackgroundSceneEmits>();

const { canvas, failed, failureReason, clearFailure, setFailure } = useBackgroundCanvas();

let runtime: MeshRenderer | null = null;
let frameScheduler: AnimationFrameScheduler | null = null;
let resizeController: BackgroundResizeController | null = null;
let environment: BackgroundEnvironment | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof MESH_QUALITY_PRESETS)[number]> | null = null;

function getRuntimeSettings() {
  const preset = performanceRuntime?.currentPreset ?? MESH_QUALITY_PRESETS[0];
  return createRuntimeBackgroundSettings('mesh', props.settingOverrides, preset.id);
}

function renderFrame(now: number): void {
  if (!runtime) return;

  const motionAllowed = props.active && !environment?.prefersReducedMotion;
  const advanceIdle = motionAllowed && props.animations.idle;
  const needsPointerTransition = runtime.render(now, {
    active: props.active,
    advanceIdle,
    motionAllowed,
  });
  const qualityChange = props.active ? performanceRuntime?.recordFrame(now) : null;

  if (qualityChange) {
    applyMeshSettings();
  }

  if (props.active) updatePerformanceStats(now);

  if (environment?.documentVisible !== false && (advanceIdle || needsPointerTransition)) {
    frameScheduler?.request();
  }
}

function requestRender(): void {
  if (environment?.documentVisible === false || !runtime) return;

  if (frameScheduler?.request()) runtime.resetFrameTime();
}

function resize(): void {
  if (!runtime) return;

  runtime.resize();
  runtime.setScrollOffset(window.scrollY, false);
  requestRender();
}

function handlePointerMove(event: PointerEvent): void {
  if (
    !runtime ||
    !props.active ||
    !props.animations.cursorMovement ||
    environment?.prefersReducedMotion ||
    event.pointerType === 'touch'
  ) {
    return;
  }

  runtime.setPointer(event.clientX, event.clientY);
  requestRender();
}

function handlePointerDown(event: PointerEvent): void {
  if (!runtime || !props.active || !props.animations.cursorClick || environment?.prefersReducedMotion) return;

  runtime.setPointer(event.clientX, event.clientY);
  requestRender();
}

function clearPointer(): void {
  runtime?.clearPointer();
  requestRender();
}

function handlePointerOut(event: PointerEvent): void {
  if (event.relatedTarget === null) clearPointer();
}

function handleScroll(): void {
  if (!runtime) return;

  runtime.setScrollOffset(
    window.scrollY,
    props.active && props.animations.scroll && !environment?.prefersReducedMotion,
  );

  // Keep the hidden, mounted canvas synchronized so activating it can
  // crossfade immediately without showing a stale scroll position.
  requestRender();
}

function handleVisibilityChange(visible: boolean): void {
  if (!visible) frameScheduler?.cancel();
  else requestRender();
}

function handleMotionPreferenceChange(): void {
  runtime?.resetMotion();
  runtime?.resetInteractions();
  requestRender();
}

function handleThemeChange(theme: BackgroundTheme): void {
  runtime?.setTheme(theme);
  requestRender();
}

function updatePerformanceStats(now: number, force = false): void {
  if (!runtime || !performanceRuntime?.shouldPublishStats(now, force)) return;

  const rendererStats = runtime.getPerformanceStats();

  emit(
    'performanceStats',
    performanceRuntime.createStats({ name: 'Living Mesh', renderer: 'Canvas2D' }, rendererStats, {
      Points: rendererStats.pointCount,
      Triangles: rendererStats.triangleCount,
      Edges: rendererStats.edgeCount,
      'Buffered rows': rendererStats.rowCount,
      'Pointer wake': rendererStats.pointerStrength.toFixed(2),
    }),
  );
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  performanceRuntime.setMode(props.performance.mode);
  if (!props.active) return;

  applyMeshSettings();
}

function syncMeshRendererSettings(): void {
  runtime?.setSettings(getRuntimeSettings());
  runtime?.setScrollOffset(window.scrollY, false);
}

function applyMeshSettings(): void {
  syncMeshRendererSettings();
  requestRender();
  updatePerformanceStats(performance.now(), true);
}

function initialize(): void {
  const element = canvas.value;
  if (!element) return;

  try {
    runtime = MeshRenderer.create(element, environment?.theme ?? 'dark', getRuntimeSettings());
    runtime.resize();
    runtime.setScrollOffset(window.scrollY, false);

    clearFailure();
    requestRender();
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
    if (!active || (!cursorMovement && !cursorClick && !scroll)) {
      runtime?.resetInteractions();
    }

    if (!active) performanceRuntime?.resetMeasurements();
    else if (!wasActive) syncMeshRendererSettings();

    runtime?.setScrollOffset(window.scrollY, false);
    requestRender();

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
    if (props.active) applyMeshSettings();
  },
  { deep: true, flush: 'post' },
);

onMounted(() => {
  frameScheduler = new AnimationFrameScheduler(renderFrame);
  performanceRuntime = new BackgroundPerformanceRuntime(MESH_QUALITY_PRESETS, props.performance.mode);
  environment = new BackgroundEnvironment({
    onMotionPreferenceChange: handleMotionPreferenceChange,
    onThemeChange: handleThemeChange,
    onVisibilityChange: handleVisibilityChange,
  });

  initialize();

  resizeController = new BackgroundResizeController(resize, [canvas.value, canvas.value?.parentElement?.parentElement]);

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerout', handlePointerOut, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerup', clearPointer, { passive: true });
  window.addEventListener('pointercancel', clearPointer, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  resizeController?.dispose();
  resizeController = null;

  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerout', handlePointerOut);
  window.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('pointerup', clearPointer);
  window.removeEventListener('pointercancel', clearPointer);
  window.removeEventListener('scroll', handleScroll);

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
    class="mesh-background"
    :class="{ 'is-fallback': failed }"
    :data-mesh-error="failed ? (failureReason ?? 'Unknown Canvas2D failure') : undefined"
    aria-hidden="true"
  >
    <canvas ref="canvas" />

    <div class="mesh-vignette" />
  </div>
</template>

<style scoped>
.mesh-background {
  position: fixed;
  z-index: 0;
  inset: 0;

  width: 100vw;
  height: 100vh;

  contain: strict;
  overflow: hidden;

  pointer-events: none;

  isolation: isolate;
}

.mesh-background::before {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(circle at 76% 14%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 30rem),
    radial-gradient(circle at 14% 72%, color-mix(in srgb, var(--primary) 5%, transparent), transparent 34rem);

  content: '';

  opacity: 0.8;

  pointer-events: none;
}

.mesh-background canvas {
  position: absolute;
  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  pointer-events: none;
}

.mesh-background.is-fallback canvas {
  display: none;
}

.mesh-vignette {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--background) 24%, transparent),
    transparent 22% 78%,
    color-mix(in srgb, var(--background) 18%, transparent)
  );

  pointer-events: none;
}

@media (max-width: 620px) {
  .mesh-background {
    opacity: 0.76;
  }
}
</style>
