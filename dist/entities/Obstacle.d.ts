import { GridPos } from './Snake';
export declare class Obstacle {
    positions: GridPos[];
    constructor(positions: GridPos[]);
    occupiesPos(pos: GridPos): boolean;
    static fromLayout(layout: {
        row: number;
        col: number;
    }[]): Obstacle;
}
