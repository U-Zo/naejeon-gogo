import type { Racer } from './types';

export class Camera {
  x = 0;
  y = 0;
  zoom = 1;
  private targetX = 0;
  private targetY = 0;
  private targetZoom = 1;
  private lerpSpeed = 0.04;

  update(
    activeRacers: Racer[],
    trackLength: number,
    trackWidth: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    if (activeRacers.length === 0) return;

    // Sort by y descending (leading = largest y = closest to finish)
    const sorted = [...activeRacers].sort((a, b) => b.body.position.y - a.body.position.y);
    const leadCount = Math.min(Math.max(2, Math.ceil(sorted.length * 0.3)), sorted.length);
    const leaders = sorted.slice(0, leadCount);

    const padding = 200;

    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const racer of leaders) {
      const { x, y } = racer.body.position;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    minX = Math.max(minX, -padding);
    maxX = Math.min(maxX, trackWidth + padding);

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    const zoomX = canvasWidth / rangeX;
    const zoomY = canvasHeight / rangeY;
    this.targetZoom = Math.min(zoomX, zoomY);

    const maxZoom = canvasWidth / (trackWidth * 0.3);
    const minZoom = canvasHeight / (trackLength + 400);
    this.targetZoom = Math.max(minZoom, Math.min(this.targetZoom, maxZoom));

    this.targetX = (minX + maxX) / 2;
    this.targetY = (minY + maxY) / 2;

    this.x = lerp(this.x, this.targetX, this.lerpSpeed);
    this.y = lerp(this.y, this.targetY, this.lerpSpeed);
    this.zoom = lerp(this.zoom, this.targetZoom, this.lerpSpeed);
  }

  resetToFullTrack(trackLength: number, trackWidth: number, canvasHeight: number): void {
    this.x = trackWidth / 2;
    this.y = trackLength / 2;
    this.zoom = canvasHeight / (trackLength + 400);
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetZoom = this.zoom;
  }

  applyTransform(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
