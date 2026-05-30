export declare class GameLoop {
    private rafId;
    private lastTime;
    private running;
    private updateFn;
    start(updateFn: (dt: number) => void): void;
    stop(): void;
    private tick;
    isRunning(): boolean;
}
