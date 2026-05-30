import { LevelConfig } from '../data/levels';
export declare class LevelSystem {
    unlockedLevel: number;
    private stars;
    constructor();
    loadLevel(id: number): LevelConfig;
    isUnlocked(id: number): boolean;
    completeLevel(id: number, starsEarned: number): void;
    getStars(id: number): number;
    private persist;
}
