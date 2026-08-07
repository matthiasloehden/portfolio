<script setup lang="ts">
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

const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: true,
});

const canvas = ref<HTMLCanvasElement | null>(null);

const points: MeshPoint[] = [];
const triangles: MeshTriangle[] = [];
const edges: MeshEdge[] = [];

const POINTER_WAKE_DURATION = 3_200;
const POINTER_WAKE_ATTACK_RATE = 7.5;
const POINTER_ACTIVITY_HOLD = 160;
const POINTER_WAKE_RADIUS = 320;
const POINTER_WAKE_MIN_RADIUS = 72;
const POINTER_CORE_RADIUS = 58;

let context: CanvasRenderingContext2D | null = null;
let animationFrame: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let reducedMotion: MediaQueryList | null = null;
let isDocumentVisible = true;
let width = 1;
let height = 1;
let worldHeight = 1;
let scrollOffset = 0;
let lastFrameTime = 0;
let elapsedTime = 0;
let pointerX = 0;
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

function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43_758.5453;
  return value - Math.floor(value);
}

function getPalette(): MeshPalette {
  if (document.documentElement.dataset.theme === 'light') {
    return {
      line: '#4a6f9e',
      glow: '#075fd7',
      node: '#075fd7',
      ambient: '7, 95, 215',
      baseLineAlpha: 0.22,
      baseFillAlpha: 0.032,
    };
  }

  return {
    line: '#668bbd',
    glow: '#72aaff',
    node: '#9bc4ff',
    ambient: '50, 132, 255',
    baseLineAlpha: 0.19,
    baseFillAlpha: 0.024,
  };
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number): number {
  const normalized = Math.min(1, Math.max(0, (value - edgeStart) / (edgeEnd - edgeStart)));
  return normalized * normalized * (3 - 2 * normalized);
}

function addEdge(a: number, b: number, tone: number, edgeKeys: Set<string>): void {
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  const key = `${start}:${end}`;
  if (edgeKeys.has(key)) return;

  edgeKeys.add(key);
  edges.push({ a: start, b: end, tone });
}

function addTriangle(a: number, b: number, c: number, tone: number, edgeKeys: Set<string>): void {
  triangles.push({ a, b, c, tone });
  addEdge(a, b, tone, edgeKeys);
  addEdge(b, c, tone, edgeKeys);
  addEdge(c, a, tone, edgeKeys);
}

function buildMesh(): void {
  points.length = 0;
  triangles.length = 0;
  edges.length = 0;

  const spacing = width < 640 ? 112 : width < 1_000 ? 128 : 148;
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

function updatePointPositions(time: number): void {
  const motion = props.active && !reducedMotion?.matches ? 1 : 0;

  points.forEach((point, index) => {
    const secondaryPhase = index * 0.31;
    point.x =
      point.baseX +
      motion *
        (Math.sin(time * point.speedX + point.phaseX) * point.amplitudeX +
          Math.sin(time * 0.07 + secondaryPhase) * point.amplitudeX * 0.35);
    point.y =
      point.baseY +
      motion *
        (Math.cos(time * point.speedY + point.phaseY) * point.amplitudeY +
          Math.sin(time * 0.085 - secondaryPhase) * point.amplitudeY * 0.28);
  });
}

function getPointerInfluence(x: number, y: number, radius = 250): number {
  if (pointerStrength <= 0.001) return 0;
  const distance = Math.hypot(x - pointerX, y - pointerY);
  const dynamicRadius = Math.max(POINTER_WAKE_MIN_RADIUS, radius * (pointerRadius / POINTER_WAKE_RADIUS));
  return (1 - smoothstep(dynamicRadius * 0.18, dynamicRadius, distance)) * pointerStrength;
}

function getPointerCoreInfluence(x: number, y: number, radius = POINTER_CORE_RADIUS): number {
  if (!props.active || !pointerPresent) return 0;
  const distance = Math.hypot(x - pointerX, y - pointerY);
  return 1 - smoothstep(radius * 0.18, radius, distance);
}

function drawTriangle(meshContext: CanvasRenderingContext2D, triangle: MeshTriangle, palette: MeshPalette): void {
  const a = points[triangle.a];
  const b = points[triangle.b];
  const c = points[triangle.c];
  if (!a || !b || !c) return;

  const centerX = (a.x + b.x + c.x) / 3;
  const centerY = (a.y + b.y + c.y) / 3;
  const screenCenterY = centerY - scrollOffset;
  if (screenCenterY < -180 || screenCenterY > height + 180) return;

  const influence = getPointerInfluence(centerX, centerY, 275);
  const idlePulse = 0.5 + Math.sin(elapsedTime * 0.18 + triangle.tone * 9) * 0.5;
  const alpha = palette.baseFillAlpha * triangle.tone + influence * (0.045 + idlePulse * 0.028);
  if (alpha < 0.002) return;

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
  if (!a || !b) return;
  const screenAY = a.y - scrollOffset;
  const screenBY = b.y - scrollOffset;
  if ((screenAY < -40 && screenBY < -40) || (screenAY > height + 40 && screenBY > height + 40)) return;

  const wakeInfluence = Math.max(
    getPointerInfluence((a.x + b.x) / 2, (a.y + b.y) / 2),
    getPointerInfluence(a.x, a.y) * 0.72,
    getPointerInfluence(b.x, b.y) * 0.72,
  );
  const coreInfluence = Math.max(
    getPointerCoreInfluence((a.x + b.x) / 2, (a.y + b.y) / 2, 42) * 0.28,
    getPointerCoreInfluence(a.x, a.y) * 0.34,
    getPointerCoreInfluence(b.x, b.y) * 0.34,
  );
  const influence = Math.max(wakeInfluence, coreInfluence);
  const idleShimmer = 0.78 + Math.sin(elapsedTime * 0.3 + edge.tone * 17) * 0.22;

  meshContext.beginPath();
  meshContext.moveTo(a.x, screenAY);
  meshContext.lineTo(b.x, screenBY);
  meshContext.strokeStyle = influence > 0.015 ? palette.glow : palette.line;
  meshContext.globalAlpha = palette.baseLineAlpha * edge.tone * idleShimmer + influence * 0.62;
  meshContext.lineWidth = 0.78 + influence * 1.55;
  meshContext.stroke();
}

function drawNode(meshContext: CanvasRenderingContext2D, point: MeshPoint, palette: MeshPalette): void {
  const screenY = point.y - scrollOffset;
  if (screenY < -10 || screenY > height + 10) return;

  const wakeInfluence = getPointerInfluence(point.x, point.y, 215);
  const coreInfluence = getPointerCoreInfluence(point.x, point.y);
  const influence = Math.max(wakeInfluence, coreInfluence);
  if (influence < 0.025) return;

  meshContext.save();
  meshContext.beginPath();
  meshContext.arc(point.x, screenY, 1.1 + influence * 2.1, 0, Math.PI * 2);
  meshContext.fillStyle = palette.node;
  meshContext.globalAlpha = 0.24 + influence * 0.76;
  if (coreInfluence > 0.01) {
    meshContext.shadowColor = palette.glow;
    meshContext.shadowBlur = 5 + coreInfluence * 10;
  }
  meshContext.fill();
  meshContext.restore();
}

function drawScene(): void {
  if (!context) return;
  const meshContext = context;
  const palette = getPalette();

  meshContext.clearRect(0, 0, width, height);

  const pointerScreenY = pointerY - scrollOffset;
  if (pointerStrength > 0.002) {
    const glow = meshContext.createRadialGradient(
      pointerX,
      pointerScreenY,
      0,
      pointerX,
      pointerScreenY,
      pointerRadius,
    );
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

  triangles.forEach((triangle) => drawTriangle(meshContext, triangle, palette));
  edges.forEach((edge) => drawEdge(meshContext, edge, palette));
  points.forEach((point) => drawNode(meshContext, point, palette));
  meshContext.globalAlpha = 1;
}

function render(now: number): void {
  animationFrame = null;
  const delta = lastFrameTime === 0 ? 0 : Math.min((now - lastFrameTime) / 1_000, 0.05);
  lastFrameTime = now;

  if (props.active && !reducedMotion?.matches) elapsedTime += delta;
  const activityIsFresh = props.active && now - lastPointerActivity < POINTER_ACTIVITY_HOLD;

  if (activityIsFresh) {
    const fadeIn = 1 - Math.exp(-delta * POINTER_WAKE_ATTACK_RATE);
    pointerStrength += (1 - pointerStrength) * fadeIn;
    pointerRadius += (POINTER_WAKE_RADIUS - pointerRadius) * fadeIn;
  } else {
    if (activityWasFresh) {
      releaseStartedAt = now;
      releaseStartStrength = pointerStrength;
      releaseStartRadius = pointerRadius;
    }

    const releaseProgress = Math.min(1, Math.max(0, (now - releaseStartedAt) / POINTER_WAKE_DURATION));
    const easedReleaseProgress = smoothstep(0, 1, releaseProgress);
    pointerStrength = releaseStartStrength * (1 - easedReleaseProgress);
    pointerRadius =
      releaseStartRadius + (POINTER_WAKE_MIN_RADIUS - releaseStartRadius) * easedReleaseProgress;
  }

  if (!props.active) {
    pointerStrength = 0;
    pointerRadius = POINTER_WAKE_MIN_RADIUS;
  }
  activityWasFresh = activityIsFresh;

  updatePointPositions(elapsedTime);
  drawScene();

  const needsPointerTransition = activityIsFresh || pointerStrength > 0.002;
  if (isDocumentVisible && ((props.active && !reducedMotion?.matches) || needsPointerTransition)) {
    animationFrame = window.requestAnimationFrame(render);
  }
}

function requestRender(): void {
  if (animationFrame !== null || !isDocumentVisible) return;
  lastFrameTime = 0;
  animationFrame = window.requestAnimationFrame(render);
}

function resize(): void {
  const element = canvas.value;
  if (!element || !context) return;

  const bounds = element.getBoundingClientRect();
  width = Math.max(1, Math.round(bounds.width));
  height = Math.max(1, Math.round(bounds.height));
  worldHeight = Math.max(height, element.parentElement?.parentElement?.scrollHeight ?? height);
  scrollOffset = window.scrollY;
  const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
  element.width = Math.round(width * pixelRatio);
  element.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  buildMesh();
  requestRender();
}

function handlePointerMove(event: PointerEvent): void {
  if (!props.active || event.pointerType === 'touch') return;
  pointerX = event.clientX;
  pointerClientY = event.clientY;
  pointerY = pointerClientY + scrollOffset;
  pointerPresent = true;
  lastPointerActivity = performance.now();
  requestRender();
}

function handlePointerOut(event: PointerEvent): void {
  if (event.relatedTarget !== null) return;
  pointerPresent = false;
  lastPointerActivity = Number.NEGATIVE_INFINITY;
  requestRender();
}

function handlePointerDown(event: PointerEvent): void {
  if (!props.active || event.pointerType !== 'touch') return;
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

function handleScroll(): void {
  scrollOffset = window.scrollY;
  pointerY = pointerClientY + scrollOffset;
  if (props.active && pointerPresent) lastPointerActivity = performance.now();
  requestRender();
}

function handleVisibilityChange(): void {
  isDocumentVisible = !document.hidden;
  if (!isDocumentVisible && animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  if (isDocumentVisible) requestRender();
}

function handleMotionPreferenceChange(): void {
  elapsedTime = 0;
  requestRender();
}

watch(
  () => props.active,
  (active) => {
    if (!active) pointerStrength = 0;
    requestRender();
  },
);

onMounted(() => {
  const element = canvas.value;
  if (!element) return;
  context = element.getContext('2d', { alpha: true });
  if (!context) return;

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.addEventListener('change', handleMotionPreferenceChange);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(element);
  if (element.parentElement?.parentElement) resizeObserver.observe(element.parentElement.parentElement);

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerout', handlePointerOut, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerup', handlePointerUp, { passive: true });
  window.addEventListener('pointercancel', handlePointerUp, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('portfolio-theme-change', requestRender);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  resize();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  reducedMotion?.removeEventListener('change', handleMotionPreferenceChange);
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);

  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerout', handlePointerOut);
  window.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('pointerup', handlePointerUp);
  window.removeEventListener('pointercancel', handlePointerUp);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('portfolio-theme-change', requestRender);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <div
    class="personal-triangle-mesh"
    aria-hidden="true"
  >
    <canvas ref="canvas" />
    <div class="mesh-vignette" />
  </div>
</template>

<style scoped>
.personal-triangle-mesh {
  position: fixed;
  z-index: 0;
  inset: 0;
  contain: strict;
  overflow: hidden;
  pointer-events: none;
}

.personal-triangle-mesh::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 76% 14%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 30rem),
    radial-gradient(circle at 14% 72%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 34rem);
  content: '';
  opacity: 0.8;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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
}

@media (max-width: 620px) {
  .personal-triangle-mesh {
    opacity: 0.76;
  }
}
</style>
