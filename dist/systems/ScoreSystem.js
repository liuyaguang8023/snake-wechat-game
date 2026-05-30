"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSystem = void 0;
class ScoreSystem {
    constructor() {
        this.score = 0;
        this.multiplier = 1;
        this.foodsEaten = 0;
        this.ratingStars = 0;
    }
    addFoodScore() {
        this.score += 10 * this.multiplier;
        this.foodsEaten++;
    }
    setMultiplier(mult) {
        this.multiplier = mult;
    }
    reset() {
        this.score = 0;
        this.multiplier = 1;
        this.foodsEaten = 0;
        this.ratingStars = 0;
    }
}
exports.ScoreSystem = ScoreSystem;
//# sourceMappingURL=ScoreSystem.js.map