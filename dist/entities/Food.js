"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
const constants_1 = require("../utils/constants");
class Food {
    constructor() {
        this.position = { row: 0, col: 0 };
    }
    spawn(occupiedPositions) {
        const occupiedSet = new Set(occupiedPositions.map((p) => `${p.row},${p.col}`));
        const freeCells = [];
        for (let r = 0; r < constants_1.GameConfig.GRID_ROWS; r++) {
            for (let c = 0; c < constants_1.GameConfig.GRID_COLS; c++) {
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
exports.Food = Food;
//# sourceMappingURL=Food.js.map