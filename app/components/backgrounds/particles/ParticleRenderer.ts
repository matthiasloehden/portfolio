/**
 * GPU renderer for the Particles background.
 *
 * The renderer creates the Three.js scene, orthographic camera and particle
 * simulation, then exposes the small lifecycle used by ParticleBackground:
 * resize, render, theme/quality updates, diagnostics and disposal. Rebuilding
 * the simulation is intentionally contained here because particle-count
 * changes alter the dimensions of its state textures.
 *
 * Browser events, Vue reactivity and frame scheduling do not belong in this
 * class. Public lifecycle methods are grouped before the private rebuild helper,
 * so the supported renderer API can be read from top to bottom before its
 * implementation details.
 */
import * as THREE from 'three';

import type {
  BackgroundAnimationSettings,
  BackgroundRendererContract,
  BackgroundTheme,
  ParticleSettings,
} from '@/types/background';

import { ThreeBackgroundRenderer } from '../shared/ThreeBackgroundRenderer';
import type { InteractionState } from './InteractionManager';
import { ParticleSimulation } from './ParticleSimulation';
import { getParticleColor, type ParticleQualityPreset } from './config';
import type { ParticleRendererStats } from './types';

export class ParticleRenderer implements BackgroundRendererContract<ParticleRendererStats> {
  private renderer: ThreeBackgroundRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  private simulation: ParticleSimulation | null = null;
  private quality: ParticleQualityPreset;
  private particleColor = '';

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    quality: ParticleQualityPreset,
    private settings: ParticleSettings,
  ) {
    this.quality = quality;
  }

  static create(
    canvas: HTMLCanvasElement,
    quality: ParticleQualityPreset,
    theme: BackgroundTheme,
    settings: ParticleSettings,
  ): ParticleRenderer {
    const runtime = new ParticleRenderer(canvas, quality, settings);

    try {
      runtime.initialize(theme);
      return runtime;
    } catch (error: unknown) {
      runtime.dispose(false);
      throw error;
    }
  }

  private initialize(theme: BackgroundTheme): void {
    this.renderer = ThreeBackgroundRenderer.create(this.canvas, { antialias: false });

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
    this.camera.position.z = 2;

    this.particleColor = getParticleColor(theme);
    this.rebuildSimulation();
  }

  resize(): void {
    if (!this.renderer || !this.camera) return;

    const width = Math.max(this.canvas.clientWidth || window.innerWidth, 1);
    const height = Math.max(this.canvas.clientHeight || window.innerHeight, 1);
    const aspect = width / height;
    const dpr = Math.min(window.devicePixelRatio, this.settings.pixelRatioCap);

    this.renderer.resize(width, height, dpr);

    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.top = 1;
    this.camera.bottom = -1;
    this.camera.updateProjectionMatrix();

    this.simulation?.resize(aspect, dpr);
  }

  setQuality(quality: ParticleQualityPreset, theme: BackgroundTheme): void {
    if (quality.id === this.quality.id) {
      this.setTheme(theme);
      return;
    }

    this.quality = quality;
    this.setTheme(theme);
  }

  setTheme(theme: BackgroundTheme): void {
    this.particleColor = getParticleColor(theme);
    this.simulation?.setColor(this.particleColor);
  }

  setSettings(settings: ParticleSettings): boolean {
    const pixelRatioCapChanged = this.settings.pixelRatioCap !== settings.pixelRatioCap;
    const particleCountChanged = this.settings.particleCount !== settings.particleCount;

    this.settings = settings;
    if (particleCountChanged) this.rebuildSimulation();
    else this.simulation?.setSettings(settings);
    return pixelRatioCapChanged;
  }

  render(now: number, delta: number, interaction: InteractionState, animations: BackgroundAnimationSettings): void {
    if (!this.renderer || !this.scene || !this.camera || !this.simulation) return;

    this.simulation.update(now / 1_000, delta, interaction, animations);
    this.renderer.instance.render(this.scene, this.camera);
  }

  renderStatic(): void {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.renderer.instance.render(this.scene, this.camera);
  }

  setAnimationLoop(callback: ((time: number) => void) | null): void {
    this.renderer?.setAnimationLoop(callback);
  }

  getPerformanceStats(): ParticleRendererStats {
    if (!this.renderer) {
      return { width: 0, height: 0, dpr: 1, particleCount: 0 };
    }

    return {
      ...this.renderer.getPerformanceStats(),
      particleCount: this.simulation?.particleCount ?? 0,
    };
  }

  dispose(forceContextLoss: boolean): void {
    this.simulation?.dispose();
    this.simulation = null;

    this.scene?.clear();
    this.scene = null;
    this.camera = null;

    this.renderer?.dispose(forceContextLoss);

    this.renderer = null;
  }

  private rebuildSimulation(): void {
    if (!this.renderer || !this.scene) return;

    const aspect =
      Math.max(this.canvas.clientWidth || window.innerWidth, 1) /
      Math.max(this.canvas.clientHeight || window.innerHeight, 1);

    // Particle state lives in a square GPGPU texture, so count changes require
    // a complete simulation rebuild rather than a uniform update.
    this.simulation?.dispose();
    this.simulation = new ParticleSimulation(
      this.renderer.instance,
      this.scene,
      this.settings,
      aspect,
      this.particleColor,
    );
    this.resize();
  }
}
