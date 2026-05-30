import { Scene, SceneManager } from '../core/SceneManager';
export declare class SettingsScene implements Scene {
    private sceneManager;
    constructor(sceneManager: SceneManager);
    onEnter(): void;
    onUpdate(_dt: number): void;
    onExit(): void;
    handleBack(): void;
}
