import { PARTICLE_CONFIG } from './config';

export interface InteractionState {
  pointerX: number;
  pointerY: number;
  pointerVelocityX: number;
  pointerVelocityY: number;
  pointerSpeed: number;
  pointerInfluence: number;
  pointerType: string;
  scrollVelocity: number;
  interactionMomentum: number;
  touchActive: boolean;
}

export class InteractionManager {
  readonly state: InteractionState = {
    pointerX: 0,
    pointerY: 0,
    pointerVelocityX: 0,
    pointerVelocityY: 0,
    pointerSpeed: 0,
    pointerInfluence: 0,
    pointerType: 'none',
    scrollVelocity: 0,
    interactionMomentum: 0,
    touchActive: false,
  };

  private width = 1;
  private height = 1;
  private aspect = 1;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastPointerTime = 0;
  private hasPointerSample = false;
  private lastScrollY = 0;
  private lastScrollTime = 0;
  private scrollTarget = 0;
  private lastMovementTime = 0;

  constructor() {
    this.resize();
    this.lastScrollY = window.scrollY;
    this.lastScrollTime = performance.now();

    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', this.onPointerEnd, { passive: true });
    window.addEventListener('pointerout', this.onPointerOut, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('blur', this.onBlur);
  }

  resize(): void {
    this.width = Math.max(window.innerWidth, 1);
    this.height = Math.max(window.innerHeight, 1);
    this.aspect = this.width / this.height;
  }

  update(now: number, delta: number): InteractionState {
    const pointerDecay = Math.exp(-delta / PARTICLE_CONFIG.interactionDecay);
    const velocityDecay = Math.exp(-delta / 0.36);
    const scrollDecay = Math.exp(-delta / 0.42);
    const momentumDecay = Math.exp(-delta / PARTICLE_CONFIG.interactionMomentumDecay);

    this.state.pointerVelocityX *= velocityDecay;
    this.state.pointerVelocityY *= velocityDecay;
    this.state.pointerSpeed = Math.hypot(this.state.pointerVelocityX, this.state.pointerVelocityY);

    if (now - this.lastMovementTime > 70) this.state.pointerInfluence *= pointerDecay;

    this.scrollTarget *= scrollDecay;
    this.state.scrollVelocity += (this.scrollTarget - this.state.scrollVelocity) * Math.min(1, delta * 12);
    this.state.interactionMomentum *= momentumDecay;

    return this.state;
  }

  dispose(): void {
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerEnd);
    window.removeEventListener('pointercancel', this.onPointerEnd);
    window.removeEventListener('pointerout', this.onPointerOut);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('blur', this.onBlur);
  }

  private setPointer(event: PointerEvent): void {
    const now = performance.now();
    const worldX = (event.clientX / this.width - 0.5) * 2 * this.aspect;
    const worldY = -(event.clientY / this.height - 0.5) * 2;

    if (this.hasPointerSample) {
      const deltaSeconds = Math.max((now - this.lastPointerTime) / 1000, 1 / 240);
      const rawVelocityX = (worldX - this.lastPointerX) / deltaSeconds;
      const rawVelocityY = (worldY - this.lastPointerY) / deltaSeconds;
      const rawSpeed = Math.hypot(rawVelocityX, rawVelocityY);
      const scale = rawSpeed > PARTICLE_CONFIG.maxPointerSpeed ? PARTICLE_CONFIG.maxPointerSpeed / rawSpeed : 1;

      this.state.pointerVelocityX += (rawVelocityX * scale - this.state.pointerVelocityX) * 0.58;
      this.state.pointerVelocityY += (rawVelocityY * scale - this.state.pointerVelocityY) * 0.58;
      this.state.pointerSpeed = Math.hypot(this.state.pointerVelocityX, this.state.pointerVelocityY);
    }

    this.state.pointerX = worldX;
    this.state.pointerY = worldY;
    this.state.pointerType = event.pointerType || 'mouse';
    this.state.touchActive = event.pointerType === 'touch' && event.buttons !== 0;
    this.state.pointerInfluence = Math.max(
      this.state.pointerInfluence,
      Math.min(1, 0.16 + this.state.pointerSpeed / PARTICLE_CONFIG.maxPointerSpeed),
    );
    this.state.interactionMomentum = Math.max(
      this.state.interactionMomentum,
      Math.min(1, 0.2 + this.state.pointerSpeed / PARTICLE_CONFIG.maxPointerSpeed),
    );

    this.lastPointerX = worldX;
    this.lastPointerY = worldY;
    this.lastPointerTime = now;
    this.lastMovementTime = now;
    this.hasPointerSample = true;
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    this.setPointer(event);
    this.state.touchActive = event.pointerType === 'touch';
    this.state.pointerInfluence = Math.max(this.state.pointerInfluence, 0.34);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    this.setPointer(event);
  };

  private readonly onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') this.state.touchActive = false;
    this.lastMovementTime = performance.now();
  };

  private readonly onPointerOut = (event: PointerEvent): void => {
    if (event.relatedTarget === null && event.pointerType !== 'touch') this.lastMovementTime = performance.now();
  };

  private readonly onScroll = (): void => {
    const now = performance.now();
    // Ignore long idle gaps between scroll gestures. Otherwise the first wheel
    // tick after a pause is divided by the entire idle duration and disappears.
    const elapsed = Math.min(Math.max((now - this.lastScrollTime) / 1000, 1 / 120), 1 / 15);
    const currentY = window.scrollY;
    const viewportVelocity = (currentY - this.lastScrollY) / this.height / elapsed;

    this.scrollTarget = Math.max(
      -PARTICLE_CONFIG.maxScrollImpulse,
      Math.min(PARTICLE_CONFIG.maxScrollImpulse, viewportVelocity),
    );
    this.state.interactionMomentum = Math.max(
      this.state.interactionMomentum,
      Math.abs(this.scrollTarget) / PARTICLE_CONFIG.maxScrollImpulse,
    );
    this.lastScrollY = currentY;
    this.lastScrollTime = now;
  };

  private readonly onBlur = (): void => {
    this.state.touchActive = false;
    this.state.pointerInfluence = 0;
    this.state.interactionMomentum = 0;
    this.scrollTarget = 0;
  };
}
