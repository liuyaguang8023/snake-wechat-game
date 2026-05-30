export class SettingsScene {
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
//# sourceMappingURL=SettingsScene.js.map