"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLoop = void 0;
class GameLoop {
    constructor() {
        this.rafId = 0;
        this.lastTime = 0;
        this.running = false;
        this.updateFn = null;
        this.tick = () => {
            if (!this.running)
                return;
            const now = Date.now();
            const dt = Math.min((now - this.lastTime) / 1000, 0.1);
            this.lastTime = now;
            this.updateFn?.(dt);
            this.rafId = requestAnimationFrame(this.tick);
        };
    }
    start(updateFn) {
        this.updateFn = updateFn;
        this.running = true;
        this.lastTime = Date.now();
        this.tick();
    }
    stop() {
        this.running = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = 0;
        }
    }
    isRunning() {
        return this.running;
    }
}
exports.GameLoop = GameLoop;
//# sourceMappingURL=GameLoop.js.map