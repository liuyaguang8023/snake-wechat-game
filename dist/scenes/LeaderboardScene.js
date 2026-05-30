"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    fetchLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield cloud_1.CloudAPI.getRank('endless');
                this.list = data;
                this.error = false;
            }
            catch (_a) {
                this.error = true;
            }
            this.loading = false;
        });
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