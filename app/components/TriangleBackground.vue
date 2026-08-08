```vue
<script setup lang="ts">
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

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const TARGET_TRIANGLES_DESKTOP = 1000;
const TARGET_TRIANGLES_TABLET = 480;
const TARGET_TRIANGLES_MOBILE = 320;

const MAX_DPR = 1.35;

const IDLE_FRAME_BUDGET_MS = 1000 / 30;
const ACTIVE_FRAME_BUDGET_MS = 1000 / 60;

/*
 * Radius der Highlight-Spur.
 *
 * Das ist ausschließlich der Radius des Trail-Effekts.
 * Die Tiles werden NICHT mehr zur Maus hin verschoben.
 */
const POINTER_RADIUS_DESKTOP = 135;
const POINTER_RADIUS_MOBILE = 100;

/*
 * Wie lange ein Highlight sichtbar bleibt.
 */
const HIGHLIGHT_LIFETIME = 1000;

/*
 * Maximale Anzahl gespeicherter Highlight-Punkte.
 */
const MAX_HIGHLIGHT_POINTS = 32;

/*
 * Abstand zwischen interpolierten Trail-Punkten.
 */
const TRAIL_SPACING = 18;

/*
 * Verhindert, dass bei sehr vielen Pointer Events
 * unnötig viele Punkte erzeugt werden.
 */
const MIN_POINTER_DISTANCE = 8;
const MIN_POINTER_INTERVAL = 24;

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

const tileRows: TileRow[] = [];

/*
 * Der komplette Highlight-Trail.
 *
 * Die Punkte bleiben an ihrer World-Position.
 */
const highlightTrail: HighlightPoint[] = [];

let context: CanvasRenderingContext2D | null = null;

let resizeObserver: ResizeObserver | null = null;
let reducedMotion: MediaQueryList | null = null;
let colorScheme: MediaQueryList | null = null;

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

/*
 * Scroll-Position in World Coordinates.
 */
let scrollOffset = 0;
let previousScrollOffset = 0;

/*
 * Cursor bleibt in Screen Coordinates.
 *
 * Er wird ausschließlich verwendet, um den Trail zu erzeugen.
 * Er beeinflusst NICHT mehr die Position der Tiles.
 */
let pointerX = 0;
let pointerY = 0;

let pointerPresent = false;

/*
 * Letzte Cursorposition in WORLD coordinates.
 *
 * Dadurch kann Scrollen ebenfalls eine virtuelle Bewegung
 * des Cursors durch die Grid-Welt erzeugen.
 */
let lastPointerWorldX = 0;
let lastPointerWorldY = 0;

let hasPointerWorldPosition = false;

let lastPointerPointTime = 0;

let isDocumentVisible = true;

/* -------------------------------------------------------------------------- */
/* Cached rendering data                                                      */
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
  const normalized = Math.min(1, Math.max(0, (value - edgeStart) / (edgeEnd - edgeStart)));

  return normalized * normalized * (3 - 2 * normalized);
}

function getTargetTriangleCount(): number {
  if (width < 640) {
    return TARGET_TRIANGLES_MOBILE;
  }

  if (width < 1000) {
    return TARGET_TRIANGLES_TABLET;
  }

  return TARGET_TRIANGLES_DESKTOP;
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

/* -------------------------------------------------------------------------- */
/* Grid                                                                       */
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
  const cellWidth = metrics.cellWidth;

  const cellHeight = metrics.cellHeight;

  trianglePathA = new Path2D();

  trianglePathA.moveTo(0, 0);

  trianglePathA.lineTo(cellWidth, 0);

  trianglePathA.lineTo(0, cellHeight);

  trianglePathA.closePath();

  trianglePathB = new Path2D();

  trianglePathB.moveTo(cellWidth, 0);

  trianglePathB.lineTo(cellWidth, cellHeight);

  trianglePathB.lineTo(0, cellHeight);

  trianglePathB.closePath();
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
  if (!context) return;

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
/* World Coordinates                                                          */
/* -------------------------------------------------------------------------- */

/*
 * Screen -> World
 *
 * X bleibt gleich.
 *
 * Y wird um scrollOffset nach unten in die Welt verschoben.
 */
function getPointerWorldX(): number {
  return pointerX;
}

function getPointerWorldY(): number {
  return pointerY + scrollOffset;
}

/* -------------------------------------------------------------------------- */
/* Highlight Trail                                                            */
/* -------------------------------------------------------------------------- */

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

  while (firstValidIndex < highlightTrail.length && now - highlightTrail[firstValidIndex].time >= HIGHLIGHT_LIFETIME) {
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

  for (let index = 0; index < highlightTrail.length; index += 1) {
    const point = highlightTrail[index];

    const age = now - point.time;

    if (age >= HIGHLIGHT_LIFETIME) {
      continue;
    }

    const dx = centerX - point.x;

    const dy = centerWorldY - point.worldY;

    const distanceSquared = dx * dx + dy * dy;

    /*
     * Schneller Reject:
     *
     * Kein sqrt / hypot, wenn das Tile
     * sowieso außerhalb des Radius liegt.
     */
    if (distanceSquared >= radiusSquared) {
      continue;
    }

    const distance = Math.sqrt(distanceSquared);

    const normalizedAge = age / HIGHLIGHT_LIFETIME;

    const fade = (1 - normalizedAge) ** 2;

    const proximity = smoothstep(radius, 0, distance);

    const pointInfluence = proximity * fade * point.strength;

    influence = Math.max(influence, pointInfluence);

    /*
     * Wenn bereits maximaler Einfluss erreicht wurde,
     * brauchen wir nicht weiterzusuchen.
     */
    if (influence >= 1) {
      return 1;
    }
  }

  return Math.min(1, influence);
}

function hasActiveTrail(now: number): boolean {
  if (highlightTrail.length === 0) {
    return false;
  }

  const newest = highlightTrail[highlightTrail.length - 1];

  return now - newest.time < HIGHLIGHT_LIFETIME;
}

/* -------------------------------------------------------------------------- */
/* Ambient Gradient                                                           */
/* -------------------------------------------------------------------------- */

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

function drawAmbientGradient(palette: TrianglePalette): void {
  if (!context) return;

  /*
   * Der Gradient wird normalerweise beim Resize
   * bzw. Theme-Wechsel erzeugt.
   *
   * Fallback, falls noch keiner existiert.
   */
  if (!ambientGradient) {
    rebuildAmbientGradient(palette);
  }

  if (!ambientGradient) return;

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
  if (!context) return;

  const x = tile.column * metrics.cellWidth;

  const centerWorldX = x + metrics.cellWidth * 0.5;

  const centerWorldY = baseWorldY + metrics.cellHeight * 0.5;

  /*
   * World Y -> Screen Y
   */
  const screenY = baseWorldY - scrollOffset;

  /*
   * Normale Idle-Bewegung bleibt erhalten.
   *
   * WICHTIG:
   *
   * Es gibt hier KEINEN pointerOffset mehr.
   *
   * Die Maus beeinflusst ausschließlich
   * den Highlight-Trail.
   */
  const idle = motion * Math.sin(elapsedTime * tile.speed + tile.phase);

  const trailInfluence = getTrailInfluence(centerWorldX, centerWorldY, now);

  const offsetX = tile.driftX * idle;

  const offsetY = tile.driftY * idle;

  const baseAlpha = 0.045 + tile.tone * 0.055 + Math.abs(idle) * 0.018;

  const alpha = (baseAlpha + trailInfluence * 0.22) * motion;

  const path = tile.side === 'a' ? trianglePathA : trianglePathB;

  if (!path) return;

  context.save();

  context.translate(x + offsetX, screenY + offsetY);

  if (trailInfluence > 0.015) {
    context.fillStyle = `rgba(${palette.accent}, ${alpha})`;

    context.fill(path);

    /*
     * Feine Kante bei stärkerem Highlight.
     */
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

function drawFrame(timestamp = performance.now()): void {
  animationFrame = null;

  if (!context) return;

  const element = canvas.value;

  if (!element) return;

  const delta = lastFrameTime === 0 ? 16.67 : Math.min(timestamp - lastFrameTime, 48);

  const parent = element.parentElement;

  const motionEnabled = !reducedMotion?.matches && !parent?.classList.contains('background-motion-paused');

  const sceneActive = parent?.classList.contains('background-scene-active') === true;

  cleanupHighlightTrail(timestamp);

  const trailActive = hasActiveTrail(timestamp);

  /*
   * WICHTIG:
   *
   * Es gibt keine pointerStrength-Abhängigkeit mehr.
   *
   * Die Animation läuft nur:
   *
   * 1. wenn die Scene aktiv ist
   * 2. oder wenn der Trail noch ausfadet.
   */
  const shouldContinue = (sceneActive && motionEnabled && isDocumentVisible) || trailActive;

  const frameBudget = shouldContinue ? ACTIVE_FRAME_BUDGET_MS : IDLE_FRAME_BUDGET_MS;

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

  const motion = motionEnabled ? 1 : 0.82;

  for (const row of tileRows) {
    const rowScreenY = row.y - scrollOffset;

    /*
     * Nur sichtbare Rows rendern.
     */
    if (rowScreenY > height + metrics.cellHeight * 1.2 || rowScreenY < -metrics.cellHeight * 1.2) {
      continue;
    }

    for (const tile of row.tiles) {
      drawTriangle(tile, palette, motion, row.y, timestamp);
    }
  }

  drawAmbientGradient(palette);

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

/* -------------------------------------------------------------------------- */
/* Resize                                                                     */
/* -------------------------------------------------------------------------- */

function resize(): void {
  const element = canvas.value;

  if (!element) return;

  const rect = element.getBoundingClientRect();

  const viewportWidth = window.innerWidth || Math.max(rect.width, 1);

  const viewportHeight = window.innerHeight || Math.max(rect.height, 1);

  width = Math.max(1, Math.round(rect.width || viewportWidth));

  height = Math.max(1, Math.round(rect.height || viewportHeight));

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

  /*
   * Ambient Gradient hängt von
   * Canvas-Größe + Theme ab.
   */
  rebuildAmbientGradient(getPalette());

  const rowsNeeded = Math.max(6, Math.ceil((height + window.innerHeight * 1.2) / Math.max(metrics.cellHeight, 1)) + 4);

  buildTileRows(0, rowsNeeded);

  lastFrameTime = 0;

  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Pointer Movement                                                           */
/* -------------------------------------------------------------------------- */

function handlePointerMove(event: PointerEvent): void {
  const now = performance.now();

  pointerPresent = true;

  const newX = event.clientX;

  const newY = event.clientY;

  pointerX = newX;
  pointerY = newY;

  /*
   * Cursorposition in WORLD coordinates.
   *
   * Der Cursor wird ausschließlich für den Trail benutzt.
   *
   * Es gibt KEINEN Offset der Tiles zur Maus.
   */
  const newWorldX = newX;

  const newWorldY = newY + scrollOffset;

  /*
   * Erstes Pointer Event.
   */
  if (!hasPointerWorldPosition) {
    lastPointerWorldX = newWorldX;

    lastPointerWorldY = newWorldY;

    hasPointerWorldPosition = true;

    addHighlightPoint(newWorldX, newWorldY, 1, now);

    lastPointerPointTime = now;

    scheduleFrame();

    return;
  }

  const distance = Math.hypot(newWorldX - lastPointerWorldX, newWorldY - lastPointerWorldY);

  const timeSinceLastPoint = now - lastPointerPointTime;

  /*
   * Nur bei echter Bewegung neue Trailpunkte erzeugen.
   */
  if (distance >= MIN_POINTER_DISTANCE || timeSinceLastPoint >= MIN_POINTER_INTERVAL) {
    addHighlightSegment(lastPointerWorldX, lastPointerWorldY, newWorldX, newWorldY, 1, now);

    lastPointerWorldX = newWorldX;

    lastPointerWorldY = newWorldY;

    lastPointerPointTime = now;
  }

  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Scroll                                                                     */
/* -------------------------------------------------------------------------- */

function handleScroll(): void {
  const newScrollOffset = window.scrollY;

  const scrollDelta = newScrollOffset - previousScrollOffset;

  if (Math.abs(scrollDelta) < 0.01) {
    return;
  }

  scrollOffset = newScrollOffset;

  previousScrollOffset = newScrollOffset;

  /*
   * Wenn der Cursor vorhanden ist,
   * erzeugt Scrollen eine virtuelle Bewegung
   * des Cursors durch die World Coordinates.
   *
   * Das bleibt erhalten.
   */
  if (pointerPresent && hasPointerWorldPosition) {
    const newWorldX = pointerX;

    const newWorldY = pointerY + scrollOffset;

    addHighlightSegment(lastPointerWorldX, lastPointerWorldY, newWorldX, newWorldY, 0.95);

    lastPointerWorldX = newWorldX;

    lastPointerWorldY = newWorldY;

    lastPointerPointTime = performance.now();
  }

  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Pointer Cleanup                                                            */
/* -------------------------------------------------------------------------- */

function clearPointer(): void {
  pointerPresent = false;

  /*
   * Trail NICHT löschen.
   *
   * Er darf normal ausfaden.
   */
  scheduleFrame();
}

/* -------------------------------------------------------------------------- */
/* Visibility / Theme / Motion                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Lifecycle                                                                  */
/* -------------------------------------------------------------------------- */

onMounted(() => {
  const element = canvas.value;

  if (!element) return;

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

  resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(element);

  window.addEventListener('resize', resize, {
    passive: true,
  });

  window.addEventListener('orientationchange', resize, {
    passive: true,
  });

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  });

  window.addEventListener('pointermove', handlePointerMove, {
    passive: true,
  });

  window.addEventListener('pointerleave', clearPointer, {
    passive: true,
  });

  window.addEventListener('blur', clearPointer);

  window.addEventListener('portfolio-theme-change', handleThemeChange);

  document.addEventListener('visibilitychange', handleVisibilityChange);

  reducedMotion.addEventListener('change', handleMotionPreferenceChange);

  colorScheme.addEventListener('change', handleMotionPreferenceChange);

  resize();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();

  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);
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

  colorScheme?.removeEventListener('change', handleMotionPreferenceChange);

  tileRows.length = 0;
  highlightTrail.length = 0;

  context = null;
  trianglePathA = null;
  trianglePathB = null;
  ambientGradient = null;
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
