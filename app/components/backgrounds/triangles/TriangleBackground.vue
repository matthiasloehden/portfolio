<script setup lang="ts">
/**
 * Draws a lightweight Canvas2D triangle field with separate idle, cursor and
 * scroll animation channels. Geometry, palette and drawing paths are cached
 * so static scenes only render when their visible state needs updating.
 *
 * The orchestrator keeps the scene mounted and pauses it while inactive so
 * background changes can crossfade without rebuilding the canvas.
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
import { TRIANGLE_QUALITY_PRESETS } from './config';

interface TriangleTile {
  column: number;
  row: number;
  side: 'a' | 'b';
  tone: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
}

interface TrianglePalette {
  fill: string;
  accent: string;
  ambient: string;
  background: string;
}

interface GridMetrics {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
}

interface TileRow {
  rowIndex: number;
  y: number;
  tiles: TriangleTile[];
}

interface HighlightPoint {
  x: number;
  worldY: number;
  time: number;
  strength: number;
}

const props = withDefaults(defineProps<BackgroundSceneProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
});
const emit = defineEmits<BackgroundSceneEmits>();

const canvas = ref<HTMLCanvasElement | null>(null);

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const TARGET_TRIANGLES_DESKTOP = 1000;
const TARGET_TRIANGLES_TABLET = 480;
const TARGET_TRIANGLES_MOBILE = 320;

const IDLE_FRAME_BUDGET_MS = 1000 / 30;
const ACTIVE_FRAME_BUDGET_MS = 1000 / 60;

const POINTER_RADIUS_DESKTOP = 135;
const POINTER_RADIUS_MOBILE = 100;

const HIGHLIGHT_LIFETIME = 1000;
const MAX_HIGHLIGHT_POINTS = 32;
const TRAIL_SPACING = 18;

const MIN_POINTER_DISTANCE = 8;
const MIN_POINTER_INTERVAL = 24;

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

const tileRows: TileRow[] = [];
const highlightTrail: HighlightPoint[] = [];

let context: CanvasRenderingContext2D | null = null;
let resizeObserver: ResizeObserver | null = null;
let environment: BackgroundEnvironment | null = null;
let animationFrame: number | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof TRIANGLE_QUALITY_PRESETS)[number]> | null = null;

let width = 1;
let height = 1;
let dpr = 1;

let metrics: GridMetrics = {
  columns: 1,
  rows: 1,
  cellWidth: 1,
  cellHeight: 1,
};

let lastFrameTime = 0;
let elapsedTime = 0;

let scrollOffset = 0;
let previousScrollOffset = 0;

let pointerScreenX = 0;
let pointerScreenY = 0;
let pointerPresent = false;

let lastPointerWorldX = 0;
let lastPointerWorldY = 0;
let hasPointerWorldPosition = false;
let lastPointerPointTime = 0;

let isDocumentVisible = true;

/* -------------------------------------------------------------------------- */
/* Cached rendering data                                                       */
/* -------------------------------------------------------------------------- */

let trianglePathA: Path2D | null = null;
let trianglePathB: Path2D | null = null;

let ambientGradient: CanvasGradient | null = null;

let cachedPalette: TrianglePalette | null = null;
let cachedTheme: string | null = null;

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;

  return value - Math.floor(value);
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number): number {
  const range = edgeEnd - edgeStart;

  if (range === 0) {
    return value < edgeStart ? 0 : 1;
  }

  const normalized = Math.min(1, Math.max(0, (value - edgeStart) / range));

  return normalized * normalized * (3 - 2 * normalized);
}

function getTargetTriangleCount(): number {
  const densityScale = performanceRuntime?.currentPreset.densityScale ?? 1;

  if (width < 640) {
    return TARGET_TRIANGLES_MOBILE * densityScale;
  }

  if (width < 1000) {
    return TARGET_TRIANGLES_TABLET * densityScale;
  }

  return TARGET_TRIANGLES_DESKTOP * densityScale;
}

function getPalette(): TrianglePalette {
  const theme = document.documentElement.dataset.theme ?? 'dark';

  if (cachedPalette !== null && cachedTheme === theme) {
    return cachedPalette;
  }

  cachedTheme = theme;

  cachedPalette =
    theme === 'light'
      ? {
          fill: '68, 96, 134',
          accent: '7, 95, 215',
          ambient: '50, 132, 255',
          background: '#f3f7fc',
        }
      : {
          fill: '112, 142, 181',
          accent: '114, 170, 255',
          ambient: '50, 132, 255',
          background: '#030509',
        };

  return cachedPalette;
}

/* -------------------------------------------------------------------------- */
/* Grid generation                                                            */
/* -------------------------------------------------------------------------- */

function calculateGridMetrics(): GridMetrics {
  const aspectRatio = Math.max(width / Math.max(height, 1), 0.35);
  const targetCells = getTargetTriangleCount() / 2;

  const columns = Math.max(6, Math.round(Math.sqrt(targetCells * aspectRatio)));
  const rows = Math.max(5, Math.round(targetCells / columns));

  return {
    columns,
    rows,
    cellWidth: width / columns,
    cellHeight: height / rows,
  };
}

function rebuildTrianglePaths(): void {
  const { cellWidth, cellHeight } = metrics;

  const pathA = new Path2D();

  pathA.moveTo(0, 0);
  pathA.lineTo(cellWidth, 0);
  pathA.lineTo(0, cellHeight);
  pathA.closePath();

  trianglePathA = pathA;

  const pathB = new Path2D();

  pathB.moveTo(cellWidth, 0);
  pathB.lineTo(cellWidth, cellHeight);
  pathB.lineTo(0, cellHeight);
  pathB.closePath();

  trianglePathB = pathB;
}

function buildTileRows(startRowIndex: number, rowCount: number): void {
  const nextRows: TileRow[] = [];

  for (let offset = 0; offset < rowCount; offset += 1) {
    const rowIndex = startRowIndex + offset;
    const rowTiles: TriangleTile[] = [];
    const rowY = rowIndex * metrics.cellHeight;

    for (let column = 0; column < metrics.columns; column += 1) {
      const seed = rowIndex * 149 + column * 43 + 1;

      rowTiles.push({
        column,
        row: rowIndex,
        side: 'a',
        tone: 0.68 + seededRandom(seed) * 0.32,
        phase: seededRandom(seed + 11) * Math.PI * 2,
        speed: 0.18 + seededRandom(seed + 17) * 0.22,
        driftX: (seededRandom(seed + 23) - 0.5) * 2.4,
        driftY: (seededRandom(seed + 29) - 0.5) * 2.4,
      });

      rowTiles.push({
        column,
        row: rowIndex,
        side: 'b',
        tone: 0.52 + seededRandom(seed + 37) * 0.34,
        phase: seededRandom(seed + 41) * Math.PI * 2,
        speed: 0.16 + seededRandom(seed + 47) * 0.2,
        driftX: (seededRandom(seed + 53) - 0.5) * 2,
        driftY: (seededRandom(seed + 59) - 0.5) * 2,
      });
    }

    nextRows.push({
      rowIndex,
      y: rowY,
      tiles: rowTiles,
    });
  }

  tileRows.length = 0;
  tileRows.push(...nextRows);
}

function syncRowsForScroll(): void {
  if (context === null) {
    return;
  }

  const rowHeight = metrics.cellHeight;

  const visibleRowCount = Math.max(4, Math.ceil((height + window.innerHeight * 1.2) / Math.max(rowHeight, 1)) + 4);

  const startRowIndex = Math.max(0, Math.floor(scrollOffset / rowHeight) - 2);

  const rowCount = Math.max(visibleRowCount, 10);

  const currentStart = tileRows[0]?.rowIndex ?? -1;
  const currentEnd = tileRows[tileRows.length - 1]?.rowIndex ?? -1;
  const expectedEnd = startRowIndex + rowCount - 1;

  if (tileRows.length === 0 || currentStart !== startRowIndex || currentEnd !== expectedEnd) {
    buildTileRows(startRowIndex, rowCount);
  }
}

/* -------------------------------------------------------------------------- */
/* Highlight trail                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Trail points are stored in world coordinates rather than screen coordinates.
 * This keeps the highlight attached to the grid while the page scrolls.
 */
function addHighlightPoint(x: number, worldY: number, strength: number, time = performance.now()): void {
  highlightTrail.push({
    x,
    worldY,
    time,
    strength,
  });

  if (highlightTrail.length > MAX_HIGHLIGHT_POINTS) {
    highlightTrail.splice(0, highlightTrail.length - MAX_HIGHLIGHT_POINTS);
  }
}

function addHighlightSegment(
  fromX: number,
  fromWorldY: number,
  toX: number,
  toWorldY: number,
  strength: number,
  now = performance.now(),
): void {
  const distance = Math.hypot(toX - fromX, toWorldY - fromWorldY);

  if (distance < 1) {
    addHighlightPoint(toX, toWorldY, strength, now);
    return;
  }

  const steps = Math.max(1, Math.ceil(distance / TRAIL_SPACING));

  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;

    const x = fromX + (toX - fromX) * progress;
    const worldY = fromWorldY + (toWorldY - fromWorldY) * progress;
    const pointTime = now - (steps - index) * 7;

    addHighlightPoint(x, worldY, strength, pointTime);
  }
}

function cleanupHighlightTrail(now: number): void {
  let firstValidIndex = 0;

  while (firstValidIndex < highlightTrail.length) {
    const point = highlightTrail[firstValidIndex];

    if (point === undefined || now - point.time < HIGHLIGHT_LIFETIME) {
      break;
    }

    firstValidIndex += 1;
  }

  if (firstValidIndex > 0) {
    highlightTrail.splice(0, firstValidIndex);
  }
}

function getTrailInfluence(centerX: number, centerWorldY: number, now: number): number {
  if (highlightTrail.length === 0) {
    return 0;
  }

  const radius = width < 640 ? POINTER_RADIUS_MOBILE : POINTER_RADIUS_DESKTOP;

  const radiusSquared = radius * radius;
  let influence = 0;

  for (const point of highlightTrail) {
    const age = now - point.time;

    if (age >= HIGHLIGHT_LIFETIME) {
      continue;
    }

    const dx = centerX - point.x;
    const dy = centerWorldY - point.worldY;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared >= radiusSquared) {
      continue;
    }

    const distance = Math.sqrt(distanceSquared);
    const normalizedAge = age / HIGHLIGHT_LIFETIME;
    const fade = (1 - normalizedAge) ** 2;
    const proximity = smoothstep(radius, 0, distance);

    influence = Math.max(influence, proximity * fade * point.strength);

    if (influence >= 1) {
      return 1;
    }
  }

  return Math.min(1, influence);
}

function hasActiveTrail(now: number): boolean {
  const newest = highlightTrail[highlightTrail.length - 1];

  return newest !== undefined && now - newest.time < HIGHLIGHT_LIFETIME;
}

/* -------------------------------------------------------------------------- */
/* Ambient gradient                                                           */
/* -------------------------------------------------------------------------- */

function rebuildAmbientGradient(palette: TrianglePalette): void {
  if (context === null) {
    ambientGradient = null;
    return;
  }

  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.36,
    0,
    width * 0.5,
    height * 0.36,
    width * 0.72,
  );

  gradient.addColorStop(0, `rgba(${palette.ambient}, 0.055)`);

  gradient.addColorStop(1, `rgba(${palette.ambient}, 0)`);

  ambientGradient = gradient;
}

function drawAmbientGradient(): void {
  if (context === null) {
    return;
  }

  if (ambientGradient === null) {
    rebuildAmbientGradient(getPalette());
  }

  if (ambientGradient === null) {
    return;
  }

  context.fillStyle = ambientGradient;
  context.fillRect(0, 0, width, height);
}

/* -------------------------------------------------------------------------- */
/* Rendering                                                                  */
/* -------------------------------------------------------------------------- */

function drawTriangle(
  tile: TriangleTile,
  palette: TrianglePalette,
  motion: number,
  baseWorldY: number,
  now: number,
): void {
  if (context === null) {
    return;
  }

  const x = tile.column * metrics.cellWidth;

  const centerWorldX = x + metrics.cellWidth * 0.5;

  const centerWorldY = baseWorldY + metrics.cellHeight * 0.5;

  const screenY = baseWorldY - scrollOffset;

  const idle = motion * Math.sin(elapsedTime * tile.speed + tile.phase);

  const trailInfluence = getTrailInfluence(centerWorldX, centerWorldY, now);

  const offsetX = tile.driftX * idle;
  const offsetY = tile.driftY * idle;

  const baseAlpha = 0.045 + tile.tone * 0.055 + Math.abs(idle) * 0.018;

  const alpha = (baseAlpha + trailInfluence * 0.22) * motion;

  const path = tile.side === 'a' ? trianglePathA : trianglePathB;

  if (path === null) {
    return;
  }

  context.save();
  context.translate(x + offsetX, screenY + offsetY);

  if (trailInfluence > 0.015) {
    context.fillStyle = `rgba(${palette.accent}, ${alpha})`;

    context.fill(path);

    if (trailInfluence > 0.14) {
      context.strokeStyle = `rgba(${palette.accent}, ${trailInfluence * 0.16})`;

      context.lineWidth = 1;
      context.stroke(path);
    }
  } else {
    context.fillStyle = `rgba(${palette.fill}, ${alpha})`;

    context.fill(path);
  }

  context.restore();
}

/* -------------------------------------------------------------------------- */
/* Animation                                                                  */
/* -------------------------------------------------------------------------- */

function scheduleFrame(): void {
  if (animationFrame !== null) {
    return;
  }

  animationFrame = window.requestAnimationFrame(drawFrame);
}

function drawFrame(timestamp = performance.now()): void {
  animationFrame = null;

  if (context === null || canvas.value === null) {
    return;
  }

  const delta = lastFrameTime === 0 ? 16.67 : Math.min(timestamp - lastFrameTime, 48);

  const idleMotionEnabled = props.active && props.animations.idle && !environment?.prefersReducedMotion;

  cleanupHighlightTrail(timestamp);

  const trailActive = hasActiveTrail(timestamp);

  const shouldContinue = (idleMotionEnabled && isDocumentVisible) || trailActive;

  const frameBudget = shouldContinue ? ACTIVE_FRAME_BUDGET_MS : IDLE_FRAME_BUDGET_MS;

  if (lastFrameTime !== 0 && timestamp - lastFrameTime < frameBudget) {
    if (shouldContinue) {
      scheduleFrame();
    }

    return;
  }

  lastFrameTime = timestamp;

  if (idleMotionEnabled) {
    elapsedTime += delta / 1000;
  }

  const palette = getPalette();

  context.clearRect(0, 0, width, height);

  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);

  syncRowsForScroll();

  // A disabled idle channel preserves a calm, static visual state.
  const motion = idleMotionEnabled ? 1 : 0.82;

  for (const row of tileRows) {
    const rowScreenY = row.y - scrollOffset;

    if (rowScreenY > height + metrics.cellHeight * 1.2 || rowScreenY < -metrics.cellHeight * 1.2) {
      continue;
    }

    for (const tile of row.tiles) {
      drawTriangle(tile, palette, motion, row.y, timestamp);
    }
  }

  drawAmbientGradient();

  const qualityChange = performanceRuntime?.recordFrame(timestamp);

  if (qualityChange) {
    resize();
    updatePerformanceStats(timestamp, true);
  }

  updatePerformanceStats(timestamp);

  if (shouldContinue) {
    scheduleFrame();
  }
}

/* -------------------------------------------------------------------------- */
/* Resize                                                                     */
/* -------------------------------------------------------------------------- */

function resize(): void {
  const element = canvas.value;

  if (element === null) {
    return;
  }

  const rect = element.getBoundingClientRect();

  const viewportWidth = window.innerWidth || Math.max(rect.width, 1);

  const viewportHeight = window.innerHeight || Math.max(rect.height, 1);

  width = Math.max(1, Math.round(rect.width || viewportWidth));

  height = Math.max(1, Math.round(rect.height || viewportHeight));

  scrollOffset = window.scrollY;
  previousScrollOffset = scrollOffset;

  const pixelRatioCap = performanceRuntime?.currentPreset.pixelRatioCap ?? 1.35;

  dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);

  element.width = Math.round(width * dpr);
  element.height = Math.round(height * dpr);

  context = element.getContext('2d', {
    alpha: true,
    desynchronized: true,
  });

  if (context === null) {
    return;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  metrics = calculateGridMetrics();

  rebuildTrianglePaths();
  rebuildAmbientGradient(getPalette());

  const rowsNeeded = Math.max(6, Math.ceil((height + window.innerHeight * 1.2) / Math.max(metrics.cellHeight, 1)) + 4);

  buildTileRows(0, rowsNeeded);

  lastFrameTime = 0;
  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Pointer input                                                              */
/* -------------------------------------------------------------------------- */

function handlePointerMove(event: PointerEvent): void {
  if (!props.active || !props.animations.cursorMovement) {
    return;
  }

  const now = performance.now();

  pointerPresent = true;

  pointerScreenX = event.clientX;
  pointerScreenY = event.clientY;

  const worldX = pointerScreenX;
  const worldY = pointerScreenY + scrollOffset;

  if (!hasPointerWorldPosition) {
    lastPointerWorldX = worldX;
    lastPointerWorldY = worldY;
    hasPointerWorldPosition = true;
    lastPointerPointTime = now;

    addHighlightPoint(worldX, worldY, 1, now);
    scheduleFrame();

    return;
  }

  const distance = Math.hypot(worldX - lastPointerWorldX, worldY - lastPointerWorldY);

  const timeSinceLastPoint = now - lastPointerPointTime;

  if (distance >= MIN_POINTER_DISTANCE || timeSinceLastPoint >= MIN_POINTER_INTERVAL) {
    addHighlightSegment(lastPointerWorldX, lastPointerWorldY, worldX, worldY, 1, now);

    lastPointerWorldX = worldX;
    lastPointerWorldY = worldY;
    lastPointerPointTime = now;
  }

  scheduleFrame();
}

function handlePointerDown(event: PointerEvent): void {
  if (!props.active || !props.animations.cursorClick) return;

  const now = performance.now();
  const worldY = event.clientY + scrollOffset;

  pointerPresent = true;
  pointerScreenX = event.clientX;
  pointerScreenY = event.clientY;
  lastPointerWorldX = event.clientX;
  lastPointerWorldY = worldY;
  lastPointerPointTime = now;
  hasPointerWorldPosition = true;

  addHighlightPoint(event.clientX, worldY, 1, now);
  addHighlightPoint(event.clientX, worldY, 0.82, now - 80);
  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Scroll input                                                               */
/* -------------------------------------------------------------------------- */

function handleScroll(): void {
  const newScrollOffset = window.scrollY;
  const scrollDelta = newScrollOffset - previousScrollOffset;

  scrollOffset = newScrollOffset;
  previousScrollOffset = newScrollOffset;

  if (!props.active || Math.abs(scrollDelta) < 0.01) {
    return;
  }

  /*
   * Scrolling changes the cursor's world position even when the cursor
   * itself does not move. This creates a continuous highlight trail.
   */
  if (props.animations.scroll && pointerPresent && hasPointerWorldPosition) {
    const worldX = pointerScreenX;
    const worldY = pointerScreenY + scrollOffset;

    addHighlightSegment(lastPointerWorldX, lastPointerWorldY, worldX, worldY, 0.95);

    lastPointerWorldX = worldX;
    lastPointerWorldY = worldY;
    lastPointerPointTime = performance.now();
  }

  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Pointer cleanup                                                             */
/* -------------------------------------------------------------------------- */

function clearPointer(): void {
  pointerPresent = false;

  // Let existing trail points fade out naturally.
  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Visibility / theme / motion                                                */
/* -------------------------------------------------------------------------- */

function handleVisibilityChange(): void {
  isDocumentVisible = document.visibilityState === 'visible';

  lastFrameTime = 0;

  if (isDocumentVisible && props.active) {
    scheduleFrame();
  }
}

function handleThemeChange(): void {
  cachedPalette = null;
  cachedTheme = null;
  ambientGradient = null;

  lastFrameTime = 0;
  scheduleFrame();
}

function handleMotionPreferenceChange(): void {
  lastFrameTime = 0;

  if (props.active) {
    scheduleFrame();
  }
}

function updatePerformanceStats(now: number, force = false): void {
  if (!performanceRuntime?.shouldPublishStats(now, force)) return;

  emit('performanceStats', {
    name: 'Triangle field',
    renderer: 'Canvas2D',
    mode: props.performance.mode,
    preset: performanceRuntime.currentPreset.id,
    fps: performanceRuntime.fps,
    frameTime: performanceRuntime.averageFrameTime,
    resolution: `${Math.round(width * dpr)} × ${Math.round(height * dpr)}`,
    dpr,
    details: {
      Triangles: metrics.columns * metrics.rows * 2,
      'Trail points': highlightTrail.length,
    },
  });
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  performanceRuntime.setMode(props.performance.mode);
  resize();
  updatePerformanceStats(performance.now(), true);
}

watch(
  () => [
    props.active,
    props.animations.idle,
    props.animations.cursorMovement,
    props.animations.cursorClick,
    props.animations.scroll,
  ],
  ([active, idle, cursorMovement, cursorClick, scroll]) => {
    if (!active || (!cursorMovement && !cursorClick && !scroll)) {
      highlightTrail.length = 0;
      hasPointerWorldPosition = false;
    }

    if (!active) performanceRuntime?.resetMeasurements();

    if (active || idle || cursorMovement || cursorClick || scroll) {
      lastFrameTime = 0;
      scheduleFrame();
    }

    if (active) updatePerformanceStats(performance.now(), true);
  },
);

watch(() => props.performance.mode, applyPerformanceMode, { flush: 'post' });
watch(
  () => props.performance.showStats,
  (showStats) => {
    if (showStats) updatePerformanceStats(performance.now(), true);
  },
  { flush: 'post' },
);

/* -------------------------------------------------------------------------- */
/* Lifecycle                                                                  */
/* -------------------------------------------------------------------------- */

onMounted(() => {
  const element = canvas.value;

  if (element === null) {
    return;
  }

  performanceRuntime = new BackgroundPerformanceRuntime(
    TRIANGLE_QUALITY_PRESETS,
    props.performance.mode,
  );

  environment = new BackgroundEnvironment({
    onMotionPreferenceChange: handleMotionPreferenceChange,
    onThemeChange: handleThemeChange,
    onVisibilityChange: handleVisibilityChange,
  });

  resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(element);

  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('orientationchange', resize, { passive: true });

  window.addEventListener('scroll', handleScroll, { passive: true });

  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  window.addEventListener('pointerdown', handlePointerDown, { passive: true });

  window.addEventListener('pointerleave', clearPointer, { passive: true });

  window.addEventListener('blur', clearPointer);

  resize();
  updatePerformanceStats(performance.now(), true);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  window.removeEventListener('resize', resize);
  window.removeEventListener('orientationchange', resize);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('pointerleave', clearPointer);
  window.removeEventListener('blur', clearPointer);
  environment?.dispose();
  environment = null;

  tileRows.length = 0;
  highlightTrail.length = 0;

  context = null;
  trianglePathA = null;
  trianglePathB = null;
  ambientGradient = null;

  cachedPalette = null;
  cachedTheme = null;
  pointerPresent = false;
  hasPointerWorldPosition = false;

  pointerScreenX = 0;
  pointerScreenY = 0;

  lastPointerWorldX = 0;
  lastPointerWorldY = 0;
  lastPointerPointTime = 0;

  scrollOffset = 0;
  previousScrollOffset = 0;

  lastFrameTime = 0;
  elapsedTime = 0;
  performanceRuntime = null;
});
</script>

<template>
  <div
    class="triangle-background"
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
</style>
