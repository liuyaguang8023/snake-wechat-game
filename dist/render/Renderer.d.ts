import { GridPos, Snake } from '../entities/Snake';
import { Obstacle } from '../entities/Obstacle';
export declare class Renderer {
    private ctx;
    private width;
    private height;
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number);
    clear(): void;
    private drawGrid;
    drawSnake(snake: Snake, ghosting: boolean): void;
    private drawEyes;
    drawFood(position: GridPos): void;
    drawObstacles(obstacle: Obstacle): void;
    drawPowerUps(positions: {
        pos: GridPos;
        def: {
            icon: string;
        };
    }[]): void;
    drawHUD(score: number, levelName: string | null, remaining: number | null, paused: boolean): void;
    private roundRect;
}
