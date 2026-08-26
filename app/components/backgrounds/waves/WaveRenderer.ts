/**
 * GPU renderer for the Wave Grid background.
 *
 * The renderer owns the Three.js scene, perspective camera, line geometry and
 * shader material. Each frame it encodes the current interaction trail into a
 * compact texture that the vertex shader uses to displace the grid. It also
 * projects screen coordinates onto the grid plane, but it never decides which
 * browser events should create a wave.
 *
 * Construction and public lifecycle methods appear first, followed by pointer
 * projection, diagnostics/disposal and the private trail-texture update. Vue
 * reactivity, event listeners and frame scheduling stay in WaveBackground.
 */
import * as THREE from 'three';

import type { BackgroundRendererContract, BackgroundTheme, WaveSettings } from '@/types/background';

import { ThreeBackgroundRenderer } from '../shared/ThreeBackgroundRenderer';
import { getWavePalette } from './config';
import { createWaveGeometry } from './geometry';
import { createWaveVertexShader, waveFragmentShader } from './shaders';
import type { WavePosition, TrailPoint, WaveRendererStats } from './types';

export class WaveRenderer implements BackgroundRendererContract<WaveRendererStats> {
  private renderer: ThreeBackgroundRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private grid: THREE.LineSegments | null = null;
  private trailTexture: THREE.DataTexture | null = null;
  private settings: WaveSettings | null = null;

  private readonly trailData: Uint8Array;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly intersection = new THREE.Vector3();
  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly maxTrailPoints: number,
  ) {
    this.trailData = new Uint8Array(maxTrailPoints * 4);
  }

  static create(
    canvas: HTMLCanvasElement,
    maxTrailPoints: number,
    settings: WaveSettings,
    theme: BackgroundTheme,
  ): WaveRenderer {
    const runtime = new WaveRenderer(canvas, maxTrailPoints);

    try {
      runtime.initialize(settings, theme);
      return runtime;
    } catch (error: unknown) {
      runtime.dispose(false);
      throw error;
    }
  }

  private initialize(settings: WaveSettings, theme: BackgroundTheme): void {
    this.settings = settings;
    this.renderer = ThreeBackgroundRenderer.create(this.canvas, { antialias: true });
    const palette = getWavePalette(theme);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

    this.trailTexture = new THREE.DataTexture(
      this.trailData,
      this.maxTrailPoints,
      1,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    this.trailTexture.minFilter = THREE.NearestFilter;
    this.trailTexture.magFilter = THREE.NearestFilter;
    this.trailTexture.generateMipmaps = false;
    this.trailTexture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTrail: { value: this.trailTexture },
        uTrailCount: { value: 0 },
        uTime: { value: 0 },
        uIdleMotion: { value: 0 },
        uIdleStrength: { value: settings.idleStrength },
        uInteractionMotion: { value: 0 },
        uRippleStrength: { value: settings.rippleStrength },
        uGridSize: { value: new THREE.Vector2(settings.gridWidth, settings.gridDepth) },
        uColor: { value: new THREE.Color(palette.color) },
        uWaveColor: { value: new THREE.Color(palette.waveColor) },
        uOpacity: { value: palette.opacity },
        uOpacityScale: { value: settings.opacity },
      },
      vertexShader: createWaveVertexShader(this.maxTrailPoints),
      fragmentShader: waveFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.grid = new THREE.LineSegments(createWaveGeometry(settings), this.material);
    this.scene.add(this.grid);
  }

  resize(settings: WaveSettings): void {
    if (!this.renderer || !this.camera) return;

    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    const isMobile = width < 720;

    this.renderer.resize(width, height, Math.min(window.devicePixelRatio, settings.pixelRatioCap));

    this.camera.aspect = width / height;
    this.camera.fov = isMobile ? 52 : 42;
    this.camera.position.set(0, isMobile ? 7.8 : 6.7, isMobile ? 10.5 : 9.2);
    this.camera.lookAt(0, 0, -5.2);
    this.camera.updateProjectionMatrix();
  }

  applySettings(settings: WaveSettings): boolean {
    if (!this.grid || !this.material) return false;

    const previousSettings = this.settings;
    const geometryChanged =
      previousSettings === null ||
      previousSettings.gridWidth !== settings.gridWidth ||
      previousSettings.gridDepth !== settings.gridDepth ||
      previousSettings.gridSpacing !== settings.gridSpacing ||
      previousSettings.vertexStep !== settings.vertexStep;
    const pixelRatioCapChanged = previousSettings?.pixelRatioCap !== settings.pixelRatioCap;

    if (geometryChanged) {
      const nextGeometry = createWaveGeometry(settings);

      this.grid.geometry.dispose();
      this.grid.geometry = nextGeometry;
    }

    const gridSize = this.material.uniforms.uGridSize?.value;

    if (gridSize instanceof THREE.Vector2) {
      gridSize.set(settings.gridWidth, settings.gridDepth);
    }

    if (this.material.uniforms.uOpacityScale) {
      this.material.uniforms.uOpacityScale.value = settings.opacity;
    }

    if (this.material.uniforms.uIdleStrength) {
      this.material.uniforms.uIdleStrength.value = settings.idleStrength;
    }

    if (this.material.uniforms.uRippleStrength) {
      this.material.uniforms.uRippleStrength.value = settings.rippleStrength;
    }

    this.settings = settings;
    return pixelRatioCapChanged;
  }

  setTheme(theme: BackgroundTheme): void {
    if (!this.material) return;

    const palette = getWavePalette(theme);
    const color = this.material.uniforms.uColor?.value;
    const waveColor = this.material.uniforms.uWaveColor?.value;

    if (color instanceof THREE.Color) color.set(palette.color);
    if (waveColor instanceof THREE.Color) waveColor.set(palette.waveColor);
    if (this.material.uniforms.uOpacity) this.material.uniforms.uOpacity.value = palette.opacity;
  }

  setMotion(idleEnabled: boolean, interactionEnabled: boolean): void {
    if (!this.material) return;

    if (this.material.uniforms.uIdleMotion) {
      this.material.uniforms.uIdleMotion.value = idleEnabled ? 1 : 0;
    }

    if (this.material.uniforms.uInteractionMotion) {
      this.material.uniforms.uInteractionMotion.value = interactionEnabled ? 1 : 0;
    }
  }

  setAnimationLoop(callback: ((time: number) => void) | null): void {
    this.renderer?.setAnimationLoop(callback);
  }

  render(now: number, trail: readonly TrailPoint[], settings: WaveSettings): void {
    if (!this.renderer || !this.scene || !this.camera || !this.material || !this.trailTexture) return;

    this.updateTrailTexture(now, trail, settings);

    if (this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value = now / 1_000;
    }

    this.renderer.instance.render(this.scene, this.camera);
  }

  projectPointer(clientX: number, clientY: number, settings: WaveSettings): WavePosition | null {
    if (!this.camera) return null;

    const rect = this.canvas.getBoundingClientRect();

    if (
      rect.width <= 0 ||
      rect.height <= 0 ||
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (!this.raycaster.ray.intersectPlane(this.groundPlane, this.intersection)) {
      return null;
    }

    return {
      x: THREE.MathUtils.clamp(this.intersection.x, -settings.gridWidth / 2, settings.gridWidth / 2),
      z: THREE.MathUtils.clamp(this.intersection.z, -settings.gridDepth / 2, settings.gridDepth / 2),
    };
  }

  getPerformanceStats(): WaveRendererStats {
    if (!this.renderer) {
      return { width: 0, height: 0, dpr: 1 };
    }

    return this.renderer.getPerformanceStats();
  }

  dispose(forceContextLoss: boolean): void {
    this.grid?.geometry.dispose();
    this.material?.dispose();
    this.trailTexture?.dispose();
    this.scene?.clear();

    this.renderer?.dispose(forceContextLoss);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.material = null;
    this.grid = null;
    this.trailTexture = null;
    this.settings = null;
  }

  private updateTrailTexture(now: number, trail: readonly TrailPoint[], settings: WaveSettings): void {
    if (!this.material || !this.trailTexture) return;

    this.trailData.fill(0);

    // Each RGBA texel stores world X, world Z, normalized age and velocity.
    // Encoding to bytes avoids a larger floating-point upload every frame.
    const trailStart = Math.max(0, trail.length - this.maxTrailPoints);
    const trailCount = trail.length - trailStart;

    for (let sourceIndex = trailStart; sourceIndex < trail.length; sourceIndex += 1) {
      const point = trail[sourceIndex];

      if (!point) continue;

      const targetIndex = sourceIndex - trailStart;
      const offset = targetIndex * 4;

      this.trailData[offset] = Math.round(THREE.MathUtils.clamp(point.x / settings.gridWidth + 0.5, 0, 1) * 255);
      this.trailData[offset + 1] = Math.round(THREE.MathUtils.clamp(point.z / settings.gridDepth + 0.5, 0, 1) * 255);
      this.trailData[offset + 2] = Math.round(
        THREE.MathUtils.clamp((now - point.createdAt) / settings.trailLifetime, 0, 1) * 255,
      );
      this.trailData[offset + 3] = Math.round(THREE.MathUtils.clamp(point.velocity, 0, 1) * 255);
    }

    this.trailTexture.needsUpdate = true;

    if (this.material.uniforms.uTrailCount) {
      this.material.uniforms.uTrailCount.value = trailCount;
    }
  }
}
