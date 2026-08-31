/**
 * Owns the GPU particle simulation and translates typed interaction settings
 * into shader uniforms. It contains no browser listeners, making orchestration
 * and lifecycle control remain in the parent background component.
 */

import * as THREE from 'three';
import { GPUComputationRenderer, type Variable } from 'three/addons/misc/GPUComputationRenderer.js';

import type { BackgroundAnimationSettings, ParticleSettings } from '@/types/background';

import { PARTICLE_CONFIG } from './config';
import type { InteractionState } from './InteractionManager';
import { particleFragmentShader, particleVertexShader, positionShader, velocityShader } from './shaders';

export class ParticleSimulation {
  readonly particleCount: number;

  private readonly compute: GPUComputationRenderer;
  private readonly positionVariable: Variable;
  private readonly velocityVariable: Variable;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.ShaderMaterial;
  private readonly points: THREE.Points;
  private readonly pointer = new THREE.Vector2();
  private readonly pointerVelocity = new THREE.Vector2();

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly scene: THREE.Scene,
    private settings: ParticleSettings,
    aspect: number,
    color: string,
  ) {
    const resolution = Math.ceil(Math.sqrt(settings.particleCount));
    this.particleCount = settings.particleCount;
    this.compute = new GPUComputationRenderer(resolution, resolution, renderer);
    this.compute.setDataType(THREE.HalfFloatType);

    const initialPosition = this.compute.createTexture();
    const initialVelocity = this.compute.createTexture();
    this.seedTextures(initialPosition, initialVelocity, aspect);

    this.velocityVariable = this.compute.addVariable('textureVelocity', velocityShader, initialVelocity);
    this.positionVariable = this.compute.addVariable('texturePosition', positionShader, initialPosition);
    this.compute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable]);
    this.compute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

    const velocityUniforms = this.velocityVariable.material.uniforms;
    velocityUniforms.uTime = { value: 0 };
    velocityUniforms.uDelta = { value: 0 };
    velocityUniforms.uAmbientStrength = { value: PARTICLE_CONFIG.ambientStrength };
    velocityUniforms.uNoiseScale = { value: PARTICLE_CONFIG.noiseScale };
    velocityUniforms.uNoiseSpeed = { value: settings.noiseSpeed };
    velocityUniforms.uDamping = { value: PARTICLE_CONFIG.damping };
    velocityUniforms.uInteractionDamping = { value: PARTICLE_CONFIG.interactionDamping };
    velocityUniforms.uInteractionMomentum = { value: 0 };
    velocityUniforms.uInteractionMaxVelocity = { value: PARTICLE_CONFIG.interactionMaxVelocity };
    velocityUniforms.uPointerRadius = { value: settings.interactionRadius };
    velocityUniforms.uPointerRepulsion = { value: settings.repulsionStrength };
    velocityUniforms.uClickAttraction = { value: settings.clickStrength };
    velocityUniforms.uClickInfluence = { value: 0 };
    velocityUniforms.uPointerVelocityTransfer = { value: PARTICLE_CONFIG.pointerVelocityTransfer };
    velocityUniforms.uPointerVortexStrength = { value: settings.vortexStrength };
    velocityUniforms.uPointerInfluence = { value: 0 };
    velocityUniforms.uIdleRingRadius = { value: PARTICLE_CONFIG.idleRingRadius };
    velocityUniforms.uIdleRingThickness = { value: PARTICLE_CONFIG.idleRingThickness };
    velocityUniforms.uIdleAttraction = { value: PARTICLE_CONFIG.idleAttraction };
    velocityUniforms.uIdleOrbitStrength = { value: PARTICLE_CONFIG.idleOrbitStrength };
    velocityUniforms.uScrollVelocity = { value: 0 };
    velocityUniforms.uScrollStrength = { value: settings.scrollStrength };
    velocityUniforms.uMaxVelocity = { value: PARTICLE_CONFIG.maxVelocity };
    velocityUniforms.uAspect = { value: aspect };
    velocityUniforms.uBoundaryCollisions = { value: settings.boundaryCollisions };
    velocityUniforms.uBoundaryRestitution = { value: PARTICLE_CONFIG.boundaryRestitution };
    velocityUniforms.uPointer = { value: this.pointer };
    velocityUniforms.uPointerVelocity = { value: this.pointerVelocity };

    const positionUniforms = this.positionVariable.material.uniforms;
    positionUniforms.uDelta = { value: 0 };
    positionUniforms.uAspect = { value: aspect };
    positionUniforms.uBoundaryCollisions = { value: settings.boundaryCollisions };
    positionUniforms.uSimulationMargin = { value: PARTICLE_CONFIG.simulationMargin };

    const error = this.compute.init();
    if (error) throw new Error(`Particle GPU simulation failed: ${error}`);

    this.geometry = this.createGeometry(resolution);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uPositionTexture: { value: this.compute.getCurrentRenderTarget(this.positionVariable).texture },
        uVelocityTexture: { value: this.compute.getCurrentRenderTarget(this.velocityVariable).texture },
        uPointSize: { value: settings.pointSize },
        uDpr: { value: Math.min(window.devicePixelRatio, settings.pixelRatioCap) },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: settings.opacity },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  update(time: number, delta: number, interaction: InteractionState, animations: BackgroundAnimationSettings): void {
    const velocityUniforms = this.velocityVariable.material.uniforms;
    const positionUniforms = this.positionVariable.material.uniforms;
    const touch = interaction.pointerType === 'touch';

    this.pointer.set(interaction.pointerX, interaction.pointerY);
    this.pointerVelocity.set(interaction.pointerVelocityX, interaction.pointerVelocityY);
    this.getUniform(velocityUniforms, 'uTime').value = time;
    this.getUniform(velocityUniforms, 'uDelta').value = delta;
    this.getUniform(velocityUniforms, 'uAmbientStrength').value = animations.idle
      ? PARTICLE_CONFIG.ambientStrength * this.settings.idleStrength
      : 0;
    this.getUniform(velocityUniforms, 'uIdleAttraction').value = animations.idle
      ? PARTICLE_CONFIG.idleAttraction * this.settings.idleStrength
      : 0;
    this.getUniform(velocityUniforms, 'uIdleOrbitStrength').value = animations.idle
      ? PARTICLE_CONFIG.idleOrbitStrength * this.settings.idleStrength
      : 0;
    this.getUniform(velocityUniforms, 'uPointerRadius').value = touch
      ? this.settings.interactionRadius * PARTICLE_CONFIG.touchRadiusScale
      : this.settings.interactionRadius;
    this.getUniform(velocityUniforms, 'uPointerRepulsion').value = touch
      ? this.settings.repulsionStrength * PARTICLE_CONFIG.touchStrength
      : this.settings.repulsionStrength;
    this.getUniform(velocityUniforms, 'uPointerInfluence').value = interaction.pointerInfluence;
    this.getUniform(velocityUniforms, 'uClickInfluence').value = interaction.clickInfluence;
    this.getUniform(velocityUniforms, 'uScrollVelocity').value = interaction.scrollVelocity;
    this.getUniform(velocityUniforms, 'uInteractionMomentum').value = interaction.interactionMomentum;
    this.getUniform(positionUniforms, 'uDelta').value = delta;

    this.compute.compute();
    this.getUniform(this.material.uniforms, 'uPositionTexture').value = this.compute.getCurrentRenderTarget(
      this.positionVariable,
    ).texture;
    this.getUniform(this.material.uniforms, 'uVelocityTexture').value = this.compute.getCurrentRenderTarget(
      this.velocityVariable,
    ).texture;
  }

  resize(aspect: number, dpr: number): void {
    this.getUniform(this.velocityVariable.material.uniforms, 'uAspect').value = aspect;
    this.getUniform(this.positionVariable.material.uniforms, 'uAspect').value = aspect;
    this.getUniform(this.material.uniforms, 'uDpr').value = dpr;
  }

  setColor(color: string): void {
    const uniformColor: unknown = this.getUniform(this.material.uniforms, 'uColor').value;
    if (uniformColor instanceof THREE.Color) uniformColor.set(color);
  }

  setSettings(settings: ParticleSettings): void {
    this.settings = settings;
    this.getUniform(this.material.uniforms, 'uPointSize').value = settings.pointSize;
    this.getUniform(this.material.uniforms, 'uOpacity').value = settings.opacity;
    this.getUniform(this.velocityVariable.material.uniforms, 'uPointerRadius').value = settings.interactionRadius;
    this.getUniform(this.velocityVariable.material.uniforms, 'uPointerRepulsion').value = settings.repulsionStrength;
    this.getUniform(this.velocityVariable.material.uniforms, 'uNoiseSpeed').value = settings.noiseSpeed;
    this.getUniform(this.velocityVariable.material.uniforms, 'uPointerVortexStrength').value = settings.vortexStrength;
    this.getUniform(this.velocityVariable.material.uniforms, 'uClickAttraction').value = settings.clickStrength;
    this.getUniform(this.velocityVariable.material.uniforms, 'uScrollStrength').value = settings.scrollStrength;
    this.getUniform(this.velocityVariable.material.uniforms, 'uBoundaryCollisions').value = settings.boundaryCollisions;
    this.getUniform(this.positionVariable.material.uniforms, 'uBoundaryCollisions').value = settings.boundaryCollisions;
  }

  dispose(): void {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
    this.compute.dispose();
  }

  private seedTextures(positionTexture: THREE.DataTexture, velocityTexture: THREE.DataTexture, aspect: number): void {
    const positions = positionTexture.image.data as Float32Array;
    const velocities = velocityTexture.image.data as Float32Array;
    const margin = this.settings.boundaryCollisions ? 1 : PARTICLE_CONFIG.simulationMargin;
    const limitX = aspect * margin;
    const limitY = margin;

    const textureParticleCount = positions.length / 4;

    for (let index = 0; index < textureParticleCount; index += 1) {
      const offset = index * 4;
      positions[offset] = (Math.random() * 2 - 1) * limitX;
      positions[offset + 1] = (Math.random() * 2 - 1) * limitY;
      positions[offset + 2] = (Math.random() * 2 - 1) * 0.12;
      positions[offset + 3] = Math.random();

      velocities[offset] = (Math.random() - 0.5) * 0.012;
      velocities[offset + 1] = (Math.random() - 0.5) * 0.012;
      velocities[offset + 2] = 0;
      velocities[offset + 3] = 0;
    }
  }

  private createGeometry(resolution: number): THREE.BufferGeometry {
    const positions = new Float32Array(this.particleCount * 3);
    const references = new Float32Array(this.particleCount * 2);

    for (let index = 0; index < this.particleCount; index += 1) {
      references[index * 2] = ((index % resolution) + 0.5) / resolution;
      references[index * 2 + 1] = (Math.floor(index / resolution) + 0.5) / resolution;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aReference', new THREE.BufferAttribute(references, 2));
    return geometry;
  }

  private getUniform(uniforms: Record<string, THREE.IUniform>, name: string): THREE.IUniform {
    const uniform = uniforms[name];
    if (!uniform) throw new Error(`Missing particle uniform: ${name}`);
    return uniform;
  }
}
