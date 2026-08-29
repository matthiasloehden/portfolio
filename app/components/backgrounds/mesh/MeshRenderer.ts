/**
 * Canvas2D renderer for the Living Mesh background.
 *
 * The renderer builds a moving triangular mesh in document coordinates and
 * draws only the viewport plus a buffer. Its points keep deterministic motion
 * parameters while pointer influence is cached separately, allowing the mesh to
 * preserve its visual identity without updating off-screen geometry every frame.
 * Theme, settings, scrolling and interaction enter through explicit methods.
 *
 * Deterministic mesh construction lives beside this renderer as a feature model
 * that can be verified without a canvas. This class owns only runtime state, viewport
 * synchronization, influence calculation and drawing. DOM events and scheduling
 * stay in MeshBackground.
 */
import type { BackgroundRendererContract, BackgroundTheme, MeshSettings } from '@/types/background';

import { buildMeshGeometryWindow, type MeshEdge, type MeshPoint, type MeshTriangle } from './meshGeometry';
import { smoothstep } from '../shared/math';
import { getMeshPalette, MESH_CONFIG } from './config';
import type { MeshPalette, MeshRendererStats, MeshRenderState } from './types';

function clampAlpha(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export class MeshRenderer implements BackgroundRendererContract<MeshRendererStats> {
  private context: CanvasRenderingContext2D | null;
  private palette: MeshPalette;

  private points: MeshPoint[] = [];
  private triangles: MeshTriangle[] = [];
  private edges: MeshEdge[] = [];
  private pointWakeInfluence: number[] = [];
  private pointCoreInfluence: number[] = [];

  private width = 1;
  private height = 1;
  private worldHeight = 1;
  private dpr = 1;
  private scrollOffset = 0;

  private spacing = 1;
  private rowSpacing = 1;
  private columnCount = 1;
  private totalRowCount = 1;
  private meshStartRow = -1;
  private meshEndRow = -1;

  private lastFrameTime = 0;
  private elapsedTime = 0;

  private pointerX = 0;
  private pointerY = 0;
  private pointerClientY = 0;
  private pointerStrength = 0;
  private pointerRadius: number = MESH_CONFIG.pointerWakeMinRadius;
  private pointerPresent = false;
  private lastPointerActivity = Number.NEGATIVE_INFINITY;
  private activityWasFresh = false;
  private releaseStartedAt = Number.NEGATIVE_INFINITY;
  private releaseStartStrength = 0;
  private releaseStartRadius: number = MESH_CONFIG.pointerWakeMinRadius;

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    theme: BackgroundTheme,
    private settings: MeshSettings,
  ) {
    this.palette = getMeshPalette(theme);
    this.context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    if (!this.context) throw new Error('Canvas2D is unavailable');

    this.resetInteractions();
  }

  static create(canvas: HTMLCanvasElement, theme: BackgroundTheme, settings: MeshSettings): MeshRenderer {
    return new MeshRenderer(canvas, theme, settings);
  }

  resize(): void {
    const context = this.context;

    if (!context) return;

    const bounds = this.canvas.getBoundingClientRect();

    this.width = Math.max(1, Math.round(bounds.width));
    this.height = Math.max(1, Math.round(bounds.height));
    this.worldHeight = Math.max(this.height, this.canvas.parentElement?.parentElement?.scrollHeight ?? this.height);
    this.scrollOffset = window.scrollY;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.settings.pixelRatioCap);

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.configureMeshGrid();
    this.syncMeshWindow(true);
    this.resetFrameTime();
  }

  setTheme(theme: BackgroundTheme): void {
    this.palette = getMeshPalette(theme);
  }

  setSettings(settings: MeshSettings): void {
    const resizeRequired =
      this.settings.densityScale !== settings.densityScale || this.settings.pixelRatioCap !== settings.pixelRatioCap;
    const radiusScaleChanged = this.settings.interactionRadiusScale !== settings.interactionRadiusScale;
    const radiusScaleRatio = settings.interactionRadiusScale / this.settings.interactionRadiusScale;

    this.settings = settings;

    if (radiusScaleChanged) {
      this.pointerRadius *= radiusScaleRatio;
      this.releaseStartRadius *= radiusScaleRatio;
    }

    if (resizeRequired) this.resize();
    else if (radiusScaleChanged) this.syncMeshWindow(true);
  }

  setPointer(clientX: number, clientY: number, now = performance.now()): void {
    this.pointerX = clientX;
    this.pointerClientY = clientY;
    this.pointerY = clientY + this.scrollOffset;
    this.pointerPresent = true;
    this.lastPointerActivity = now;
  }

  clearPointer(): void {
    this.pointerPresent = false;
    this.lastPointerActivity = Number.NEGATIVE_INFINITY;
  }

  setScrollOffset(scrollOffset: number, activateWake: boolean, now = performance.now()): void {
    this.scrollOffset = scrollOffset;
    this.pointerY = this.pointerClientY + scrollOffset;

    if (activateWake && this.pointerPresent) this.lastPointerActivity = now;
  }

  resetInteractions(): void {
    this.pointerStrength = 0;
    this.pointerRadius = MESH_CONFIG.pointerWakeMinRadius * this.settings.interactionRadiusScale;
    this.pointerPresent = false;
    this.lastPointerActivity = Number.NEGATIVE_INFINITY;
    this.activityWasFresh = false;
    this.releaseStartedAt = Number.NEGATIVE_INFINITY;
    this.releaseStartStrength = 0;
    this.releaseStartRadius = MESH_CONFIG.pointerWakeMinRadius * this.settings.interactionRadiusScale;
  }

  resetMotion(): void {
    this.elapsedTime = 0;
    this.resetFrameTime();
  }

  resetFrameTime(): void {
    this.lastFrameTime = 0;
  }

  render(now: number, state: MeshRenderState): boolean {
    if (!this.context) return false;

    const delta = this.lastFrameTime === 0 ? 0 : Math.min((now - this.lastFrameTime) / 1_000, 0.05);

    this.lastFrameTime = now;

    if (state.advanceIdle) this.elapsedTime += delta * this.settings.idleSpeed;

    this.syncMeshWindow();

    const activityIsFresh = state.active && now - this.lastPointerActivity < MESH_CONFIG.pointerActivityHold;

    this.updatePointerTransition(now, delta, state.active, activityIsFresh);
    this.updatePointPositions(state.motionAllowed);
    this.drawScene(state.active);

    return activityIsFresh || this.pointerStrength > 0.002;
  }

  getPerformanceStats(): MeshRendererStats {
    return {
      width: Math.round(this.width * this.dpr),
      height: Math.round(this.height * this.dpr),
      dpr: this.dpr,
      pointCount: this.points.length,
      triangleCount: this.triangles.length,
      edgeCount: this.edges.length,
      rowCount: Math.max(0, this.meshEndRow - this.meshStartRow + 1),
      pointerStrength: this.pointerStrength,
    };
  }

  dispose(): void {
    this.points.length = 0;
    this.triangles.length = 0;
    this.edges.length = 0;
    this.pointWakeInfluence.length = 0;
    this.pointCoreInfluence.length = 0;
    this.meshStartRow = -1;
    this.meshEndRow = -1;
    this.context = null;
  }

  private configureMeshGrid(): void {
    const spacingConfig = MESH_CONFIG.spacing;
    const breakpoints = MESH_CONFIG.viewportBreakpoints;
    const baseSpacing =
      this.width < breakpoints.mobile
        ? spacingConfig.mobile
        : this.width < breakpoints.tablet
          ? spacingConfig.tablet
          : spacingConfig.desktop;

    this.spacing = baseSpacing / this.settings.densityScale;
    this.rowSpacing = this.spacing * spacingConfig.rowScale;
    this.columnCount = Math.ceil(this.width / this.spacing) + 3;
    this.totalRowCount = Math.ceil(this.worldHeight / this.rowSpacing) + 3;
    this.meshStartRow = -1;
    this.meshEndRow = -1;
  }

  private syncMeshWindow(force = false): void {
    const config = MESH_CONFIG;
    const rowOriginY = -this.rowSpacing;
    // Rows are exchanged outside the visible viewport. The configured buffer
    // covers both pointer glow range and the maximum animated vertex drift.
    const viewportBuffer = Math.max(
      config.viewportBuffer,
      config.pointerWakeRadius * this.settings.interactionRadiusScale + 60,
    );
    const visibleTop = this.scrollOffset - viewportBuffer;
    const visibleBottom = this.scrollOffset + this.height + viewportBuffer;
    const startRow = Math.max(0, Math.floor((visibleTop - rowOriginY) / this.rowSpacing) - 1);
    const endRow = Math.min(this.totalRowCount - 1, Math.ceil((visibleBottom - rowOriginY) / this.rowSpacing) + 1);

    if (!force && startRow === this.meshStartRow && endRow === this.meshEndRow) return;

    this.buildMeshWindow(startRow, endRow);
  }

  private buildMeshWindow(startRow: number, endRow: number): void {
    const geometry = buildMeshGeometryWindow({
      startRow,
      endRow,
      columnCount: this.columnCount,
      spacing: this.spacing,
      rowSpacing: this.rowSpacing,
    });

    this.points = geometry.points;
    this.triangles = geometry.triangles;
    this.edges = geometry.edges;
    this.pointWakeInfluence = new Array<number>(geometry.points.length).fill(0);
    this.pointCoreInfluence = new Array<number>(geometry.points.length).fill(0);
    this.meshStartRow = startRow;
    this.meshEndRow = endRow;
  }

  private updatePointerTransition(now: number, delta: number, active: boolean, activityIsFresh: boolean): void {
    const config = MESH_CONFIG;

    if (activityIsFresh) {
      const fadeIn = 1 - Math.exp(-delta * config.pointerWakeAttackRate);

      this.pointerStrength += (1 - this.pointerStrength) * fadeIn;
      this.pointerRadius +=
        (config.pointerWakeRadius * this.settings.interactionRadiusScale - this.pointerRadius) * fadeIn;
    } else {
      if (this.activityWasFresh) {
        // Snapshot the current attack state once; subsequent frames interpolate
        // from this point instead of restarting the release on every frame.
        this.releaseStartedAt = now;
        this.releaseStartStrength = this.pointerStrength;
        this.releaseStartRadius = this.pointerRadius;
      }

      const releaseProgress = Math.min(
        1,
        Math.max(0, (now - this.releaseStartedAt) / this.settings.interactionDuration),
      );
      const easedReleaseProgress = smoothstep(0, 1, releaseProgress);

      this.pointerStrength = this.releaseStartStrength * (1 - easedReleaseProgress);
      this.pointerRadius =
        this.releaseStartRadius +
        (config.pointerWakeMinRadius * this.settings.interactionRadiusScale - this.releaseStartRadius) *
          easedReleaseProgress;
    }

    if (!active) {
      this.pointerStrength = 0;
      this.pointerRadius = config.pointerWakeMinRadius * this.settings.interactionRadiusScale;
    }

    this.activityWasFresh = activityIsFresh;
  }

  private updatePointPositions(motionAllowed: boolean): void {
    if (!motionAllowed) {
      for (const point of this.points) {
        point.x = point.baseX;
        point.y = point.baseY;
      }

      return;
    }

    for (let index = 0; index < this.points.length; index += 1) {
      const point = this.points[index];

      if (!point) continue;

      point.x =
        point.baseX +
        (Math.sin(this.elapsedTime * point.speedX + point.phaseX) * point.amplitudeX +
          Math.sin(this.elapsedTime * 0.07 + point.secondaryPhase) * point.amplitudeX * 0.35) *
          this.settings.idleStrength;
      point.y =
        point.baseY +
        (Math.cos(this.elapsedTime * point.speedY + point.phaseY) * point.amplitudeY +
          Math.sin(this.elapsedTime * 0.085 - point.secondaryPhase) * point.amplitudeY * 0.28) *
          this.settings.idleStrength;
    }
  }

  private updatePointerInfluenceCache(active: boolean): void {
    if (this.pointerStrength <= 0.001 && !this.pointerPresent) {
      this.pointWakeInfluence.fill(0);
      this.pointCoreInfluence.fill(0);
      return;
    }

    // Edges and nodes reuse these values, avoiding repeated distance checks for
    // every primitive sharing the same vertex.
    for (let index = 0; index < this.points.length; index += 1) {
      const point = this.points[index];

      if (!point) continue;

      this.pointWakeInfluence[index] = this.getWakeInfluenceAt(point.x, point.y, 275);
      this.pointCoreInfluence[index] = this.getCoreInfluenceAt(point.x, point.y, active);
    }
  }

  private getWakeInfluenceAt(x: number, y: number, radius: number): number {
    if (this.pointerStrength <= 0.001) return 0;

    const config = MESH_CONFIG;
    const minimumRadius = config.pointerWakeMinRadius * this.settings.interactionRadiusScale;
    const maximumRadius = config.pointerWakeRadius * this.settings.interactionRadiusScale;
    const dynamicRadius = Math.max(
      minimumRadius,
      radius * this.settings.interactionRadiusScale * (this.pointerRadius / maximumRadius),
    );
    const dx = x - this.pointerX;
    const dy = y - this.pointerY;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared >= dynamicRadius * dynamicRadius) return 0;

    const distance = Math.sqrt(distanceSquared);

    return Math.min(
      1,
      (1 - smoothstep(dynamicRadius * 0.18, dynamicRadius, distance)) *
        this.pointerStrength *
        this.settings.interactionStrength,
    );
  }

  private getCoreInfluenceAt(x: number, y: number, active: boolean): number {
    if (!active || !this.pointerPresent) return 0;

    const dx = x - this.pointerX;
    const dy = y - this.pointerY;
    const distanceSquared = dx * dx + dy * dy;
    const radius = MESH_CONFIG.pointerCoreRadius * this.settings.interactionRadiusScale;

    if (distanceSquared >= radius * radius) return 0;

    return Math.min(
      1,
      (1 - smoothstep(radius * 0.18, radius, Math.sqrt(distanceSquared))) * this.settings.interactionStrength,
    );
  }

  private drawScene(active: boolean): void {
    const context = this.context;

    if (!context) return;

    context.clearRect(0, 0, this.width, this.height);

    const pointerScreenY = this.pointerY - this.scrollOffset;

    this.drawPointerGlow(context, pointerScreenY, active);
    this.updatePointerInfluenceCache(active);

    for (const triangle of this.triangles) this.drawTriangle(context, triangle);
    for (const edge of this.edges) this.drawEdge(context, edge);

    for (let index = 0; index < this.points.length; index += 1) {
      const point = this.points[index];

      if (point) this.drawNode(context, point, index);
    }

    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }

  private drawPointerGlow(context: CanvasRenderingContext2D, pointerScreenY: number, active: boolean): void {
    const effectOpacity = this.settings.interactionStrength * this.settings.opacity;

    if (this.pointerStrength > 0.002) {
      const glow = context.createRadialGradient(
        this.pointerX,
        pointerScreenY,
        0,
        this.pointerX,
        pointerScreenY,
        this.pointerRadius,
      );

      glow.addColorStop(
        0,
        `rgba(${this.palette.ambient}, ${clampAlpha(0.075 * this.pointerStrength * effectOpacity)})`,
      );
      glow.addColorStop(
        0.42,
        `rgba(${this.palette.ambient}, ${clampAlpha(0.025 * this.pointerStrength * effectOpacity)})`,
      );
      glow.addColorStop(1, `rgba(${this.palette.ambient}, 0)`);
      context.fillStyle = glow;
      context.globalAlpha = 1;
      context.fillRect(
        this.pointerX - this.pointerRadius,
        pointerScreenY - this.pointerRadius,
        this.pointerRadius * 2,
        this.pointerRadius * 2,
      );
    }

    if (!active || !this.pointerPresent) return;

    const radius = MESH_CONFIG.pointerCoreRadius * this.settings.interactionRadiusScale;
    const coreGlow = context.createRadialGradient(
      this.pointerX,
      pointerScreenY,
      0,
      this.pointerX,
      pointerScreenY,
      radius,
    );

    coreGlow.addColorStop(0, `rgba(${this.palette.ambient}, ${clampAlpha(0.075 * effectOpacity)})`);
    coreGlow.addColorStop(0.35, `rgba(${this.palette.ambient}, ${clampAlpha(0.028 * effectOpacity)})`);
    coreGlow.addColorStop(1, `rgba(${this.palette.ambient}, 0)`);
    context.fillStyle = coreGlow;
    context.globalAlpha = 1;
    context.fillRect(this.pointerX - radius, pointerScreenY - radius, radius * 2, radius * 2);
  }

  private drawTriangle(context: CanvasRenderingContext2D, triangle: MeshTriangle): void {
    const a = this.points[triangle.a];
    const b = this.points[triangle.b];
    const c = this.points[triangle.c];

    if (!a || !b || !c) return;

    const minY = Math.min(a.y, b.y, c.y);
    const maxY = Math.max(a.y, b.y, c.y);
    const margin = MESH_CONFIG.renderMargin;

    if (maxY - this.scrollOffset < -margin || minY - this.scrollOffset > this.height + margin) return;

    const centerX = (a.x + b.x + c.x) / 3;
    const centerY = (a.y + b.y + c.y) / 3;
    const influence = this.getWakeInfluenceAt(centerX, centerY, 275);
    const idlePulse = 0.5 + Math.sin(this.elapsedTime * 0.18 + triangle.tone * 9) * 0.5;
    const alpha = clampAlpha(
      (this.palette.baseFillAlpha * triangle.tone + influence * (0.045 + idlePulse * 0.028)) * this.settings.opacity,
    );

    if (alpha < 0.002) return;

    context.beginPath();
    context.moveTo(a.x, a.y - this.scrollOffset);
    context.lineTo(b.x, b.y - this.scrollOffset);
    context.lineTo(c.x, c.y - this.scrollOffset);
    context.closePath();
    context.fillStyle = influence > 0.01 ? this.palette.glow : this.palette.line;
    context.globalAlpha = alpha;
    context.fill();
  }

  private drawEdge(context: CanvasRenderingContext2D, edge: MeshEdge): void {
    const a = this.points[edge.a];
    const b = this.points[edge.b];

    if (!a || !b) return;

    const screenAY = a.y - this.scrollOffset;
    const screenBY = b.y - this.scrollOffset;

    if ((screenAY < -40 && screenBY < -40) || (screenAY > this.height + 40 && screenBY > this.height + 40)) {
      return;
    }

    const wakeInfluence = Math.max(this.pointWakeInfluence[edge.a] ?? 0, this.pointWakeInfluence[edge.b] ?? 0);
    const midpointWake = this.getWakeInfluenceAt((a.x + b.x) * 0.5, (a.y + b.y) * 0.5, 250);
    const finalWake = Math.max(wakeInfluence, midpointWake);
    const coreInfluence = Math.max(
      (this.pointCoreInfluence[edge.a] ?? 0) * 0.34,
      (this.pointCoreInfluence[edge.b] ?? 0) * 0.34,
    );
    const influence = Math.max(finalWake, coreInfluence);
    const idleShimmer = 0.78 + Math.sin(this.elapsedTime * 0.3 + edge.tone * 17) * 0.22;

    context.beginPath();
    context.moveTo(a.x, screenAY);
    context.lineTo(b.x, screenBY);
    context.strokeStyle = influence > 0.015 ? this.palette.glow : this.palette.line;
    context.globalAlpha = clampAlpha(
      (this.palette.baseLineAlpha * edge.tone * idleShimmer + influence * 0.62) * this.settings.opacity,
    );
    context.lineWidth = 0.78 + influence * 1.55;
    context.stroke();
  }

  private drawNode(context: CanvasRenderingContext2D, point: MeshPoint, pointIndex: number): void {
    const screenY = point.y - this.scrollOffset;

    if (screenY < -10 || screenY > this.height + 10) return;

    const wakeInfluence = this.pointWakeInfluence[pointIndex] ?? 0;
    const coreInfluence = this.pointCoreInfluence[pointIndex] ?? 0;
    const influence = Math.max(wakeInfluence, coreInfluence);

    if (influence < 0.025) return;

    context.beginPath();
    context.arc(point.x, screenY, 1.1 + influence * 2.1, 0, Math.PI * 2);
    context.fillStyle = this.palette.node;
    context.globalAlpha = clampAlpha((0.24 + influence * 0.76) * this.settings.opacity);

    if (coreInfluence > 0.01) {
      context.shadowColor = this.palette.glow;
      context.shadowBlur = 5 + coreInfluence * 10;
    } else {
      context.shadowBlur = 0;
    }

    context.fill();
    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }
}
