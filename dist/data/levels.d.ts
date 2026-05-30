export interface LevelConfig {
    id: number;
    name: string;
    target: number;
    speed: number;
    obstacles: {
        row: number;
        col: number;
    }[];
}
export declare const LEVELS: LevelConfig[];
