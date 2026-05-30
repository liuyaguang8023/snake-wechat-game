import { GridPos } from '../entities/Snake';
import { GameConfig } from '../utils/constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export class Effects {
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D | null = null;

  bind(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  emitBurst(pos: GridPos, color: string, count: number = 8): void {
    const cx = pos.col * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
    const cy = pos.row * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 20 + Math.random() * 40;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3 + Math.random() * 0.3,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  emitDeath(head: GridPos): void {
    this.emitBurst(head, '#FF5252', 20);
  }

  update(dt: number): void {
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
  }

  draw(): void {
    if (!this.ctx) return;
    for (const p of this.particles) {
      this.ctx.globalAlpha = Math.max(0, p.life / 0.6);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  clear(): void {
    this.particles = [];
  }
}
