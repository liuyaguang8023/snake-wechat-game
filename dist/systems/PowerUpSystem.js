import { POWERUP_DEFS } from '../data/powerups';
export class PowerUpSystem {
    constructor() {
        this.actives = new Map();
        this.justActivatedSet = new Set();
    }
    activate(id) {
        const def = POWERUP_DEFS.find((p) => p.id === id);
        if (!def)
            return;
        if (def.duration < 0) {
            this.justActivatedSet.add(id);
            return;
        }
        this.actives.set(id, { def, remaining: def.duration });
        this.justActivatedSet.add(id);
    }
    deactivate(id) {
        this.actives.delete(id);
    }
    update(dt) {
        this.justActivatedSet.clear();
        const expired = [];
        for (const [id, active] of this.actives) {
            active.remaining -= dt;
            if (active.remaining <= 0) {
                expired.push(id);
            }
        }
        expired.forEach((id) => this.actives.delete(id));
    }
    hasActive(id) {
        return this.actives.has(id);
    }
    justActivated(id) {
        return this.justActivatedSet.has(id);
    }
    getRemaining(id) {
        return this.actives.get(id)?.remaining ?? 0;
    }
    activeIds() {
        return Array.from(this.actives.keys());
    }
    getSpeedMultiplier() {
        let mult = 1;
        if (this.hasActive('speed'))
            mult *= 0.5;
        if (this.hasActive('slow'))
            mult *= 2;
        return mult;
    }
    getScoreMultiplier() {
        let mult = 1;
        if (this.hasActive('speed'))
            mult *= 2;
        if (this.hasActive('double'))
            mult *= 2;
        return mult;
    }
    isInvincible() {
        return this.hasActive('invincible');
    }
    isGhosting() {
        return this.hasActive('ghost');
    }
    reset() {
        this.actives.clear();
        this.justActivatedSet.clear();
    }
}
//# sourceMappingURL=PowerUpSystem.js.map