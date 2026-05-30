import { GridPos } from './Snake';
export declare class Food {
    position: GridPos;
    spawn(occupiedPositions: GridPos[]): boolean;
}
