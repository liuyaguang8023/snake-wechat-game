import { Scene, SceneManager } from '../core/SceneManager';
import { GameMode } from './GameScene';
interface ResultData {
    mode: GameMode;
    score: number;
    levelId?: number;
    stars?: number;
}
export declare class ResultScene implements Scene {
    private sceneManager;
    private data;
    constructor(sceneManager: SceneManager);
    onEnter(data?: ResultData): void;
    onUpdate(_dt: number): void;
    onExit(): void;
    getData(): ResultData | null;
    isLastLevelComplete(): boolean;
    handleRestart(): void;
    handleBackToMenu(): void;
}
export {};
