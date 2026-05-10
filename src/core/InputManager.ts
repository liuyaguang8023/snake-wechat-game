import { Direction } from '../utils/constants';

export class InputManager {
  private currentDirection: Direction | null = null;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly swipeThreshold: number = 30;

  bind(canvas: any): void {
    canvas.addEventListener('touchstart', (e: any) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    canvas.addEventListener('touchmove', (e: any) => {
      e.preventDefault?.();
      const touch = e.touches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;

      if (Math.abs(dx) < this.swipeThreshold && Math.abs(dy) < this.swipeThreshold) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        this.currentDirection = dx > 0 ? Direction.Right : Direction.Left;
      } else {
        this.currentDirection = dy > 0 ? Direction.Down : Direction.Up;
      }

      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    canvas.addEventListener('touchend', () => {
      // direction consumed in next game tick
    });
  }

  consumeDirection(): Direction | null {
    const dir = this.currentDirection;
    this.currentDirection = null;
    return dir;
  }
}
