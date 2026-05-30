import { Direction } from '../utils/constants';

const wx = (globalThis as any).wx;

export class InputManager {
  private currentDirection: Direction | null = null;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly swipeThreshold: number = 30;
  private bound: boolean = false;

  bind(_canvas: any): void {
    if (this.bound) return;
    this.bound = true;

    // WeChat Mini Game uses wx.onTouch* instead of canvas.addEventListener
    if (wx) {
      wx.onTouchStart((e: any) => {
        const touch = e.touches[0];
        if (!touch) return;
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      });

      wx.onTouchMove((e: any) => {
        const touch = e.touches[0];
        if (!touch) return;
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

      wx.onTouchEnd(() => {
        // direction consumed in next game tick
      });
    }
  }

  consumeDirection(): Direction | null {
    const dir = this.currentDirection;
    this.currentDirection = null;
    return dir;
  }
}
