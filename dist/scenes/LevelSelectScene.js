import { LevelSystem } from '../systems/LevelSystem';
export class LevelSelectScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.levelSystem = new LevelSystem();
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
//# sourceMappingURL=LevelSelectScene.js.map