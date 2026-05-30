import { Snake, GridPos } from '../entities/Snake';
import { Obstacle } from '../entities/Obstacle';
export declare enum CollisionType {
    None = "None",
    Wall = "Wall",
    Self = "Self",
    Food = "Food",
    Obstacle = "Obstacle"
}
export declare class CollisionSystem {
    check(snake: Snake, foodPos: GridPos | null, obstacle: Obstacle | null): CollisionType;
    checkWallCollision(snake: Snake): boolean;
    checkSelfCollision(snake: Snake): boolean;
    checkFoodCollision(snake: Snake, foodPos: GridPos): boolean;
    checkObstacleCollision(snake: Snake, obstacle: Obstacle): boolean;
}
