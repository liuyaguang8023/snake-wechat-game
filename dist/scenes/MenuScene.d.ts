import { Scene, SceneManager } from '../core/SceneManager';
export declare class MenuScene implements Scene {
    private sceneManager;
    constructor(sceneManager: SceneManager);
    onEnter(): void;
    onUpdate(_dt: number): void;
    onExit(): void;
    handleStartEndless(): void;
    handleLevelSelect(): void;
    handleSettings(): void;
}
