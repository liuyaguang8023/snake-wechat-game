"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obstacle = void 0;
class Obstacle {
    constructor(positions) {
        this.positions = positions;
    }
    occupiesPos(pos) {
        return this.positions.some((o) => o.row === pos.row && o.col === pos.col);
    }
    static fromLayout(layout) {
        return new Obstacle(layout.map((p) => (Object.assign({}, p))));
    }
}
exports.Obstacle = Obstacle;
//# sourceMappingURL=Obstacle.js.map