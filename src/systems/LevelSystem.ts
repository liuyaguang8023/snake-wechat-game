import { LEVELS, LevelConfig } from '../data/levels';
import { Storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

export class LevelSystem {
  unlockedLevel: number;
  private stars: Record<number, number>;

  constructor() {
    this.unlockedLevel = Storage.get<number>(STORAGE_KEYS.unlockedLevel, 1);
    this.stars = Storage.get<Record<number, number>>(STORAGE_KEYS.levelStars, {});
  }

  loadLevel(id: number): LevelConfig {
    return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
  }

  isUnlocked(id: number): boolean {
    return id <= this.unlockedLevel;
  }

  completeLevel(id: number, starsEarned: number): void {
    const prev = this.stars[id] ?? 0;
    if (starsEarned > prev) {
      this.stars[id] = starsEarned;
    }
    if (id >= this.unlockedLevel && id < LEVELS.length) {
      this.unlockedLevel = id + 1;
    }
    this.persist();
  }

  getStars(id: number): number {
    return this.stars[id] ?? 0;
  }

  private persist(): void {
    Storage.set(STORAGE_KEYS.unlockedLevel, this.unlockedLevel);
    Storage.set(STORAGE_KEYS.levelStars, this.stars);
  }
}
