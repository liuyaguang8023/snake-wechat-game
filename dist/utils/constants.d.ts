export declare const GameConfig: {
    GRID_COLS: number;
    GRID_ROWS: number;
    CELL_SIZE: number;
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    HUD_HEIGHT: number;
};
/** 根据屏幕尺寸重新计算网格参数。在 main.ts 启动时调用一次。 */
export declare function initDimensions(screenW: number, screenH: number): void;
export declare enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}
export declare const DirectionVectors: Record<Direction, {
    row: number;
    col: number;
}>;
export declare const OppositeDirection: Record<Direction, Direction>;
export declare const Colors: {
    snakeHead: string;
    snakeBody: string;
    snakeTail: string;
    food: string;
    obstacle: string;
    background: string;
    grid: string;
    hudText: string;
    powerUpGlow: string;
};
export declare const SPEED_TIERS: {
    maxScore: number;
    interval: number;
}[];
export declare const POWERUP_SPAWN_FOOD_COUNT = 5;
export declare const POWERUP_SPAWN_CHANCE = 0.4;
export declare const MAX_POWERUPS_ON_FIELD = 2;
export declare const STORAGE_KEYS: {
    readonly bestScoreEndless: "best_score_endless";
    readonly levelStars: "level_stars";
    readonly unlockedLevel: "unlocked_level";
    readonly settingsSound: "settings_sound";
};
export declare const INITIAL_SNAKE_LENGTH = 3;
