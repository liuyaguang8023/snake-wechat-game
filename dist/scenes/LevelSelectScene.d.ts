import { Scene, SceneManager } from '../core/SceneManager';
import { LevelSystem } from '../systems/LevelSystem';
export declare class LevelSelectScene implements Scene {
    private sceneManager;
    private levelSystem;
    constructor(sceneManager: SceneManager);
    onEnter(): void;
    onUpdate(_dt: number): void;
    onExit(): void;
    getLevelSystem(): LevelSystem;
    handleSelectLevel(levelId: number): void;
    handleBack(): void;
}
