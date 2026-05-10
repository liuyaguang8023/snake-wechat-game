import { Scene, SceneManager } from '../core/SceneManager';

export class MenuScene implements Scene {
  constructor(private sceneManager: SceneManager) {}

  onEnter(): void {}
  onUpdate(_dt: number): void {}
  onExit(): void {}

  handleStartEndless(): void {
    const { GameScene, GameMode } = require('./GameScene');
    this.sceneManager.switchTo(
      new GameScene(this.sceneManager, { mode: GameMode.Endless })
    );
  }

  handleLevelSelect(): void {
    const { LevelSelectScene } = require('./LevelSelectScene');
    this.sceneManager.switchTo(new LevelSelectScene(this.sceneManager));
  }

  handleSettings(): void {
    const { SettingsScene } = require('./SettingsScene');
    this.sceneManager.switchTo(new SettingsScene(this.sceneManager));
  }
}
