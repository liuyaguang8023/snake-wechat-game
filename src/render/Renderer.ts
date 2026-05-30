import { GridPos, Snake } from '../entities/Snake';
import { Obstacle } from '../entities/Obstacle';
import { Direction, Colors, GameConfig } from '../utils/constants';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  clear(): void {
    this.ctx.fillStyle = Colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.drawGrid();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = Colors.grid;
    this.ctx.lineWidth = 0.5;
    for (let r = 0; r < GameConfig.GRID_ROWS; r++) {
      for (let c = 0; c < GameConfig.GRID_COLS; c++) {
        this.ctx.strokeRect(c * GameConfig.CELL_SIZE, r * GameConfig.CELL_SIZE, GameConfig.CELL_SIZE, GameConfig.CELL_SIZE);
      }
    }
  }

  drawSnake(snake: Snake, ghosting: boolean): void {
    this.ctx.globalAlpha = ghosting ? 0.5 : 1;
    snake.body.forEach((seg, i) => {
      const x = seg.col * GameConfig.CELL_SIZE;
      const y = seg.row * GameConfig.CELL_SIZE;
      const radius = 4;
      const padding = 1;

      if (i === 0) {
        this.ctx.fillStyle = Colors.snakeHead;
      } else if (i === snake.body.length - 1) {
        this.ctx.fillStyle = Colors.snakeTail;
      } else {
        this.ctx.fillStyle = Colors.snakeBody;
      }

      this.roundRect(x + padding, y + padding, GameConfig.CELL_SIZE - padding * 2, GameConfig.CELL_SIZE - padding * 2, radius);
      this.ctx.fill();

      if (i === 0) {
        this.drawEyes(seg, snake.direction);
      }
    });
    this.ctx.globalAlpha = 1;
  }

  private drawEyes(head: GridPos, direction: Direction): void {
    const cx = head.col * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
    const cy = head.row * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
    const eyeR = 2;
    this.ctx.fillStyle = '#FFFFFF';

    let ex1 = cx, ey1 = cy, ex2 = cx, ey2 = cy;
    const offset = 4;

    switch (direction) {
      case Direction.Up:    ey1 -= offset; ey2 -= offset; ex1 -= offset; ex2 += offset; break;
      case Direction.Down:  ey1 += offset; ey2 += offset; ex1 -= offset; ex2 += offset; break;
      case Direction.Left:  ex1 -= offset; ex2 -= offset; ey1 -= offset; ey2 += offset; break;
      case Direction.Right: ex1 += offset; ex2 += offset; ey1 -= offset; ey2 += offset; break;
    }

    this.ctx.beginPath();
    this.ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2);
    this.ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#333';
    this.ctx.beginPath();
    this.ctx.arc(ex1, ey1, 1, 0, Math.PI * 2);
    this.ctx.arc(ex2, ey2, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawFood(position: GridPos): void {
    const x = position.col * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
    const y = position.row * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
    const emojiSize = Math.max(GameConfig.CELL_SIZE + 4, 16);
    this.ctx.font = `${emojiSize}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🍎', x, y);
  }

  drawObstacles(obstacle: Obstacle): void {
    obstacle.positions.forEach((pos) => {
      const x = pos.col * GameConfig.CELL_SIZE + 2;
      const y = pos.row * GameConfig.CELL_SIZE + 2;
      this.ctx.fillStyle = Colors.obstacle;
      this.roundRect(x, y, GameConfig.CELL_SIZE - 4, GameConfig.CELL_SIZE - 4, 3);
      this.ctx.fill();
    });
  }

  drawPowerUps(positions: { pos: GridPos; def: { icon: string } }[]): void {
    positions.forEach(({ pos, def }) => {
      const x = pos.col * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
      const y = pos.row * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
      const emojiSize = Math.max(GameConfig.CELL_SIZE + 4, 16);
      this.ctx.font = `${emojiSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(def.icon, x, y);
    });
  }

  drawHUD(score: number, levelName: string | null, remaining: number | null, paused: boolean): void {
    // 清除 HUD 区域
    const hudY = GameConfig.CELL_SIZE * GameConfig.GRID_ROWS;
    this.ctx.fillStyle = Colors.background;
    this.ctx.fillRect(0, hudY, this.width, GameConfig.HUD_HEIGHT);

    this.ctx.fillStyle = Colors.hudText;
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`分数: ${score}`, 8, hudY + 18);

    if (levelName) {
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${levelName}`, GameConfig.CELL_SIZE * GameConfig.GRID_COLS / 2, hudY + 18);
    }

    if (remaining !== null) {
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`剩余: ${remaining}`, GameConfig.CELL_SIZE * GameConfig.GRID_COLS - 8, hudY + 18);
    }

    if (paused) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('已暂停', this.width / 2, this.height / 2 - 20);
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText('滑动屏幕继续', this.width / 2, this.height / 2 + 10);
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.arcTo(x + w, y, x + w, y + r, r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.arcTo(x, y + h, x, y + h - r, r);
    this.ctx.lineTo(x, y + r);
    this.ctx.arcTo(x, y, x + r, y, r);
    this.ctx.closePath();
  }
}
