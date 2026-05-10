export interface Scene {
  onEnter(data?: any): void;
  onUpdate(dt: number): void;
  onExit(): void;
}

export class SceneManager {
  private currentScene: Scene | null = null;
  private nextScene: { scene: Scene; data?: any } | null = null;

  switchTo(scene: Scene, data?: any): void {
    this.nextScene = { scene, data };
  }

  update(dt: number): void {
    if (this.nextScene) {
      this.currentScene?.onExit();
      this.currentScene = this.nextScene.scene;
      this.currentScene.onEnter(this.nextScene.data);
      this.nextScene = null;
    }
    this.currentScene?.onUpdate(dt);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }
}
