export class ScoreSystem {
  score: number = 0;
  multiplier: number = 1;
  foodsEaten: number = 0;
  ratingStars: number = 0;

  addFoodScore(): void {
    this.score += 10 * this.multiplier;
    this.foodsEaten++;
  }

  setMultiplier(mult: number): void {
    this.multiplier = mult;
  }

  reset(): void {
    this.score = 0;
    this.multiplier = 1;
    this.foodsEaten = 0;
    this.ratingStars = 0;
  }
}
