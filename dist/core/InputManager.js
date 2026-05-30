import { Direction } from '../utils/constants';
export class InputManager {
    constructor() {
        this.currentDirection = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 30;
    }
    bind(canvas) {
        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault?.();
            const touch = e.touches[0];
            const dx = touch.clientX - this.touchStartX;
            const dy = touch.clientY - this.touchStartY;
            if (Math.abs(dx) < this.swipeThreshold && Math.abs(dy) < this.swipeThreshold)
                return;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.currentDirection = dx > 0 ? Direction.Right : Direction.Left;
            }
            else {
                this.currentDirection = dy > 0 ? Direction.Down : Direction.Up;
            }
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });
        canvas.addEventListener('touchend', () => {
            // direction consumed in next game tick
        });
    }
    consumeDirection() {
        const dir = this.currentDirection;
        this.currentDirection = null;
        return dir;
    }
}
//# sourceMappingURL=InputManager.js.map