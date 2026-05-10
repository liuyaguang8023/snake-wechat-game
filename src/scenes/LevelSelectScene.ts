import { Scene, SceneManager } from '../core/SceneManager';
import { LevelSystem } from '../systems/LevelSystem';

export class LevelSelectScene implements Scene {
  private levelSystem: LevelSystem;

  constructor(private sceneManager: SceneManager) {
    this.levelSystem = new LevelSystem();
  }

  onEnter(): void {}
  onUpdate(_dt: number): void {}
  onExit(): void {}

  getLevelSystem(): LevelSystem {
    return this.levelSystem;
  }

  handleSelectLevel(levelId: number): void {
    if (!this.levelSystem.isUnlocked(levelId)) return;
    const { GameScene, GameMode } = require('./GameScene');
    this.sceneManager.switchTo(
      new GameScene(this.sceneManager, { mode: GameMode.Level, levelId })
    );
  }

  handleBack(): void {
    const { MenuScene } = require('./MenuScene');
    this.sceneManager.switchTo(new MenuScene(this.sceneManager));
  }
}
