import { GameConfig } from '../utils/constants';
export class Food {
    constructor() {
        this.position = { row: 0, col: 0 };
    }
    spawn(occupiedPositions) {
        const occupiedSet = new Set(occupiedPositions.map((p) => `${p.row},${p.col}`));
        const freeCells = [];
        for (let r = 0; r < GameConfig.GRID_ROWS; r++) {
            for (let c = 0; c < GameConfig.GRID_COLS; c++) {
                if (!occupiedSet.has(`${r},${c}`)) {
                    freeCells.push({ row: r, col: c });
                }
            }
        }
        if (freeCells.length === 0)
            return false;
        const idx = Math.floor(Math.random() * freeCells.length);
        this.position = freeCells[idx];
        return true;
    }
}
//# sourceMappingURL=Food.js.map