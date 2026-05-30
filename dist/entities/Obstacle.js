export class Obstacle {
    constructor(positions) {
        this.positions = positions;
    }
    occupiesPos(pos) {
        return this.positions.some((o) => o.row === pos.row && o.col === pos.col);
    }
    static fromLayout(layout) {
        return new Obstacle(layout.map((p) => ({ ...p })));
    }
}
//# sourceMappingURL=Obstacle.js.map