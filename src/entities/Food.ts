import { GridPos } from './Snake';
import { GRID_ROWS, GRID_COLS } from '../utils/constants';

export class Food {
  position: GridPos = { row: 0, col: 0 };

  spawn(occupiedPositions: GridPos[]): boolean {
    const occupiedSet = new Set(
      occupiedPositions.map((p) => `${p.row},${p.col}`)
    );
    const freeCells: GridPos[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (!occupiedSet.has(`${r},${c}`)) {
          freeCells.push({ row: r, col: c });
        }
      }
    }
    if (freeCells.length === 0) return false;
    const idx = Math.floor(Math.random() * freeCells.length);
    this.position = freeCells[idx];
    return true;
  }
}
