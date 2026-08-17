<script setup lang="ts">
/**
 * Renders a viewport-synchronized Canvas2D triangle mesh. Idle movement,
 * pointer deformation and scroll-driven wake updates are independently
 * controllable while cached geometry keeps static rendering inexpensive.
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
import { TRIANGLE_MESH_QUALITY_PRESETS } from './config';

interface MeshPoint {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  amplitudeX: number;
  amplitudeY: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
}

interface MeshTriangle {
  a: number;
  b: number;
  c: number;
  tone: number;
}

interface MeshEdge {
  a: number;
  b: number;
  tone: number;
}

interface MeshPalette {
  line: string;
  glow: string;
  node: string;
  ambient: string;
  baseLineAlpha: number;
  baseFillAlpha: number;
}

const props = withDefaults(defineProps<BackgroundSceneProps>(), {
  active: true,
  animations: createDefaultBackgroundAnimationSettings,
  performance: createDefaultBackgroundPerformanceSettings,
});
const emit = defineEmits<BackgroundSceneEmits>();

const canvas = ref<HTMLCanvasElement | null>(null);

/* -------------------------------------------------------------------------- */
/* Mesh                                                                       */
/* -------------------------------------------------------------------------- */

const points: MeshPoint[] = [];
const triangles: MeshTriangle[] = [];
const edges: MeshEdge[] = [];

/*
 * Pointer influence wird pro Point nur einmal pro Frame berechnet.
 *
 * Das spart sehr viele Distanzberechnungen:
 *
 * vorher:
 *   Edge -> point A
 *   Edge -> point B
 *   Edge -> midpoint
 *   ...
 *
 * jetzt:
 *   Point influence -> einmal
 *   Edge/Node -> cached value
 */
const pointWakeInfluence: number[] = [];
const pointCoreInfluence: number[] = [];

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const POINTER_WAKE_DURATION = 3_200;
const POINTER_WAKE_ATTACK_RATE = 7.5;
const POINTER_ACTIVITY_HOLD = 160;

const POINTER_WAKE_RADIUS = 320;
const POINTER_WAKE_MIN_RADIUS = 72;
const POINTER_CORE_RADIUS = 58;

/*
 * Zusätzlicher Bereich um den sichtbaren Viewport.
 *
 * Elemente innerhalb dieses Bereichs werden noch verarbeitet,
 * damit beim Scrollen keine sichtbaren Pop-In-Effekte entstehen.
 */
const RENDER_MARGIN = 180;

/*
 * Canvas-Auflösung.
 *
 * 1.5 reicht für diesen Hintergrund normalerweise völlig aus
 * und reduziert die Anzahl der zu zeichnenden Pixel deutlich
 * gegenüber einem unlimitierten devicePixelRatio.
 */
/* -------------------------------------------------------------------------- */
/* Canvas / Runtime State                                                     */
/* -------------------------------------------------------------------------- */

let context: CanvasRenderingContext2D | null = null;
let animationFrame: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let environment: BackgroundEnvironment | null = null;
let performanceRuntime: BackgroundPerformanceRuntime<(typeof TRIANGLE_MESH_QUALITY_PRESETS)[number]> | null = null;

let isDocumentVisible = true;

let width = 1;
let height = 1;
let worldHeight = 1;

let scrollOffset = 0;

let lastFrameTime = 0;
let elapsedTime = 0;

/* -------------------------------------------------------------------------- */
/* Pointer State                                                               */
/* -------------------------------------------------------------------------- */

let pointerX = 0;

/*
 * pointerY ist WORLD Y.
 *
 * Screen Y:
 *
 *   pointerClientY
 *
 * World Y:
 *
 *   pointerClientY + scrollOffset
 */
let pointerY = 0;
let pointerClientY = 0;

let pointerStrength = 0;
let pointerRadius = POINTER_WAKE_MIN_RADIUS;

let pointerPresent = false;

let lastPointerActivity = Number.NEGATIVE_INFINITY;

let activityWasFresh = false;

let releaseStartedAt = Number.NEGATIVE_INFINITY;

let releaseStartStrength = 0;
let releaseStartRadius = POINTER_WAKE_MIN_RADIUS;

/* -------------------------------------------------------------------------- */
/* Cached Palette                                                             */
/* -------------------------------------------------------------------------- */

let cachedPalette: MeshPalette | null = null;

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

/*
 * Schneller als Math.hypot().
 *
 * Für Pointer-Influence brauchen wir nur die
 * Distanz im Vergleich mit einem Radius.
 */
function getDistanceSquared(dx: number, dy: number): number {
  return dx * dx + dy * dy;
}

function getPalette(): MeshPalette {
  const theme = document.documentElement.dataset.theme ?? 'dark';

  if (cachedPalette && cachedTheme === theme) {
    return cachedPalette;
  }

  cachedTheme = theme;

  cachedPalette =
    theme === 'light'
      ? {
          line: '#4a6f9e',
          glow: '#075fd7',
          node: '#075fd7',
          ambient: '7, 95, 215',
          baseLineAlpha: 0.22,
          baseFillAlpha: 0.032,
        }
      : {
          line: '#668bbd',
          glow: '#72aaff',
          node: '#9bc4ff',
          ambient: '50, 132, 255',
          baseLineAlpha: 0.19,
          baseFillAlpha: 0.024,
        };

  return cachedPalette;
}

/* -------------------------------------------------------------------------- */
/* Mesh Construction                                                          */
/* -------------------------------------------------------------------------- */

function addEdge(a: number, b: number, tone: number, edgeKeys: Set<string>): void {
  const start = Math.min(a, b);
  const end = Math.max(a, b);

  const key = `${start}:${end}`;

  if (edgeKeys.has(key)) {
    return;
  }

  edgeKeys.add(key);

  edges.push({
    a: start,
    b: end,
    tone,
  });
}

function addTriangle(a: number, b: number, c: number, tone: number, edgeKeys: Set<string>): void {
  triangles.push({
    a,
    b,
    c,
    tone,
  });

  addEdge(a, b, tone, edgeKeys);

  addEdge(b, c, tone, edgeKeys);

  addEdge(c, a, tone, edgeKeys);
}

function buildMesh(): void {
  points.length = 0;
  triangles.length = 0;
  edges.length = 0;

  pointWakeInfluence.length = 0;
  pointCoreInfluence.length = 0;

  const baseSpacing = width < 640 ? 112 : width < 1_000 ? 128 : 148;

  const spacing = baseSpacing * (performanceRuntime?.currentPreset.spacingScale ?? 1);

  const rowSpacing = spacing * 0.79;

  const columns = Math.ceil(width / spacing) + 3;

  const rows = Math.ceil(worldHeight / rowSpacing) + 3;

  const startX = -spacing * 1.25;

  const startY = -rowSpacing;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const seed = row * 101 + column * 37 + 1;

      const offsetX = row % 2 === 0 ? 0 : spacing * 0.5;

      const jitterX = (seededRandom(seed) - 0.5) * spacing * 0.26;

      const jitterY = (seededRandom(seed + 7) - 0.5) * rowSpacing * 0.24;

      const baseX = startX + column * spacing + offsetX + jitterX;

      const baseY = startY + row * rowSpacing + jitterY;

      points.push({
        baseX,
        baseY,

        x: baseX,
        y: baseY,

        amplitudeX: 8 + seededRandom(seed + 13) * 18,

        amplitudeY: 7 + seededRandom(seed + 19) * 16,

        phaseX: seededRandom(seed + 23) * Math.PI * 2,

        phaseY: seededRandom(seed + 29) * Math.PI * 2,

        speedX: 0.22 + seededRandom(seed + 31) * 0.25,

        speedY: 0.18 + seededRandom(seed + 43) * 0.28,
      });

      pointWakeInfluence.push(0);
      pointCoreInfluence.push(0);
    }
  }

  const edgeKeys = new Set<string>();

  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const topLeft = row * columns + column;

      const topRight = topLeft + 1;

      const bottomLeft = topLeft + columns;

      const bottomRight = bottomLeft + 1;

      const tone = 0.72 + seededRandom(row * 89 + column * 17) * 0.28;

      if ((row + column) % 2 === 0) {
        addTriangle(topLeft, topRight, bottomRight, tone, edgeKeys);

        addTriangle(topLeft, bottomRight, bottomLeft, tone * 0.82, edgeKeys);
      } else {
        addTriangle(topLeft, topRight, bottomLeft, tone * 0.82, edgeKeys);

        addTriangle(topRight, bottomRight, bottomLeft, tone, edgeKeys);
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Point Animation                                                            */
/* -------------------------------------------------------------------------- */

function updatePointPositions(time: number): void {
  const motion = props.active && !environment?.prefersReducedMotion ? 1 : 0;

  /*
   * Wenn keine Animation aktiv ist, müssen wir die
   * trigonometrischen Berechnungen überhaupt nicht machen.
   */
  if (motion === 0) {
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];

      if (!point) {
        continue;
      }

      point.x = point.baseX;
      point.y = point.baseY;
    }

    return;
  }

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (!point) {
      continue;
    }

    const secondaryPhase = index * 0.31;

    point.x =
      point.baseX +
      (Math.sin(time * point.speedX + point.phaseX) * point.amplitudeX +
        Math.sin(time * 0.07 + secondaryPhase) * point.amplitudeX * 0.35);

    point.y =
      point.baseY +
      (Math.cos(time * point.speedY + point.phaseY) * point.amplitudeY +
        Math.sin(time * 0.085 - secondaryPhase) * point.amplitudeY * 0.28);
  }
}

/* -------------------------------------------------------------------------- */
/* Pointer Influence Cache                                                    */
/* -------------------------------------------------------------------------- */

function getWakeInfluenceAt(x: number, y: number, radius: number): number {
  if (pointerStrength <= 0.001) {
    return 0;
  }

  const dynamicRadius = Math.max(POINTER_WAKE_MIN_RADIUS, radius * (pointerRadius / POINTER_WAKE_RADIUS));

  const dx = x - pointerX;

  const dy = y - pointerY;

  const distanceSquared = getDistanceSquared(dx, dy);

  const outerRadiusSquared = dynamicRadius * dynamicRadius;

  if (distanceSquared >= outerRadiusSquared) {
    return 0;
  }

  /*
   * Nur hier brauchen wir sqrt.
   *
   * Wichtig:
   * Durch den Radius-Culling-Check wird sqrt nur
   * für Punkte innerhalb des Wake-Bereichs ausgeführt.
   */
  const distance = Math.sqrt(distanceSquared);

  return (1 - smoothstep(dynamicRadius * 0.18, dynamicRadius, distance)) * pointerStrength;
}

function getCoreInfluenceAt(x: number, y: number): number {
  if (!props.active || !pointerPresent) {
    return 0;
  }

  const dx = x - pointerX;

  const dy = y - pointerY;

  const distanceSquared = getDistanceSquared(dx, dy);

  const radius = POINTER_CORE_RADIUS;

  if (distanceSquared >= radius * radius) {
    return 0;
  }

  const distance = Math.sqrt(distanceSquared);

  return 1 - smoothstep(radius * 0.18, radius, distance);
}

function updatePointerInfluenceCache(): void {
  /*
   * Wenn Pointer komplett inaktiv ist, können wir alle
   * Influence-Werte einfach auf 0 setzen.
   */
  if (pointerStrength <= 0.001 && !pointerPresent) {
    for (let index = 0; index < points.length; index += 1) {
      pointWakeInfluence[index] = 0;

      pointCoreInfluence[index] = 0;
    }

    return;
  }

  /*
   * Einmal pro Point:
   *
   * - Wake
   * - Core
   *
   * Danach greifen Nodes und Edges nur noch auf
   * diese Arrays zu.
   */
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (!point) {
      continue;
    }

    pointWakeInfluence[index] = getWakeInfluenceAt(point.x, point.y, 275);

    pointCoreInfluence[index] = getCoreInfluenceAt(point.x, point.y);
  }
}

/* -------------------------------------------------------------------------- */
/* Visibility Helpers                                                         */
/* -------------------------------------------------------------------------- */

function isPointVisible(point: MeshPoint): boolean {
  const screenY = point.y - scrollOffset;

  return screenY >= -RENDER_MARGIN && screenY <= height + RENDER_MARGIN;
}

/* -------------------------------------------------------------------------- */
/* Drawing                                                                    */
/* -------------------------------------------------------------------------- */

function drawTriangle(meshContext: CanvasRenderingContext2D, triangle: MeshTriangle, palette: MeshPalette): void {
  const a = points[triangle.a];

  const b = points[triangle.b];

  const c = points[triangle.c];

  if (!a || !b || !c) {
    return;
  }

  /*
   * Schneller Bounding-Check bevor wir irgendwelche
   * Pointer-Berechnungen durchführen.
   */
  const minY = Math.min(a.y, b.y, c.y);

  const maxY = Math.max(a.y, b.y, c.y);

  if (maxY - scrollOffset < -RENDER_MARGIN || minY - scrollOffset > height + RENDER_MARGIN) {
    return;
  }

  const centerX = (a.x + b.x + c.x) / 3;

  const centerY = (a.y + b.y + c.y) / 3;

  /*
   * Triangle influence wird nur einmal für den
   * Mittelpunkt berechnet.
   */
  const influence = getWakeInfluenceAt(centerX, centerY, 275);

  const idlePulse = 0.5 + Math.sin(elapsedTime * 0.18 + triangle.tone * 9) * 0.5;

  const alpha = palette.baseFillAlpha * triangle.tone + influence * (0.045 + idlePulse * 0.028);

  if (alpha < 0.002) {
    return;
  }

  meshContext.beginPath();

  meshContext.moveTo(a.x, a.y - scrollOffset);

  meshContext.lineTo(b.x, b.y - scrollOffset);

  meshContext.lineTo(c.x, c.y - scrollOffset);

  meshContext.closePath();

  meshContext.fillStyle = influence > 0.01 ? palette.glow : palette.line;

  meshContext.globalAlpha = alpha;

  meshContext.fill();
}

function drawEdge(meshContext: CanvasRenderingContext2D, edge: MeshEdge, palette: MeshPalette): void {
  const a = points[edge.a];

  const b = points[edge.b];

  if (!a || !b) {
    return;
  }

  const screenAY = a.y - scrollOffset;

  const screenBY = b.y - scrollOffset;

  /*
   * Edge komplett außerhalb des Viewports?
   */
  if ((screenAY < -40 && screenBY < -40) || (screenAY > height + 40 && screenBY > height + 40)) {
    return;
  }

  /*
   * Die teuren Point-Influences sind bereits gecached.
   */
  const wakeInfluence = Math.max(pointWakeInfluence[edge.a] ?? 0, pointWakeInfluence[edge.b] ?? 0);

  /*
   * Für den Mittelpunkt brauchen wir weiterhin
   * eine zusätzliche Berechnung, weil der Mittelpunkt
   * nicht selbst ein MeshPoint ist.
   *
   * Dafür verwenden wir aber nur einen Wake-Test.
   */
  const midpointX = (a.x + b.x) * 0.5;

  const midpointY = (a.y + b.y) * 0.5;

  const midpointWake = getWakeInfluenceAt(midpointX, midpointY, 250);

  const finalWake = Math.max(wakeInfluence, midpointWake);

  const coreInfluence = Math.max((pointCoreInfluence[edge.a] ?? 0) * 0.34, (pointCoreInfluence[edge.b] ?? 0) * 0.34);

  const influence = Math.max(finalWake, coreInfluence);

  const idleShimmer = 0.78 + Math.sin(elapsedTime * 0.3 + edge.tone * 17) * 0.22;

  meshContext.beginPath();

  meshContext.moveTo(a.x, screenAY);

  meshContext.lineTo(b.x, screenBY);

  meshContext.strokeStyle = influence > 0.015 ? palette.glow : palette.line;

  meshContext.globalAlpha = palette.baseLineAlpha * edge.tone * idleShimmer + influence * 0.62;

  meshContext.lineWidth = 0.78 + influence * 1.55;

  meshContext.stroke();
}

function drawNode(
  meshContext: CanvasRenderingContext2D,
  point: MeshPoint,
  pointIndex: number,
  palette: MeshPalette,
): void {
  const screenY = point.y - scrollOffset;

  if (screenY < -10 || screenY > height + 10) {
    return;
  }

  /*
   * Beide Werte kommen aus dem Cache.
   */
  const wakeInfluence = pointWakeInfluence[pointIndex] ?? 0;

  const coreInfluence = pointCoreInfluence[pointIndex] ?? 0;

  const influence = Math.max(wakeInfluence, coreInfluence);

  if (influence < 0.025) {
    return;
  }

  meshContext.beginPath();

  meshContext.arc(point.x, screenY, 1.1 + influence * 2.1, 0, Math.PI * 2);

  meshContext.fillStyle = palette.node;

  meshContext.globalAlpha = 0.24 + influence * 0.76;

  /*
   * Shadow wird nur im kleinen Core-Bereich
   * aktiviert.
   */
  if (coreInfluence > 0.01) {
    meshContext.shadowColor = palette.glow;

    meshContext.shadowBlur = 5 + coreInfluence * 10;
  } else {
    meshContext.shadowBlur = 0;
  }

  meshContext.fill();

  /*
   * Wichtig:
   * globalAlpha und shadowBlur zurücksetzen,
   * aber kein save()/restore() pro Node.
   */
  meshContext.globalAlpha = 1;
  meshContext.shadowBlur = 0;
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                      */
/* -------------------------------------------------------------------------- */

function drawScene(): void {
  if (!context) {
    return;
  }

  const meshContext = context;

  const palette = getPalette();

  meshContext.clearRect(0, 0, width, height);

  /*
   * Pointer-Wake-Glow.
   */
  const pointerScreenY = pointerY - scrollOffset;

  if (pointerStrength > 0.002) {
    const glow = meshContext.createRadialGradient(pointerX, pointerScreenY, 0, pointerX, pointerScreenY, pointerRadius);

    glow.addColorStop(0, `rgba(${palette.ambient}, ${0.075 * pointerStrength})`);

    glow.addColorStop(0.42, `rgba(${palette.ambient}, ${0.025 * pointerStrength})`);

    glow.addColorStop(1, `rgba(${palette.ambient}, 0)`);

    meshContext.fillStyle = glow;

    meshContext.globalAlpha = 1;

    meshContext.fillRect(
      pointerX - pointerRadius,
      pointerScreenY - pointerRadius,
      pointerRadius * 2,
      pointerRadius * 2,
    );
  }

  /*
   * Kleiner Core-Glow.
   */
  if (props.active && pointerPresent) {
    const coreGlow = meshContext.createRadialGradient(
      pointerX,
      pointerScreenY,
      0,
      pointerX,
      pointerScreenY,
      POINTER_CORE_RADIUS,
    );

    coreGlow.addColorStop(0, `rgba(${palette.ambient}, 0.075)`);

    coreGlow.addColorStop(0.35, `rgba(${palette.ambient}, 0.028)`);

    coreGlow.addColorStop(1, `rgba(${palette.ambient}, 0)`);

    meshContext.fillStyle = coreGlow;

    meshContext.globalAlpha = 1;

    meshContext.fillRect(
      pointerX - POINTER_CORE_RADIUS,
      pointerScreenY - POINTER_CORE_RADIUS,
      POINTER_CORE_RADIUS * 2,
      POINTER_CORE_RADIUS * 2,
    );
  }

  /*
   * Pointer-Einflüsse einmal pro Frame berechnen.
   */
  updatePointerInfluenceCache();

  /*
   * Triangles.
   */
  for (let index = 0; index < triangles.length; index += 1) {
    const triangle = triangles[index];

    if (!triangle) {
      continue;
    }
    drawTriangle(meshContext, triangle, palette);
  }

  /*
   * Edges.
   */
  for (let index = 0; index < edges.length; index += 1) {
    const edge = edges[index];

    if (!edge) {
      continue;
    }
    drawEdge(meshContext, edge, palette);
  }

  /*
   * Nodes.
   */
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (!point) {
      continue;
    }

    drawNode(meshContext, point, index, palette);
  }

  meshContext.globalAlpha = 1;

  meshContext.shadowBlur = 0;
}

/* -------------------------------------------------------------------------- */
/* Animation                                                                  */
/* -------------------------------------------------------------------------- */

function render(now: number): void {
  animationFrame = null;

  /*
   * Große Zeit-Sprünge werden begrenzt.
   */
  const delta = lastFrameTime === 0 ? 0 : Math.min((now - lastFrameTime) / 1_000, 0.05);

  lastFrameTime = now;

  const motionEnabled = props.active && props.animations.idle && !environment?.prefersReducedMotion;

  if (motionEnabled) {
    elapsedTime += delta;
  }

  const activityIsFresh = props.active && now - lastPointerActivity < POINTER_ACTIVITY_HOLD;

  /*
   * Pointer Wake Attack.
   */
  if (activityIsFresh) {
    const fadeIn = 1 - Math.exp(-delta * POINTER_WAKE_ATTACK_RATE);

    pointerStrength += (1 - pointerStrength) * fadeIn;

    pointerRadius += (POINTER_WAKE_RADIUS - pointerRadius) * fadeIn;
  } else {
    /*
     * Beginn des Release-Fades.
     */
    if (activityWasFresh) {
      releaseStartedAt = now;

      releaseStartStrength = pointerStrength;

      releaseStartRadius = pointerRadius;
    }

    const releaseProgress = Math.min(1, Math.max(0, (now - releaseStartedAt) / POINTER_WAKE_DURATION));

    const easedReleaseProgress = smoothstep(0, 1, releaseProgress);

    pointerStrength = releaseStartStrength * (1 - easedReleaseProgress);

    pointerRadius = releaseStartRadius + (POINTER_WAKE_MIN_RADIUS - releaseStartRadius) * easedReleaseProgress;
  }

  if (!props.active) {
    pointerStrength = 0;
    pointerRadius = POINTER_WAKE_MIN_RADIUS;
  }

  activityWasFresh = activityIsFresh;

  /*
   * Mesh-Bewegung.
   */
  updatePointPositions(elapsedTime);

  /*
   * Rendern.
   */
  drawScene();

  const qualityChange = performanceRuntime?.recordFrame(now);

  if (qualityChange) {
    resize();
    updatePerformanceStats(now, true);
  }

  updatePerformanceStats(now);

  /*
   * Nur weiter animieren, wenn tatsächlich etwas
   * animiert werden muss.
   */
  const needsPointerTransition = activityIsFresh || pointerStrength > 0.002;

  const shouldAnimate = isDocumentVisible && (motionEnabled || needsPointerTransition);

  if (shouldAnimate) {
    animationFrame = window.requestAnimationFrame(render);
  }
}

function requestRender(): void {
  if (animationFrame !== null || !isDocumentVisible) {
    return;
  }

  lastFrameTime = 0;

  animationFrame = window.requestAnimationFrame(render);
}

/* -------------------------------------------------------------------------- */
/* Resize                                                                     */
/* -------------------------------------------------------------------------- */

function resize(): void {
  const element = canvas.value;

  if (!element || !context) {
    return;
  }

  const bounds = element.getBoundingClientRect();

  width = Math.max(1, Math.round(bounds.width));

  height = Math.max(1, Math.round(bounds.height));

  /*
   * Das Mesh bleibt weiterhin so groß wie der komplette
   * Dokument-Content.
   */
  worldHeight = Math.max(height, element.parentElement?.parentElement?.scrollHeight ?? height);

  scrollOffset = window.scrollY;

  const pixelRatioCap = performanceRuntime?.currentPreset.pixelRatioCap ?? 1.5;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioCap);

  element.width = Math.round(width * pixelRatio);

  element.height = Math.round(height * pixelRatio);

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  buildMesh();

  lastFrameTime = 0;

  requestRender();
}

/* -------------------------------------------------------------------------- */
/* Pointer                                                                     */
/* -------------------------------------------------------------------------- */

function handlePointerMove(event: PointerEvent): void {
  if (!props.active || !props.animations.cursorMovement || event.pointerType === 'touch') {
    return;
  }

  pointerX = event.clientX;

  pointerClientY = event.clientY;

  pointerY = pointerClientY + scrollOffset;

  pointerPresent = true;

  lastPointerActivity = performance.now();

  requestRender();
}

function handlePointerOut(event: PointerEvent): void {
  if (event.relatedTarget !== null) {
    return;
  }

  pointerPresent = false;

  lastPointerActivity = Number.NEGATIVE_INFINITY;

  requestRender();
}

function handlePointerDown(event: PointerEvent): void {
  if (!props.active || !props.animations.cursorClick) {
    return;
  }

  pointerX = event.clientX;

  pointerClientY = event.clientY;

  pointerY = pointerClientY + scrollOffset;

  pointerPresent = true;

  lastPointerActivity = performance.now();

  requestRender();
}

function handlePointerUp(): void {
  pointerPresent = false;

  lastPointerActivity = Number.NEGATIVE_INFINITY;

  requestRender();
}

/* -------------------------------------------------------------------------- */
/* Scroll                                                                      */
/* -------------------------------------------------------------------------- */

function handleScroll(): void {
  scrollOffset = window.scrollY;

  /*
   * Cursor bleibt physisch an derselben Screen-Position,
   * bekommt aber eine neue World-Y-Position.
   *
   * Das ist KEIN Maus-Parallax.
   *
   * Das Mesh selbst bleibt an die Scroll-Position gekoppelt.
   */
  pointerY = pointerClientY + scrollOffset;

  /*
   * Scrollen hält den Wake-Effekt aktiv,
   * wenn der Pointer vorhanden ist.
   */
  if (props.active && props.animations.scroll && pointerPresent) {
    lastPointerActivity = performance.now();
  }

  requestRender();
}

/* -------------------------------------------------------------------------- */
/* Visibility / Motion / Theme                                                */
/* -------------------------------------------------------------------------- */

function handleVisibilityChange(): void {
  isDocumentVisible = !document.hidden;

  if (!isDocumentVisible && animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);

    animationFrame = null;
  }

  if (isDocumentVisible) {
    requestRender();
  }
}

function handleMotionPreferenceChange(): void {
  elapsedTime = 0;

  requestRender();
}

function handleThemeChange(): void {
  cachedPalette = null;
  cachedTheme = null;

  requestRender();
}

function updatePerformanceStats(now: number, force = false): void {
  if (!performanceRuntime?.shouldPublishStats(now, force)) return;

  const pixelRatioCap = performanceRuntime.currentPreset.pixelRatioCap;
  const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);

  emit('performanceStats', {
    name: 'Living mesh',
    renderer: 'Canvas2D',
    mode: props.performance.mode,
    preset: performanceRuntime.currentPreset.id,
    fps: performanceRuntime.fps,
    frameTime: performanceRuntime.averageFrameTime,
    resolution: `${Math.round(width * dpr)} × ${Math.round(height * dpr)}`,
    dpr,
    details: {
      Points: points.length,
      Triangles: triangles.length,
      Edges: edges.length,
    },
  });
}

function applyPerformanceMode(): void {
  if (!performanceRuntime) return;

  performanceRuntime.setMode(props.performance.mode);
  resize();
  updatePerformanceStats(performance.now(), true);
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

watch(
  () => [
    props.active,
    props.animations.idle,
    props.animations.cursorMovement,
    props.animations.cursorClick,
    props.animations.scroll,
  ],
  ([active, , cursorMovement, cursorClick, scroll]) => {
    if (!active || (!cursorMovement && !cursorClick && !scroll)) {
      pointerStrength = 0;
      pointerPresent = false;
    }

    if (!active) performanceRuntime?.resetMeasurements();

    requestRender();
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

  if (!element) {
    return;
  }

  performanceRuntime = new BackgroundPerformanceRuntime(
    TRIANGLE_MESH_QUALITY_PRESETS,
    props.performance.mode,
  );

  context = element.getContext('2d', {
    alpha: true,
    desynchronized: true,
  });

  if (!context) {
    return;
  }

  environment = new BackgroundEnvironment({
    onMotionPreferenceChange: handleMotionPreferenceChange,
    onThemeChange: handleThemeChange,
    onVisibilityChange: handleVisibilityChange,
  });

  resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(element);

  /*
   * Parent ebenfalls beobachten, weil sich die
   * Dokumenthöhe ändern kann.
   */
  if (element.parentElement?.parentElement) {
    resizeObserver.observe(element.parentElement.parentElement);
  }

  window.addEventListener('pointermove', handlePointerMove, {
    passive: true,
  });

  window.addEventListener('pointerout', handlePointerOut, {
    passive: true,
  });

  window.addEventListener('pointerdown', handlePointerDown, {
    passive: true,
  });

  window.addEventListener('pointerup', handlePointerUp, {
    passive: true,
  });

  window.addEventListener('pointercancel', handlePointerUp, {
    passive: true,
  });

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  });

  resize();
  updatePerformanceStats(performance.now(), true);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();

  environment?.dispose();
  environment = null;

  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);
  }

  window.removeEventListener('pointermove', handlePointerMove);

  window.removeEventListener('pointerout', handlePointerOut);

  window.removeEventListener('pointerdown', handlePointerDown);

  window.removeEventListener('pointerup', handlePointerUp);

  window.removeEventListener('pointercancel', handlePointerUp);

  window.removeEventListener('scroll', handleScroll);

  points.length = 0;
  triangles.length = 0;
  edges.length = 0;

  pointWakeInfluence.length = 0;
  pointCoreInfluence.length = 0;

  context = null;
  cachedPalette = null;
  cachedTheme = null;
  performanceRuntime = null;
});
</script>

<template>
  <div
    class="triangle-mesh-background"
    aria-hidden="true"
  >
    <canvas ref="canvas" />

    <div class="mesh-vignette" />
  </div>
</template>

<style scoped>
.triangle-mesh-background {
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

.triangle-mesh-background::before {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(circle at 76% 14%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 30rem),
    radial-gradient(circle at 14% 72%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 34rem);

  content: '';

  opacity: 0.8;

  pointer-events: none;
}

.triangle-mesh-background canvas {
  position: absolute;
  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  pointer-events: none;
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
  .triangle-mesh-background {
    opacity: 0.76;
  }
}
</style>
