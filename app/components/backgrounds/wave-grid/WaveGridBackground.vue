<script setup lang="ts">
/**
 * Interactive WebGL background with a perspective grid,
 * independent idle, cursor-movement, cursor-click and scroll channels, and
 * temporary ripples triggered by enabled interactions.
 *
 * Rendering pauses while inactive, hidden or static. WebGL failure
 * falls back to CSS so the visual never becomes a page dependency.
 */

import * as THREE from 'three';

import {
  createDefaultBackgroundAnimationSettings,
  createDefaultWaveGridSettings,
  WAVE_GRID_MAX_TRAIL_POINTS,
  type WaveGridBackgroundProps,
} from '@/types/background';
import { createWaveGridGeometry } from './geometry';
import { createWaveGridVertexShader, waveGridFragmentShader } from './shaders';

interface TrailPoint {
  x: number;
  z: number;
  createdAt: number;
  velocity: number;
}

interface GridPosition {
  x: number;
  z: number;
}

const props = withDefaults(defineProps<WaveGridBackgroundProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  settings: createDefaultWaveGridSettings,
});

// Shader capacity is fixed so trail-length changes do not require recompilation.
const MAX_TRAIL_POINTS = WAVE_GRID_MAX_TRAIL_POINTS;

// Minimum time between scroll-generated ripples.
const SCROLL_RIPPLE_THROTTLE = 80;

// Minimum time between touch-movement ripples.
const TOUCH_RIPPLE_THROTTLE = 80;

// Time offset between layered ripple points.
const RIPPLE_LAYER_OFFSET = 55;

// Number of points used for a deliberate click/tap ripple.
const CLICK_RIPPLE_LAYERS = 3;

// Number of points used for passive scroll/touch ripples.
const DEFAULT_RIPPLE_LAYERS = 2;

const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const failureReason = ref<string | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let material: THREE.ShaderMaterial | null = null;
let grid: THREE.LineSegments | null = null;
let trailTexture: THREE.DataTexture | null = null;

let reducedMotion: MediaQueryList | null = null;
let colorScheme: MediaQueryList | null = null;
let resizeObserver: ResizeObserver | null = null;
let contextLost = false;

const trail: TrailPoint[] = [];
const trailData = new Uint8Array(MAX_TRAIL_POINTS * 4);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const intersection = new THREE.Vector3();

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

const vertexShader = createWaveGridVertexShader(MAX_TRAIL_POINTS);

function getPalette(): {
  color: THREE.Color;
  waveColor: THREE.Color;
  opacity: number;
} {
  if (document.documentElement.dataset.theme === 'light') {
    return {
      color: new THREE.Color('#37628f'),
      waveColor: new THREE.Color('#075fd7'),
      opacity: 0.72,
    };
  }

  return {
    color: new THREE.Color('#38679e'),
    waveColor: new THREE.Color('#72aaff'),
    opacity: 0.82,
  };
}

function applyPalette(): void {
  if (!material) return;

  const palette = getPalette();

  material.uniforms.uColor?.value.copy(palette.color);

  material.uniforms.uWaveColor?.value.copy(palette.waveColor);

  if (material.uniforms.uOpacity) {
    material.uniforms.uOpacity.value = palette.opacity;
  }
}

function addRipple(position: GridPosition, now: number, velocity: number, layers: number): void {
  for (let layer = layers - 1; layer >= 0; layer -= 1) {
    trail.push({
      ...position,
      createdAt: now - layer * RIPPLE_LAYER_OFFSET,
      velocity: velocity * (layer === 0 ? 1 : 0.9),
    });
  }

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

function updateTrailTexture(now: number): void {
  if (!trailTexture || !material) {
    return;
  }

  removeExpiredTrailPoints(now);

  trailData.fill(0);

  trail.forEach((point, index) => {
    const offset = index * 4;

    // X position.
    trailData[offset] = Math.round(THREE.MathUtils.clamp(point.x / props.settings.gridWidth + 0.5, 0, 1) * 255);

    // Z position.
    trailData[offset + 1] = Math.round(THREE.MathUtils.clamp(point.z / props.settings.gridDepth + 0.5, 0, 1) * 255);

    // Normalized age.
    trailData[offset + 2] = Math.round(
      THREE.MathUtils.clamp((now - point.createdAt) / props.settings.trailLifetime, 0, 1) * 255,
    );

    // Velocity / ripple strength.
    trailData[offset + 3] = Math.round(THREE.MathUtils.clamp(point.velocity, 0, 1) * 255);
  });

  trailTexture.needsUpdate = true;

  if (material.uniforms.uTrailCount) {
    material.uniforms.uTrailCount.value = trail.length;
  }
}

function hasActiveTrail(now: number): boolean {
  removeExpiredTrailPoints(now);

  return trail.length > 0;
}

function renderFrame(now: number): void {
  if (!renderer || !scene || !camera || !material || contextLost) {
    return;
  }

  updateTrailTexture(now);

  if (material.uniforms.uTime) {
    material.uniforms.uTime.value = now / 1_000;
  }

  renderer.render(scene, camera);

  if (!props.animations.idle && !hasActiveTrail(now)) {
    setAnimationState();
  }
}

function resize(): void {
  const element = canvas.value;

  if (!element || !renderer || !scene || !camera) {
    return;
  }

  const width = Math.max(element.clientWidth, 1);

  const height = Math.max(element.clientHeight, 1);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, props.settings.pixelRatioCap));

  renderer.setSize(width, height, false);

  camera.aspect = width / height;

  const isMobile = width < 720;

  camera.fov = isMobile ? 52 : 42;

  camera.position.set(0, isMobile ? 7.8 : 6.7, isMobile ? 10.5 : 9.2);

  camera.lookAt(0, 0, -5.2);

  camera.updateProjectionMatrix();

  if (reducedMotion?.matches) {
    renderer.render(scene, camera);
  }
}

function applyWaveGridSettings(): void {
  if (!grid || !material) return;

  const nextGeometry = createWaveGridGeometry(props.settings);

  grid.geometry.dispose();
  grid.geometry = nextGeometry;

  const gridSize = material.uniforms.uGridSize?.value;

  if (gridSize instanceof THREE.Vector2) {
    gridSize.set(props.settings.gridWidth, props.settings.gridDepth);
  }

  while (trail.length > props.settings.trailLength) {
    trail.shift();
  }

  resize();
  setAnimationState();
}

function projectPointer(clientX: number, clientY: number): GridPosition | null {
  if (!camera || !canvas.value) {
    return null;
  }

  const rect = canvas.value.getBoundingClientRect();

  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    return null;
  }

  pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));

  raycaster.setFromCamera(pointer, camera);

  if (!raycaster.ray.intersectPlane(groundPlane, intersection)) {
    return null;
  }

  return {
    x: THREE.MathUtils.clamp(intersection.x, -props.settings.gridWidth / 2, props.settings.gridWidth / 2),
    z: THREE.MathUtils.clamp(intersection.z, -props.settings.gridDepth / 2, props.settings.gridDepth / 2),
  };
}

function updatePointerPosition(clientX: number, clientY: number): GridPosition | null {
  const position = projectPointer(clientX, clientY);

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

  if (!position) return;

  if (!props.animations.cursorMovement || reducedMotion?.matches) return;

  const now = performance.now();

  const distance = lastPoint ? Math.hypot(position.x - lastPoint.x, position.z - lastPoint.z) : 1;

  const elapsed = lastPoint ? Math.max(now - lastPoint.createdAt, 16) : 16;

  if (lastPoint && distance < 0.24 && elapsed < 54) {
    return;
  }

  const velocity = THREE.MathUtils.clamp((distance / elapsed) * 72, 0.18, 1);

  const point: TrailPoint = {
    ...position,
    createdAt: now,
    velocity,
  };

  trail.push(point);

  if (trail.length > props.settings.trailLength) {
    trail.shift();
  }

  lastPoint = point;
  setAnimationState();
}

function addPointerRipple(event: PointerEvent): void {
  if (!props.active || (!props.animations.cursorClick && !props.animations.scroll)) {
    return;
  }

  const position = updatePointerPosition(event.clientX, event.clientY);

  if (!position) return;

  if (!props.animations.cursorClick || reducedMotion?.matches) return;

  // Clicks/taps use more layers, making the ripple feel larger and stronger.
  addRipple(position, performance.now(), 1, CLICK_RIPPLE_LAYERS);

  // Prevent the next pointer movement from creating a velocity spike.
  lastPoint = null;
  setAnimationState();
}

function emitScrollRipple(position: GridPosition, distance: number, now: number): void {
  if (now - lastWheelEmission < SCROLL_RIPPLE_THROTTLE) return;

  const velocity = THREE.MathUtils.clamp(distance / 65, 0.72, 1);

  addRipple(position, now, velocity, DEFAULT_RIPPLE_LAYERS);

  lastWheelEmission = now;
  setAnimationState();
}

function addScrollRipple(event: WheelEvent): void {
  if (!props.active || !props.animations.scroll || reducedMotion?.matches) {
    return;
  }

  const now = performance.now();
  const position = updatePointerPosition(event.clientX, event.clientY);

  if (!position) return;

  emitScrollRipple(position, Math.hypot(event.deltaX, event.deltaY), now);
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

  const velocity = THREE.MathUtils.clamp((distance / elapsed) * 0.8, 0.62, 1);

  addRipple(position, now, velocity, DEFAULT_RIPPLE_LAYERS);

  lastTouchEmission = now;
  setAnimationState();
}

function endTouchRipple(): void {
  lastTouchSample = null;
}

function setAnimationState(): void {
  if (!renderer || !scene || !camera || !material) {
    return;
  }

  const now = performance.now();
  const motionAllowed = !document.hidden && !reducedMotion?.matches && !contextLost;

  updateTrailTexture(now);

  const shouldAnimate = props.active && motionAllowed && (props.animations.idle || hasActiveTrail(now));

  if (material.uniforms.uIdleMotion) {
    material.uniforms.uIdleMotion.value = motionAllowed && props.animations.idle ? 1 : 0;
  }

  if (material.uniforms.uInteractionMotion) {
    material.uniforms.uInteractionMotion.value = motionAllowed ? 1 : 0;
  }

  renderer.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !contextLost) {
    renderer.render(scene, camera);
  }
}

function initialize(): void {
  const element = canvas.value;

  if (!element) return;

  try {
    const context = element.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    if (!context) {
      throw new Error('WebGL2 is unavailable');
    }

    renderer = new THREE.WebGLRenderer({
      canvas: element,
      context,
      alpha: true,
      antialias: true,
    });

    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

    trailTexture = new THREE.DataTexture(trailData, MAX_TRAIL_POINTS, 1, THREE.RGBAFormat, THREE.UnsignedByteType);

    trailTexture.minFilter = THREE.NearestFilter;

    trailTexture.magFilter = THREE.NearestFilter;

    trailTexture.generateMipmaps = false;

    trailTexture.needsUpdate = true;

    const palette = getPalette();

    material = new THREE.ShaderMaterial({
      uniforms: {
        uTrail: {
          value: trailTexture,
        },
        uTrailCount: {
          value: 0,
        },
        uTime: {
          value: 0,
        },
        uIdleMotion: {
          value: reducedMotion?.matches || !props.animations.idle ? 0 : 1,
        },
        uInteractionMotion: {
          value: reducedMotion?.matches ? 0 : 1,
        },
        uGridSize: {
          value: new THREE.Vector2(props.settings.gridWidth, props.settings.gridDepth),
        },
        uColor: {
          value: palette.color,
        },
        uWaveColor: {
          value: palette.waveColor,
        },
        uOpacity: {
          value: palette.opacity,
        },
      },

      vertexShader,
      fragmentShader: waveGridFragmentShader,

      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    grid = new THREE.LineSegments(createWaveGridGeometry(props.settings), material);

    scene.add(grid);

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
  renderer?.setAnimationLoop(null);

  grid?.geometry.dispose();
  material?.dispose();
  trailTexture?.dispose();

  scene?.clear();

  if (renderer) {
    renderer.dispose();

    if (forceContextLoss) {
      renderer.forceContextLoss();
    }
  }

  renderer = null;
  scene = null;
  camera = null;
  material = null;
  grid = null;
  trailTexture = null;
}

function onMotionPreferenceChange(): void {
  trail.length = 0;
  lastPoint = null;
  lastPointerPosition = null;
  setAnimationState();
}

function onContextLost(event: Event): void {
  event.preventDefault();

  contextLost = true;
  failed.value = true;
  failureReason.value = 'WebGL context lost';

  renderer?.setAnimationLoop(null);
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

    if (!cursorMovement && !cursorClick && !scroll) {
      trail.length = 0;
      lastPoint = null;
      lastPointerPosition = null;
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

  // Desktop pointer trail.
  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  // Clicks, taps and stylus presses.
  window.addEventListener('pointerdown', addPointerRipple, { passive: true });

  // Mouse wheel and trackpad scrolling.
  window.addEventListener('wheel', addScrollRipple, { passive: true });

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Touch movement.
  window.addEventListener('touchstart', startTouchRipple, { passive: true });

  window.addEventListener('touchmove', addTouchRipple, { passive: true });

  window.addEventListener('touchend', endTouchRipple, { passive: true });

  window.addEventListener('touchcancel', endTouchRipple, { passive: true });

  document.addEventListener('visibilitychange', setAnimationState);

  lastScrollOffset = window.scrollY;

  reducedMotion.addEventListener('change', onMotionPreferenceChange);

  colorScheme.addEventListener('change', applyPalette);

  window.addEventListener('portfolio-theme-change', applyPalette);

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

  document.removeEventListener('visibilitychange', setAnimationState);

  reducedMotion?.removeEventListener('change', onMotionPreferenceChange);

  colorScheme?.removeEventListener('change', applyPalette);

  window.removeEventListener('portfolio-theme-change', applyPalette);

  canvas.value?.removeEventListener('webglcontextlost', onContextLost);

  canvas.value?.removeEventListener('webglcontextrestored', onContextRestored);

  resizeObserver?.disconnect();

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
    <canvas ref="canvas"></canvas>
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
