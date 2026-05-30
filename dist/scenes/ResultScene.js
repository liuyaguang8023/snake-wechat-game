"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultScene = void 0;
const GameScene_1 = require("./GameScene");
const storage_1 = require("../utils/storage");
const constants_1 = require("../utils/constants");
class ResultScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.data = null;
    }
    onEnter(data) {
        this.data = data ?? null;
        if (!this.data)
            return;
        if (this.data.mode === GameScene_1.GameMode.Endless) {
            const best = storage_1.Storage.get(constants_1.STORAGE_KEYS.bestScoreEndless, 0);
            if (this.data.score > best) {
                storage_1.Storage.set(constants_1.STORAGE_KEYS.bestScoreEndless, this.data.score);
            }
        }
    }
    onUpdate(_dt) { }
    onExit() { }
    getData() {
        return this.data;
    }
    isLastLevelComplete() {
        return this.data?.levelId === 10 && this.data?.mode === GameScene_1.GameMode.Level;
    }
    handleRestart() {
        if (!this.data)
            return;
        const { GameScene } = require('./GameScene');
        if (this.data.mode === GameScene_1.GameMode.Endless) {
            this.sceneManager.switchTo(new GameScene(this.sceneManager, { mode: GameScene_1.GameMode.Endless }));
        }
        else if (this.data.levelId) {
            this.sceneManager.switchTo(new GameScene(this.sceneManager, { mode: GameScene_1.GameMode.Level, levelId: this.data.levelId }));
        }
    }
    handleBackToMenu() {
        const { MenuScene } = require('./MenuScene');
        this.sceneManager.switchTo(new MenuScene(this.sceneManager));
    }
}
exports.ResultScene = ResultScene;
//# sourceMappingURL=ResultScene.js.map