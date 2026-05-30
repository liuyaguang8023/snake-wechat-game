import { DirectionVectors, OppositeDirection } from '../utils/constants';
export class Snake {
    constructor(head, length, direction) {
        this.direction = direction;
        this.nextDirection = direction;
        const vec = DirectionVectors[direction];
        this.body = [];
        for (let i = 0; i < length; i++) {
            this.body.push({
                row: head.row - vec.row * i,
                col: head.col - vec.col * i,
            });
        }
    }
    get head() {
        return this.body[0];
    }
    setDirection(dir) {
        if (this.body.length > 1 && OppositeDirection[dir] === this.direction)
            return;
        this.direction = dir;
        this.nextDirection = dir;
    }
    move(eating) {
        this.direction = this.nextDirection;
        const vec = DirectionVectors[this.direction];
        const newHead = {
            row: this.head.row + vec.row,
            col: this.head.col + vec.col,
        };
        this.body.unshift(newHead);
        if (!eating) {
            this.body.pop();
        }
    }
    shorten(count) {
        const newLength = Math.max(2, this.body.length - count);
        this.body = this.body.slice(0, newLength);
    }
    occupiesPos(pos) {
        return this.body.some((seg) => seg.row === pos.row && seg.col === pos.col);
    }
    cloneBody() {
        return this.body.map((seg) => ({ ...seg }));
    }
}
//# sourceMappingURL=Snake.js.map