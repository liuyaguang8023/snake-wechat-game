import { GridPos } from './Snake';

export class Obstacle {
  positions: GridPos[];

  constructor(positions: GridPos[]) {
    this.positions = positions;
  }

  occupiesPos(pos: GridPos): boolean {
    return this.positions.some((o) => o.row === pos.row && o.col === pos.col);
  }

  static fromLayout(layout: { row: number; col: number }[]): Obstacle {
    return new Obstacle(layout.map((p) => ({ ...p })));
  }
}
