import { Scene, SceneManager } from '../core/SceneManager';
import { GameMode } from './GameScene';
import { Storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

interface ResultData {
  mode: GameMode;
  score: number;
  levelId?: number;
  stars?: number;
}

export class ResultScene implements Scene {
  private data: ResultData | null = null;

  constructor(private sceneManager: SceneManager) {}

  onEnter(data?: ResultData): void {
    this.data = data ?? null;
    if (!this.data) return;

    if (this.data.mode === GameMode.Endless) {
      const best = Storage.get<number>(STORAGE_KEYS.bestScoreEndless, 0);
      if (this.data.score > best) {
        Storage.set(STORAGE_KEYS.bestScoreEndless, this.data.score);
      }
    }
  }

  onUpdate(_dt: number): void {}

  onExit(): void {}

  getData(): ResultData | null {
    return this.data;
  }

  isLastLevelComplete(): boolean {
    return this.data?.levelId === 10 && this.data?.mode === GameMode.Level;
  }

  handleRestart(): void {
    if (!this.data) return;
    const { GameScene } = require('./GameScene');
    if (this.data.mode === GameMode.Endless) {
      this.sceneManager.switchTo(new GameScene(this.sceneManager, { mode: GameMode.Endless }));
    } else if (this.data.levelId) {
      this.sceneManager.switchTo(new GameScene(this.sceneManager, { mode: GameMode.Level, levelId: this.data.levelId }));
    }
  }

  handleBackToMenu(): void {
    const { MenuScene } = require('./MenuScene');
    this.sceneManager.switchTo(new MenuScene(this.sceneManager));
  }
}
