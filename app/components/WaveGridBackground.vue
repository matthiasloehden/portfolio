```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * Canvas-based triangular background with:
 * - deterministic procedural tile generation
 * - scroll-aware world coordinates
 * - pointer and touch-independent highlight trails
 * - theme-aware rendering
 * - reduced-motion and document-visibility handling
 * - adaptive rendering density and device pixel ratio
 *
 * The component stays mounted even when the background is inactive.
 * Its animation loop only runs while the scene needs to update.
 */

declare global {
  interface WindowEventMap {
    'portfolio-theme-change': Event;
  }
}

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

const canvas = ref<HTMLCanvasElement | null>(null);

const TARGET_TRIANGLES = {
  desktop: 1000,
  tablet: 480,
  mobile: 320,
} as const;

const MAX_DPR = 1.35;

const FRAME_BUDGET = {
  idle: 1000 / 30,
  active: 1000 / 60,
} as const;

const POINTER_RADIUS = {
  desktop: 135,
  mobile: 100,
} as const;

const HIGHLIGHT_LIFETIME = 1000;
const MAX_HIGHLIGHT_POINTS = 32;
const TRAIL_SPACING = 18;
const MIN_POINTER_DISTANCE = 8;
const MIN_POINTER_INTERVAL = 24;

const tileRows: TileRow[] = [];
const highlightTrail: HighlightPoint[] = [];

let context: CanvasRenderingContext2D | null = null;
let resizeObserver: ResizeObserver | null = null;
let reducedMotion: MediaQueryList | null = null;
let animationFrame: number | null = null;

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

let pointerX = 0;
let pointerY = 0;
let pointerPresent = false;

let lastPointerWorldX = 0;
let lastPointerWorldY = 0;
let hasPointerWorldPosition = false;
let lastPointerPointTime = 0;

let isDocumentVisible = true;

let trianglePathA: Path2D | null = null;
let trianglePathB: Path2D | null = null;
let ambientGradient: CanvasGradient | null = null;

let cachedPalette: TrianglePalette | null = null;
let cachedTheme: string | null = null;

/**
 * Deterministic pseudo-random value used for tile generation.
 *
 * Using a seed instead of Math.random() keeps the grid visually stable
 * across rebuilds and scrolling.
 */
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
  if (width < 640) {
    return TARGET_TRIANGLES.mobile;
  }

  if (width < 1000) {
    return TARGET_TRIANGLES.tablet;
  }

  return TARGET_TRIANGLES.desktop;
}

function getPalette(): TrianglePalette {
  const theme = document.documentElement.dataset.theme ?? 'dark';

  if (cachedPalette && cachedTheme === theme) {
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

/* Grid generation */

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

  const pathB = new Path2D();
  pathB.moveTo(cellWidth, 0);
  pathB.lineTo(cellWidth, cellHeight);
  pathB.lineTo(0, cellHeight);
  pathB.closePath();

  trianglePathA = pathA;
  trianglePathB = pathB;
}

function createTile(column: number, row: number, side: TriangleTile['side'], seed: number): TriangleTile {
  const isPrimary = side === 'a';

  return {
    column,
    row,
    side,
    tone: isPrimary ? 0.68 + seededRandom(seed) * 0.32 : 0.52 + seededRandom(seed) * 0.34,
    phase: seededRandom(seed + (isPrimary ? 11 : 41)) * Math.PI * 2,
    speed: isPrimary ? 0.18 + seededRandom(seed + 17) * 0.22 : 0.16 + seededRandom(seed + 47) * 0.2,
    driftX: (seededRandom(seed + (isPrimary ? 23 : 53)) - 0.5) * (isPrimary ? 2.4 : 2),
    driftY: (seededRandom(seed + (isPrimary ? 29 : 59)) - 0.5) * (isPrimary ? 2.4 : 2),
  };
}

function buildTileRows(startRowIndex: number, rowCount: number): void {
  const rows: TileRow[] = [];

  for (let offset = 0; offset < rowCount; offset += 1) {
    const rowIndex = startRowIndex + offset;
    const tiles: TriangleTile[] = [];

    for (let column = 0; column < metrics.columns; column += 1) {
      const seed = rowIndex * 149 + column * 43 + 1;

      tiles.push(createTile(column, rowIndex, 'a', seed));
      tiles.push(createTile(column, rowIndex, 'b', seed + 36));
    }

    rows.push({
      rowIndex,
      y: rowIndex * metrics.cellHeight,
      tiles,
    });
  }

  tileRows.length = 0;
  tileRows.push(...rows);
}

function syncRowsForScroll(): void {
  if (!context) {
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

/* Highlight trail */

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

    addHighlightPoint(
      fromX + (toX - fromX) * progress,
      fromWorldY + (toWorldY - fromWorldY) * progress,
      strength,
      now - (steps - index) * 7,
    );
  }
}

function cleanupHighlightTrail(now: number): void {
  const firstActiveIndex = highlightTrail.findIndex((point) => now - point.time < HIGHLIGHT_LIFETIME);

  if (firstActiveIndex > 0) {
    highlightTrail.splice(0, firstActiveIndex);
  } else if (firstActiveIndex === -1) {
    highlightTrail.length = 0;
  }
}

function getTrailInfluence(centerX: number, centerWorldY: number, now: number): number {
  if (highlightTrail.length === 0) {
    return 0;
  }

  const radius = width < 640 ? POINTER_RADIUS.mobile : POINTER_RADIUS.desktop;

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
  const newest = highlightTrail.at(-1);

  return newest !== undefined && now - newest.time < HIGHLIGHT_LIFETIME;
}

/* Rendering */

function rebuildAmbientGradient(palette: TrianglePalette): void {
  if (!context) {
    ambientGradient = null;
    return;
  }

  ambientGradient = context.createRadialGradient(
    width * 0.5,
    height * 0.36,
    0,
    width * 0.5,
    height * 0.36,
    width * 0.72,
  );

  ambientGradient.addColorStop(0, `rgba(${palette.ambient}, 0.055)`);

  ambientGradient.addColorStop(1, `rgba(${palette.ambient}, 0)`);
}

function drawAmbientGradient(): void {
  if (!context) {
    return;
  }

  const gradient = ambientGradient;

  if (!gradient) {
    return;
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawTriangle(
  tile: TriangleTile,
  palette: TrianglePalette,
  motion: number,
  baseWorldY: number,
  now: number,
): void {
  if (!context) {
    return;
  }

  const x = tile.column * metrics.cellWidth;
  const centerWorldX = x + metrics.cellWidth * 0.5;
  const centerWorldY = baseWorldY + metrics.cellHeight * 0.5;

  const idle = motion * Math.sin(elapsedTime * tile.speed + tile.phase);

  const trailInfluence = getTrailInfluence(centerWorldX, centerWorldY, now);

  const offsetX = tile.driftX * idle;
  const offsetY = tile.driftY * idle;

  const baseAlpha = 0.045 + tile.tone * 0.055 + Math.abs(idle) * 0.018;

  const alpha = (baseAlpha + trailInfluence * 0.22) * motion;

  const path = tile.side === 'a' ? trianglePathA : trianglePathB;

  if (!path) {
    return;
  }

  context.save();
  context.translate(x + offsetX, baseWorldY - scrollOffset + offsetY);

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

function drawFrame(timestamp = performance.now()): void {
  animationFrame = null;

  if (!context || !canvas.value) {
    return;
  }

  const delta = lastFrameTime === 0 ? 16.67 : Math.min(timestamp - lastFrameTime, 48);

  const parent = canvas.value.parentElement;

  const motionEnabled = reducedMotion?.matches !== true && !parent?.classList.contains('background-motion-paused');

  const sceneActive = parent?.classList.contains('background-scene-active') === true;

  cleanupHighlightTrail(timestamp);

  const trailActive = hasActiveTrail(timestamp);

  const shouldContinue = (sceneActive && motionEnabled && isDocumentVisible) || trailActive;

  const frameBudget = shouldContinue ? FRAME_BUDGET.active : FRAME_BUDGET.idle;

  if (lastFrameTime !== 0 && timestamp - lastFrameTime < frameBudget) {
    if (shouldContinue) {
      scheduleFrame();
    }

    return;
  }

  lastFrameTime = timestamp;

  if (motionEnabled) {
    elapsedTime += delta / 1000;
  }

  const palette = getPalette();

  context.clearRect(0, 0, width, height);

  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);

  syncRowsForScroll();

  // Keep a small amount of static visual variation when motion is paused.
  const motion = motionEnabled ? 1 : 0.82;

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

  if (shouldContinue) {
    scheduleFrame();
  }
}

function scheduleFrame(): void {
  if (animationFrame !== null) {
    return;
  }

  animationFrame = window.requestAnimationFrame(drawFrame);
}

/* Resize */

function resize(): void {
  const element = canvas.value;

  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();

  width = Math.max(1, Math.round(rect.width || window.innerWidth || 1));

  height = Math.max(1, Math.round(rect.height || window.innerHeight || 1));

  scrollOffset = window.scrollY;
  previousScrollOffset = scrollOffset;

  dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  element.width = Math.round(width * dpr);
  element.height = Math.round(height * dpr);

  context = element.getContext('2d', {
    alpha: true,
    desynchronized: true,
  });

  if (!context) {
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

/* Pointer */

function handlePointerMove(event: PointerEvent): void {
  const now = performance.now();

  pointerPresent = true;
  pointerX = event.clientX;
  pointerY = event.clientY;

  const worldX = pointerX;
  const worldY = pointerY + scrollOffset;

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

/* Scroll */

function handleScroll(): void {
  const parent = canvas.value?.parentElement;

  if (!parent?.classList.contains('background-scene-active')) {
    return;
  }

  const nextScrollOffset = window.scrollY;
  const scrollDelta = nextScrollOffset - previousScrollOffset;

  if (Math.abs(scrollDelta) < 0.01) {
    return;
  }

  scrollOffset = nextScrollOffset;
  previousScrollOffset = nextScrollOffset;

  if (pointerPresent && hasPointerWorldPosition) {
    const worldX = pointerX;
    const worldY = pointerY + scrollOffset;

    addHighlightSegment(lastPointerWorldX, lastPointerWorldY, worldX, worldY, 0.95);

    lastPointerWorldX = worldX;
    lastPointerWorldY = worldY;
    lastPointerPointTime = performance.now();
  }

  scheduleFrame();
}

function clearPointer(): void {
  pointerPresent = false;
  hasPointerWorldPosition = false;

  scheduleFrame();
}

/* Environment changes */

function handleVisibilityChange(): void {
  isDocumentVisible = document.visibilityState === 'visible';

  lastFrameTime = 0;

  if (isDocumentVisible) {
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
  scheduleFrame();
}

/* Lifecycle */

onMounted(() => {
  const element = canvas.value;

  if (!element) {
    return;
  }

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(element);

  window.addEventListener('resize', resize, {
    passive: true,
  });

  window.addEventListener('orientationchange', resize, { passive: true });

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  });

  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  window.addEventListener('pointerleave', clearPointer, { passive: true });

  window.addEventListener('blur', clearPointer);

  window.addEventListener('portfolio-theme-change', handleThemeChange);

  document.addEventListener('visibilitychange', handleVisibilityChange);

  reducedMotion.addEventListener('change', handleMotionPreferenceChange);

  resize();
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
  window.removeEventListener('pointerleave', clearPointer);
  window.removeEventListener('blur', clearPointer);
  window.removeEventListener('portfolio-theme-change', handleThemeChange);

  document.removeEventListener('visibilitychange', handleVisibilityChange);

  reducedMotion?.removeEventListener('change', handleMotionPreferenceChange);

  tileRows.length = 0;
  highlightTrail.length = 0;

  context = null;
  trianglePathA = null;
  trianglePathB = null;
  ambientGradient = null;

  cachedPalette = null;
  cachedTheme = null;
  reducedMotion = null;

  pointerPresent = false;
  hasPointerWorldPosition = false;

  pointerX = 0;
  pointerY = 0;

  lastPointerWorldX = 0;
  lastPointerWorldY = 0;
  lastPointerPointTime = 0;

  scrollOffset = 0;
  previousScrollOffset = 0;

  lastFrameTime = 0;
  elapsedTime = 0;
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
