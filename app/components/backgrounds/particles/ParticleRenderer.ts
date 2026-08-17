import * as THREE from 'three';

import type { BackgroundAnimationSettings } from '@/types/background';

import type { InteractionState } from './InteractionManager';
import { ParticleSimulation } from './ParticleSimulation';
import type { ParticleQuality } from './config';
import type { ParticleRendererStats } from './types';

/** Owns the Three.js renderer, camera, scene and particle simulation. */
export class ParticleRenderer {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  private simulation: ParticleSimulation | null = null;
  private quality: ParticleQuality;

  private readonly drawingBufferSize = new THREE.Vector2();

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    quality: ParticleQuality,
  ) {
    this.quality = quality;
  }

  static create(canvas: HTMLCanvasElement, quality: ParticleQuality, color: string): ParticleRenderer {
    const runtime = new ParticleRenderer(canvas, quality);

    try {
      runtime.initialize(color);
      return runtime;
    } catch (error: unknown) {
      runtime.dispose(false);
      throw error;
    }
  }

  private initialize(color: string): void {
    const context = this.canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (!context) throw new Error('WebGL2 is unavailable');

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context,
      alpha: true,
      antialias: false,
    });
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
    this.camera.position.z = 2;

    this.rebuildSimulation(color);
  }

  resize(): void {
    if (!this.renderer || !this.camera) return;

    const width = Math.max(this.canvas.clientWidth || window.innerWidth, 1);
    const height = Math.max(this.canvas.clientHeight || window.innerHeight, 1);
    const aspect = width / height;
    const dpr = Math.min(window.devicePixelRatio, this.quality.dprCap);

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);

    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.top = 1;
    this.camera.bottom = -1;
    this.camera.updateProjectionMatrix();

    this.simulation?.resize(aspect, dpr);
  }

  setQuality(quality: ParticleQuality, color: string): void {
    if (quality.id === this.quality.id) return;

    this.quality = quality;
    this.rebuildSimulation(color);
  }

  setColor(color: string): void {
    this.simulation?.setColor(color);
  }

  render(now: number, delta: number, interaction: InteractionState, animations: BackgroundAnimationSettings): void {
    if (!this.renderer || !this.scene || !this.camera || !this.simulation) return;

    this.simulation.update(now / 1_000, delta, interaction, animations);
    this.renderer.render(this.scene, this.camera);
  }

  renderStatic(): void {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  }

  setAnimationLoop(callback: ((time: number) => void) | null): void {
    this.renderer?.setAnimationLoop(callback);
  }

  getPerformanceStats(): ParticleRendererStats {
    if (!this.renderer) {
      return { width: 0, height: 0, dpr: 1, particleCount: 0 };
    }

    this.renderer.getDrawingBufferSize(this.drawingBufferSize);

    return {
      width: Math.round(this.drawingBufferSize.x),
      height: Math.round(this.drawingBufferSize.y),
      dpr: this.renderer.getPixelRatio(),
      particleCount: this.simulation?.particleCount ?? 0,
    };
  }

  dispose(forceContextLoss: boolean): void {
    this.renderer?.setAnimationLoop(null);

    this.simulation?.dispose();
    this.simulation = null;

    this.scene?.clear();
    this.scene = null;
    this.camera = null;

    if (this.renderer) {
      this.renderer.dispose();

      if (forceContextLoss) {
        this.renderer.forceContextLoss();
      }
    }

    this.renderer = null;
  }

  private rebuildSimulation(color: string): void {
    if (!this.renderer || !this.scene) return;

    const aspect =
      Math.max(this.canvas.clientWidth || window.innerWidth, 1) /
      Math.max(this.canvas.clientHeight || window.innerHeight, 1);

    this.simulation?.dispose();
    this.simulation = new ParticleSimulation(this.renderer, this.scene, this.quality, aspect, color);
    this.resize();
  }
}
