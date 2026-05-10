import { describe, it, expect } from 'vitest';
import { Snake } from '../src/entities/Snake';
import { Direction } from '../src/utils/constants';

describe('Snake', () => {
  it('initializes with correct length at start position', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    expect(snake.body.length).toBe(3);
    expect(snake.head).toEqual({ row: 10, col: 15 });
    expect(snake.direction).toBe(Direction.Right);
  });

  it('body extends rightward for initial direction Right', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    expect(snake.body[0]).toEqual({ row: 10, col: 15 }); // head
    expect(snake.body[1]).toEqual({ row: 10, col: 14 }); // segment 2
    expect(snake.body[2]).toEqual({ row: 10, col: 13 }); // tail
  });

  it('body extends leftward for initial direction Left', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Left);
    expect(snake.body[0]).toEqual({ row: 10, col: 15 });
    expect(snake.body[1]).toEqual({ row: 10, col: 16 });
    expect(snake.body[2]).toEqual({ row: 10, col: 17 });
  });

  it('moves forward in current direction', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false);
    expect(snake.head).toEqual({ row: 10, col: 16 });
    expect(snake.body.length).toBe(3);
    expect(snake.body[2]).toEqual({ row: 10, col: 14 });
  });

  it('grows when eating food', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(true);
    expect(snake.head).toEqual({ row: 10, col: 16 });
    expect(snake.body.length).toBe(4);
    expect(snake.body[3]).toEqual({ row: 10, col: 13 }); // tail retained
  });

  it('shortens by N segments (minimum 2)', () => {
    const snake = new Snake({ row: 10, col: 15 }, 5, Direction.Right);
    snake.shorten(2);
    expect(snake.body.length).toBe(3);
    snake.shorten(10);
    expect(snake.body.length).toBe(2);
  });

  it('rejects 180-degree reverse direction change', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.setDirection(Direction.Left);
    expect(snake.direction).toBe(Direction.Right);
  });

  it('accepts valid direction changes', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.setDirection(Direction.Up);
    expect(snake.direction).toBe(Direction.Up);
    snake.setDirection(Direction.Left);
    expect(snake.direction).toBe(Direction.Left);
  });

  it('clones body correctly', () => {
    const snake = new Snake({ row: 5, col: 5 }, 3, Direction.Up);
    const clone = snake.cloneBody();
    expect(clone).toEqual(snake.body);
    clone[0] = { row: 99, col: 99 };
    expect(snake.head).toEqual({ row: 5, col: 5 });
  });

  it('occupiesPos detects snake body position', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    expect(snake.occupiesPos({ row: 10, col: 15 })).toBe(true);
    expect(snake.occupiesPos({ row: 10, col: 14 })).toBe(true);
    expect(snake.occupiesPos({ row: 5, col: 5 })).toBe(false);
  });
});
