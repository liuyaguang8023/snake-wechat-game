"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelSelectScene = void 0;
const LevelSystem_1 = require("../systems/LevelSystem");
class LevelSelectScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.levelSystem = new LevelSystem_1.LevelSystem();
    }
    onEnter() { }
    onUpdate(_dt) { }
    onExit() { }
    getLevelSystem() {
        return this.levelSystem;
    }
    handleSelectLevel(levelId) {
        if (!this.levelSystem.isUnlocked(levelId))
            return;
        const { GameScene, GameMode } = require('./GameScene');
        this.sceneManager.switchTo(new GameScene(this.sceneManager, { mode: GameMode.Level, levelId }));
    }
    handleBack() {
        const { MenuScene } = require('./MenuScene');
        this.sceneManager.switchTo(new MenuScene(this.sceneManager));
    }
}
exports.LevelSelectScene = LevelSelectScene;
//# sourceMappingURL=LevelSelectScene.js.map