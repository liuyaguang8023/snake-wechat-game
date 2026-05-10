import { POWERUP_DEFS, PowerUpDef } from '../data/powerups';

export interface ActivePowerUp {
  def: PowerUpDef;
  remaining: number;
}

export class PowerUpSystem {
  private actives: Map<string, ActivePowerUp> = new Map();
  private justActivatedSet: Set<string> = new Set();

  activate(id: string): void {
    const def = POWERUP_DEFS.find((p) => p.id === id);
    if (!def) return;
    if (def.duration < 0) {
      this.justActivatedSet.add(id);
      return;
    }
    this.actives.set(id, { def, remaining: def.duration });
    this.justActivatedSet.add(id);
  }

  deactivate(id: string): void {
    this.actives.delete(id);
  }

  update(dt: number): void {
    this.justActivatedSet.clear();
    const expired: string[] = [];
    for (const [id, active] of this.actives) {
      active.remaining -= dt;
      if (active.remaining <= 0) {
        expired.push(id);
      }
    }
    expired.forEach((id) => this.actives.delete(id));
  }

  hasActive(id: string): boolean {
    return this.actives.has(id);
  }

  justActivated(id: string): boolean {
    return this.justActivatedSet.has(id);
  }

  getRemaining(id: string): number {
    return this.actives.get(id)?.remaining ?? 0;
  }

  activeIds(): string[] {
    return Array.from(this.actives.keys());
  }

  getSpeedMultiplier(): number {
    let mult = 1;
    if (this.hasActive('speed')) mult *= 0.5;
    if (this.hasActive('slow')) mult *= 2;
    return mult;
  }

  getScoreMultiplier(): number {
    let mult = 1;
    if (this.hasActive('speed')) mult *= 2;
    if (this.hasActive('double')) mult *= 2;
    return mult;
  }

  isInvincible(): boolean {
    return this.hasActive('invincible');
  }

  isGhosting(): boolean {
    return this.hasActive('ghost');
  }

  reset(): void {
    this.actives.clear();
    this.justActivatedSet.clear();
  }
}
