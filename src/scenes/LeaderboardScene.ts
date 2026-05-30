import { Scene, SceneManager } from '../core/SceneManager';
import { CloudAPI, RankItem } from '../api/cloud';

export class LeaderboardScene implements Scene {
  private loading = true;
  private list: RankItem[] = [];
  private error = false;

  constructor(private sceneManager: SceneManager) {}

  onEnter(): void {
    this.loading = true;
    this.list = [];
    this.error = false;
    this.fetchLeaderboard();
  }

  private async fetchLeaderboard(): Promise<void> {
    try {
      const data = await CloudAPI.getRank('endless');
      this.list = data;
      this.error = false;
    } catch {
      this.error = true;
    }
    this.loading = false;
  }

  onUpdate(_dt: number): void {}
  onExit(): void {}

  isLoading(): boolean { return this.loading; }
  getList(): RankItem[] { return this.list; }
  hasError(): boolean { return this.error; }

  handleBack(): void {
    const { MenuScene } = require('./MenuScene');
    this.sceneManager.switchTo(new MenuScene(this.sceneManager));
  }
}
