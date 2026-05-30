import { GridPos } from '../entities/Snake';
export declare class Effects {
    private particles;
    private ctx;
    bind(ctx: CanvasRenderingContext2D): void;
    emitBurst(pos: GridPos, color: string, count?: number): void;
    emitDeath(head: GridPos): void;
    update(dt: number): void;
    draw(): void;
    clear(): void;
}
