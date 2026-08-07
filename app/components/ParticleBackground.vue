<script setup lang="ts">
import * as THREE from 'three';

import { PARTICLE_CONFIG, chooseInitialQuality, getParticleQuality } from './particles/config';
import { InteractionManager } from './particles/InteractionManager';
import { ParticleSimulation } from './particles/ParticleSimulation';
import { PerformanceManager } from './particles/PerformanceManager';

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

const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const debugEnabled = ref(false);
const debugStats = ref<DebugStats | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let simulation: ParticleSimulation | null = null;
let interaction: InteractionManager | null = null;
let performanceManager: PerformanceManager | null = null;
let qualityIndex = 0;
let previousTime = 0;
let lastDebugUpdate = 0;
let reducedMotion: MediaQueryList | null = null;
let lightScheme: MediaQueryList | null = null;
let contextLost = false;

function getParticleColor(): string {
  return lightScheme?.matches ? PARTICLE_CONFIG.lightColor : PARTICLE_CONFIG.darkColor;
}

function resizeRenderer(): void {
  if (!renderer || !camera) return;

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

function rebuildSimulation(): void {
  if (!renderer || !scene) return;
  const quality = getParticleQuality(qualityIndex);
  const aspect = Math.max(window.innerWidth, 1) / Math.max(window.innerHeight, 1);

  simulation?.dispose();
  simulation = new ParticleSimulation(renderer, scene, quality, aspect, getParticleColor());
  resizeRenderer();
}

function updateDebug(now: number): void {
  if (!debugEnabled.value || !renderer || !simulation || !interaction || !performanceManager) return;
  if (now - lastDebugUpdate < PARTICLE_CONFIG.debugUpdateInterval) return;

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

function renderFrame(now: number): void {
  if (!renderer || !scene || !camera || !simulation || !interaction || contextLost) return;

  const delta = previousTime === 0 ? 1 / 60 : Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;
  const state = interaction.update(now, delta);
  simulation.update(now / 1000, delta, state);
  renderer.render(scene, camera);

  if (performanceManager?.record(delta * 1000)) {
    qualityIndex = performanceManager.qualityIndex;
    rebuildSimulation();
  }
  updateDebug(now);
}

function setAnimationState(): void {
  if (!renderer) return;
  const shouldAnimate = !document.hidden && !reducedMotion?.matches && !contextLost;
  previousTime = 0;
  renderer.setAnimationLoop(shouldAnimate ? renderFrame : null);

  if (!shouldAnimate && !contextLost && scene && camera) renderer.render(scene, camera);
}

function initialize(): void {
  const element = canvas.value;
  if (!element) return;

  try {
    const context = element.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
    if (!context) throw new Error('WebGL2 is unavailable');

    renderer = new THREE.WebGLRenderer({ canvas: element, context, alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
    camera.position.z = 2;
    interaction = new InteractionManager();
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

function cleanupGraphics(forceContextLoss: boolean): void {
  renderer?.setAnimationLoop(null);
  interaction?.dispose();
  interaction = null;
  simulation?.dispose();
  simulation = null;
  scene = null;
  camera = null;

  if (renderer) {
    renderer.dispose();
    if (forceContextLoss) renderer.forceContextLoss();
  }
  renderer = null;
  performanceManager = null;
}

function onVisibilityChange(): void {
  setAnimationState();
}

function onMotionPreferenceChange(): void {
  setAnimationState();
}

function onColorSchemeChange(): void {
  simulation?.setColor(getParticleColor());
}

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

onMounted(() => {
  debugEnabled.value = import.meta.dev && new URLSearchParams(window.location.search).get('particlesDebug') === '1';
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  canvas.value?.addEventListener('webglcontextlost', onContextLost);
  canvas.value?.addEventListener('webglcontextrestored', onContextRestored);
  window.addEventListener('resize', resizeRenderer, { passive: true });
  window.addEventListener('orientationchange', resizeRenderer, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  reducedMotion.addEventListener('change', onMotionPreferenceChange);
  lightScheme.addEventListener('change', onColorSchemeChange);
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
