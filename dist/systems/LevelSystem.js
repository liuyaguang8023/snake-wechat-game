import { LEVELS } from '../data/levels';
import { Storage } from '../utils/storage';
import { GameConfig, STORAGE_KEYS } from '../utils/constants';
export class LevelSystem {
    constructor() {
        this.unlockedLevel = Storage.get(STORAGE_KEYS.unlockedLevel, 1);
        this.stars = Storage.get(STORAGE_KEYS.levelStars, {});
    }
    loadLevel(id) {
        const level = LEVELS.find((l) => l.id === id) ?? LEVELS[0];
        // 如果网格行数不是原始的 20 行，按比例重映射障碍物行位置
        if (GameConfig.GRID_ROWS !== 20) {
            const scale = GameConfig.GRID_ROWS / 20;
            const remappedObstacles = level.obstacles.map((o) => ({
                row: Math.min(Math.floor(o.row * scale), GameConfig.GRID_ROWS - 1),
                col: o.col,
            }));
            return { ...level, obstacles: remappedObstacles };
        }
        return level;
    }
    isUnlocked(id) {
        return id <= this.unlockedLevel;
    }
    completeLevel(id, starsEarned) {
        const prev = this.stars[id] ?? 0;
        if (starsEarned > prev) {
            this.stars[id] = starsEarned;
        }
        if (id >= this.unlockedLevel && id < LEVELS.length) {
            this.unlockedLevel = id + 1;
        }
        this.persist();
    }
    getStars(id) {
        return this.stars[id] ?? 0;
    }
    persist() {
        Storage.set(STORAGE_KEYS.unlockedLevel, this.unlockedLevel);
        Storage.set(STORAGE_KEYS.levelStars, this.stars);
    }
}
//# sourceMappingURL=LevelSystem.js.map