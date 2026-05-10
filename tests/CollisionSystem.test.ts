import { describe, it, expect } from 'vitest';
import { CollisionSystem, CollisionType } from '../src/systems/CollisionSystem';
import { Snake } from '../src/entities/Snake';
import { Food } from '../src/entities/Food';
import { Obstacle } from '../src/entities/Obstacle';
import { Direction } from '../src/utils/constants';

describe('CollisionSystem', () => {
  it('detects wall collision when snake moves out of bounds', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 0, col: 15 }, 3, Direction.Up);
    snake.move(false);
    expect(cs.checkWallCollision(snake)).toBe(true);
  });

  it('detects self collision when head hits body', () => {
    const cs = new CollisionSystem();
    // Manually build a snake body where head would collide with body
    const snake = new Snake({ row: 10, col: 10 }, 1, Direction.Right);
    snake.body = [
      { row: 10, col: 10 }, // head
      { row: 10, col: 9 },  // body
      { row: 11, col: 9 },  // body
      { row: 11, col: 10 }, // body
    ];
    // Move up into (9,10) - not self collision
    snake.body.unshift({ row: 9, col: 10 });
    expect(cs.checkSelfCollision(snake)).toBe(false);

    // Force self collision: set head position to match a body segment
    snake.body[0] = { row: 10, col: 9 };
    expect(cs.checkSelfCollision(snake)).toBe(true);
  });

  it('detects food collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false); // head now at (10, 16)
    expect(cs.checkFoodCollision(snake, { row: 10, col: 16 })).toBe(true);
    expect(cs.checkFoodCollision(snake, { row: 5, col: 5 })).toBe(false);
  });

  it('detects obstacle collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false); // head now at (10, 16)
    const obstacle = new Obstacle([{ row: 10, col: 16 }, { row: 5, col: 5 }]);
    expect(cs.checkObstacleCollision(snake, obstacle)).toBe(true);

    const snake2 = new Snake({ row: 5, col: 5 }, 3, Direction.Right);
    snake2.move(false); // head now at (5, 6), not hitting obstacle
    expect(cs.checkObstacleCollision(snake2, obstacle)).toBe(false);
  });

  it('check returns None when no collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false); // head at (10, 16), within bounds
    const foodPos = { row: 5, col: 5 };
    const obstacle = new Obstacle([{ row: 0, col: 0 }]);
    expect(cs.check(snake, foodPos, obstacle)).toBe(CollisionType.None);
  });

  it('check returns Food when food is at head position', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false); // head at (10, 16)
    const foodPos = { row: 10, col: 16 };
    expect(cs.check(snake, foodPos, null)).toBe(CollisionType.Food);
  });

  it('check returns Wall when out of bounds', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 0, col: 15 }, 3, Direction.Up);
    snake.move(false); // head at (-1, 15) = out of bounds
    expect(cs.check(snake, null, null)).toBe(CollisionType.Wall);
  });

  it('check returns Obstacle when hitting obstacle', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false); // head at (10, 16)
    const obstacle = new Obstacle([{ row: 10, col: 16 }]);
    expect(cs.check(snake, null, obstacle)).toBe(CollisionType.Obstacle);
  });
});
