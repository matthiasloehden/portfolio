/**
 * Builds the Wave Grid line geometry from validated scene settings. Geometry
 * creation is isolated from Vue so runtime setting changes can safely replace
 * GPU buffers without duplicating the grid-generation algorithm.
 */

import * as THREE from 'three';

import type { WaveSettings } from '@/types/background';

function appendSegment(
  positions: number[],
  strengths: number[],
  start: [number, number, number],
  end: [number, number, number],
  strength: number,
): void {
  positions.push(...start, ...end);
  strengths.push(strength, strength);
}

export function createWaveGeometry(settings: WaveSettings): THREE.BufferGeometry {
  const positions: number[] = [];
  const strengths: number[] = [];

  const xLines = Math.floor(settings.gridWidth / settings.gridSpacing);
  const zLines = Math.floor(settings.gridDepth / settings.gridSpacing);
  const xSegments = Math.ceil(settings.gridWidth / settings.vertexStep);
  const zSegments = Math.ceil(settings.gridDepth / settings.vertexStep);

  for (let zIndex = 0; zIndex <= zLines; zIndex += 1) {
    const z = -settings.gridDepth / 2 + (zIndex / zLines) * settings.gridDepth;
    const strength = zIndex % 5 === 0 ? 1 : 0.42;

    for (let segment = 0; segment < xSegments; segment += 1) {
      const xStart = -settings.gridWidth / 2 + (segment / xSegments) * settings.gridWidth;
      const xEnd = -settings.gridWidth / 2 + ((segment + 1) / xSegments) * settings.gridWidth;

      appendSegment(positions, strengths, [xStart, 0, z], [xEnd, 0, z], strength);
    }
  }

  for (let xIndex = 0; xIndex <= xLines; xIndex += 1) {
    const x = -settings.gridWidth / 2 + (xIndex / xLines) * settings.gridWidth;
    const strength = xIndex % 5 === 0 ? 1 : 0.42;

    for (let segment = 0; segment < zSegments; segment += 1) {
      const zStart = -settings.gridDepth / 2 + (segment / zSegments) * settings.gridDepth;
      const zEnd = -settings.gridDepth / 2 + ((segment + 1) / zSegments) * settings.gridDepth;

      appendSegment(positions, strengths, [x, 0, zStart], [x, 0, zEnd], strength);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aLineStrength', new THREE.Float32BufferAttribute(strengths, 1));

  return geometry;
}
