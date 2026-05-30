"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelSystem = void 0;
const levels_1 = require("../data/levels");
const storage_1 = require("../utils/storage");
const constants_1 = require("../utils/constants");
class LevelSystem {
    constructor() {
        this.unlockedLevel = storage_1.Storage.get(constants_1.STORAGE_KEYS.unlockedLevel, 1);
        this.stars = storage_1.Storage.get(constants_1.STORAGE_KEYS.levelStars, {});
    }
    loadLevel(id) {
        var _a;
        const level = (_a = levels_1.LEVELS.find((l) => l.id === id)) !== null && _a !== void 0 ? _a : levels_1.LEVELS[0];
        // 如果网格行数不是原始的 20 行，按比例重映射障碍物行位置
        if (constants_1.GameConfig.GRID_ROWS !== 20) {
            const scale = constants_1.GameConfig.GRID_ROWS / 20;
            const remappedObstacles = level.obstacles.map((o) => ({
                row: Math.min(Math.floor(o.row * scale), constants_1.GameConfig.GRID_ROWS - 1),
                col: o.col,
            }));
            return Object.assign(Object.assign({}, level), { obstacles: remappedObstacles });
        }
        return level;
    }
    isUnlocked(id) {
        return id <= this.unlockedLevel;
    }
    completeLevel(id, starsEarned) {
        var _a;
        const prev = (_a = this.stars[id]) !== null && _a !== void 0 ? _a : 0;
        if (starsEarned > prev) {
            this.stars[id] = starsEarned;
        }
        if (id >= this.unlockedLevel && id < levels_1.LEVELS.length) {
            this.unlockedLevel = id + 1;
        }
        this.persist();
    }
    getStars(id) {
        var _a;
        return (_a = this.stars[id]) !== null && _a !== void 0 ? _a : 0;
    }
    persist() {
        storage_1.Storage.set(constants_1.STORAGE_KEYS.unlockedLevel, this.unlockedLevel);
        storage_1.Storage.set(constants_1.STORAGE_KEYS.levelStars, this.stars);
    }
}
exports.LevelSystem = LevelSystem;
//# sourceMappingURL=LevelSystem.js.map