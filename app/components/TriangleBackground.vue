<script setup lang="ts">
const background = ref<HTMLElement | null>(null);

let animationFrame: number | null = null;
let activeCell: HTMLElement | null = null;
let finePointerEnabled = false;
let touchInteractionEnabled = false;
let pointerAvailable = false;
let pointerX = 0;
let pointerY = 0;

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
    v-once
    ref="background"
    class="triangle-background"
    aria-hidden="true"
  >
    <div class="triangle-field">
      <div
        v-for="band in 12"
        :key="band"
        class="triangle-band"
      >
        <span
          v-for="cell in 60"
          :key="cell"
          class="triangle-cell"
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

.triangle-field {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(12, 100vh);
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
  clip-path: polygon(0 0, 100% 0, 0 100%);
  opacity: var(--plate-a);
}

.triangle-cell::after {
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  opacity: var(--plate-b);
}

.triangle-cell:nth-child(even)::before {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.triangle-cell:nth-child(even)::after {
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.triangle-cell:nth-child(3n) {
  --duration: 13.5s;
  --delay: -8s;
  --drift-x: -1px;
  --rotation: -0.65deg;
  --tilt-x: -0.5deg;
  --tilt-y: 0.8deg;
  --plate-a: 0.055;
  --plate-b: 0.13;
}

.triangle-cell:nth-child(4n + 1) {
  --duration: 8.5s;
  --delay: -5.5s;
  --drift-y: 1px;
  --rotation: 0.45deg;
  --tilt-x: 1.1deg;
  --tilt-y: 0.35deg;
  --idle-scale: 1.012;
}

.triangle-cell:nth-child(5n + 2) {
  --duration: 15s;
  --delay: -11s;
  --drift-x: 2px;
  --drift-y: 0;
  --tilt-x: -0.8deg;
  --tilt-y: -1.15deg;
  --plate-a: 0.15;
  --plate-b: 0.035;
}

.triangle-cell:nth-child(7n + 3) {
  --duration: 10s;
  --delay: -2s;
  --rotation: -1.1deg;
  --tilt-x: 0.4deg;
  --tilt-y: 1.2deg;
  --idle-scale: 0.992;
  --plate-a: 0.025;
  --plate-b: 0.09;
}

.triangle-cell:nth-child(11n + 4) {
  --duration: 6.5s;
  --delay: -4s;
  --drift-x: 0;
  --drift-y: 2px;
  --tilt-x: -1.15deg;
  --tilt-y: 0.45deg;
  --plate-a: 0.18;
  --plate-b: 0.065;
}

.triangle-cell:nth-child(13n + 6) {
  --duration: 14.5s;
  --delay: -9s;
  --rotation: 0.2deg;
  --tilt-x: 0.25deg;
  --tilt-y: -0.4deg;
  --idle-scale: 1.004;
  --plate-a: 0.018;
  --plate-b: 0.035;
}

.triangle-cell:nth-child(2n) {
  animation: triangle-idle var(--duration) ease-in-out var(--delay) infinite alternate;
}

@keyframes triangle-idle {
  0% {
    opacity: 0.72;
    transform: translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0) scale(1);
  }

  55% {
    opacity: 0.93;
    transform: translate3d(calc(var(--drift-x) * -0.35), calc(var(--drift-y) * -0.35), 0)
      rotateX(calc(var(--tilt-x) * -0.45)) rotateY(calc(var(--tilt-y) * -0.45)) rotateZ(calc(var(--rotation) * 0.2))
      scale(0.998);
  }

  100% {
    opacity: 1;
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
