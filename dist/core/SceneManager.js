export class SceneManager {
    constructor() {
        this.currentScene = null;
        this.nextScene = null;
    }
    switchTo(scene, data) {
        this.nextScene = { scene, data };
    }
    update(dt) {
        if (this.nextScene) {
            this.currentScene?.onExit();
            this.currentScene = this.nextScene.scene;
            this.currentScene.onEnter(this.nextScene.data);
            this.nextScene = null;
        }
        this.currentScene?.onUpdate(dt);
    }
    getCurrentScene() {
        return this.currentScene;
    }
}
//# sourceMappingURL=SceneManager.js.map