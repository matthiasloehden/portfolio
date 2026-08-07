<script setup lang="ts">
const background = ref<HTMLElement | null>(null);
const bandCount = ref(1);
const triangleDirections = [
  ['polygon(0 0, 100% 0, 0 100%)', 'polygon(100% 0, 100% 100%, 0 100%)'],
  ['polygon(0 0, 100% 0, 100% 100%)', 'polygon(0 0, 100% 100%, 0 100%)'],
  ['polygon(100% 0, 100% 100%, 0 100%)', 'polygon(0 0, 100% 0, 0 100%)'],
  ['polygon(0 0, 100% 100%, 0 100%)', 'polygon(0 0, 100% 0, 100% 100%)'],
] as const;

let animationFrame: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let activeCell: HTMLElement | null = null;
let finePointerEnabled = false;
let touchInteractionEnabled = false;
let pointerAvailable = false;
let pointerX = 0;
let pointerY = 0;

function pseudoRandom(seed: number): number {
  let value = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4_294_967_295;
}

function getCellStyle(band: number, cell: number): Record<string, string> {
  const seed = band * 137 + cell * 53;
  const duration = 3 + pseudoRandom(seed + 11) * 7;
  const shadeLow = 0.83 + pseudoRandom(seed + 23) * 0.08;
  const shadeHigh = Math.min(0.98, shadeLow + 0.05 + pseudoRandom(seed + 37) * 0.04);
  const direction =
    triangleDirections[Math.floor(pseudoRandom(seed) * triangleDirections.length)] ?? triangleDirections[0];

  return {
    '--triangle-a': direction[0],
    '--triangle-b': direction[1],
    '--duration': `${duration.toFixed(2)}s`,
    '--delay': `${(-pseudoRandom(seed + 71) * duration).toFixed(2)}s`,
    '--shade-low': shadeLow.toFixed(3),
    '--shade-mid': ((shadeLow + shadeHigh) / 2).toFixed(3),
    '--shade-high': shadeHigh.toFixed(3),
  };
}

function updateBandCount(): void {
  if (!background.value) return;

  const backgroundHeight = background.value.getBoundingClientRect().height;
  const viewportHeight = Math.max(window.innerHeight, 1);
  bandCount.value = Math.max(1, Math.ceil(backgroundHeight / viewportHeight));
}

function setActiveCell(nextCell: HTMLElement | null): void {
  if (nextCell === activeCell) return;

  activeCell?.classList.remove('is-cursor-active');
  nextCell?.classList.add('is-cursor-active');
  activeCell = nextCell;
}

function sampleTriangleAtPointer(): void {
  animationFrame = null;

  if (!pointerAvailable || !background.value) {
    setActiveCell(null);
    return;
  }

  const layeredCell = document.elementsFromPoint(pointerX, pointerY).find((element): element is HTMLElement => {
    return (
      element instanceof HTMLElement &&
      element.classList.contains('triangle-cell') &&
      background.value?.contains(element) === true
    );
  });

  if (layeredCell) {
    setActiveCell(layeredCell);
    return;
  }

  if (!touchInteractionEnabled) {
    setActiveCell(null);
    return;
  }

  const backgroundRect = background.value.getBoundingClientRect();
  const localY = pointerY - backgroundRect.top;
  const bandIndex = Math.floor(localY / window.innerHeight);
  const band = background.value.querySelectorAll<HTMLElement>('.triangle-band').item(bandIndex);

  if (!band) {
    setActiveCell(null);
    return;
  }

  const bandRect = band.getBoundingClientRect();
  const columns = window.innerWidth <= 600 ? 5 : window.innerWidth <= 900 ? 6 : 10;
  const rows = 60 / columns;
  const column = Math.min(
    columns - 1,
    Math.max(0, Math.floor(((pointerX - bandRect.left) / bandRect.width) * columns)),
  );
  const row = Math.min(rows - 1, Math.max(0, Math.floor(((pointerY - bandRect.top) / bandRect.height) * rows)));
  const nextCell = band.querySelectorAll<HTMLElement>('.triangle-cell').item(row * columns + column);

  setActiveCell(nextCell);
}

function schedulePointerSample(): void {
  if (animationFrame !== null) return;
  animationFrame = window.requestAnimationFrame(sampleTriangleAtPointer);
}

function handlePointerMove(event: PointerEvent): void {
  pointerAvailable = true;
  pointerX = event.clientX;
  pointerY = event.clientY;
  schedulePointerSample();
}

function handleTouchPosition(event: TouchEvent): void {
  const touch = event.touches.item(0);
  if (!touch) return;

  pointerAvailable = true;
  pointerX = touch.clientX;
  pointerY = touch.clientY;
  schedulePointerSample();
}

function handlePointerOut(event: PointerEvent): void {
  if (event.relatedTarget !== null) return;
  pointerAvailable = false;
  setActiveCell(null);
}

function clearPointer(): void {
  pointerAvailable = false;
  setActiveCell(null);
}

onMounted(() => {
  const backgroundElement = background.value;
  if (!backgroundElement) return;

  updateBandCount();
  resizeObserver = new ResizeObserver(updateBandCount);
  resizeObserver.observe(backgroundElement);
  window.addEventListener('resize', updateBandCount, { passive: true });

  finePointerEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  touchInteractionEnabled = window.matchMedia('(pointer: coarse)').matches;

  if (finePointerEnabled) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
  }

  if (touchInteractionEnabled) {
    window.addEventListener('touchstart', handleTouchPosition, { passive: true });
    window.addEventListener('touchmove', handleTouchPosition, { passive: true });
    window.addEventListener('touchend', clearPointer, { passive: true });
    window.addEventListener('touchcancel', clearPointer, { passive: true });
  }

  if (!finePointerEnabled && !touchInteractionEnabled) return;
  window.addEventListener('scroll', schedulePointerSample, { passive: true });
  window.addEventListener('blur', clearPointer);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', updateBandCount);

  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
  setActiveCell(null);

  if (finePointerEnabled) {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerout', handlePointerOut);
  }

  if (touchInteractionEnabled) {
    window.removeEventListener('touchstart', handleTouchPosition);
    window.removeEventListener('touchmove', handleTouchPosition);
    window.removeEventListener('touchend', clearPointer);
    window.removeEventListener('touchcancel', clearPointer);
  }

  if (!finePointerEnabled && !touchInteractionEnabled) return;
  window.removeEventListener('scroll', schedulePointerSample);
  window.removeEventListener('blur', clearPointer);
});
</script>

<template>
  <div
    ref="background"
    class="triangle-background"
    aria-hidden="true"
  >
    <div class="triangle-field">
      <div
        v-for="band in bandCount"
        :key="band"
        class="triangle-band"
      >
        <span
          v-for="cell in 60"
          :key="cell"
          class="triangle-cell"
          :style="getCellStyle(band, cell)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.triangle-background {
  --triangle-color: color-mix(in srgb, var(--muted) 82%, var(--text));
  --triangle-hover: color-mix(in srgb, var(--muted) 74%, var(--accent-bright));
  --hover-scale: 1.045;
  --hover-rotation: 3deg;
  --neighbor-scale: 1.018;
  --neighbor-rotation: 0.8deg;
  position: absolute;
  z-index: 0;
  inset: 0;
  contain: layout paint;
  overflow: hidden;
  background: var(--background);
}

.triangle-background.background-motion-paused {
  pointer-events: none;
}

.triangle-background.background-motion-paused .triangle-cell {
  animation-play-state: paused;
}

.triangle-field {
  position: absolute;
  inset: 0;
  display: grid;
  grid-auto-rows: 100vh;
  overflow: hidden;
}

.triangle-band {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  grid-template-rows: repeat(6, minmax(0, 1fr));
  height: 100vh;
  contain: layout paint style;
  content-visibility: auto;
  contain-intrinsic-size: auto 100vh;
  perspective: 900px;
}

.triangle-cell {
  --duration: 11s;
  --delay: -3s;
  --triangle-a: polygon(0 0, 100% 0, 0 100%);
  --triangle-b: polygon(100% 0, 100% 100%, 0 100%);
  --shade-low: 0.82;
  --shade-mid: 0.88;
  --shade-high: 0.94;
  --drift-x: 1px;
  --drift-y: -1px;
  --rotation: 0.8deg;
  --tilt-x: 0.7deg;
  --tilt-y: -1deg;
  --idle-scale: 1.008;
  --plate-a: 0.105;
  --plate-b: 0.055;
  position: relative;
  min-width: 0;
  min-height: 0;
  contain: layout paint style;
  opacity: 0.86;
  transform-origin: center;
  animation: triangle-idle var(--duration) ease-in-out var(--delay) infinite alternate;
}

.triangle-cell::before,
.triangle-cell::after {
  position: absolute;
  inset: 0.5px;
  background: var(--triangle-color);
  content: '';
  transform-origin: center;
  transition:
    transform 5200ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 5000ms linear;
}

.triangle-cell::before {
  clip-path: var(--triangle-a);
  opacity: var(--plate-a);
}

.triangle-cell::after {
  clip-path: var(--triangle-b);
  opacity: var(--plate-b);
}

.triangle-cell:nth-child(3n) {
  --drift-x: -1px;
  --rotation: -0.65deg;
  --tilt-x: -0.5deg;
  --tilt-y: 0.8deg;
  --plate-a: 0.055;
  --plate-b: 0.13;
}

.triangle-cell:nth-child(4n + 1) {
  --drift-y: 1px;
  --rotation: 0.45deg;
  --tilt-x: 1.1deg;
  --tilt-y: 0.35deg;
  --idle-scale: 1.012;
}

.triangle-cell:nth-child(5n + 2) {
  --drift-x: 2px;
  --drift-y: 0;
  --tilt-x: -0.8deg;
  --tilt-y: -1.15deg;
  --plate-a: 0.15;
  --plate-b: 0.035;
}

.triangle-cell:nth-child(7n + 3) {
  --rotation: -1.1deg;
  --tilt-x: 0.4deg;
  --tilt-y: 1.2deg;
  --idle-scale: 0.992;
  --plate-a: 0.025;
  --plate-b: 0.09;
}

.triangle-cell:nth-child(11n + 4) {
  --drift-x: 0;
  --drift-y: 2px;
  --tilt-x: -1.15deg;
  --tilt-y: 0.45deg;
  --plate-a: 0.18;
  --plate-b: 0.065;
}

.triangle-cell:nth-child(13n + 6) {
  --rotation: 0.2deg;
  --tilt-x: 0.25deg;
  --tilt-y: -0.4deg;
  --idle-scale: 1.004;
  --plate-a: 0.018;
  --plate-b: 0.035;
}

@keyframes triangle-idle {
  0% {
    opacity: var(--shade-low);
    transform: translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0) scale(1);
  }

  55% {
    opacity: var(--shade-mid);
    transform: translate3d(calc(var(--drift-x) * -0.35), calc(var(--drift-y) * -0.35), 0)
      rotateX(calc(var(--tilt-x) * -0.45)) rotateY(calc(var(--tilt-y) * -0.45)) rotateZ(calc(var(--rotation) * 0.2))
      scale(0.998);
  }

  100% {
    opacity: var(--shade-high);
    transform: translate3d(var(--drift-x), var(--drift-y), 0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))
      rotateZ(var(--rotation)) scale(var(--idle-scale));
  }
}

@media (hover: hover) and (pointer: fine) {
  .triangle-cell:is(:hover, .is-cursor-active) {
    animation-play-state: paused;
  }

  .triangle-cell:is(:hover, .is-cursor-active)::before,
  .triangle-cell:is(:hover, .is-cursor-active)::after {
    background: var(--triangle-hover);
    transition-duration: 140ms;
  }

  .triangle-cell:is(:hover, .is-cursor-active)::before {
    opacity: 0.42;
    transform: translate3d(3px, -2px, 0) rotate(var(--hover-rotation)) scale(var(--hover-scale));
  }

  .triangle-cell:is(:hover, .is-cursor-active)::after {
    opacity: 0.26;
    transform: translate3d(-2px, 3px, 0) rotate(calc(var(--hover-rotation) * -0.7))
      scale(calc(var(--hover-scale) - 0.01));
  }

  .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell::before,
  .triangle-cell:has(+ .triangle-cell:is(:hover, .is-cursor-active))::after {
    opacity: 0.22;
    transform: translate3d(1px, -1px, 0) rotate(var(--neighbor-rotation)) scale(var(--neighbor-scale));
    transition-duration: 190ms;
  }

  .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell::after,
  .triangle-cell:has(+ .triangle-cell:is(:hover, .is-cursor-active))::before {
    opacity: 0.15;
    transform: translate3d(-1px, 1px, 0) rotate(calc(var(--neighbor-rotation) * -1)) scale(var(--neighbor-scale));
    transition-duration: 190ms;
  }

  .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell + .triangle-cell::before,
  .triangle-cell:has(+ .triangle-cell + .triangle-cell:is(:hover, .is-cursor-active))::after {
    opacity: 0.13;
    transform: translate3d(0.5px, -0.5px, 0) rotate(calc(var(--neighbor-rotation) * 0.45)) scale(1.008);
    transition-duration: 260ms;
  }

  .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell + .triangle-cell::after,
  .triangle-cell:has(+ .triangle-cell + .triangle-cell:is(:hover, .is-cursor-active))::before {
    opacity: 0.09;
    transform: translate3d(-0.5px, 0.5px, 0) rotate(calc(var(--neighbor-rotation) * -0.45)) scale(1.008);
    transition-duration: 260ms;
  }
}

@media (max-width: 900px) {
  .triangle-band {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(10, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .triangle-background {
    pointer-events: none;
  }

  .triangle-band {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: repeat(12, minmax(0, 1fr));
  }
}

@media (hover: none), (pointer: coarse) {
  .triangle-cell.is-cursor-active {
    animation-play-state: paused;
  }

  .triangle-cell.is-cursor-active::before,
  .triangle-cell.is-cursor-active::after {
    background: var(--triangle-hover);
    transition-duration: 80ms;
  }

  .triangle-cell.is-cursor-active::before {
    opacity: 0.34;
    transform: translate3d(1.5px, -1px, 0) rotate(1.6deg) scale(1.026);
  }

  .triangle-cell.is-cursor-active::after {
    opacity: 0.2;
    transform: translate3d(-1px, 1.5px, 0) rotate(-1.1deg) scale(1.018);
  }

  .triangle-cell.is-cursor-active + .triangle-cell::before,
  .triangle-cell:has(+ .triangle-cell.is-cursor-active)::after {
    opacity: 0.16;
    transform: translate3d(0.5px, -0.5px, 0) rotate(0.45deg) scale(1.008);
    transition-duration: 120ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  .triangle-cell {
    opacity: 0.86;
    transform: none;
    animation: none;
  }

  .triangle-cell::before,
  .triangle-cell::after {
    transition: opacity 180ms ease;
  }

  .triangle-cell.is-cursor-active::before,
  .triangle-cell.is-cursor-active::after,
  .triangle-cell.is-cursor-active + .triangle-cell::before,
  .triangle-cell:has(+ .triangle-cell.is-cursor-active)::after {
    transform: none;
  }

  @media (hover: hover) and (pointer: fine) {
    .triangle-cell:is(:hover, .is-cursor-active)::before,
    .triangle-cell:is(:hover, .is-cursor-active)::after,
    .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell::before,
    .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell::after,
    .triangle-cell:has(+ .triangle-cell:is(:hover, .is-cursor-active))::before,
    .triangle-cell:has(+ .triangle-cell:is(:hover, .is-cursor-active))::after,
    .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell + .triangle-cell::before,
    .triangle-cell:is(:hover, .is-cursor-active) + .triangle-cell + .triangle-cell::after,
    .triangle-cell:has(+ .triangle-cell + .triangle-cell:is(:hover, .is-cursor-active))::before,
    .triangle-cell:has(+ .triangle-cell + .triangle-cell:is(:hover, .is-cursor-active))::after {
      transform: none;
    }
  }
}
</style>
