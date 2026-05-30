import { CloudAPI } from '../api/cloud';
export class LeaderboardScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.loading = true;
        this.list = [];
        this.error = false;
    }
    onEnter() {
        this.loading = true;
        this.list = [];
        this.error = false;
        this.fetchLeaderboard();
    }
    async fetchLeaderboard() {
        try {
            const data = await CloudAPI.getRank('endless');
            this.list = data;
            this.error = false;
        }
        catch {
            this.error = true;
        }
        this.loading = false;
    }
    onUpdate(_dt) { }
    onExit() { }
    isLoading() { return this.loading; }
    getList() { return this.list; }
    hasError() { return this.error; }
    handleBack() {
        const { MenuScene } = require('./MenuScene');
        this.sceneManager.switchTo(new MenuScene(this.sceneManager));
    }
}
//# sourceMappingURL=LeaderboardScene.js.map