"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUpSystem = void 0;
const powerups_1 = require("../data/powerups");
class PowerUpSystem {
    constructor() {
        this.actives = new Map();
        this.justActivatedSet = new Set();
    }
    activate(id) {
        const def = powerups_1.POWERUP_DEFS.find((p) => p.id === id);
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
        var _a, _b;
        return (_b = (_a = this.actives.get(id)) === null || _a === void 0 ? void 0 : _a.remaining) !== null && _b !== void 0 ? _b : 0;
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
exports.PowerUpSystem = PowerUpSystem;
//# sourceMappingURL=PowerUpSystem.js.map