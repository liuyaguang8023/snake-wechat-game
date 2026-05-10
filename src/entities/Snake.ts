import { Direction, DirectionVectors, OppositeDirection } from '../utils/constants';

export interface GridPos {
  row: number;
  col: number;
}

export class Snake {
  body: GridPos[];
  direction: Direction;
  private nextDirection: Direction;

  constructor(head: GridPos, length: number, direction: Direction) {
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

  get head(): GridPos {
    return this.body[0];
  }

  setDirection(dir: Direction): void {
    if (this.body.length > 1 && OppositeDirection[dir] === this.direction) return;
    this.direction = dir;
    this.nextDirection = dir;
  }

  move(eating: boolean): void {
    this.direction = this.nextDirection;
    const vec = DirectionVectors[this.direction];
    const newHead: GridPos = {
      row: this.head.row + vec.row,
      col: this.head.col + vec.col,
    };
    this.body.unshift(newHead);
    if (!eating) {
      this.body.pop();
    }
  }

  shorten(count: number): void {
    const newLength = Math.max(2, this.body.length - count);
    this.body = this.body.slice(0, newLength);
  }

  occupiesPos(pos: GridPos): boolean {
    return this.body.some((seg) => seg.row === pos.row && seg.col === pos.col);
  }

  cloneBody(): GridPos[] {
    return this.body.map((seg) => ({ ...seg }));
  }
}
