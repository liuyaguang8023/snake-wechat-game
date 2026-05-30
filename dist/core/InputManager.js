"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputManager = void 0;
const constants_1 = require("../utils/constants");
const wx = globalThis.wx;
class InputManager {
    constructor() {
        this.currentDirection = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 30;
        this.bound = false;
    }
    bind(_canvas) {
        if (this.bound)
            return;
        this.bound = true;
        // WeChat Mini Game uses wx.onTouch* instead of canvas.addEventListener
        if (wx) {
            wx.onTouchStart((e) => {
                const touch = e.touches[0];
                if (!touch)
                    return;
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
            });
            wx.onTouchMove((e) => {
                const touch = e.touches[0];
                if (!touch)
                    return;
                const dx = touch.clientX - this.touchStartX;
                const dy = touch.clientY - this.touchStartY;
                if (Math.abs(dx) < this.swipeThreshold && Math.abs(dy) < this.swipeThreshold)
                    return;
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.currentDirection = dx > 0 ? constants_1.Direction.Right : constants_1.Direction.Left;
                }
                else {
                    this.currentDirection = dy > 0 ? constants_1.Direction.Down : constants_1.Direction.Up;
                }
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
            });
            wx.onTouchEnd(() => {
                // direction consumed in next game tick
            });
        }
    }
    consumeDirection() {
        const dir = this.currentDirection;
        this.currentDirection = null;
        return dir;
    }
}
exports.InputManager = InputManager;
//# sourceMappingURL=InputManager.js.map