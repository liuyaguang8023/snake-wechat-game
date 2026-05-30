"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSystem = exports.CollisionType = void 0;
const constants_1 = require("../utils/constants");
var CollisionType;
(function (CollisionType) {
    CollisionType["None"] = "None";
    CollisionType["Wall"] = "Wall";
    CollisionType["Self"] = "Self";
    CollisionType["Food"] = "Food";
    CollisionType["Obstacle"] = "Obstacle";
})(CollisionType || (exports.CollisionType = CollisionType = {}));
class CollisionSystem {
    check(snake, foodPos, obstacle) {
        if (this.checkWallCollision(snake))
            return CollisionType.Wall;
        if (this.checkSelfCollision(snake))
            return CollisionType.Self;
        if (foodPos && this.checkFoodCollision(snake, foodPos))
            return CollisionType.Food;
        if (obstacle && this.checkObstacleCollision(snake, obstacle))
            return CollisionType.Obstacle;
        return CollisionType.None;
    }
    checkWallCollision(snake) {
        const { row, col } = snake.head;
        return row < 0 || row >= constants_1.GameConfig.GRID_ROWS || col < 0 || col >= constants_1.GameConfig.GRID_COLS;
    }
    checkSelfCollision(snake) {
        const { row, col } = snake.head;
        return snake.body.slice(1).some((seg) => seg.row === row && seg.col === col);
    }
    checkFoodCollision(snake, foodPos) {
        return snake.head.row === foodPos.row && snake.head.col === foodPos.col;
    }
    checkObstacleCollision(snake, obstacle) {
        return obstacle.occupiesPos(snake.head);
    }
}
exports.CollisionSystem = CollisionSystem;
//# sourceMappingURL=CollisionSystem.js.map