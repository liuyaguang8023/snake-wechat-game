// 网格配置
export const GRID_ROWS = 20;
export const GRID_COLS = 30;
export const CELL_SIZE = 18;
export const CANVAS_WIDTH = GRID_COLS * CELL_SIZE;   // 540
export const CANVAS_HEIGHT = GRID_ROWS * CELL_SIZE;   // 360

// 移动方向
export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export const DirectionVectors: Record<Direction, { row: number; col: number }> = {
  [Direction.Up]: { row: -1, col: 0 },
  [Direction.Down]: { row: 1, col: 0 },
  [Direction.Left]: { row: 0, col: -1 },
  [Direction.Right]: { row: 0, col: 1 },
};

export const OppositeDirection: Record<Direction, Direction> = {
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left,
};

// 颜色（Emoji 可爱风）
export const Colors = {
  snakeHead: '#FF8F00',
  snakeBody: '#FFB300',
  snakeTail: '#FFCA28',
  food: '#FF5252',
  obstacle: '#8D6E63',
  background: '#FFFDE7',
  grid: '#FFF9C4',
  hudText: '#5D4037',
  powerUpGlow: '#FFD700',
};

// 难度（无尽模式）
export const SPEED_TIERS: { maxScore: number; interval: number }[] = [
  { maxScore: 50, interval: 200 },
  { maxScore: 100, interval: 150 },
  { maxScore: 200, interval: 120 },
  { maxScore: 400, interval: 90 },
  { maxScore: Infinity, interval: 70 },
];

// 道具刷新：每 N 个食物有概率出现道具
export const POWERUP_SPAWN_FOOD_COUNT = 5;
export const POWERUP_SPAWN_CHANCE = 0.4;
export const MAX_POWERUPS_ON_FIELD = 2;

// 存储 key
export const STORAGE_KEYS = {
  bestScoreEndless: 'best_score_endless',
  levelStars: 'level_stars',
  unlockedLevel: 'unlocked_level',
  settingsSound: 'settings_sound',
} as const;

// 初始蛇身长度
export const INITIAL_SNAKE_LENGTH = 3;
