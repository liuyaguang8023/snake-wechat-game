import { Scene, SceneManager } from '../core/SceneManager';

export class SettingsScene implements Scene {
  constructor(private sceneManager: SceneManager) {}

  onEnter(): void {}
  onUpdate(_dt: number): void {}
  onExit(): void {}

  handleBack(): void {
    const { MenuScene } = require('./MenuScene');
    this.sceneManager.switchTo(new MenuScene(this.sceneManager));
  }
}
