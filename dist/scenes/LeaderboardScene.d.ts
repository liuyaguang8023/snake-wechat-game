import { Scene, SceneManager } from '../core/SceneManager';
import { RankItem } from '../api/cloud';
export declare class LeaderboardScene implements Scene {
    private sceneManager;
    private loading;
    private list;
    private error;
    constructor(sceneManager: SceneManager);
    onEnter(): void;
    private fetchLeaderboard;
    onUpdate(_dt: number): void;
    onExit(): void;
    isLoading(): boolean;
    getList(): RankItem[];
    hasError(): boolean;
    handleBack(): void;
}
