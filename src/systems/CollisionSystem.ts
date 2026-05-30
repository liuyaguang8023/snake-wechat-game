import { Snake, GridPos } from '../entities/Snake';
import { Obstacle } from '../entities/Obstacle';
import { GameConfig } from '../utils/constants';

export enum CollisionType {
  None = 'None',
  Wall = 'Wall',
  Self = 'Self',
  Food = 'Food',
  Obstacle = 'Obstacle',
}

export class CollisionSystem {
  check(
    snake: Snake,
    foodPos: GridPos | null,
    obstacle: Obstacle | null
  ): CollisionType {
    if (this.checkWallCollision(snake)) return CollisionType.Wall;
    if (this.checkSelfCollision(snake)) return CollisionType.Self;
    if (foodPos && this.checkFoodCollision(snake, foodPos)) return CollisionType.Food;
    if (obstacle && this.checkObstacleCollision(snake, obstacle)) return CollisionType.Obstacle;
    return CollisionType.None;
  }

  checkWallCollision(snake: Snake): boolean {
    const { row, col } = snake.head;
    return row < 0 || row >= GameConfig.GRID_ROWS || col < 0 || col >= GameConfig.GRID_COLS;
  }

  checkSelfCollision(snake: Snake): boolean {
    const { row, col } = snake.head;
    return snake.body.slice(1).some((seg) => seg.row === row && seg.col === col);
  }

  checkFoodCollision(snake: Snake, foodPos: GridPos): boolean {
    return snake.head.row === foodPos.row && snake.head.col === foodPos.col;
  }

  checkObstacleCollision(snake: Snake, obstacle: Obstacle): boolean {
    return obstacle.occupiesPos(snake.head);
  }
}
