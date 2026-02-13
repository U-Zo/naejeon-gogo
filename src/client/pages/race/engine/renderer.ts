import type { Camera } from './camera';
import type { Obstacle, Racer } from './types';

const TRACK_BG = '#0a1428';
const WALL_COLOR = '#1e2d3d';
const FINISH_LINE_COLOR = '#c8aa6e';
const START_LINE_COLOR = '#5b5a56';
const RACER_COLORS = [
  '#e06060', '#60a0e0', '#60c060', '#e0a040', '#b060d0',
  '#40c8c8', '#e07090', '#80b040', '#d08040', '#6080d0',
];

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvasEl: HTMLCanvasElement) {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d canvas context');
    this.ctx = ctx;
  }

  render(
    camera: Camera,
    racers: readonly Racer[],
    obstacles: readonly Obstacle[],
    trackLength: number,
    trackWidth: number,
  ): void {
    const { width, height } = this.canvasEl;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = TRACK_BG;
    ctx.fillRect(0, 0, width, height);

    camera.applyTransform(ctx, width, height);

    this.drawTrack(trackLength, trackWidth);
    this.drawObstacles(obstacles);
    this.drawRacers(racers);

    camera.restoreTransform(ctx);
  }

  private drawTrack(trackLength: number, trackWidth: number): void {
    const ctx = this.ctx;

    // Track background
    ctx.fillStyle = '#0d1f33';
    ctx.fillRect(0, -100, trackWidth, trackLength + 200);

    // Side walls
    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -100);
    ctx.lineTo(0, trackLength + 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(trackWidth, -100);
    ctx.lineTo(trackWidth, trackLength + 100);
    ctx.stroke();

    // Start line at top (y = 50)
    ctx.strokeStyle = START_LINE_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(trackWidth, 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Finish line at bottom (y = trackLength)
    ctx.strokeStyle = FINISH_LINE_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, trackLength);
    ctx.lineTo(trackWidth, trackLength);
    ctx.stroke();

    // Finish zone glow
    ctx.fillStyle = FINISH_LINE_COLOR;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(0, trackLength, trackWidth, 100);
    ctx.globalAlpha = 1;

    // Checkerboard pattern at finish
    const checkerSize = 15;
    ctx.fillStyle = FINISH_LINE_COLOR;
    ctx.globalAlpha = 0.3;
    const cols = Math.ceil(trackWidth / checkerSize);
    const rows = Math.ceil(40 / checkerSize);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(
            c * checkerSize,
            trackLength + r * checkerSize,
            checkerSize,
            checkerSize,
          );
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawObstacles(obstacles: readonly Obstacle[]): void {
    const ctx = this.ctx;

    for (const obs of obstacles) {
      const { position, vertices, angle } = obs.body;
      ctx.globalAlpha = 0.7;

      switch (obs.type) {
        case 'bumper': {
          const radius = 'circleRadius' in obs.body ? (obs.body.circleRadius as number) : 10;
          // Outer glow
          ctx.beginPath();
          ctx.arc(position.x, position.y, radius + 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 100, 80, 0.2)';
          ctx.fill();
          // Main circle
          ctx.beginPath();
          ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#e85d4a';
          ctx.fill();
          ctx.strokeStyle = '#ff8a75';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Center dot
          ctx.beginPath();
          ctx.arc(position.x, position.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = 0.6;
          ctx.fill();
          break;
        }
        case 'wall': {
          ctx.save();
          ctx.translate(position.x, position.y);
          ctx.rotate(angle);
          const w = Math.hypot(
            vertices[1].x - vertices[0].x,
            vertices[1].y - vertices[0].y,
          );
          const h = Math.hypot(
            vertices[2].x - vertices[1].x,
            vertices[2].y - vertices[1].y,
          );
          ctx.fillStyle = '#f5a623';
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.strokeStyle = '#ffc860';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
          // Hazard stripes
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#000';
          const stripeW = 6;
          for (let sx = -w / 2; sx < w / 2; sx += stripeW * 2) {
            ctx.fillRect(sx, -h / 2, stripeW, h);
          }
          ctx.restore();
          break;
        }
        case 'spinner': {
          ctx.beginPath();
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let j = 1; j < vertices.length; j++) {
            ctx.lineTo(vertices[j].x, vertices[j].y);
          }
          ctx.closePath();
          ctx.fillStyle = '#5ac8e8';
          ctx.fill();
          ctx.strokeStyle = '#8adfff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        }
      }

      ctx.globalAlpha = 1;
    }
  }

  private drawRacers(racers: readonly Racer[]): void {
    const ctx = this.ctx;

    for (let i = 0; i < racers.length; i++) {
      const racer = racers[i];
      const { x, y } = racer.body.position;
      const radius = 'circleRadius' in racer.body ? (racer.body.circleRadius as number) : 15;
      const isFinished = racer.finishOrder !== null;
      const color = RACER_COLORS[i % RACER_COLORS.length];

      ctx.globalAlpha = isFinished ? 0.3 : 1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isFinished ? '#333' : '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (isFinished && racer.finishOrder !== null) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${radius}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${racer.finishOrder}`, x, y);
      }

      ctx.fillStyle = isFinished ? '#666' : '#f0e6d2';
      ctx.font = `bold ${Math.max(10, radius * 0.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(racer.name, x, y + radius + 4);

      ctx.globalAlpha = 1;
    }
  }

  resize(): void {
    const rect = this.canvasEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvasEl.width = rect.width * dpr;
    this.canvasEl.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  get width(): number {
    return this.canvasEl.getBoundingClientRect().width;
  }

  get height(): number {
    return this.canvasEl.getBoundingClientRect().height;
  }
}
