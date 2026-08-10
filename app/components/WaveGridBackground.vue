<script setup lang="ts">
import * as THREE from 'three';

/**
 * Interactive WebGL background with a perspective grid,
 * subtle idle motion, and temporary ripples triggered by
 * pointer movement, clicks, scrolling, and touch input.
 *
 * The component respects reduced-motion preferences,
 * adapts to light/dark themes, pauses when inactive or
 * hidden, and falls back to a CSS grid if WebGL fails.
 */

interface TrailPoint {
  x: number;
  z: number;
  createdAt: number;
  velocity: number;
}

const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: true,
});

// Maximum number of active trail/ripple points.
const TRAIL_LENGTH = 32;

// Lifetime of each trail point in milliseconds.
const TRAIL_LIFETIME = 2_300;

// Width of the grid in world units.
const GRID_WIDTH = 34;

// Depth of the grid in world units.
const GRID_DEPTH = 32;

// Distance between neighboring grid lines.
const GRID_SPACING = 0.8;

// Distance between geometry vertices along each grid line.
const VERTEX_STEP = 0.32;

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

// Maximum device pixel ratio used for rendering.
const MAX_PIXEL_RATIO = 1.5;

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
const trailData = new Uint8Array(TRAIL_LENGTH * 4);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const intersection = new THREE.Vector3();

let lastPoint: TrailPoint | null = null;
let lastWheelEmission = 0;
let lastTouchEmission = 0;

let lastTouchSample: {
  x: number;
  y: number;
  time: number;
} | null = null;

const vertexShader = /* glsl */ `
  #define TRAIL_LENGTH ${TRAIL_LENGTH}

  uniform sampler2D uTrail;
  uniform float uTrailCount;
  uniform float uTime;
  uniform float uMotion;
  uniform vec2 uGridSize;

  attribute float aLineStrength;

  varying float vLineStrength;
  varying float vWave;
  varying float vIdle;
  varying float vDepth;

  void main() {
    vec3 displaced = position;
    float wave = 0.0;

    for (int index = 0; index < TRAIL_LENGTH; index++) {
      if (float(index) >= uTrailCount) break;

      vec4 point = texture2D(
        uTrail,
        vec2(
          (float(index) + 0.5) /
          float(TRAIL_LENGTH),
          0.5
        )
      );

      vec2 origin =
        (point.rg - 0.5) *
        uGridSize;

      float age = point.b;
      float velocity = point.a;

      float distanceToPoint =
        distance(
          position.xz,
          origin
        );

      float radius =
        0.18 +
        age * 5.2;

      float width =
        0.12 +
        age * 0.18;

      float ring =
        exp(
          -pow(
            (distanceToPoint - radius) /
            width,
            2.0
          )
        );

      float wake =
        exp(
          -distanceToPoint * 1.8
        ) *
        exp(
          -age * 5.0
        );

      wave +=
        (
          ring * 0.3 +
          wake * 0.1
        ) *
        (
          0.28 +
          velocity * 0.72
        ) *
        (1.0 - age);
    }

    // Subtle ambient motion keeps the grid alive when idle.
    vec2 idleCenter = vec2(
      sin(uTime * 0.22) * 6.0,
      cos(uTime * 0.18) * 5.0 - 3.0
    );

    float idleDistance =
      distance(
        position.xz,
        idleCenter
      );

    float ambientField =
      sin(
        position.x * 0.36 +
        uTime * 0.72
      ) *
      cos(
        position.z * 0.3 -
        uTime * 0.58
      ) *
      0.095;

    float ambientRing =
      sin(
        idleDistance * 0.92 -
        uTime * 1.1
      ) *
      exp(
        -idleDistance * 0.035
      ) *
      0.05;

    float idleSweep =
      pow(
        0.5 +
        0.5 *
        sin(
          position.z * 0.62 -
          uTime * 0.95
        ),
        14.0
      );

    float ambient =
      ambientField +
      ambientRing +
      idleSweep * 0.045;

    displaced.y +=
      (
        min(wave, 1.15) * 0.38 +
        ambient
      ) *
      uMotion;

    vLineStrength = aLineStrength;
    vWave = min(wave, 1.0) * uMotion;

    vIdle =
      max(
        smoothstep(
          0.025,
          0.13,
          abs(ambient)
        ),
        idleSweep * 0.9
      ) *
      uMotion;

    vDepth =
      smoothstep(
        -16.0,
        10.0,
        position.z
      );

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uWaveColor;
  uniform float uOpacity;

  varying float vLineStrength;
  varying float vWave;
  varying float vIdle;
  varying float vDepth;

  void main() {
    float highlight =
      max(
        smoothstep(0.02, 0.52, vWave),
        vIdle * 0.48
      );

    vec3 color =
      mix(
        uColor,
        uWaveColor,
        highlight
      );

    float waveGlow =
      smoothstep(
        0.0,
        0.58,
        vWave
      ) *
      0.42;

    float idleGlow =
      vIdle * 0.23;

    float alpha =
      (
        0.2 +
        vLineStrength * 0.3 +
        idleGlow +
        waveGlow
      ) *
      uOpacity *
      vDepth;

    gl_FragColor =
      vec4(color, alpha);
  }
`;

function appendSegment(
  positions: number[],
  strengths: number[],
  start: [number, number, number],
  end: [number, number, number],
  strength: number,
): void {
  positions.push(...start, ...end);
  strengths.push(strength, strength);
}

function createGridGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const strengths: number[] = [];

  const xLines = Math.floor(GRID_WIDTH / GRID_SPACING);

  const zLines = Math.floor(GRID_DEPTH / GRID_SPACING);

  const xSegments = Math.ceil(GRID_WIDTH / VERTEX_STEP);

  const zSegments = Math.ceil(GRID_DEPTH / VERTEX_STEP);

  // Horizontal lines.
  for (let zIndex = 0; zIndex <= zLines; zIndex += 1) {
    const z = -GRID_DEPTH / 2 + (zIndex / zLines) * GRID_DEPTH;

    // Every fifth line is slightly brighter.
    const strength = zIndex % 5 === 0 ? 1 : 0.42;

    for (let segment = 0; segment < xSegments; segment += 1) {
      const xStart = -GRID_WIDTH / 2 + (segment / xSegments) * GRID_WIDTH;

      const xEnd = -GRID_WIDTH / 2 + ((segment + 1) / xSegments) * GRID_WIDTH;

      appendSegment(positions, strengths, [xStart, 0, z], [xEnd, 0, z], strength);
    }
  }

  // Vertical lines.
  for (let xIndex = 0; xIndex <= xLines; xIndex += 1) {
    const x = -GRID_WIDTH / 2 + (xIndex / xLines) * GRID_WIDTH;

    const strength = xIndex % 5 === 0 ? 1 : 0.42;

    for (let segment = 0; segment < zSegments; segment += 1) {
      const zStart = -GRID_DEPTH / 2 + (segment / zSegments) * GRID_DEPTH;

      const zEnd = -GRID_DEPTH / 2 + ((segment + 1) / zSegments) * GRID_DEPTH;

      appendSegment(positions, strengths, [x, 0, zStart], [x, 0, zEnd], strength);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  geometry.setAttribute('aLineStrength', new THREE.Float32BufferAttribute(strengths, 1));

  return geometry;
}

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

function addRipple(position: { x: number; z: number }, now: number, velocity: number, layers: number): void {
  for (let layer = layers - 1; layer >= 0; layer -= 1) {
    trail.push({
      ...position,
      createdAt: now - layer * RIPPLE_LAYER_OFFSET,
      velocity: velocity * (layer === 0 ? 1 : 0.9),
    });
  }

  while (trail.length > TRAIL_LENGTH) {
    trail.shift();
  }
}

function updateTrailTexture(now: number): void {
  if (!trailTexture || !material) {
    return;
  }

  // Remove expired points before uploading the texture.
  let oldestPoint = trail[0];

  while (oldestPoint && now - oldestPoint.createdAt > TRAIL_LIFETIME) {
    trail.shift();
    oldestPoint = trail[0];
  }

  trailData.fill(0);

  trail.forEach((point, index) => {
    const offset = index * 4;

    // X position.
    trailData[offset] = Math.round(THREE.MathUtils.clamp(point.x / GRID_WIDTH + 0.5, 0, 1) * 255);

    // Z position.
    trailData[offset + 1] = Math.round(THREE.MathUtils.clamp(point.z / GRID_DEPTH + 0.5, 0, 1) * 255);

    // Normalized age.
    trailData[offset + 2] = Math.round(THREE.MathUtils.clamp((now - point.createdAt) / TRAIL_LIFETIME, 0, 1) * 255);

    // Velocity / ripple strength.
    trailData[offset + 3] = Math.round(THREE.MathUtils.clamp(point.velocity, 0, 1) * 255);
  });

  trailTexture.needsUpdate = true;

  if (material.uniforms.uTrailCount) {
    material.uniforms.uTrailCount.value = trail.length;
  }
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
}

function resize(): void {
  const element = canvas.value;

  if (!element || !renderer || !scene || !camera) {
    return;
  }

  const width = Math.max(element.clientWidth, 1);

  const height = Math.max(element.clientHeight, 1);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

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

function projectPointer(clientX: number, clientY: number): { x: number; z: number } | null {
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
    x: THREE.MathUtils.clamp(intersection.x, -GRID_WIDTH / 2, GRID_WIDTH / 2),
    z: THREE.MathUtils.clamp(intersection.z, -GRID_DEPTH / 2, GRID_DEPTH / 2),
  };
}

function addTrailPoint(event: PointerEvent): void {
  if (reducedMotion?.matches || event.pointerType === 'touch') {
    return;
  }

  const position = projectPointer(event.clientX, event.clientY);

  if (!position) return;

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

  if (trail.length > TRAIL_LENGTH) {
    trail.shift();
  }

  lastPoint = point;
}

function addPointerRipple(event: PointerEvent): void {
  if (reducedMotion?.matches) {
    return;
  }

  const position = projectPointer(event.clientX, event.clientY);

  if (!position) return;

  // Clicks/taps use more layers, making the ripple feel larger and stronger.
  addRipple(position, performance.now(), 1, CLICK_RIPPLE_LAYERS);

  // Prevent the next pointer movement from creating a velocity spike.
  lastPoint = null;
}

function addScrollRipple(event: WheelEvent): void {
  if (reducedMotion?.matches) {
    return;
  }

  const now = performance.now();

  if (now - lastWheelEmission < SCROLL_RIPPLE_THROTTLE) {
    return;
  }

  const position = projectPointer(event.clientX, event.clientY);

  if (!position) return;

  const scrollDistance = Math.hypot(event.deltaX, event.deltaY);

  const velocity = THREE.MathUtils.clamp(scrollDistance / 65, 0.72, 1);

  addRipple(position, now, velocity, DEFAULT_RIPPLE_LAYERS);

  lastWheelEmission = now;
}

function startTouchRipple(event: TouchEvent): void {
  const touch = event.touches[0];

  if (!touch) return;

  lastTouchSample = {
    x: touch.clientX,
    y: touch.clientY,
    time: performance.now(),
  };
}

function addTouchRipple(event: TouchEvent): void {
  const touch = event.touches[0];

  if (!touch) return;

  const now = performance.now();
  const previousSample = lastTouchSample;

  lastTouchSample = {
    x: touch.clientX,
    y: touch.clientY,
    time: now,
  };

  if (reducedMotion?.matches || !previousSample || now - lastTouchEmission < TOUCH_RIPPLE_THROTTLE) {
    return;
  }

  const position = projectPointer(touch.clientX, touch.clientY);

  if (!position) return;

  const distance = Math.hypot(touch.clientX - previousSample.x, touch.clientY - previousSample.y);

  const elapsed = Math.max(now - previousSample.time, 16);

  const velocity = THREE.MathUtils.clamp((distance / elapsed) * 0.8, 0.62, 1);

  addRipple(position, now, velocity, DEFAULT_RIPPLE_LAYERS);

  lastTouchEmission = now;
}

function endTouchRipple(): void {
  lastTouchSample = null;
}

function setAnimationState(): void {
  if (!renderer || !scene || !camera || !material) {
    return;
  }

  const shouldAnimate = props.active && !document.hidden && !reducedMotion?.matches && !contextLost;

  if (material.uniforms.uMotion) {
    material.uniforms.uMotion.value = reducedMotion?.matches ? 0 : 1;
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

    trailTexture = new THREE.DataTexture(trailData, TRAIL_LENGTH, 1, THREE.RGBAFormat, THREE.UnsignedByteType);

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
        uMotion: {
          value: reducedMotion?.matches ? 0 : 1,
        },
        uGridSize: {
          value: new THREE.Vector2(GRID_WIDTH, GRID_DEPTH),
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
      fragmentShader,

      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    grid = new THREE.LineSegments(createGridGeometry(), material);

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
  () => props.active,
  (active) => {
    if (active) resize();
    setAnimationState();
  },
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
  window.addEventListener('pointermove', addTrailPoint, { passive: true });

  // Clicks, taps and stylus presses.
  window.addEventListener('pointerdown', addPointerRipple, { passive: true });

  // Mouse wheel and trackpad scrolling.
  window.addEventListener('wheel', addScrollRipple, { passive: true });

  // Touch movement.
  window.addEventListener('touchstart', startTouchRipple, { passive: true });

  window.addEventListener('touchmove', addTouchRipple, { passive: true });

  window.addEventListener('touchend', endTouchRipple, { passive: true });

  window.addEventListener('touchcancel', endTouchRipple, { passive: true });

  document.addEventListener('visibilitychange', setAnimationState);

  reducedMotion.addEventListener('change', onMotionPreferenceChange);

  colorScheme.addEventListener('change', applyPalette);

  window.addEventListener('portfolio-theme-change', applyPalette);

  canvas.value?.addEventListener('webglcontextlost', onContextLost);

  canvas.value?.addEventListener('webglcontextrestored', onContextRestored);

  initialize();
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', addTrailPoint);

  window.removeEventListener('pointerdown', addPointerRipple);

  window.removeEventListener('wheel', addScrollRipple);

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
