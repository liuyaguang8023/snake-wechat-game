export interface Scene {
    onEnter(data?: any): void;
    onUpdate(dt: number): void;
    onExit(): void;
}
export declare class SceneManager {
    private currentScene;
    private nextScene;
    switchTo(scene: Scene, data?: any): void;
    update(dt: number): void;
    getCurrentScene(): Scene | null;
}
