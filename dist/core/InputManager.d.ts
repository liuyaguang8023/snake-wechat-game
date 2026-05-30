import { Direction } from '../utils/constants';
export declare class InputManager {
    private currentDirection;
    private touchStartX;
    private touchStartY;
    private readonly swipeThreshold;
    bind(canvas: any): void;
    consumeDirection(): Direction | null;
}
