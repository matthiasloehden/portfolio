```vue
<script setup lang="ts">
/**
 * GPU-accelerated particle background.
 *
 * The component owns the WebGL renderer and coordinates four responsibilities:
 *
 * - ParticleSimulation: GPU particle simulation and rendering data.
 * - InteractionManager: pointer, touch and scroll interaction state.
 * - PerformanceManager: runtime performance monitoring and quality scaling.
 * - Lifecycle management: visibility, reduced motion, resize and WebGL recovery.
 *
 * Rendering automatically pauses when the component is inactive, hidden,
 * static, reduced-motion, or the WebGL context is unavailable.
 *
 * WebGL2 failure is handled gracefully through a CSS fallback, so the visual
 * background never becomes a functional dependency of the page.
 */

import * as THREE from 'three';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { createDefaultBackgroundAnimationSettings, type BackgroundSceneProps } from '@/types/background';

import { PARTICLE_CONFIG, chooseInitialQuality, getParticleQuality } from './config';
import { InteractionManager } from './InteractionManager';
import { ParticleSimulation } from './ParticleSimulation';
import { PerformanceManager } from './PerformanceManager';

interface DebugStats {
  renderer: string;
  fps: string;
  frameTime: string;
  particleCount: number;
  resolution: string;
  dpr: string;
  pointerType: string;
  pointerSpeed: string;
  scrollVelocity: string;
  touchActive: string;
  quality: string;
}

/**
 * Whether this background should currently render.
 *
 * defineProps() and withDefaults() are compiler macros in <script setup>
 * and therefore must not be imported from Vue.
 */
const props = withDefaults(defineProps<BackgroundSceneProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
});

const canvas = ref<HTMLCanvasElement | null>(null);

const failed = ref(false);
const debugEnabled = ref(false);
const debugStats = ref<DebugStats | null>(null);

/* -------------------------------------------------------------------------- */
/* WebGL state                                                                */
/* -------------------------------------------------------------------------- */

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;

/* -------------------------------------------------------------------------- */
/* Particle systems                                                           */
/* -------------------------------------------------------------------------- */

let simulation: ParticleSimulation | null = null;
let interaction: InteractionManager | null = null;
let performanceManager: PerformanceManager | null = null;

/**
 * Current quality preset.
 *
 * PerformanceManager can change this value dynamically when frame time
 * becomes too high or leaves enough headroom for a higher quality level.
 */
let qualityIndex = 0;

/* -------------------------------------------------------------------------- */
/* Runtime state                                                              */
/* -------------------------------------------------------------------------- */

let previousTime = 0;
let lastDebugUpdate = 0;

let reducedMotion: MediaQueryList | null = null;
let lightScheme: MediaQueryList | null = null;

let contextLost = false;

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

function getParticleColor(): string {
  return document.documentElement.dataset.theme === 'light' ? PARTICLE_CONFIG.lightColor : PARTICLE_CONFIG.darkColor;
}

/* -------------------------------------------------------------------------- */
/* Renderer                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Synchronizes the WebGL viewport and orthographic camera with the viewport.
 *
 * The renderer uses the quality preset's DPR cap rather than the raw device
 * pixel ratio to avoid unnecessarily large GPU buffers on high-density
 * displays.
 */
function resizeRenderer(): void {
  if (renderer === null || camera === null) {
    return;
  }

  const width = Math.max(window.innerWidth, 1);
  const height = Math.max(window.innerHeight, 1);
  const aspect = width / height;

  const quality = getParticleQuality(qualityIndex);
  const dpr = Math.min(window.devicePixelRatio, quality.dprCap);

  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);

  camera.left = -aspect;
  camera.right = aspect;
  camera.top = 1;
  camera.bottom = -1;
  camera.updateProjectionMatrix();

  simulation?.resize(aspect, dpr);
  interaction?.resize();
}

/**
 * Recreates the particle simulation for the current quality preset.
 *
 * Simulation resources are explicitly disposed before a new simulation is
 * created. This is important because quality changes can happen while the
 * application is running.
 */
function rebuildSimulation(): void {
  if (renderer === null || scene === null) {
    return;
  }

  const quality = getParticleQuality(qualityIndex);

  const aspect = Math.max(window.innerWidth, 1) / Math.max(window.innerHeight, 1);

  simulation?.dispose();

  simulation = new ParticleSimulation(renderer, scene, quality, aspect, getParticleColor());

  resizeRenderer();
}

/* -------------------------------------------------------------------------- */
/* Debug                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Updates the optional development/debug overlay at a limited frequency.
 *
 * Debug information is intentionally not updated on every frame.
 */
function updateDebug(now: number): void {
  if (
    !debugEnabled.value ||
    renderer === null ||
    simulation === null ||
    interaction === null ||
    performanceManager === null
  ) {
    return;
  }

  if (now - lastDebugUpdate < PARTICLE_CONFIG.debugUpdateInterval) {
    return;
  }

  const quality = getParticleQuality(qualityIndex);
  const average = performanceManager.averageFrameTime;

  debugStats.value = {
    renderer: 'WebGL2 / GPGPU',
    fps: (1000 / average).toFixed(0),
    frameTime: `${average.toFixed(1)} ms`,
    particleCount: simulation.particleCount,
    resolution: `${quality.resolution} × ${quality.resolution}`,
    dpr: Math.min(window.devicePixelRatio, quality.dprCap).toFixed(2),
    pointerType: interaction.state.pointerType,
    pointerSpeed: interaction.state.pointerSpeed.toFixed(2),
    scrollVelocity: interaction.state.scrollVelocity.toFixed(2),
    touchActive: interaction.state.touchActive ? 'yes' : 'no',
    quality: quality.id,
  };

  lastDebugUpdate = now;
}

/* -------------------------------------------------------------------------- */
/* Animation                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Executes one simulation/render frame.
 *
 * The frame delta is capped to prevent a long inactive tab or temporary
 * browser stall from producing an excessively large simulation step.
 */
function renderFrame(now: number): void {
  if (
    renderer === null ||
    scene === null ||
    camera === null ||
    simulation === null ||
    interaction === null ||
    contextLost
  ) {
    return;
  }

  const delta = previousTime === 0 ? 1 / 60 : Math.min((now - previousTime) / 1000, 0.05);

  previousTime = now;

  const state = interaction.update(now, delta);

  simulation.update(now / 1000, delta, state, props.animations);

  renderer.render(scene, camera);

  /**
   * PerformanceManager returns true when the active quality preset should
   * change. Rebuilding the simulation is deliberately kept outside the
   * simulation update itself so quality management remains centralized.
   */
  if (performanceManager?.record(delta * 1000)) {
    qualityIndex = performanceManager.qualityIndex;
    rebuildSimulation();
  }

  updateDebug(now);

  if (!props.animations.idle && !interaction.hasActiveAnimation()) {
    setAnimationState();
  }
}

/**
 * Enables or disables the renderer's animation loop according to the
 * component and browser state.
 *
 * Rendering stops when:
 *
 * - the component is inactive,
 * - the document is hidden,
 * - reduced motion is requested, or
 * - the WebGL context has been lost.
 *
 * When animation is disabled for a normal reason, one final static render
 * keeps the background visually up to date.
 */
function setAnimationState(): void {
  if (renderer === null) {
    return;
  }

  const shouldAnimate =
    props.active &&
    !document.hidden &&
    reducedMotion?.matches !== true &&
    !contextLost &&
    (props.animations.idle || interaction?.hasActiveAnimation() === true);

  previousTime = 0;

  renderer.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !contextLost && scene !== null && camera !== null) {
    renderer.render(scene, camera);
  }
}

/* -------------------------------------------------------------------------- */
/* Initialization                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the WebGL renderer and all particle subsystems.
 *
 * WebGL2 availability is treated as an optional enhancement. If initialization
 * fails, the component switches to the CSS fallback instead of breaking the
 * page.
 */
function initialize(): void {
  const element = canvas.value;

  if (element === null) {
    return;
  }

  try {
    const context = element.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (context === null) {
      throw new Error('WebGL2 is unavailable');
    }

    renderer = new THREE.WebGLRenderer({
      canvas: element,
      context,
      alpha: true,
      antialias: false,
    });

    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);

    camera.position.z = 2;

    interaction = new InteractionManager(props.animations, setAnimationState);

    qualityIndex = chooseInitialQuality();
    performanceManager = new PerformanceManager(qualityIndex);

    rebuildSimulation();

    failed.value = false;

    setAnimationState();
  } catch (error: unknown) {
    failed.value = true;

    if (debugEnabled.value) {
      debugStats.value = {
        renderer: error instanceof Error ? `Fallback: ${error.message}` : 'Fallback: initialization failed',
        fps: '0',
        frameTime: 'paused',
        particleCount: 0,
        resolution: 'CSS fallback',
        dpr: Math.min(window.devicePixelRatio, 1).toFixed(2),
        pointerType: 'none',
        pointerSpeed: '0',
        scrollVelocity: '0',
        touchActive: 'no',
        quality: 'fallback',
      };
    }

    cleanupGraphics(false);
  }
}

/**
 * Releases all Three.js and particle resources owned by this component.
 *
 * forceContextLoss() is only used during final component destruction.
 * During WebGL context recovery we keep the browser context alive and simply
 * recreate the application-level resources.
 */
function cleanupGraphics(forceContextLoss: boolean): void {
  renderer?.setAnimationLoop(null);

  interaction?.dispose();
  interaction = null;

  simulation?.dispose();
  simulation = null;

  scene = null;
  camera = null;

  if (renderer !== null) {
    renderer.dispose();

    if (forceContextLoss) {
      renderer.forceContextLoss();
    }
  }

  renderer = null;
  performanceManager = null;
}

/* -------------------------------------------------------------------------- */
/* Browser lifecycle                                                          */
/* -------------------------------------------------------------------------- */

function onVisibilityChange(): void {
  setAnimationState();
}

function onMotionPreferenceChange(): void {
  setAnimationState();
}

function onColorSchemeChange(): void {
  simulation?.setColor(getParticleColor());
}

/* -------------------------------------------------------------------------- */
/* WebGL context recovery                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Stops rendering when the browser loses the WebGL context.
 *
 * Calling preventDefault() allows the browser to attempt context recovery
 * and gives us a chance to rebuild the application state afterwards.
 */
function onContextLost(event: Event): void {
  event.preventDefault();

  contextLost = true;
  failed.value = true;

  renderer?.setAnimationLoop(null);
}

function onContextRestored(): void {
  contextLost = false;

  cleanupGraphics(false);
  initialize();
}

/* -------------------------------------------------------------------------- */
/* Reactive state                                                             */
/* -------------------------------------------------------------------------- */

watch(
  () => [props.active, props.animations.idle, props.animations.cursor, props.animations.scroll],
  ([active]) => {
    interaction?.setAnimations(props.animations);

    if (active) {
      resizeRenderer();
    }

    setAnimationState();
  },
  {
    flush: 'post',
  },
);

/* -------------------------------------------------------------------------- */
/* Lifecycle                                                                  */
/* -------------------------------------------------------------------------- */

onMounted(() => {
  debugEnabled.value = import.meta.dev || new URLSearchParams(window.location.search).get('particlesDebug') === '1';

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  canvas.value?.addEventListener('webglcontextlost', onContextLost);

  canvas.value?.addEventListener('webglcontextrestored', onContextRestored);

  window.addEventListener('resize', resizeRenderer, { passive: true });

  window.addEventListener('orientationchange', resizeRenderer, { passive: true });

  document.addEventListener('visibilitychange', onVisibilityChange);

  reducedMotion.addEventListener('change', onMotionPreferenceChange);

  lightScheme.addEventListener('change', onColorSchemeChange);

  window.addEventListener('portfolio-theme-change', onColorSchemeChange);

  initialize();
});

onBeforeUnmount(() => {
  canvas.value?.removeEventListener('webglcontextlost', onContextLost);

  canvas.value?.removeEventListener('webglcontextrestored', onContextRestored);

  window.removeEventListener('resize', resizeRenderer);

  window.removeEventListener('orientationchange', resizeRenderer);

  document.removeEventListener('visibilitychange', onVisibilityChange);

  reducedMotion?.removeEventListener('change', onMotionPreferenceChange);

  lightScheme?.removeEventListener('change', onColorSchemeChange);

  window.removeEventListener('portfolio-theme-change', onColorSchemeChange);

  cleanupGraphics(true);
});
</script>

<template>
  <div
    class="particle-background"
    :class="{ 'is-fallback': failed }"
    aria-hidden="true"
  >
    <canvas ref="canvas" />

    <aside
      v-if="debugEnabled && debugStats"
      class="particle-debug"
    >
      <strong>Particle field</strong>

      <dl>
        <template
          v-for="(value, key) in debugStats"
          :key="key"
        >
          <dt>{{ key }}</dt>
          <dd>{{ value }}</dd>
        </template>
      </dl>
    </aside>
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

.particle-debug {
  position: fixed;
  z-index: 10;
  right: 0.75rem;
  bottom: 0.75rem;

  width: 15rem;
  padding: 0.8rem;

  border: 1px solid rgba(109, 159, 232, 0.45);

  background: rgba(2, 6, 13, 0.9);
  color: #edf5ff;

  font-family: var(--mono-font);
  font-size: 0.58rem;

  backdrop-filter: blur(12px);
}

.particle-debug strong {
  display: block;

  margin-bottom: 0.65rem;

  color: var(--accent-bright);

  font-size: 0.62rem;
  text-transform: uppercase;
}

.particle-debug dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem 0.7rem;

  margin: 0;
}

.particle-debug dt {
  color: #8190a8;
  text-transform: capitalize;
}

.particle-debug dd {
  margin: 0;
  text-align: right;
}

@media (prefers-reduced-motion: reduce) {
  .particle-background::before {
    opacity: 0.45;
  }
}
</style>
```
