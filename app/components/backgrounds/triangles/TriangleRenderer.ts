/**
 * Canvas2D renderer for the Triangles background.
 *
 * The scene is defined in document space, but only rows intersecting the
 * viewport plus a small buffer are generated and drawn. Seeded tile properties
 * make those temporary rows deterministic, so scrolling away and back produces
 * the same pattern without retaining a document-sized grid in memory.
 *
 * Local data shapes are declared before the renderer state. The public lifecycle
 * and interaction API follows, while coordinate conversion, visible-row
 * generation and drawing helpers are kept near the bottom. Browser events and
 * frame scheduling remain in TriangleBackground.
 */
import type { BackgroundRendererContract, BackgroundTheme, TriangleSettings } from '@/types/background';
import { seededRandom } from '@/domain/backgrounds/math';
import { TriangleHighlightTrail, type TrianglePosition } from '@/domain/backgrounds/triangleHighlightTrail';

import { getTrianglePalette, TRIANGLE_CONFIG } from './config';
import type { TrianglePalette, TriangleRendererStats } from './types';

interface TriangleTile {
  column: number;
  side: 'a' | 'b';
  tone: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
}

interface TileRow {
  rowIndex: number;
  y: number;
  tiles: TriangleTile[];
}

interface GridMetrics {
  cellWidth: number;
  cellHeight: number;
}

interface VisibleWorldBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export class TriangleRenderer implements BackgroundRendererContract<TriangleRendererStats> {
  private context: CanvasRenderingContext2D | null;

  private width = 1;
  private height = 1;
  private dpr = 1;
  private scrollOffset = 0;
  private syncedScrollOffset = Number.NaN;

  private sceneWidth = 1;
  private sceneHeight = 1;

  private metrics: GridMetrics = {
    cellWidth: 1,
    cellHeight: 1,
  };

  private readonly tileRows: TileRow[] = [];
  private readonly highlightTrail = new TriangleHighlightTrail({
    maxPoints: TRIANGLE_CONFIG.maxHighlightPoints,
    pointSpacing: TRIANGLE_CONFIG.trailSpacing,
  });

  private trianglePathA: Path2D | null = null;
  private trianglePathB: Path2D | null = null;
  private ambientGradient: CanvasGradient | null = null;
  private palette: TrianglePalette;

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    theme: BackgroundTheme,
    private settings: TriangleSettings,
  ) {
    this.palette = getTrianglePalette(theme);
    this.context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    if (!this.context) {
      throw new Error('Canvas2D is unavailable');
    }
  }

  static create(canvas: HTMLCanvasElement, theme: BackgroundTheme, settings: TriangleSettings): TriangleRenderer {
    return new TriangleRenderer(canvas, theme, settings);
  }

  resize(): void {
    if (!this.context) return;

    const rect = this.canvas.getBoundingClientRect();
    const viewportWidth = window.innerWidth || Math.max(rect.width, 1);
    const viewportHeight = window.innerHeight || Math.max(rect.height, 1);

    this.width = Math.max(1, Math.round(rect.width || viewportWidth));
    this.height = Math.max(1, Math.round(rect.height || viewportHeight));
    this.dpr = Math.min(window.devicePixelRatio || 1, this.settings.pixelRatioCap);

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.calculateRotatedSceneBounds();
    this.metrics = this.calculateGridMetrics();
    this.rebuildTrianglePaths();
    this.rebuildAmbientGradient();
    this.tileRows.length = 0;
    this.syncedScrollOffset = Number.NaN;
    this.syncGridForViewport();
  }

  setTheme(theme: BackgroundTheme): void {
    this.palette = getTrianglePalette(theme);
    this.ambientGradient = null;
  }

  setSettings(settings: TriangleSettings): void {
    const resizeRequired =
      this.settings.densityScale !== settings.densityScale || this.settings.pixelRatioCap !== settings.pixelRatioCap;
    const opacityChanged = this.settings.opacity !== settings.opacity;

    this.settings = settings;

    if (resizeRequired) this.resize();
    else if (opacityChanged) this.ambientGradient = null;
  }

  setScrollOffset(scrollOffset: number): void {
    this.scrollOffset = scrollOffset;
  }

  projectPointer(clientX: number, clientY: number): TrianglePosition {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const dx = clientX - centerX;
    // Page scrolling is applied after scene rotation in screen coordinates.
    // Undo that vertical translation before applying the inverse rotation.
    const dy = clientY + this.scrollOffset - centerY;
    const cosine = Math.cos(TRIANGLE_CONFIG.rotationRadians);
    const sine = Math.sin(TRIANGLE_CONFIG.rotationRadians);

    return {
      x: centerX + dx * cosine + dy * sine,
      worldY: centerY - dx * sine + dy * cosine,
    };
  }

  addHighlightPoint(position: TrianglePosition, strength: number, time = performance.now()): void {
    this.highlightTrail.addPoint(position, strength, time);
  }

  addHighlightSegment(from: TrianglePosition, to: TrianglePosition, strength: number, now = performance.now()): void {
    this.highlightTrail.addSegment(from, to, strength, now);
  }

  addClick(position: TrianglePosition, now = performance.now()): void {
    this.highlightTrail.addClick(position, now);
  }

  resetInteractions(): void {
    this.highlightTrail.clear();
  }

  hasActiveTrail(now: number): boolean {
    return this.highlightTrail.hasActivePoint(now, this.settings.highlightLifetime);
  }

  render(now: number, elapsedTime: number, idleMotionEnabled: boolean): void {
    const context = this.context;

    if (!context) return;

    this.highlightTrail.removeExpired(now, this.settings.highlightLifetime);
    this.syncGridForViewport();

    context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    context.clearRect(0, 0, this.width, this.height);
    context.fillStyle = this.palette.background;
    context.fillRect(0, 0, this.width, this.height);

    context.save();
    // Scroll is a vertical screen-space movement. Applying it before rotation
    // prevents the page from drifting diagonally through the transformed grid.
    context.translate(0, -this.scrollOffset);
    context.translate(this.width * 0.5, this.height * 0.5);
    context.rotate(TRIANGLE_CONFIG.rotationRadians);
    context.translate(-this.width * 0.5, -this.height * 0.5);

    const idleStrength = idleMotionEnabled ? this.settings.idleStrength : 0.82;
    const sceneOpacity = idleMotionEnabled ? this.settings.opacity : this.settings.opacity * 0.82;

    for (const row of this.tileRows) {
      for (const tile of row.tiles) {
        this.drawTriangle(tile, row.y, now, elapsedTime, idleStrength, sceneOpacity);
      }
    }

    context.restore();
    this.drawAmbientGradient();
  }

  getPerformanceStats(): TriangleRendererStats {
    return {
      width: Math.round(this.width * this.dpr),
      height: Math.round(this.height * this.dpr),
      dpr: this.dpr,
      triangleCount: this.tileRows.reduce((count, row) => count + row.tiles.length, 0),
      trailPointCount: this.highlightTrail.pointCount,
      rotationDegrees: Math.round((TRIANGLE_CONFIG.rotationRadians * 180) / Math.PI),
    };
  }

  dispose(): void {
    this.tileRows.length = 0;
    this.highlightTrail.clear();
    this.trianglePathA = null;
    this.trianglePathB = null;
    this.ambientGradient = null;
    this.context = null;
  }

  private calculateRotatedSceneBounds(): void {
    const cosine = Math.abs(Math.cos(TRIANGLE_CONFIG.rotationRadians));
    const sine = Math.abs(Math.sin(TRIANGLE_CONFIG.rotationRadians));

    this.sceneWidth = this.width * cosine + this.height * sine;
    this.sceneHeight = this.width * sine + this.height * cosine;
  }

  private calculateGridMetrics(): GridMetrics {
    const aspectRatio = Math.max(this.sceneWidth / Math.max(this.sceneHeight, 1), 0.35);
    const targetCells = this.getTargetTriangleCount() / 2;
    const visibleColumns = Math.max(TRIANGLE_CONFIG.minimumColumns, Math.round(Math.sqrt(targetCells * aspectRatio)));
    const visibleRows = Math.max(TRIANGLE_CONFIG.minimumRows, Math.round(targetCells / visibleColumns));
    const cellWidth = this.sceneWidth / visibleColumns;
    const cellHeight = this.sceneHeight / visibleRows;

    return {
      cellWidth,
      cellHeight,
    };
  }

  private getTargetTriangleCount(): number {
    const targets = TRIANGLE_CONFIG.targetTriangles;
    const breakpoints = TRIANGLE_CONFIG.viewportBreakpoints;

    if (this.width < breakpoints.mobile) return targets.mobile * this.settings.densityScale;
    if (this.width < breakpoints.tablet) return targets.tablet * this.settings.densityScale;
    return targets.desktop * this.settings.densityScale;
  }

  private rebuildTrianglePaths(): void {
    const { cellWidth, cellHeight } = this.metrics;
    const pathA = new Path2D();

    pathA.moveTo(0, 0);
    pathA.lineTo(cellWidth, 0);
    pathA.lineTo(0, cellHeight);
    pathA.closePath();
    this.trianglePathA = pathA;

    const pathB = new Path2D();

    pathB.moveTo(cellWidth, 0);
    pathB.lineTo(cellWidth, cellHeight);
    pathB.lineTo(0, cellHeight);
    pathB.closePath();
    this.trianglePathB = pathB;
  }

  private syncGridForViewport(): void {
    if (this.tileRows.length > 0 && this.syncedScrollOffset === this.scrollOffset) return;

    // The screen corners are inverse-projected because a rotated rectangle
    // needs more source cells than its unrotated width and height suggest.
    const bounds = this.getVisibleWorldBounds();
    const cellWidth = Math.max(this.metrics.cellWidth, 1);
    const cellHeight = Math.max(this.metrics.cellHeight, 1);
    const overscan = TRIANGLE_CONFIG.overscanCells;
    const startColumnIndex = Math.floor(bounds.left / cellWidth) - overscan;
    const columnCount = Math.max(
      TRIANGLE_CONFIG.minimumColumns,
      Math.ceil((bounds.right - bounds.left) / cellWidth) + overscan * 2,
    );
    const startRowIndex = Math.floor(bounds.top / cellHeight) - overscan;
    const rowCount = Math.max(
      TRIANGLE_CONFIG.minimumRows,
      Math.ceil((bounds.bottom - bounds.top) / cellHeight) + overscan * 2,
    );
    const firstRow = this.tileRows[0];
    const currentStart = firstRow?.rowIndex;
    const currentEnd = this.tileRows[this.tileRows.length - 1]?.rowIndex;
    const currentColumnStart = firstRow?.tiles[0]?.column;
    const currentColumnEnd = firstRow?.tiles[firstRow.tiles.length - 1]?.column;
    const expectedEnd = startRowIndex + rowCount - 1;
    const expectedColumnEnd = startColumnIndex + columnCount - 1;

    if (
      currentStart === startRowIndex &&
      currentEnd === expectedEnd &&
      currentColumnStart === startColumnIndex &&
      currentColumnEnd === expectedColumnEnd
    ) {
      this.syncedScrollOffset = this.scrollOffset;
      return;
    }

    this.buildTileRows(startRowIndex, rowCount, startColumnIndex, columnCount);
    this.syncedScrollOffset = this.scrollOffset;
  }

  private getVisibleWorldBounds(): VisibleWorldBounds {
    const corners = [
      this.projectPointer(0, 0),
      this.projectPointer(this.width, 0),
      this.projectPointer(0, this.height),
      this.projectPointer(this.width, this.height),
    ];
    const xCoordinates = corners.map((corner) => corner.x);
    const yCoordinates = corners.map((corner) => corner.worldY);

    return {
      left: Math.min(...xCoordinates),
      right: Math.max(...xCoordinates),
      top: Math.min(...yCoordinates),
      bottom: Math.max(...yCoordinates),
    };
  }

  private buildTileRows(startRowIndex: number, rowCount: number, startColumnIndex: number, columnCount: number): void {
    const nextRows: TileRow[] = [];

    for (let offset = 0; offset < rowCount; offset += 1) {
      const rowIndex = startRowIndex + offset;
      const rowTiles: TriangleTile[] = [];

      for (let columnOffset = 0; columnOffset < columnCount; columnOffset += 1) {
        const column = startColumnIndex + columnOffset;
        // Global row/column seeds make a tile identical after window rebuilds.
        const seed = rowIndex * 149 + column * 43 + 1;

        rowTiles.push({
          column,
          side: 'a',
          tone: 0.68 + seededRandom(seed) * 0.32,
          phase: seededRandom(seed + 11) * Math.PI * 2,
          speed: 0.18 + seededRandom(seed + 17) * 0.22,
          driftX: (seededRandom(seed + 23) - 0.5) * 2.4,
          driftY: (seededRandom(seed + 29) - 0.5) * 2.4,
        });
        rowTiles.push({
          column,
          side: 'b',
          tone: 0.52 + seededRandom(seed + 37) * 0.34,
          phase: seededRandom(seed + 41) * Math.PI * 2,
          speed: 0.16 + seededRandom(seed + 47) * 0.2,
          driftX: (seededRandom(seed + 53) - 0.5) * 2,
          driftY: (seededRandom(seed + 59) - 0.5) * 2,
        });
      }

      nextRows.push({
        rowIndex,
        y: rowIndex * this.metrics.cellHeight,
        tiles: rowTiles,
      });
    }

    this.tileRows.length = 0;
    this.tileRows.push(...nextRows);
  }

  private drawTriangle(
    tile: TriangleTile,
    baseWorldY: number,
    now: number,
    elapsedTime: number,
    idleStrength: number,
    sceneOpacity: number,
  ): void {
    const context = this.context;
    const path = tile.side === 'a' ? this.trianglePathA : this.trianglePathB;

    if (!context || !path) return;

    const x = tile.column * this.metrics.cellWidth;
    const centerWorldX = x + this.metrics.cellWidth * 0.5;
    const centerWorldY = baseWorldY + this.metrics.cellHeight * 0.5;
    const idle = idleStrength * Math.sin(elapsedTime * tile.speed + tile.phase);
    const radius =
      this.width < TRIANGLE_CONFIG.viewportBreakpoints.mobile
        ? TRIANGLE_CONFIG.pointerRadius.mobile
        : TRIANGLE_CONFIG.pointerRadius.desktop;
    const trailInfluence = this.highlightTrail.getInfluence({ x: centerWorldX, worldY: centerWorldY }, now, {
      lifetime: this.settings.highlightLifetime,
      radius: radius * this.settings.interactionRadiusScale,
      strength: this.settings.highlightStrength,
    });
    const baseAlpha = 0.045 + tile.tone * 0.055 + Math.abs(idle) * 0.018;
    const alpha = (baseAlpha + trailInfluence * 0.22) * sceneOpacity;

    context.save();
    context.translate(x + tile.driftX * idle, baseWorldY + tile.driftY * idle);

    if (trailInfluence > 0.015) {
      context.fillStyle = `rgba(${this.palette.accent}, ${alpha})`;
      context.fill(path);

      if (trailInfluence > 0.14) {
        context.strokeStyle = `rgba(${this.palette.accent}, ${trailInfluence * 0.16 * sceneOpacity})`;
        context.lineWidth = 1;
        context.stroke(path);
      }
    } else {
      context.fillStyle = `rgba(${this.palette.fill}, ${alpha})`;
      context.fill(path);
    }

    context.restore();
  }

  private rebuildAmbientGradient(): void {
    const context = this.context;

    if (!context) {
      this.ambientGradient = null;
      return;
    }

    const gradient = context.createRadialGradient(
      this.width * 0.5,
      this.height * 0.36,
      0,
      this.width * 0.5,
      this.height * 0.36,
      this.width * 0.72,
    );

    gradient.addColorStop(0, `rgba(${this.palette.ambient}, ${0.055 * this.settings.opacity})`);
    gradient.addColorStop(1, `rgba(${this.palette.ambient}, 0)`);
    this.ambientGradient = gradient;
  }

  private drawAmbientGradient(): void {
    const context = this.context;

    if (!context) return;
    if (!this.ambientGradient) this.rebuildAmbientGradient();
    if (!this.ambientGradient) return;

    context.fillStyle = this.ambientGradient;
    context.fillRect(0, 0, this.width, this.height);
  }
}
