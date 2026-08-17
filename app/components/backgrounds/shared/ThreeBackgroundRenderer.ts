/**
 * Low-level WebGL2 adapter shared by the Three.js backgrounds.
 *
 * It validates WebGL2 support, creates the Three.js renderer and standardizes
 * canvas sizing, animation-loop ownership, drawing-buffer diagnostics and
 * disposal. Cameras, geometry, materials and quality behavior remain in the
 * scene renderer because those resources are not meaningfully interchangeable.
 * Keeping this adapter small provides shared lifecycle guarantees without a
 * broad renderer inheritance hierarchy.
 */
import * as THREE from 'three';

import type { BackgroundRendererStats } from '@/types/background';

export interface ThreeBackgroundRendererOptions {
  antialias: boolean;
}

export class ThreeBackgroundRenderer {
  readonly instance: THREE.WebGLRenderer;

  private readonly drawingBufferSize = new THREE.Vector2();

  private constructor(renderer: THREE.WebGLRenderer) {
    this.instance = renderer;
  }

  static create(canvas: HTMLCanvasElement, options: ThreeBackgroundRendererOptions): ThreeBackgroundRenderer {
    const context = canvas.getContext('webgl2', {
      alpha: true,
      antialias: options.antialias,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (!context) throw new Error('WebGL2 is unavailable');

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: options.antialias,
    });

    renderer.setClearColor(0x000000, 0);
    return new ThreeBackgroundRenderer(renderer);
  }

  resize(width: number, height: number, dpr: number): void {
    this.instance.setPixelRatio(dpr);
    this.instance.setSize(width, height, false);
  }

  setAnimationLoop(callback: FrameRequestCallback | null): void {
    this.instance.setAnimationLoop(callback);
  }

  getPerformanceStats(): BackgroundRendererStats {
    this.instance.getDrawingBufferSize(this.drawingBufferSize);

    return {
      width: Math.round(this.drawingBufferSize.x),
      height: Math.round(this.drawingBufferSize.y),
      dpr: this.instance.getPixelRatio(),
    };
  }

  dispose(forceContextLoss: boolean): void {
    this.instance.setAnimationLoop(null);
    this.instance.dispose();

    if (forceContextLoss) this.instance.forceContextLoss();
  }
}
