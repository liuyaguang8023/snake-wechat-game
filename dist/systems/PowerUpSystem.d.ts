import { PowerUpDef } from '../data/powerups';
export interface ActivePowerUp {
    def: PowerUpDef;
    remaining: number;
}
export declare class PowerUpSystem {
    private actives;
    private justActivatedSet;
    activate(id: string): void;
    deactivate(id: string): void;
    update(dt: number): void;
    hasActive(id: string): boolean;
    justActivated(id: string): boolean;
    getRemaining(id: string): number;
    activeIds(): string[];
    getSpeedMultiplier(): number;
    getScoreMultiplier(): number;
    isInvincible(): boolean;
    isGhosting(): boolean;
    reset(): void;
}
