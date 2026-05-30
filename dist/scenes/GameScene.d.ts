import { Scene, SceneManager } from '../core/SceneManager';
import { ScoreSystem } from '../systems/ScoreSystem';
import { EventBus } from '../core/EventBus';
export declare enum GameMode {
    Endless = "Endless",
    Level = "Level"
}
interface GameSceneData {
    mode: GameMode;
    levelId?: number;
}
export declare class GameScene implements Scene {
    private sceneManager;
    private snake;
    private food;
    private obstacle;
    private collisionSystem;
    private scoreSystem;
    private powerUpSystem;
    private levelSystem;
    private effects;
    private eventBus;
    private mode;
    private levelId;
    private moveAccumulator;
    private moveInterval;
    private paused;
    private gameOver;
    private won;
    private fieldPowerUps;
    constructor(sceneManager: SceneManager, data: GameSceneData);
    onEnter(): void;
    private resetGame;
    onUpdate(dt: number): void;
    private gameTick;
    private spawnFood;
    private trySpawnPowerUp;
    private updateSpeed;
    private handleDeath;
    private handleWin;
    private render;
    togglePause(): void;
    isGameOver(): boolean;
    isWon(): boolean;
    getScoreSystem(): ScoreSystem;
    getEventBus(): EventBus;
    getMode(): GameMode;
    getLevelId(): number;
    onExit(): void;
}
export {};
