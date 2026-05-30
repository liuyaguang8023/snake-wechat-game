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
            var _a;
            if (!this.running)
                return;
            const now = Date.now();
            const dt = Math.min((now - this.lastTime) / 1000, 0.1);
            this.lastTime = now;
            (_a = this.updateFn) === null || _a === void 0 ? void 0 : _a.call(this, dt);
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