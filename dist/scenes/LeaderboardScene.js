"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardScene = void 0;
const cloud_1 = require("../api/cloud");
class LeaderboardScene {
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
            const data = await cloud_1.CloudAPI.getRank('endless');
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
exports.LeaderboardScene = LeaderboardScene;
//# sourceMappingURL=LeaderboardScene.js.map