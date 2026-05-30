"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsScene = void 0;
class SettingsScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }
    onEnter() { }
    onUpdate(_dt) { }
    onExit() { }
    handleBack() {
        const { MenuScene } = require('./MenuScene');
        this.sceneManager.switchTo(new MenuScene(this.sceneManager));
    }
}
exports.SettingsScene = SettingsScene;
//# sourceMappingURL=SettingsScene.js.map