import { describe, it, expect } from 'vitest';
import { ScoreSystem } from '../src/systems/ScoreSystem';

describe('ScoreSystem', () => {
  it('starts at 0', () => {
    const ss = new ScoreSystem();
    expect(ss.score).toBe(0);
  });

  it('adds base 10 points per food', () => {
    const ss = new ScoreSystem();
    ss.addFoodScore();
    expect(ss.score).toBe(10);
    ss.addFoodScore();
    expect(ss.score).toBe(20);
  });

  it('applies single multiplier', () => {
    const ss = new ScoreSystem();
    ss.setMultiplier(2);
    ss.addFoodScore();
    expect(ss.score).toBe(20);
  });

  it('stacks multipliers (2x then 4x)', () => {
    const ss = new ScoreSystem();
    ss.setMultiplier(2);
    ss.setMultiplier(4);
    ss.addFoodScore();
    expect(ss.score).toBe(40);
  });

  it('resets correctly', () => {
    const ss = new ScoreSystem();
    ss.addFoodScore();
    ss.setMultiplier(2);
    ss.reset();
    expect(ss.score).toBe(0);
    expect(ss.multiplier).toBe(1);
  });

  it('tracks foods eaten count', () => {
    const ss = new ScoreSystem();
    ss.addFoodScore();
    ss.addFoodScore();
    expect(ss.foodsEaten).toBe(2);
  });

  it('ratingStars defaults to 0', () => {
    const ss = new ScoreSystem();
    expect(ss.ratingStars).toBe(0);
  });
});
