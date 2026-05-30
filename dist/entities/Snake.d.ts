import { Direction } from '../utils/constants';
export interface GridPos {
    row: number;
    col: number;
}
export declare class Snake {
    body: GridPos[];
    direction: Direction;
    private nextDirection;
    constructor(head: GridPos, length: number, direction: Direction);
    get head(): GridPos;
    setDirection(dir: Direction): void;
    move(eating: boolean): void;
    shorten(count: number): void;
    occupiesPos(pos: GridPos): boolean;
    cloneBody(): GridPos[];
}
