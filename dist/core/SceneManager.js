"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneManager = void 0;
class SceneManager {
    constructor() {
        this.currentScene = null;
        this.nextScene = null;
    }
    switchTo(scene, data) {
        this.nextScene = { scene, data };
    }
    update(dt) {
        var _a, _b;
        if (this.nextScene) {
            (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.onExit();
            this.currentScene = this.nextScene.scene;
            this.currentScene.onEnter(this.nextScene.data);
            this.nextScene = null;
        }
        (_b = this.currentScene) === null || _b === void 0 ? void 0 : _b.onUpdate(dt);
    }
    getCurrentScene() {
        return this.currentScene;
    }
}
exports.SceneManager = SceneManager;
//# sourceMappingURL=SceneManager.js.map