# 贪吃蛇微信小游戏 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个完整的贪吃蛇微信小游戏，支持无尽模式、10关关卡模式、6种道具系统。

**Architecture:** TypeScript + 微信小游戏原生 Canvas 2D API，自建轻量游戏框架。核心逻辑（entities/systems）纯 TypeScript 可单测；渲染和场景层调用微信 API。EventBus 解耦模块，场景通过 SceneManager 管理生命周期。道具系统插件式注册。

**Tech Stack:** TypeScript, 微信小游戏 Canvas API, Vitest（单元测试）

---

## 文件结构总览

```
snake-game/
├── game.json
├── project.config.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── main.ts
│   ├── core/
│   │   ├── GameLoop.ts
│   │   ├── SceneManager.ts
│   │   ├── InputManager.ts
│   │   └── EventBus.ts
│   ├── entities/
│   │   ├── Snake.ts
│   │   ├── Food.ts
│   │   └── Obstacle.ts
│   ├── systems/
│   │   ├── CollisionSystem.ts
│   │   ├── ScoreSystem.ts
│   │   ├── PowerUpSystem.ts
│   │   └── LevelSystem.ts
│   ├── scenes/
│   │   ├── MenuScene.ts
│   │   ├── GameScene.ts
│   │   ├── LevelSelectScene.ts
│   │   ├── ResultScene.ts
│   │   └── SettingsScene.ts
│   ├── data/
│   │   ├── levels.ts
│   │   └── powerups.ts
│   ├── render/
│   │   ├── Renderer.ts
│   │   └── Effects.ts
│   └── utils/
│       ├── storage.ts
│       └── constants.ts
├── tests/
│   ├── Snake.test.ts
│   ├── CollisionSystem.test.ts
│   ├── ScoreSystem.test.ts
│   ├── PowerUpSystem.test.ts
│   ├── LevelSystem.test.ts
│   ├── Food.test.ts
│   └── EventBus.test.ts
└── cloud/
    └── leaderboard/
        ├── index.js
        └── config.json
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `game.json`, `project.config.json`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "snake-game",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 3: 创建 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 4: 创建 game.json**

```json
{
  "deviceOrientation": "portrait",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 5000
  }
}
```

- [ ] **Step 5: 创建 project.config.json**

```json
{
  "miniprogramRoot": "./",
  "compileType": "game",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": false,
    "minified": false
  },
  "appid": "",
  "projectname": "snake-game",
  "condition": {}
}
```

- [ ] **Step 6: 安装依赖**

```bash
cd /Users/liuyaguang/snake-game && npm install
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "chore: project scaffold for snake WeChat mini game"
```

---

### Task 2: 常量定义

**Files:**
- Create: `src/utils/constants.ts`

- [ ] **Step 1: 创建 constants.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/constants.ts && git commit -m "feat: add game constants"
```

---

### Task 3: EventBus 事件总线

**Files:**
- Create: `src/core/EventBus.ts`
- Test: `tests/EventBus.test.ts`

- [ ] **Step 1: 写 EventBus 单元测试**

在 `tests/EventBus.test.ts`：

```typescript
import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../src/core/EventBus';

describe('EventBus', () => {
  it('calls registered handler when event is emitted', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('score_changed', handler);
    bus.emit('score_changed', { score: 10 });
    expect(handler).toHaveBeenCalledWith({ score: 10 });
  });

  it('does not call handler after off', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    bus.off('test', handler);
    bus.emit('test', {});
    expect(handler).not.toHaveBeenCalled();
  });

  it('calls multiple handlers for same event', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.on('test', h1);
    bus.on('test', h2);
    bus.emit('test', {});
    expect(h1).toHaveBeenCalled();
    expect(h2).toHaveBeenCalled();
  });

  it('does nothing when emitting event with no handlers', () => {
    const bus = new EventBus();
    expect(() => bus.emit('no_handlers', {})).not.toThrow();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/EventBus.test.ts
```
预期：FAIL（EventBus 未定义）

- [ ] **Step 3: 实现 EventBus**

在 `src/core/EventBus.ts`：

```typescript
type Handler = (data: any) => void;

export class EventBus {
  private handlers: Map<string, Set<Handler>> = new Map();

  on(event: string, handler: Handler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: Handler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, data?: any): void {
    this.handlers.get(event)?.forEach((handler) => handler(data));
  }

  clear(): void {
    this.handlers.clear();
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/EventBus.test.ts
```
预期：PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/EventBus.ts tests/EventBus.test.ts && git commit -m "feat: add EventBus"
```

---

### Task 4: Snake 蛇实体

**Files:**
- Create: `src/entities/Snake.ts`
- Test: `tests/Snake.test.ts`

- [ ] **Step 1: 写 Snake 单元测试**

在 `tests/Snake.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { Snake } from '../src/entities/Snake';
import { Direction } from '../src/utils/constants';

describe('Snake', () => {
  it('initializes with correct length at start position', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    expect(snake.body.length).toBe(3);
    expect(snake.head).toEqual({ row: 10, col: 15 });
    expect(snake.direction).toBe(Direction.Right);
  });

  it('body extends rightward for initial direction Right', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    expect(snake.body[0]).toEqual({ row: 10, col: 15 }); // head
    expect(snake.body[1]).toEqual({ row: 10, col: 14 }); // segment 2
    expect(snake.body[2]).toEqual({ row: 10, col: 13 }); // tail
  });

  it('body extends leftward for initial direction Left', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Left);
    expect(snake.body[0]).toEqual({ row: 10, col: 15 });
    expect(snake.body[1]).toEqual({ row: 10, col: 16 });
    expect(snake.body[2]).toEqual({ row: 10, col: 17 });
  });

  it('moves forward in current direction', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(false);
    expect(snake.head).toEqual({ row: 10, col: 16 });
    expect(snake.body.length).toBe(3);
    expect(snake.body[2]).toEqual({ row: 10, col: 14 });
  });

  it('grows when eating food', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.move(true);
    expect(snake.head).toEqual({ row: 10, col: 16 });
    expect(snake.body.length).toBe(4);
    expect(snake.body[3]).toEqual({ row: 10, col: 13 }); // tail retained
    expect(snake.body[2]).toEqual({ row: 10, col: 14 });
  });

  it('shortens by N segments (minimum 2)', () => {
    const snake = new Snake({ row: 10, col: 15 }, 5, Direction.Right);
    snake.shorten(2);
    expect(snake.body.length).toBe(3);
    snake.shorten(10);
    expect(snake.body.length).toBe(2);
  });

  it('rejects 180-degree reverse direction change', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.setDirection(Direction.Left);
    expect(snake.direction).toBe(Direction.Right);
  });

  it('accepts valid direction changes', () => {
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    snake.setDirection(Direction.Up);
    expect(snake.direction).toBe(Direction.Up);
    snake.setDirection(Direction.Down);
    expect(snake.direction).toBe(Direction.Down);
  });

  it('clones body correctly', () => {
    const snake = new Snake({ row: 5, col: 5 }, 3, Direction.Up);
    const clone = snake.cloneBody();
    expect(clone).toEqual(snake.body);
    clone[0] = { row: 99, col: 99 };
    expect(snake.head).toEqual({ row: 5, col: 5 });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/Snake.test.ts
```

- [ ] **Step 3: 实现 Snake**

在 `src/entities/Snake.ts`：

```typescript
import { Direction, DirectionVectors, OppositeDirection } from '../utils/constants';

export interface GridPos {
  row: number;
  col: number;
}

export class Snake {
  body: GridPos[];
  direction: Direction;
  private nextDirection: Direction;

  constructor(head: GridPos, length: number, direction: Direction) {
    this.direction = direction;
    this.nextDirection = direction;
    const vec = DirectionVectors[direction];
    this.body = [];
    for (let i = 0; i < length; i++) {
      this.body.push({
        row: head.row - vec.row * i,
        col: head.col - vec.col * i,
      });
    }
  }

  get head(): GridPos {
    return this.body[0];
  }

  setDirection(dir: Direction): void {
    if (this.body.length > 1 && OppositeDirection[dir] === this.direction) return;
    this.nextDirection = dir;
  }

  move(eating: boolean): void {
    this.direction = this.nextDirection;
    const vec = DirectionVectors[this.direction];
    const newHead: GridPos = {
      row: this.head.row + vec.row,
      col: this.head.col + vec.col,
    };
    this.body.unshift(newHead);
    if (!eating) {
      this.body.pop();
    }
  }

  shorten(count: number): void {
    const newLength = Math.max(2, this.body.length - count);
    this.body = this.body.slice(0, newLength);
  }

  occupiesPos(pos: GridPos): boolean {
    return this.body.some((seg) => seg.row === pos.row && seg.col === pos.col);
  }

  cloneBody(): GridPos[] {
    return this.body.map((seg) => ({ ...seg }));
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/Snake.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/entities/Snake.ts tests/Snake.test.ts && git commit -m "feat: add Snake entity"
```

---

### Task 5: Food 食物实体

**Files:**
- Create: `src/entities/Food.ts`
- Test: `tests/Food.test.ts`

- [ ] **Step 1: 写 Food 单元测试**

在 `tests/Food.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { Food } from '../src/entities/Food';
import { GRID_ROWS, GRID_COLS } from '../src/utils/constants';

describe('Food', () => {
  it('spawns within grid bounds', () => {
    const food = new Food();
    const occupied = [{ row: 5, col: 5 }];
    food.spawn(occupied);
    expect(food.position.row).toBeGreaterThanOrEqual(0);
    expect(food.position.row).toBeLessThan(GRID_ROWS);
    expect(food.position.col).toBeGreaterThanOrEqual(0);
    expect(food.position.col).toBeLessThan(GRID_COLS);
  });

  it('does not spawn on occupied position', () => {
    const food = new Food();
    // Fill almost entire grid except one cell
    const occupied: { row: number; col: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (r !== 10 || c !== 15) {
          occupied.push({ row: r, col: c });
        }
      }
    }
    food.spawn(occupied);
    expect(food.position).toEqual({ row: 10, col: 15 });
  });

  it('returns false when no free cell available', () => {
    const food = new Food();
    const occupied: { row: number; col: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        occupied.push({ row: r, col: c });
      }
    }
    const result = food.spawn(occupied);
    expect(result).toBe(false);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/Food.test.ts
```

- [ ] **Step 3: 实现 Food**

在 `src/entities/Food.ts`：

```typescript
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
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/Food.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/entities/Food.ts tests/Food.test.ts && git commit -m "feat: add Food entity"
```

---

### Task 6: Obstacle 障碍物实体

**Files:**
- Create: `src/entities/Obstacle.ts`

- [ ] **Step 1: 实现 Obstacle**

在 `src/entities/Obstacle.ts`：

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/Obstacle.ts && git commit -m "feat: add Obstacle entity"
```

---

### Task 7: CollisionSystem 碰撞系统

**Files:**
- Create: `src/systems/CollisionSystem.ts`
- Test: `tests/CollisionSystem.test.ts`

- [ ] **Step 1: 写 CollisionSystem 单元测试**

在 `tests/CollisionSystem.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { CollisionSystem, CollisionType } from '../src/systems/CollisionSystem';
import { Snake } from '../src/entities/Snake';
import { Food } from '../src/entities/Food';
import { Obstacle } from '../src/entities/Obstacle';
import { Direction, GRID_ROWS, GRID_COLS } from '../src/utils/constants';

describe('CollisionSystem', () => {
  it('detects wall collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 0, col: 15 }, 3, Direction.Up);
    snake.move(false);
    expect(cs.check(snake, null, null)).toBe(CollisionType.Wall);
  });

  it('detects self collision', () => {
    const cs = new CollisionSystem();
    // Build a snake that curls into itself
    const snake = new Snake({ row: 10, col: 10 }, 1, Direction.Right);
    // Manually build body to simulate a self-collision scenario
    snake.body = [
      { row: 10, col: 10 },
      { row: 10, col: 9 },
      { row: 11, col: 9 },
      { row: 11, col: 10 },
      { row: 10, col: 10 }, // tail wraps to head position = self collision
    ];
    snake.direction = Direction.Up;
    // Move into tail position
    snake.body = [
      { row: 10, col: 10 },
      { row: 9, col: 10 },
      { row: 9, col: 9 },
      { row: 10, col: 9 },
    ];
    // Simulate moving up so head hits body
    snake.body.unshift({ row: 8, col: 10 });
    expect(cs.checkSelfCollision(snake)).toBe(true);
  });

  it('detects food collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    const food = new Food();
    food.position = { row: 10, col: 16 };
    snake.move(false);
    expect(cs.checkFoodCollision(snake, food.position)).toBe(true);
  });

  it('detects obstacle collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    const obstacle = new Obstacle([{ row: 10, col: 16 }]);
    snake.move(false);
    expect(cs.checkObstacleCollision(snake, obstacle)).toBe(true);
  });

  it('returns None when no collision', () => {
    const cs = new CollisionSystem();
    const snake = new Snake({ row: 10, col: 15 }, 3, Direction.Right);
    const food = new Food();
    food.position = { row: 5, col: 5 };
    const obstacle = new Obstacle([{ row: 0, col: 0 }]);
    snake.move(false);
    expect(cs.check(snake, food.position, obstacle)).toBe(CollisionType.None);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/CollisionSystem.test.ts
```

- [ ] **Step 3: 实现 CollisionSystem**

在 `src/systems/CollisionSystem.ts`：

```typescript
import { Snake } from '../entities/Snake';
import { Obstacle } from '../entities/Obstacle';
import { GridPos } from '../entities/Snake';
import { GRID_ROWS, GRID_COLS } from '../utils/constants';

export enum CollisionType {
  None = 'None',
  Wall = 'Wall',
  Self = 'Self',
  Food = 'Food',
  Obstacle = 'Obstacle',
}

export class CollisionSystem {
  check(
    snake: Snake,
    foodPos: GridPos | null,
    obstacle: Obstacle | null
  ): CollisionType {
    if (this.checkWallCollision(snake)) return CollisionType.Wall;
    if (this.checkSelfCollision(snake)) return CollisionType.Self;
    if (foodPos && this.checkFoodCollision(snake, foodPos)) return CollisionType.Food;
    if (obstacle && this.checkObstacleCollision(snake, obstacle)) return CollisionType.Obstacle;
    return CollisionType.None;
  }

  checkWallCollision(snake: Snake): boolean {
    const { row, col } = snake.head;
    return row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS;
  }

  checkSelfCollision(snake: Snake): boolean {
    const { row, col } = snake.head;
    return snake.body.slice(1).some((seg) => seg.row === row && seg.col === col);
  }

  checkFoodCollision(snake: Snake, foodPos: GridPos): boolean {
    return snake.head.row === foodPos.row && snake.head.col === foodPos.col;
  }

  checkObstacleCollision(snake: Snake, obstacle: Obstacle): boolean {
    return obstacle.occupiesPos(snake.head);
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/CollisionSystem.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/systems/CollisionSystem.ts tests/CollisionSystem.test.ts && git commit -m "feat: add CollisionSystem"
```

---

### Task 8: ScoreSystem 计分系统

**Files:**
- Create: `src/systems/ScoreSystem.ts`
- Test: `tests/ScoreSystem.test.ts`

- [ ] **Step 1: 写 ScoreSystem 单元测试**

在 `tests/ScoreSystem.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { ScoreSystem } from '../src/systems/ScoreSystem';

describe('ScoreSystem', () => {
  it('starts at 0', () => {
    const ss = new ScoreSystem();
    expect(ss.score).toBe(0);
  });

  it('adds base 10 points per food', () => {
    const ss = new ScoreSystem();
    ss.addFoodScore();
    expect(ss.score).toBe(10);
    ss.addFoodScore();
    expect(ss.score).toBe(20);
  });

  it('applies single multiplier', () => {
    const ss = new ScoreSystem();
    ss.setMultiplier(2);
    ss.addFoodScore();
    expect(ss.score).toBe(20);
  });

  it('stacks multipliers additively (2x + 2x = 4x)', () => {
    const ss = new ScoreSystem();
    ss.setMultiplier(2);
    ss.setMultiplier(4);
    ss.addFoodScore();
    expect(ss.score).toBe(40);
  });

  it('resets correctly', () => {
    const ss = new ScoreSystem();
    ss.addFoodScore();
    ss.setMultiplier(2);
    ss.reset();
    expect(ss.score).toBe(0);
    expect(ss.multiplier).toBe(1);
  });

  it('sets and gets star rating', () => {
    const ss = new ScoreSystem();
    ss.ratingStars = 3;
    expect(ss.ratingStars).toBe(3);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/ScoreSystem.test.ts
```

- [ ] **Step 3: 实现 ScoreSystem**

在 `src/systems/ScoreSystem.ts`：

```typescript
export class ScoreSystem {
  score: number = 0;
  multiplier: number = 1;
  foodsEaten: number = 0;
  ratingStars: number = 0;

  addFoodScore(): void {
    this.score += 10 * this.multiplier;
    this.foodsEaten++;
  }

  setMultiplier(mult: number): void {
    this.multiplier = mult;
  }

  reset(): void {
    this.score = 0;
    this.multiplier = 1;
    this.foodsEaten = 0;
    this.ratingStars = 0;
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/ScoreSystem.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/systems/ScoreSystem.ts tests/ScoreSystem.test.ts && git commit -m "feat: add ScoreSystem"
```

---

### Task 9: Storage 存储工具

**Files:**
- Create: `src/utils/storage.ts`

- [ ] **Step 1: 实现 storage.ts**

在 `src/utils/storage.ts`：

```typescript
// 微信小游戏存储封装
// setStorageSync/getStorageSync 在非微信环境会退化到内存存储（用于测试）

const memStore = new Map<string, any>();

const wx = (globalThis as any).wx;

function setStorageSync(key: string, value: any): void {
  if (wx && wx.setStorageSync) {
    wx.setStorageSync(key, value);
  } else {
    memStore.set(key, value);
  }
}

function getStorageSync(key: string): any {
  if (wx && wx.getStorageSync) {
    return wx.getStorageSync(key);
  }
  return memStore.get(key);
}

export const Storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const val = getStorageSync(key);
      return val !== undefined && val !== null && val !== '' ? val : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key: string, value: any): void {
    try {
      setStorageSync(key, value);
    } catch {
      // 静默失败
    }
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/storage.ts && git commit -m "feat: add Storage utility"
```

---

### Task 10: PowerUpSystem 道具系统

**Files:**
- Create: `src/data/powerups.ts`, `src/systems/PowerUpSystem.ts`
- Test: `tests/PowerUpSystem.test.ts`

- [ ] **Step 1: 写道具数据定义**

在 `src/data/powerups.ts`：

```typescript
export interface PowerUpDef {
  id: string;
  name: string;
  icon: string;
  duration: number;  // 秒，-1 = 即时
  probability: number;
}

export const POWERUP_DEFS: PowerUpDef[] = [
  { id: 'speed', name: '加速', icon: '⚡️', duration: 8, probability: 0.25 },
  { id: 'slow', name: '减速', icon: '🐢', duration: 8, probability: 0.20 },
  { id: 'invincible', name: '无敌', icon: '🛡️', duration: 6, probability: 0.15 },
  { id: 'ghost', name: '穿墙', icon: '👻', duration: 6, probability: 0.15 },
  { id: 'double', name: '双倍分数', icon: '💎', duration: 10, probability: 0.20 },
  { id: 'shrink', name: '缩短', icon: '✂️', duration: -1, probability: 0.05 },
];
```

- [ ] **Step 2: 写 PowerUpSystem 单元测试**

在 `tests/PowerUpSystem.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { PowerUpSystem, ActivePowerUp } from '../src/systems/PowerUpSystem';

describe('PowerUpSystem', () => {
  it('activates a power-up by id', () => {
    const sys = new PowerUpSystem();
    sys.activate('speed');
    expect(sys.hasActive('speed')).toBe(true);
  });

  it('deactivates a power-up', () => {
    const sys = new PowerUpSystem();
    sys.activate('speed');
    sys.deactivate('speed');
    expect(sys.hasActive('speed')).toBe(false);
  });

  it('updates remaining time', () => {
    const sys = new PowerUpSystem();
    sys.activate('speed');
    sys.update(1.0);
    expect(sys.getRemaining('speed')).toBeCloseTo(7);
  });

  it('auto-deactivates expired power-ups', () => {
    const sys = new PowerUpSystem();
    sys.activate('invincible');
    sys.update(10);
    expect(sys.hasActive('invincible')).toBe(false);
  });

  it('refreshes duration when same type activated again', () => {
    const sys = new PowerUpSystem();
    sys.activate('speed');
    sys.update(5);
    sys.activate('speed');
    expect(sys.getRemaining('speed')).toBeCloseTo(8);
  });

  it('instant power-up (shrink) has no duration tracking', () => {
    const sys = new PowerUpSystem();
    sys.activate('shrink');
    expect(sys.hasActive('shrink')).toBe(false);
    expect(sys.justActivated('shrink')).toBe(true);
  });

  it('clears all power-ups', () => {
    const sys = new PowerUpSystem();
    sys.activate('speed');
    sys.activate('ghost');
    sys.reset();
    expect(sys.hasActive('speed')).toBe(false);
    expect(sys.hasActive('ghost')).toBe(false);
  });

  it('returns list of active power-up ids', () => {
    const sys = new PowerUpSystem();
    sys.activate('speed');
    sys.activate('double');
    expect(sys.activeIds()).toContain('speed');
    expect(sys.activeIds()).toContain('double');
  });

  it('calculates movement speed multiplier', () => {
    const sys = new PowerUpSystem();
    expect(sys.getSpeedMultiplier()).toBe(1);
    sys.activate('speed');
    expect(sys.getSpeedMultiplier()).toBe(0.5);
    sys.activate('slow');
    expect(sys.getSpeedMultiplier()).toBe(2); // slow overrides speed (last activated wins for same category)
  });

  it('calculates score multiplier', () => {
    const sys = new PowerUpSystem();
    expect(sys.getScoreMultiplier()).toBe(1);
    sys.activate('speed');
    expect(sys.getScoreMultiplier()).toBe(2);
    sys.activate('double');
    expect(sys.getScoreMultiplier()).toBe(4);
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/PowerUpSystem.test.ts
```

- [ ] **Step 4: 实现 PowerUpSystem**

在 `src/systems/PowerUpSystem.ts`：

```typescript
import { POWERUP_DEFS, PowerUpDef } from '../data/powerups';

export interface ActivePowerUp {
  def: PowerUpDef;
  remaining: number;
}

export class PowerUpSystem {
  private actives: Map<string, ActivePowerUp> = new Map();
  private justActivatedSet: Set<string> = new Set();

  activate(id: string): void {
    const def = POWERUP_DEFS.find((p) => p.id === id);
    if (!def) return;
    if (def.duration < 0) {
      // 即时道具：标记一下然后不清除
      this.justActivatedSet.add(id);
      return;
    }
    this.actives.set(id, { def, remaining: def.duration });
    this.justActivatedSet.add(id);
  }

  deactivate(id: string): void {
    this.actives.delete(id);
  }

  update(dt: number): void {
    this.justActivatedSet.clear();
    const expired: string[] = [];
    for (const [id, active] of this.actives) {
      active.remaining -= dt;
      if (active.remaining <= 0) {
        expired.push(id);
      }
    }
    expired.forEach((id) => this.actives.delete(id));
  }

  hasActive(id: string): boolean {
    return this.actives.has(id);
  }

  justActivated(id: string): boolean {
    return this.justActivatedSet.has(id);
  }

  getRemaining(id: string): number {
    return this.actives.get(id)?.remaining ?? 0;
  }

  activeIds(): string[] {
    return Array.from(this.actives.keys());
  }

  getSpeedMultiplier(): number {
    let mult = 1;
    if (this.hasActive('speed')) mult *= 0.5;
    if (this.hasActive('slow')) mult *= 2;
    return mult;
  }

  getScoreMultiplier(): number {
    let mult = 1;
    if (this.hasActive('speed')) mult *= 2;
    if (this.hasActive('double')) mult *= 2;
    return mult;
  }

  isInvincible(): boolean {
    return this.hasActive('invincible');
  }

  isGhosting(): boolean {
    return this.hasActive('ghost');
  }

  reset(): void {
    this.actives.clear();
    this.justActivatedSet.clear();
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/PowerUpSystem.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/data/powerups.ts src/systems/PowerUpSystem.ts tests/PowerUpSystem.test.ts && git commit -m "feat: add PowerUpSystem"
```

---

### Task 11: LevelSystem 关卡系统

**Files:**
- Create: `src/data/levels.ts`, `src/systems/LevelSystem.ts`
- Test: `tests/LevelSystem.test.ts`

- [ ] **Step 1: 写关卡数据**

在 `src/data/levels.ts`：

```typescript
export interface LevelConfig {
  id: number;
  name: string;
  target: number;
  speed: number;
  obstacles: { row: number; col: number }[];
}

// 辅助：生成一行障碍物坐标
function row(r: number, cols: number[]): { row: number; col: number }[] {
  return cols.map((c) => ({ row: r, col: c }));
}

function col(c: number, rows: number[]): { row: number; col: number }[] {
  return rows.map((r) => ({ row: r, col: c }));
}

export const LEVELS: LevelConfig[] = [
  { id: 1, name: '新手村', target: 10, speed: 200, obstacles: [] },
  {
    id: 2, name: '十字路', target: 12, speed: 180,
    obstacles: [
      ...row(10, [0,1,2,3, 26,27,28,29]),
      ...col(15, [0,1,2,3, 16,17,18,19]),
    ],
  },
  {
    id: 3, name: '迷宫入口', target: 15, speed: 170,
    obstacles: [
      ...row(0, [0,1,2,3,4]),
      ...row(19, [25,26,27,28,29]),
      ...col(0, [5,6,7,8]),
      ...col(29, [11,12,13,14]),
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
    obstacles: [
      ...row(10, Array.from({ length: 30 }, (_, i) => i)),
      // 中间留 3 个缺口
    ].filter((p) => p.col !== 10 && p.col !== 15 && p.col !== 20),
  },
  {
    id: 8, name: '迷宫深处', target: 20, speed: 120,
    obstacles: [
      ...row(4, [0,1,2,3,4,5,6,7, 12,13,14,15,16,17, 22,23,24,25,26,27,28,29]),
      ...row(8, [8,9,10,11,12, 18,19,20,21,22]),
      ...row(12, [0,1,2,3,4,5,6,7, 12,13,14,15,16,17, 22,23,24,25,26,27,28,29]),
      ...row(16, [8,9,10,11,12, 18,19,20,21,22]),
      ...col(4, [0,1,2,3, 10,11,12,13,14,15, 18,19]),
      ...col(25, [0,1,2,3, 10,11,12,13,14,15, 18,19]),
    ],
  },
  {
    id: 9, name: '包围圈', target: 25, speed: 110,
    obstacles: [
      ...row(2, Array.from({ length: 26 }, (_, i) => i + 2)),
      ...row(11, Array.from({ length: 10 }, (_, i) => i).concat(
        Array.from({ length: 10 }, (_, i) => i + 20)
      )),
      ...row(17, Array.from({ length: 26 }, (_, i) => i + 2)),
      ...col(2, Array.from({ length: 16 }, (_, i) => i + 2)),
      ...col(27, Array.from({ length: 16 }, (_, i) => i + 2)),
    ],
  },
  {
    id: 10, name: '终极挑战', target: 30, speed: 100,
    obstacles: [
      ...row(3, [0,1,2, 7,8,9,10,11, 16,17,18, 23,24,25, 29]),
      ...row(7, [3,4,5,6, 13,14,15, 20,21,22, 26,27,28]),
      ...row(11, [0,1,2,3,4, 10,11,12,13,14, 20,21,22,23,24, 29]),
      ...row(15, [5,6,7,8,9, 15,16,17,18,19, 25,26,27,28]),
      ...row(19, [0,1, 9,10,11, 19,20,21, 28,29]),
      ...col(5, [1,2,3,4, 8,9,10,11, 14,15,16]),
      ...col(15, [5,6,7, 11,12,13, 17,18,19]),
      ...col(24, [0,1,2, 6,7,8, 12,13,14, 18,19]),
    ],
  },
];
```

- [ ] **Step 2: 写 LevelSystem 单元测试**

在 `tests/LevelSystem.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { LevelSystem } from '../src/systems/LevelSystem';

describe('LevelSystem', () => {
  it('starts with level 1 unlocked', () => {
    const sys = new LevelSystem();
    expect(sys.unlockedLevel).toBe(1);
  });

  it('loads level config correctly', () => {
    const sys = new LevelSystem();
    const config = sys.loadLevel(1);
    expect(config.name).toBe('新手村');
    expect(config.target).toBe(10);
    expect(config.speed).toBe(200);
    expect(config.obstacles).toEqual([]);
  });

  it('completing a level unlocks next level', () => {
    const sys = new LevelSystem();
    sys.completeLevel(1, 3);
    expect(sys.unlockedLevel).toBe(2);
    expect(sys.getStars(1)).toBe(3);
  });

  it('only saves highest stars', () => {
    const sys = new LevelSystem();
    sys.completeLevel(1, 2);
    sys.completeLevel(1, 3);
    expect(sys.getStars(1)).toBe(3);
  });

  it('does not unlock beyond level 10', () => {
    const sys = new LevelSystem();
    sys.completeLevel(10, 3);
    expect(sys.unlockedLevel).toBe(10);
  });

  it('saves and loads from storage', () => {
    const sys = new LevelSystem();
    sys.completeLevel(1, 2);
    sys.completeLevel(2, 3);
    
    const sys2 = new LevelSystem();
    // After construction, should load persisted state
    expect(sys2.getStars(1)).toBe(2);
    expect(sys2.getStars(2)).toBe(3);
    expect(sys2.unlockedLevel).toBe(3);
  });

  it('getStars returns 0 for unplayed level', () => {
    const sys = new LevelSystem();
    expect(sys.getStars(5)).toBe(0);
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/LevelSystem.test.ts
```

- [ ] **Step 4: 实现 LevelSystem**

在 `src/systems/LevelSystem.ts`：

```typescript
import { LEVELS, LevelConfig } from '../data/levels';
import { Storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

export class LevelSystem {
  unlockedLevel: number;
  private stars: Record<number, number>;

  constructor() {
    this.unlockedLevel = Storage.get<number>(STORAGE_KEYS.unlockedLevel, 1);
    this.stars = Storage.get<Record<number, number>>(STORAGE_KEYS.levelStars, {});
  }

  loadLevel(id: number): LevelConfig {
    return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
  }

  isUnlocked(id: number): boolean {
    return id <= this.unlockedLevel;
  }

  completeLevel(id: number, starsEarned: number): void {
    const prev = this.stars[id] ?? 0;
    if (starsEarned > prev) {
      this.stars[id] = starsEarned;
    }
    if (id >= this.unlockedLevel && id < LEVELS.length) {
      this.unlockedLevel = id + 1;
    }
    this.persist();
  }

  getStars(id: number): number {
    return this.stars[id] ?? 0;
  }

  private persist(): void {
    Storage.set(STORAGE_KEYS.unlockedLevel, this.unlockedLevel);
    Storage.set(STORAGE_KEYS.levelStars, this.stars);
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run tests/LevelSystem.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/data/levels.ts src/systems/LevelSystem.ts tests/LevelSystem.test.ts && git commit -m "feat: add LevelSystem"
```

---

### Task 12: InputManager 触摸输入

**Files:**
- Create: `src/core/InputManager.ts`

- [ ] **Step 1: 实现 InputManager**

在 `src/core/InputManager.ts`：

```typescript
import { Direction } from '../utils/constants';

export class InputManager {
  private currentDirection: Direction | null = null;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly swipeThreshold: number = 30;

  bind(canvas: any): void {
    // canvas 是微信小游戏的 canvas 对象
    canvas.addEventListener('touchstart', (e: any) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    canvas.addEventListener('touchmove', (e: any) => {
      e.preventDefault?.();
      const touch = e.touches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;
      
      if (Math.abs(dx) < this.swipeThreshold && Math.abs(dy) < this.swipeThreshold) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        this.currentDirection = dx > 0 ? Direction.Right : Direction.Left;
      } else {
        this.currentDirection = dy > 0 ? Direction.Down : Direction.Up;
      }
      
      // 重置起点，允许连续滑动
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    canvas.addEventListener('touchend', () => {
      // Direction stays as last set, consumed in next game tick
    });
  }

  consumeDirection(): Direction | null {
    const dir = this.currentDirection;
    this.currentDirection = null;
    return dir;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/InputManager.ts && git commit -m "feat: add InputManager"
```

---

### Task 13: GameLoop 游戏循环

**Files:**
- Create: `src/core/GameLoop.ts`

- [ ] **Step 1: 实现 GameLoop**

在 `src/core/GameLoop.ts`：

```typescript
export class GameLoop {
  private rafId: number = 0;
  private lastTime: number = 0;
  private running: boolean = false;
  private updateFn: ((dt: number) => void) | null = null;

  start(updateFn: (dt: number) => void): void {
    this.updateFn = updateFn;
    this.running = true;
    this.lastTime = Date.now();
    this.tick();
  }

  stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private tick = (): void => {
    if (!this.running) return;
    const now = Date.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1); // cap at 100ms
    this.lastTime = now;
    this.updateFn?.(dt);
    this.rafId = requestAnimationFrame(this.tick);
  };

  isRunning(): boolean {
    return this.running;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/GameLoop.ts && git commit -m "feat: add GameLoop"
```

---

### Task 14: SceneManager 场景管理

**Files:**
- Create: `src/core/SceneManager.ts`

- [ ] **Step 1: 实现 SceneManager**

在 `src/core/SceneManager.ts`：

```typescript
export interface Scene {
  onEnter(data?: any): void;
  onUpdate(dt: number): void;
  onExit(): void;
}

export class SceneManager {
  private currentScene: Scene | null = null;
  private nextScene: { scene: Scene; data?: any } | null = null;

  switchTo(scene: Scene, data?: any): void {
    this.nextScene = { scene, data };
  }

  update(dt: number): void {
    if (this.nextScene) {
      this.currentScene?.onExit();
      this.currentScene = this.nextScene.scene;
      this.currentScene.onEnter(this.nextScene.data);
      this.nextScene = null;
    }
    this.currentScene?.onUpdate(dt);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/SceneManager.ts && git commit -m "feat: add SceneManager"
```

---

### Task 15: Renderer 渲染器

**Files:**
- Create: `src/render/Renderer.ts`

- [ ] **Step 1: 实现 Renderer**

在 `src/render/Renderer.ts`：

```typescript
import { GridPos, Snake } from '../entities/Snake';
import { Obstacle } from '../entities/Obstacle';
import { Direction, Colors, CELL_SIZE, GRID_ROWS, GRID_COLS } from '../utils/constants';
import { ActivePowerUp } from '../systems/PowerUpSystem';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  clear(): void {
    this.ctx.fillStyle = Colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.drawGrid();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = Colors.grid;
    this.ctx.lineWidth = 0.5;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        this.ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  drawSnake(snake: Snake, ghosting: boolean): void {
    this.ctx.globalAlpha = ghosting ? 0.5 : 1;
    snake.body.forEach((seg, i) => {
      const x = seg.col * CELL_SIZE;
      const y = seg.row * CELL_SIZE;
      const radius = 4;
      const padding = 1;

      if (i === 0) {
        this.ctx.fillStyle = Colors.snakeHead;
      } else if (i === snake.body.length - 1) {
        this.ctx.fillStyle = Colors.snakeTail;
      } else {
        this.ctx.fillStyle = Colors.snakeBody;
      }

      this.roundRect(x + padding, y + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2, radius);
      this.ctx.fill();

      // 蛇头眼睛
      if (i === 0) {
        this.drawEyes(seg, snake.direction);
      }
    });
    this.ctx.globalAlpha = 1;
  }

  private drawEyes(head: GridPos, direction: Direction): void {
    const cx = head.col * CELL_SIZE + CELL_SIZE / 2;
    const cy = head.row * CELL_SIZE + CELL_SIZE / 2;
    const eyeR = 2;
    this.ctx.fillStyle = '#FFFFFF';

    let ex1 = cx, ey1 = cy, ex2 = cx, ey2 = cy;
    const offset = 4;

    switch (direction) {
      case Direction.Up:    ey1 -= offset; ey2 -= offset; ex1 -= offset; ex2 += offset; break;
      case Direction.Down:  ey1 += offset; ey2 += offset; ex1 -= offset; ex2 += offset; break;
      case Direction.Left:  ex1 -= offset; ex2 -= offset; ey1 -= offset; ey2 += offset; break;
      case Direction.Right: ex1 += offset; ex2 += offset; ey1 -= offset; ey2 += offset; break;
    }

    this.ctx.beginPath();
    this.ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2);
    this.ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#333';
    this.ctx.beginPath();
    this.ctx.arc(ex1, ey1, 1, 0, Math.PI * 2);
    this.ctx.arc(ex2, ey2, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawFood(position: GridPos): void {
    const x = position.col * CELL_SIZE + CELL_SIZE / 2;
    const y = position.row * CELL_SIZE + CELL_SIZE / 2;
    this.ctx.font = `${CELL_SIZE - 2}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🍎', x, y);
  }

  drawObstacles(obstacle: Obstacle): void {
    obstacle.positions.forEach((pos) => {
      const x = pos.col * CELL_SIZE + 2;
      const y = pos.row * CELL_SIZE + 2;
      this.ctx.fillStyle = Colors.obstacle;
      this.roundRect(x, y, CELL_SIZE - 4, CELL_SIZE - 4, 3);
      this.ctx.fill();
    });
  }

  drawPowerUps(positions: { pos: GridPos; def: { icon: string } }[]): void {
    positions.forEach(({ pos, def }) => {
      const x = pos.col * CELL_SIZE + CELL_SIZE / 2;
      const y = pos.row * CELL_SIZE + CELL_SIZE / 2;
      this.ctx.font = `${CELL_SIZE - 2}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(def.icon, x, y);
    });
  }

  drawHUD(score: number, levelName: string | null, remaining: number | null, paused: boolean): void {
    this.ctx.fillStyle = Colors.hudText;
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`分数: ${score}`, 8, CELL_SIZE * GRID_ROWS + 18);
    
    if (levelName) {
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${levelName}`, CELL_SIZE * GRID_COLS / 2, CELL_SIZE * GRID_ROWS + 18);
    }
    
    if (remaining !== null) {
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`剩余: ${remaining}`, CELL_SIZE * GRID_COLS - 8, CELL_SIZE * GRID_ROWS + 18);
    }

    if (paused) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('已暂停', this.width / 2, this.height / 2 - 20);
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText('滑动屏幕继续', this.width / 2, this.height / 2 + 10);
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.arcTo(x + w, y, x + w, y + r, r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.arcTo(x, y + h, x, y + h - r, r);
    this.ctx.lineTo(x, y + r);
    this.ctx.arcTo(x, y, x + r, y, r);
    this.ctx.closePath();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/render/Renderer.ts && git commit -m "feat: add Renderer"
```

---

### Task 16: Effects 特效系统

**Files:**
- Create: `src/render/Effects.ts`

- [ ] **Step 1: 实现 Effects**

在 `src/render/Effects.ts`：

```typescript
import { GridPos } from '../entities/Snake';
import { CELL_SIZE } from '../utils/constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export class Effects {
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D | null = null;

  bind(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  emitBurst(pos: GridPos, color: string, count: number = 8): void {
    const cx = pos.col * CELL_SIZE + CELL_SIZE / 2;
    const cy = pos.row * CELL_SIZE + CELL_SIZE / 2;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 20 + Math.random() * 40;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3 + Math.random() * 0.3,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  emitDeath(head: GridPos): void {
    this.emitBurst(head, '#FF5252', 20);
  }

  update(dt: number): void {
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
  }

  draw(): void {
    if (!this.ctx) return;
    for (const p of this.particles) {
      this.ctx.globalAlpha = Math.max(0, p.life / 0.6);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  clear(): void {
    this.particles = [];
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/render/Effects.ts && git commit -m "feat: add Effects system"
```

---

### Task 17: 场景实现（MenuScene + SettingsScene + LevelSelectScene）

**Files:**
- Create: `src/scenes/MenuScene.ts`, `src/scenes/SettingsScene.ts`, `src/scenes/LevelSelectScene.ts`

- [ ] **Step 1: 实现 MenuScene**

在 `src/scenes/MenuScene.ts`：

```typescript
import { Scene } from '../core/SceneManager';
import { SceneManager } from '../core/SceneManager';
import { GameMode } from './GameScene';

export class MenuScene implements Scene {
  constructor(private sceneManager: SceneManager) {}

  onEnter(): void {}

  onUpdate(_dt: number): void {}

  onExit(): void {}

  // 由 UI 按钮调用，过渡到 GameScene
  // 在微信小游戏中，按钮通过 wx.createUserInfoButton 或 canvas 绘制实现
  handleStartEndless(): void {
    // 将被 main.ts 中绘制在 canvas 上的按钮区域检测调用
    this.sceneManager.switchTo(
      new (require('./GameScene').GameScene)(this.sceneManager, { mode: GameMode.Endless })
    );
  }

  handleLevelSelect(): void {
    const LevelSelectScene = require('./LevelSelectScene').LevelSelectScene;
    this.sceneManager.switchTo(new LevelSelectScene(this.sceneManager));
  }

  handleSettings(): void {
    const SettingsScene = require('./SettingsScene').SettingsScene;
    this.sceneManager.switchTo(new SettingsScene(this.sceneManager));
  }
}
```

- [ ] **Step 2: 实现 SettingsScene**

在 `src/scenes/SettingsScene.ts`：

```typescript
import { Scene, SceneManager } from '../core/SceneManager';

export class SettingsScene implements Scene {
  constructor(private sceneManager: SceneManager) {}

  onEnter(): void {}
  onUpdate(_dt: number): void {}
  onExit(): void {}
}
```

- [ ] **Step 3: 实现 LevelSelectScene**

在 `src/scenes/LevelSelectScene.ts`：

```typescript
import { Scene, SceneManager } from '../core/SceneManager';
import { LevelSystem } from '../systems/LevelSystem';
import { GameMode } from './GameScene';

export class LevelSelectScene implements Scene {
  private levelSystem: LevelSystem;

  constructor(private sceneManager: SceneManager) {
    this.levelSystem = new LevelSystem();
  }

  onEnter(): void {}
  onUpdate(_dt: number): void {}
  onExit(): void {}

  getLevelSystem(): LevelSystem {
    return this.levelSystem;
  }

  handleSelectLevel(levelId: number): void {
    if (!this.levelSystem.isUnlocked(levelId)) return;
    const GameScene = require('./GameScene').GameScene;
    this.sceneManager.switchTo(
      new GameScene(this.sceneManager, { mode: GameMode.Level, levelId })
    );
  }

  handleBack(): void {
    const MenuScene = require('./MenuScene').MenuScene;
    this.sceneManager.switchTo(new MenuScene(this.sceneManager));
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/scenes/MenuScene.ts src/scenes/SettingsScene.ts src/scenes/LevelSelectScene.ts && git commit -m "feat: add Menu/Settings/LevelSelect scenes"
```

---

### Task 18: GameScene 游戏主场景

**Files:**
- Create: `src/scenes/GameScene.ts`

- [ ] **Step 1: 实现 GameScene**

在 `src/scenes/GameScene.ts`：

```typescript
import { Scene, SceneManager } from '../core/SceneManager';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import { Obstacle } from '../entities/Obstacle';
import { CollisionSystem, CollisionType } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { PowerUpSystem } from '../systems/PowerUpSystem';
import { LevelSystem } from '../systems/LevelSystem';
import { InputManager } from '../core/InputManager';
import { Renderer } from '../render/Renderer';
import { Effects } from '../render/Effects';
import { EventBus } from '../core/EventBus';
import { Direction, GRID_ROWS, GRID_COLS, INITIAL_SNAKE_LENGTH, MAX_POWERUPS_ON_FIELD, POWERUP_SPAWN_FOOD_COUNT, POWERUP_SPAWN_CHANCE, SPEED_TIERS } from '../utils/constants';
import { POWERUP_DEFS } from '../data/powerups';
import { GridPos } from '../entities/Snake';

export enum GameMode {
  Endless = 'Endless',
  Level = 'Level',
}

interface GameSceneData {
  mode: GameMode;
  levelId?: number;
}

interface FieldPowerUp {
  pos: GridPos;
  defId: string;
}

export class GameScene implements Scene {
  // 核心系统
  private snake!: Snake;
  private food!: Food;
  private obstacle: Obstacle | null = null;
  private collisionSystem = new CollisionSystem();
  private scoreSystem = new ScoreSystem();
  private powerUpSystem = new PowerUpSystem();
  private levelSystem = new LevelSystem();
  private renderer: Renderer;
  private effects = new Effects();
  private inputManager = new InputManager();
  private eventBus = new EventBus();

  // 状态
  private mode: GameMode;
  private levelId: number;
  private moveAccumulator: number = 0;
  private moveInterval: number;
  private paused: boolean = false;
  private gameOver: boolean = false;
  private won: boolean = false;
  private fieldPowerUps: FieldPowerUp[] = [];

  constructor(private sceneManager: SceneManager, data: GameSceneData, renderer: Renderer, inputManager: InputManager) {
    this.mode = data.mode;
    this.levelId = data.levelId ?? 0;
    this.renderer = renderer;
    this.inputManager = inputManager;

    if (this.mode === GameMode.Level) {
      const config = this.levelSystem.loadLevel(this.levelId);
      this.moveInterval = config.speed;
    } else {
      this.moveInterval = SPEED_TIERS[0].interval;
    }
  }

  onEnter(): void {
    // 已在构造函数初始化，这里做重置
    this.resetGame();
  }

  private resetGame(): void {
    const startRow = Math.floor(GRID_ROWS / 2);
    const startCol = Math.floor(GRID_COLS / 3);
    this.snake = new Snake({ row: startRow, col: startCol }, INITIAL_SNAKE_LENGTH, Direction.Right);
    this.food = new Food();
    this.obstacle = null;
    this.scoreSystem.reset();
    this.powerUpSystem.reset();
    this.fieldPowerUps = [];
    this.moveAccumulator = 0;
    this.gameOver = false;
    this.won = false;
    this.paused = false;
    this.effects.clear();

    if (this.mode === GameMode.Level) {
      const config = this.levelSystem.loadLevel(this.levelId);
      this.obstacle = Obstacle.fromLayout(config.obstacles);
      this.moveInterval = config.speed;
    } else {
      this.moveInterval = SPEED_TIERS[0].interval;
    }

    this.food.spawn([...this.snake.body, ...(this.obstacle?.positions ?? [])]);
  }

  onUpdate(dt: number): void {
    if (this.paused || this.gameOver || this.won) return;

    // 处理输入
    const dir = this.inputManager.consumeDirection();
    if (dir) this.snake.setDirection(dir);

    // 更新道具计时器
    this.powerUpSystem.update(dt);
    this.effects.update(dt);

    // 速度计算（道具影响）
    const speedMult = this.powerUpSystem.getSpeedMultiplier();
    const effectiveInterval = this.moveInterval * speedMult;
    this.moveAccumulator += dt * 1000;

    if (this.moveAccumulator >= effectiveInterval) {
      this.moveAccumulator = 0;
      this.tick();
    }

    // 渲染
    this.render();
  }

  private tick(): void {
    const ghosting = this.powerUpSystem.isGhosting();
    this.snake.move(false);

    // 穿墙处理
    if (ghosting) {
      const head = this.snake.head;
      if (head.row < 0) head.row = GRID_ROWS - 1;
      if (head.row >= GRID_ROWS) head.row = 0;
      if (head.col < 0) head.col = GRID_COLS - 1;
      if (head.col >= GRID_COLS) head.col = 0;
    }

    // 碰撞检测
    const invincible = this.powerUpSystem.isInvincible();
    const collision = this.collisionSystem.check(
      this.snake,
      this.food.position,
      this.obstacle
    );

    // 回退一步：用于无力时检查是否撞到自己（蛇先 move 再检测）
    // Actually the move already happened, we need to check and potentially undo

    switch (collision) {
      case CollisionType.Food:
        this.snake.body.pop(); // undo move, then move with eating
        this.snake.move(true);
        this.scoreSystem.addFoodScore();
        this.effects.emitBurst(this.food.position, '#FFD700', 8);
        this.spawnFood();
        this.trySpawnPowerUp();
        this.updateSpeed();
        break;
      case CollisionType.Wall:
      case CollisionType.Self:
        if (!invincible && !ghosting) {
          this.handleDeath();
          return;
        }
        if (ghosting && collision === CollisionType.Wall) {
          // 穿墙已在前面处理
        }
        break;
      case CollisionType.Obstacle:
        if (!invincible) {
          this.handleDeath();
          return;
        }
        break;
    }

    // 检查通关（关卡模式）
    if (this.mode === GameMode.Level) {
      const config = this.levelSystem.loadLevel(this.levelId);
      if (this.scoreSystem.foodsEaten >= config.target) {
        this.handleWin();
        return;
      }
    }
  }

  private spawnFood(): void {
    const occupied = [
      ...this.snake.body,
      ...(this.obstacle?.positions ?? []),
      ...this.fieldPowerUps.map((p) => p.pos),
    ];
    this.food.spawn(occupied);
  }

  private trySpawnPowerUp(): void {
    if (this.fieldPowerUps.length >= MAX_POWERUPS_ON_FIELD) return;
    if (this.scoreSystem.foodsEaten % POWERUP_SPAWN_FOOD_COUNT !== 0) return;
    if (Math.random() > POWERUP_SPAWN_CHANCE) return;

    const occupied = [
      ...this.snake.body,
      ...(this.obstacle?.positions ?? []),
      this.food.position,
      ...this.fieldPowerUps.map((p) => p.pos),
    ];

    // 按概率权重随机选一个道具
    const totalProb = POWERUP_DEFS.reduce((s, d) => s + d.probability, 0);
    let r = Math.random() * totalProb;
    let chosen = POWERUP_DEFS[0];
    for (const def of POWERUP_DEFS) {
      r -= def.probability;
      if (r <= 0) { chosen = def; break; }
    }

    // 找空格
    const occupiedSet = new Set(occupied.map((p) => `${p.row},${p.col}`));
    const freeCells: GridPos[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (!occupiedSet.has(`${r},${c}`)) {
          freeCells.push({ row: r, col: c });
        }
      }
    }
    if (freeCells.length === 0) return;
    const pos = freeCells[Math.floor(Math.random() * freeCells.length)];
    this.fieldPowerUps.push({ pos, defId: chosen.id });
  }

  private updateSpeed(): void {
    if (this.mode !== GameMode.Endless) return;
    const score = this.scoreSystem.score;
    const tier = SPEED_TIERS.find((t) => score <= t.maxScore);
    if (tier) this.moveInterval = tier.interval;
  }

  private handleDeath(): void {
    this.gameOver = true;
    this.effects.emitDeath(this.snake.head);
    // Will transition to ResultScene via main.ts polling or direct call
    this.eventBus.emit('game_over', {
      score: this.scoreSystem.score,
      mode: this.mode,
      levelId: this.levelId,
    });
  }

  private handleWin(): void {
    this.won = true;
    const foodsEaten = this.scoreSystem.foodsEaten;
    const target = this.levelSystem.loadLevel(this.levelId).target;
    let stars = 1;
    if (foodsEaten >= target * 1.5) stars = 2;
    if (foodsEaten >= target * 2) stars = 3;
    this.scoreSystem.ratingStars = stars;
    this.levelSystem.completeLevel(this.levelId, stars);
    this.eventBus.emit('level_complete', {
      levelId: this.levelId,
      stars,
      score: this.scoreSystem.score,
    });
  }

  private render(): void {
    this.renderer.clear();
    if (this.obstacle) this.renderer.drawObstacles(this.obstacle);
    this.renderer.drawFood(this.food.position);
    this.fieldPowerUps.forEach((fp) => {
      const def = POWERUP_DEFS.find((d) => d.id === fp.defId);
      if (def) this.renderer.drawPowerUps([{ pos: fp.pos, def }]);
    });
    this.renderer.drawSnake(this.snake, this.powerUpSystem.isGhosting());
    this.effects.draw();

    let levelName: string | null = null;
    let remaining: number | null = null;
    if (this.mode === GameMode.Level) {
      const config = this.levelSystem.loadLevel(this.levelId);
      levelName = config.name;
      remaining = config.target - this.scoreSystem.foodsEaten;
    }
    this.renderer.drawHUD(this.scoreSystem.score, levelName, remaining, this.paused);
  }

  // External controls
  togglePause(): void { this.paused = !this.paused; }
  isGameOver(): boolean { return this.gameOver; }
  isWon(): boolean { return this.won; }
  getScoreSystem(): ScoreSystem { return this.scoreSystem; }
  getEventBus(): EventBus { return this.eventBus; }
  getMode(): GameMode { return this.mode; }
  getLevelId(): number { return this.levelId; }

  onExit(): void {
    this.effects.clear();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/GameScene.ts && git commit -m "feat: add GameScene"
```

---

### Task 19: ResultScene 结算场景

**Files:**
- Create: `src/scenes/ResultScene.ts`

- [ ] **Step 1: 实现 ResultScene**

在 `src/scenes/ResultScene.ts`：

```typescript
import { Scene, SceneManager } from '../core/SceneManager';
import { GameMode } from './GameScene';
import { Storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

interface ResultData {
  mode: GameMode;
  score: number;
  levelId?: number;
  stars?: number;
}

export class ResultScene implements Scene {
  private data: ResultData | null = null;

  constructor(private sceneManager: SceneManager) {}

  onEnter(data?: ResultData): void {
    this.data = data ?? null;
    if (!this.data) return;

    // 保存无尽模式最高分
    if (this.data.mode === GameMode.Endless) {
      const best = Storage.get<number>(STORAGE_KEYS.bestScoreEndless, 0);
      if (this.data.score > best) {
        Storage.set(STORAGE_KEYS.bestScoreEndless, this.data.score);
      }
    }
  }

  onUpdate(_dt: number): void {}

  onExit(): void {}

  getData(): ResultData | null {
    return this.data;
  }

  isLastLevelComplete(): boolean {
    return this.data?.levelId === 10 && this.data.mode === GameMode.Level;
  }

  handleRestart(): void {
    const GameScene = require('./GameScene').GameScene;
    // 需要重新创建 GameScene 实例...
    // 调用方 main.ts 负责处理
  }

  handleBackToMenu(): void {
    const MenuScene = require('./MenuScene').MenuScene;
    this.sceneManager.switchTo(new MenuScene(this.sceneManager));
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scenes/ResultScene.ts && git commit -m "feat: add ResultScene"
```

---

### Task 20: Main 入口 + canvas 按钮交互

**Files:**
- Create: `src/main.ts`

- [ ] **Step 1: 实现 main.ts**

在 `src/main.ts`：

```typescript
import { GameLoop } from './core/GameLoop';
import { SceneManager } from './core/SceneManager';
import { InputManager } from './core/InputManager';
import { Renderer } from './render/Renderer';
import { Effects } from './render/Effects';
import { MenuScene } from './scenes/MenuScene';
import { GameScene, GameMode } from './scenes/GameScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { ResultScene } from './scenes/ResultScene';
import { SettingsScene } from './scenes/SettingsScene';
import { Storage } from './utils/storage';
import { CANVAS_WIDTH, CANVAS_HEIGHT, STORAGE_KEYS } from './utils/constants';

const canvas = (wx as any).createCanvas();
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT + 30; // extra for HUD
const ctx = canvas.getContext('2d');

const renderer = new Renderer(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
const inputManager = new InputManager();
const effects = new Effects();
const sceneManager = new SceneManager();
const gameLoop = new GameLoop();

inputManager.bind(canvas);
effects.bind(ctx);

let currentMenuScene: MenuScene;
let currentGameScene: GameScene | null = null;

// 按钮区域定义（在 canvas 上绘制，点击检测）
interface Button {
  x: number; y: number; w: number; h: number;
  label: string;
  action: () => void;
}

let buttons: Button[] = [];

function setButtons(btns: Button[]): void {
  buttons = btns;
}

// 触摸点击检测
canvas.addEventListener('touchend', (e: any) => {
  // 如果 InputManager 刚处理了滑动，不作为点击
  const touch = e.changedTouches[0];
  if (!touch) return;
  const tx = touch.clientX;
  const ty = touch.clientY;
  buttons.forEach((btn) => {
    if (tx >= btn.x && tx <= btn.x + btn.w && ty >= btn.y && ty <= btn.y + btn.h) {
      btn.action();
    }
  });
});

// 启动场景
currentMenuScene = new MenuScene(sceneManager);
sceneManager.switchTo(currentMenuScene);

// 场景渲染循环
gameLoop.start((dt) => {
  sceneManager.update(dt);

  const current = sceneManager.getCurrentScene();

  if (current instanceof MenuScene) {
    renderMenu();
  } else if (current instanceof GameScene) {
    currentGameScene = current;
    // GameScene 自带渲染
    current.onUpdate(dt);
    // 检测游戏结束/通关
    if (current.isGameOver() || current.isWon()) {
      const scoreSystem = current.getScoreSystem();
      const mode = current.getMode();
      const levelId = current.getLevelId();
      const resultScene = new ResultScene(sceneManager);
      sceneManager.switchTo(resultScene, {
        mode,
        score: scoreSystem.score,
        levelId,
        stars: scoreSystem.ratingStars,
      });
    }
  } else if (current instanceof LevelSelectScene) {
    renderLevelSelect(current);
  } else if (current instanceof ResultScene) {
    renderResult(current);
  } else if (current instanceof SettingsScene) {
    renderSettings();
  }
});

function renderMenu(): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐍 贪吃蛇', CANVAS_WIDTH / 2, 60);

  // 装饰蛇动画
  ctx.font = '48px sans-serif';
  ctx.fillText('🐍', CANVAS_WIDTH / 2, 130);

  const bestScore = Storage.get<number>(STORAGE_KEYS.bestScoreEndless, 0);
  ctx.font = '14px sans-serif';
  ctx.fillText(`最高分: ${bestScore}`, CANVAS_WIDTH / 2, 170);

  // 按钮
  const btnW = 160, btnH = 44, startY = 210, gap = 56;
  drawButton(CANVAS_WIDTH / 2 - btnW / 2, startY, btnW, btnH, '无尽模式', '#FFB300');
  drawButton(CANVAS_WIDTH / 2 - btnW / 2, startY + gap, btnW, btnH, '关卡模式', '#66BB6A');
  drawButton(CANVAS_WIDTH / 2 - btnW / 2, startY + gap * 2, btnW, btnH, '设置', '#42A5F5');

  setButtons([
    { x: CANVAS_WIDTH / 2 - btnW / 2, y: startY, w: btnW, h: btnH, label: '无尽', action: startEndless },
    { x: CANVAS_WIDTH / 2 - btnW / 2, y: startY + gap, w: btnW, h: btnH, label: '关卡', action: () => {
      const lss = new LevelSelectScene(sceneManager);
      sceneManager.switchTo(lss);
    }},
    { x: CANVAS_WIDTH / 2 - btnW / 2, y: startY + gap * 2, w: btnW, h: btnH, label: '设置', action: () => {
      sceneManager.switchTo(new SettingsScene(sceneManager));
    }},
  ]);
}

function startEndless(): void {
  currentGameScene = new GameScene(sceneManager, { mode: GameMode.Endless }, renderer, inputManager);
  sceneManager.switchTo(currentGameScene);
}

function renderLevelSelect(scene: LevelSelectScene): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('关卡选择', CANVAS_WIDTH / 2, 36);

  const ls = scene.getLevelSystem();
  const cols = 2, rows = 5;
  const cardW = 120, cardH = 70, gapX = 20, gapY = 16;
  const startX = (CANVAS_WIDTH - (cols * cardW + (cols - 1) * gapX)) / 2;
  const startY = 60;

  const btns: Button[] = [];

  for (let i = 0; i < 10; i++) {
    const levelId = i + 1;
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = startX + c * (cardW + gapX);
    const y = startY + r * (cardH + gapY);

    const unlocked = ls.isUnlocked(levelId);
    const stars = ls.getStars(levelId);

    ctx.fillStyle = unlocked ? '#FFFFFF' : '#E0E0E0';
    ctx.strokeStyle = unlocked ? '#FFB300' : '#BDBDBD';
    ctx.lineWidth = 2;
    // roundRect
    ctx.beginPath();
    ctx.moveTo(x + 8, y); ctx.lineTo(x + cardW - 8, y);
    ctx.arcTo(x + cardW, y, x + cardW, y + 8, 8);
    ctx.lineTo(x + cardW, y + cardH - 8);
    ctx.arcTo(x + cardW, y + cardH, x + cardW - 8, y + cardH, 8);
    ctx.lineTo(x + 8, y + cardH);
    ctx.arcTo(x, y + cardH, x, y + cardH - 8, 8);
    ctx.lineTo(x, y + 8);
    ctx.arcTo(x, y, x + 8, y, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#5D4037';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(unlocked ? `第${levelId}关` : '🔒', x + cardW / 2, y + 26);

    if (stars > 0) {
      ctx.fillText('⭐️'.repeat(stars), x + cardW / 2, y + 50);
    }

    if (unlocked) {
      btns.push({ x, y, w: cardW, h: cardH, label: `Level ${levelId}`, action: () => scene.handleSelectLevel(levelId) });
    }
  }

  // 返回按钮
  const backY = startY + rows * (cardH + gapY) + 10;
  drawButton(CANVAS_WIDTH / 2 - 60, backY, 120, 36, '返回', '#9E9E9E');
  btns.push({ x: CANVAS_WIDTH / 2 - 60, y: backY, w: 120, h: 36, label: 'Back', action: () => {
    sceneManager.switchTo(new MenuScene(sceneManager));
  }});

  setButtons(btns);
}

function renderResult(scene: ResultScene): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);

  const data = scene.getData();
  if (!data) return;

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';

  if (data.mode === GameMode.Level && data.stars && data.stars > 0) {
    ctx.fillText('🎉 通关!', CANVAS_WIDTH / 2, 50);
    ctx.font = '18px sans-serif';
    ctx.fillText(`分数: ${data.score}`, CANVAS_WIDTH / 2, 90);
    ctx.font = '28px sans-serif';
    ctx.fillText('⭐️'.repeat(data.stars), CANVAS_WIDTH / 2, 130);

    // 第10关特殊文字
    if (data.levelId === 10) {
      ctx.font = '16px sans-serif';
      ctx.fillText('悦宝，以后要辛苦你啦！', CANVAS_WIDTH / 2, 170);
    }
  } else {
    ctx.fillText('Game Over', CANVAS_WIDTH / 2, 50);
    ctx.font = '18px sans-serif';
    ctx.fillText(`分数: ${data.score}`, CANVAS_WIDTH / 2, 90);
  }

  const best = Storage.get<number>(STORAGE_KEYS.bestScoreEndless, 0);
  if (data.mode === GameMode.Endless) {
    ctx.font = '14px sans-serif';
    ctx.fillText(`历史最高: ${best}`, CANVAS_WIDTH / 2, 130);
  }

  // 按钮
  const btnY = data.mode === GameMode.Endless ? 180 : 210;
  drawButton(CANVAS_WIDTH / 2 - 60, btnY, 120, 40, '再来一局', '#FFB300');
  drawButton(CANVAS_WIDTH / 2 - 60, btnY + 50, 120, 40, '返回菜单', '#66BB6A');

  setButtons([
    { x: CANVAS_WIDTH / 2 - 60, y: btnY, w: 120, h: 40, label: 'Restart', action: () => {
      if (data.mode === GameMode.Endless) {
        currentGameScene = new GameScene(sceneManager, { mode: GameMode.Endless }, renderer, inputManager);
        sceneManager.switchTo(currentGameScene);
      } else if (data.levelId) {
        currentGameScene = new GameScene(sceneManager, { mode: GameMode.Level, levelId: data.levelId }, renderer, inputManager);
        sceneManager.switchTo(currentGameScene);
      }
    }},
    { x: CANVAS_WIDTH / 2 - 60, y: btnY + 50, w: 120, h: 40, label: 'Menu', action: () => {
      sceneManager.switchTo(new MenuScene(sceneManager));
    }},
  ]);
}

function renderSettings(): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT + 30);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('设置', CANVAS_WIDTH / 2, 40);

  ctx.font = '14px sans-serif';
  ctx.fillText('更多功能开发中...', CANVAS_WIDTH / 2, 120);

  drawButton(CANVAS_WIDTH / 2 - 60, 180, 120, 40, '返回', '#9E9E9E');
  setButtons([
    { x: CANVAS_WIDTH / 2 - 60, y: 180, w: 120, h: 40, label: 'Back', action: () => {
      sceneManager.switchTo(new MenuScene(sceneManager));
    }},
  ]);
}

function drawButton(x: number, y: number, w: number, h: number, text: string, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 8, y); ctx.lineTo(x + w - 8, y);
  ctx.arcTo(x + w, y, x + w, y + 8, 8);
  ctx.lineTo(x + w, y + h - 8);
  ctx.arcTo(x + w, y + h, x + w - 8, y + h, 8);
  ctx.lineTo(x + 8, y + h);
  ctx.arcTo(x, y + h, x, y + h - 8, 8);
  ctx.lineTo(x, y + 8);
  ctx.arcTo(x, y, x + 8, y, 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + w / 2, y + h / 2 + 5);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/main.ts && git commit -m "feat: add main entry with full UI"
```

---

### Task 21: 排行榜云函数（预留）

**Files:**
- Create: `cloud/leaderboard/index.js`, `cloud/leaderboard/config.json`

- [ ] **Step 1: 创建云函数**

在 `cloud/leaderboard/index.js`：

```javascript
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, score, level, mode } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'upload':
      await db.collection('leaderboard').add({
        data: {
          openid: OPENID,
          score,
          level: level || 0,
          mode: mode || 'endless',
          createdAt: new Date(),
        },
      });
      return { success: true };

    case 'rank':
      const res = await db.collection('leaderboard')
        .where({ mode: mode || 'endless' })
        .orderBy('score', 'desc')
        .limit(100)
        .get();
      return { list: res.data };

    default:
      return { error: 'unknown action' };
  }
};
```

在 `cloud/leaderboard/config.json`：

```json
{
  "permissions": {
    "openapi": []
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add cloud/leaderboard/ && git commit -m "feat: add cloud function placeholder for leaderboard"
```

---

### Task 22: 最终集成测试和验证

**Files:**
- Modify: 以上所有文件

- [ ] **Step 1: 运行全部单元测试**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run
```

- [ ] **Step 2: 确保所有测试通过**

```bash
cd /Users/liuyaguang/snake-game && npx vitest run --reporter=verbose
```

- [ ] **Step 3: 确认项目结构完整**

```bash
find /Users/liuyaguang/snake-game/src -name "*.ts" | sort
find /Users/liuyaguang/snake-game/tests -name "*.test.ts" | sort
```

- [ ] **Step 4: npm install & build**

```bash
cd /Users/liuyaguang/snake-game && npm install && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "verify: all tests pass, project complete"
```
