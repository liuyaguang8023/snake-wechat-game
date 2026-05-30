"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVELS = void 0;
function row(r, cols) {
    return cols.map((c) => ({ row: r, col: c }));
}
function col(c, rows) {
    return rows.map((r) => ({ row: r, col: c }));
}
exports.LEVELS = [
    { id: 1, name: '新手村', target: 10, speed: 200, obstacles: [] },
    {
        id: 2, name: '十字路', target: 12, speed: 180,
        obstacles: [
            ...row(10, [0, 1, 2, 3, 26, 27, 28, 29]),
            ...col(15, [0, 1, 2, 3, 16, 17, 18, 19]),
        ],
    },
    {
        id: 3, name: '迷宫入口', target: 15, speed: 170,
        obstacles: [
            ...row(0, [0, 1, 2, 3, 4]),
            ...row(19, [25, 26, 27, 28, 29]),
            ...col(0, [5, 6, 7, 8]),
            ...col(29, [11, 12, 13, 14]),
        ],
    },
    {
        id: 4, name: '走廊', target: 15, speed: 160,
        obstacles: [
            ...col(5, Array.from({ length: 15 }, (_, i) => i)),
            ...col(24, Array.from({ length: 15 }, (_, i) => i + 5)),
        ],
    },
    {
        id: 5, name: '之字形', target: 18, speed: 150,
        obstacles: [
            ...row(5, Array.from({ length: 20 }, (_, i) => i)),
            ...row(10, Array.from({ length: 20 }, (_, i) => i + 10)),
            ...row(15, Array.from({ length: 20 }, (_, i) => i)),
        ],
    },
    {
        id: 6, name: '回廊', target: 18, speed: 140,
        obstacles: [
            ...row(3, Array.from({ length: 24 }, (_, i) => i + 3)),
            ...row(16, Array.from({ length: 24 }, (_, i) => i + 3)),
            ...col(3, Array.from({ length: 13 }, (_, i) => i)),
            ...col(26, Array.from({ length: 13 }, (_, i) => i + 7)),
        ],
    },
    {
        id: 7, name: '四宫格', target: 20, speed: 130,
        obstacles: row(10, Array.from({ length: 30 }, (_, i) => i))
            .filter((p) => p.col !== 10 && p.col !== 15 && p.col !== 20),
    },
    {
        id: 8, name: '迷宫深处', target: 20, speed: 120,
        obstacles: [
            ...row(4, [0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 28, 29]),
            ...row(8, [8, 9, 10, 11, 12, 18, 19, 20, 21, 22]),
            ...row(12, [0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 28, 29]),
            ...row(16, [8, 9, 10, 11, 12, 18, 19, 20, 21, 22]),
            ...col(4, [0, 1, 2, 3, 10, 11, 12, 13, 14, 15, 18, 19]),
            ...col(25, [0, 1, 2, 3, 10, 11, 12, 13, 14, 15, 18, 19]),
        ],
    },
    {
        id: 9, name: '包围圈', target: 25, speed: 110,
        obstacles: [
            ...row(2, Array.from({ length: 26 }, (_, i) => i + 2)),
            ...row(11, [...Array.from({ length: 10 }, (_, i) => i), ...Array.from({ length: 10 }, (_, i) => i + 20)]),
            ...row(17, Array.from({ length: 26 }, (_, i) => i + 2)),
            ...col(2, Array.from({ length: 16 }, (_, i) => i + 2)),
            ...col(27, Array.from({ length: 16 }, (_, i) => i + 2)),
        ],
    },
    {
        id: 10, name: '终极挑战', target: 30, speed: 100,
        obstacles: [
            ...row(3, [0, 1, 2, 7, 8, 9, 10, 11, 16, 17, 18, 23, 24, 25, 29]),
            ...row(7, [3, 4, 5, 6, 13, 14, 15, 20, 21, 22, 26, 27, 28]),
            ...row(11, [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 29]),
            ...row(15, [5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 25, 26, 27, 28]),
            ...row(19, [0, 1, 9, 10, 11, 19, 20, 21, 28, 29]),
            ...col(5, [1, 2, 3, 4, 8, 9, 10, 11, 14, 15, 16]),
            ...col(15, [5, 6, 7, 11, 12, 13, 17, 18, 19]),
            ...col(24, [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19]),
        ],
    },
];
//# sourceMappingURL=levels.js.map