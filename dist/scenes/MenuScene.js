export class MenuScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }
    onEnter() { }
    onUpdate(_dt) { }
    onExit() { }
    handleStartEndless() {
        const { GameScene, GameMode } = require('./GameScene');
        this.sceneManager.switchTo(new GameScene(this.sceneManager, { mode: GameMode.Endless }));
    }
    handleLevelSelect() {
        const { LevelSelectScene } = require('./LevelSelectScene');
        this.sceneManager.switchTo(new LevelSelectScene(this.sceneManager));
    }
    handleSettings() {
        const { SettingsScene } = require('./SettingsScene');
        this.sceneManager.switchTo(new SettingsScene(this.sceneManager));
    }
}
//# sourceMappingURL=MenuScene.js.map