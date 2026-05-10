import { describe, it, expect } from 'vitest';
import { Food } from '../src/entities/Food';
import { GRID_ROWS, GRID_COLS } from '../src/utils/constants';

describe('Food', () => {
  it('spawns within grid bounds', () => {
    const food = new Food();
    const occupied = [{ row: 5, col: 5 }];
    food.spawn(occupied);
    expect(food.position.row).toBeGreaterThanOrEqual(0);
    expect(food.position.row).toBeLessThan(GRID_ROWS);
    expect(food.position.col).toBeGreaterThanOrEqual(0);
    expect(food.position.col).toBeLessThan(GRID_COLS);
  });

  it('does not spawn on occupied position', () => {
    const food = new Food();
    const occupied: { row: number; col: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (r !== 10 || c !== 15) {
          occupied.push({ row: r, col: c });
        }
      }
    }
    food.spawn(occupied);
    expect(food.position).toEqual({ row: 10, col: 15 });
  });

  it('returns false when no free cell available', () => {
    const food = new Food();
    const occupied: { row: number; col: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        occupied.push({ row: r, col: c });
      }
    }
    const result = food.spawn(occupied);
    expect(result).toBe(false);
  });
});
