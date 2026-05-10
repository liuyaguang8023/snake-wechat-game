export class GameLoop {
  private rafId: number = 0;
  private lastTime: number = 0;
  private running: boolean = false;
  private updateFn: ((dt: number) => void) | null = null;

  start(updateFn: (dt: number) => void): void {
    this.updateFn = updateFn;
    this.running = true;
    this.lastTime = Date.now();
    this.tick();
  }

  stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private tick = (): void => {
    if (!this.running) return;
    const now = Date.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.updateFn?.(dt);
    this.rafId = requestAnimationFrame(this.tick);
  };

  isRunning(): boolean {
    return this.running;
  }
}
