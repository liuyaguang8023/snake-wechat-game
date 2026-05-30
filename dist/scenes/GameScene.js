import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import { Obstacle } from '../entities/Obstacle';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { PowerUpSystem } from '../systems/PowerUpSystem';
import { LevelSystem } from '../systems/LevelSystem';
import { EventBus } from '../core/EventBus';
import { Effects } from '../render/Effects';
import { GameContext } from '../core/context';
import { GameConfig, Direction, INITIAL_SNAKE_LENGTH, MAX_POWERUPS_ON_FIELD, POWERUP_SPAWN_FOOD_COUNT, POWERUP_SPAWN_CHANCE, SPEED_TIERS, } from '../utils/constants';
import { POWERUP_DEFS } from '../data/powerups';
export var GameMode;
(function (GameMode) {
    GameMode["Endless"] = "Endless";
    GameMode["Level"] = "Level";
})(GameMode || (GameMode = {}));
export class GameScene {
    constructor(sceneManager, data) {
        this.sceneManager = sceneManager;
        this.obstacle = null;
        this.collisionSystem = new CollisionSystem();
        this.scoreSystem = new ScoreSystem();
        this.powerUpSystem = new PowerUpSystem();
        this.levelSystem = new LevelSystem();
        this.effects = new Effects();
        this.eventBus = new EventBus();
        this.moveAccumulator = 0;
        this.paused = false;
        this.gameOver = false;
        this.won = false;
        this.fieldPowerUps = [];
        this.mode = data.mode;
        this.levelId = data.levelId ?? 0;
        if (this.mode === GameMode.Level) {
            const config = this.levelSystem.loadLevel(this.levelId);
            this.moveInterval = config.speed;
        }
        else {
            this.moveInterval = SPEED_TIERS[0].interval;
        }
    }
    onEnter() {
        this.resetGame();
    }
    resetGame() {
        const startRow = Math.floor(GameConfig.GRID_ROWS / 2);
        const startCol = Math.floor(GameConfig.GRID_COLS / 3);
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
        }
        else {
            this.moveInterval = SPEED_TIERS[0].interval;
        }
        this.food.spawn([...this.snake.body, ...(this.obstacle?.positions ?? [])]);
        this.effects.bind(GameContext.renderer?.ctx);
    }
    onUpdate(dt) {
        if (this.paused || this.gameOver || this.won)
            return;
        const dir = GameContext.inputManager?.consumeDirection();
        if (dir)
            this.snake.setDirection(dir);
        this.powerUpSystem.update(dt);
        this.effects.update(dt);
        const speedMult = this.powerUpSystem.getSpeedMultiplier();
        const effectiveInterval = this.moveInterval * speedMult;
        this.moveAccumulator += dt * 1000;
        if (this.moveAccumulator >= effectiveInterval) {
            this.moveAccumulator = 0;
            this.gameTick();
        }
        this.render();
    }
    gameTick() {
        const ghosting = this.powerUpSystem.isGhosting();
        const tailBeforeMove = this.snake.body[this.snake.body.length - 1];
        this.snake.move(false);
        if (ghosting) {
            const head = this.snake.head;
            if (head.row < 0)
                this.snake.body[0] = { ...head, row: GameConfig.GRID_ROWS - 1 };
            if (head.row >= GameConfig.GRID_ROWS)
                this.snake.body[0] = { ...head, row: 0 };
            if (head.col < 0)
                this.snake.body[0] = { ...head, col: GameConfig.GRID_COLS - 1 };
            if (head.col >= GameConfig.GRID_COLS)
                this.snake.body[0] = { ...head, col: 0 };
        }
        const invincible = this.powerUpSystem.isInvincible();
        const wallHit = this.collisionSystem.checkWallCollision(this.snake);
        if (wallHit && !ghosting) {
            this.handleDeath();
            return;
        }
        // Check for power-up pickups
        const collectedPowerUp = this.fieldPowerUps.findIndex((fp) => fp.pos.row === this.snake.head.row && fp.pos.col === this.snake.head.col);
        if (collectedPowerUp >= 0) {
            const defId = this.fieldPowerUps[collectedPowerUp].defId;
            this.powerUpSystem.activate(defId);
            if (defId === 'shrink') {
                this.snake.shorten(3);
            }
            this.fieldPowerUps.splice(collectedPowerUp, 1);
        }
        // Check food collision
        const ateFood = this.collisionSystem.checkFoodCollision(this.snake, this.food.position);
        if (ateFood) {
            this.snake.body.push({ ...tailBeforeMove }); // restore tail for growth
            this.scoreSystem.addFoodScore();
            this.effects.emitBurst(this.food.position, '#FFD700', 8);
            // Check level completion BEFORE spawning new food, so the last apple
            // doesn't flash a new one on screen before the result scene
            if (this.mode === GameMode.Level) {
                const config = this.levelSystem.loadLevel(this.levelId);
                if (this.scoreSystem.foodsEaten >= config.target) {
                    this.handleWin();
                    return;
                }
            }
            this.spawnFood();
            this.trySpawnPowerUp();
            this.updateSpeed();
        }
        // Check obstacle and self collision
        if (!invincible) {
            if (this.obstacle && this.collisionSystem.checkObstacleCollision(this.snake, this.obstacle)) {
                this.handleDeath();
                return;
            }
            if (this.collisionSystem.checkSelfCollision(this.snake)) {
                this.handleDeath();
                return;
            }
        }
        // Update score multiplier from power-ups
        this.scoreSystem.setMultiplier(this.powerUpSystem.getScoreMultiplier());
    }
    spawnFood() {
        const occupied = [
            ...this.snake.body,
            ...(this.obstacle?.positions ?? []),
            ...this.fieldPowerUps.map((p) => p.pos),
        ];
        this.food.spawn(occupied);
    }
    trySpawnPowerUp() {
        if (this.fieldPowerUps.length >= MAX_POWERUPS_ON_FIELD)
            return;
        if (this.scoreSystem.foodsEaten % POWERUP_SPAWN_FOOD_COUNT !== 0)
            return;
        if (Math.random() > POWERUP_SPAWN_CHANCE)
            return;
        const occupied = [
            ...this.snake.body,
            ...(this.obstacle?.positions ?? []),
            this.food.position,
            ...this.fieldPowerUps.map((p) => p.pos),
        ];
        const totalProb = POWERUP_DEFS.reduce((s, d) => s + d.probability, 0);
        let r = Math.random() * totalProb;
        let chosen = POWERUP_DEFS[0];
        for (const def of POWERUP_DEFS) {
            r -= def.probability;
            if (r <= 0) {
                chosen = def;
                break;
            }
        }
        const occupiedSet = new Set(occupied.map((p) => `${p.row},${p.col}`));
        const freeCells = [];
        for (let r = 0; r < GameConfig.GRID_ROWS; r++) {
            for (let c = 0; c < GameConfig.GRID_COLS; c++) {
                if (!occupiedSet.has(`${r},${c}`)) {
                    freeCells.push({ row: r, col: c });
                }
            }
        }
        if (freeCells.length === 0)
            return;
        const pos = freeCells[Math.floor(Math.random() * freeCells.length)];
        this.fieldPowerUps.push({ pos, defId: chosen.id });
    }
    updateSpeed() {
        if (this.mode !== GameMode.Endless)
            return;
        const score = this.scoreSystem.score;
        const tier = SPEED_TIERS.find((t) => score <= t.maxScore);
        if (tier)
            this.moveInterval = tier.interval;
    }
    handleDeath() {
        this.gameOver = true;
        this.effects.emitDeath(this.snake.head);
        this.eventBus.emit('game_over', {
            score: this.scoreSystem.score,
            mode: this.mode,
            levelId: this.levelId,
        });
    }
    handleWin() {
        this.won = true;
        const foodsEaten = this.scoreSystem.foodsEaten;
        const target = this.levelSystem.loadLevel(this.levelId).target;
        let stars = 1;
        if (foodsEaten >= target * 1.5)
            stars = 2;
        if (foodsEaten >= target * 2)
            stars = 3;
        this.scoreSystem.ratingStars = stars;
        this.levelSystem.completeLevel(this.levelId, stars);
        this.eventBus.emit('level_complete', {
            levelId: this.levelId,
            stars,
            score: this.scoreSystem.score,
        });
    }
    render() {
        const renderer = GameContext.renderer;
        if (!renderer)
            return;
        renderer.clear();
        if (this.obstacle)
            renderer.drawObstacles(this.obstacle);
        renderer.drawFood(this.food.position);
        this.fieldPowerUps.forEach((fp) => {
            const def = POWERUP_DEFS.find((d) => d.id === fp.defId);
            if (def)
                renderer.drawPowerUps([{ pos: fp.pos, def }]);
        });
        renderer.drawSnake(this.snake, this.powerUpSystem.isGhosting());
        this.effects.draw();
        let levelName = null;
        let remaining = null;
        if (this.mode === GameMode.Level) {
            const config = this.levelSystem.loadLevel(this.levelId);
            levelName = config.name;
            remaining = config.target - this.scoreSystem.foodsEaten;
        }
        renderer.drawHUD(this.scoreSystem.score, levelName, remaining, this.paused);
    }
    // Public API
    togglePause() { this.paused = !this.paused; }
    isGameOver() { return this.gameOver; }
    isWon() { return this.won; }
    getScoreSystem() { return this.scoreSystem; }
    getEventBus() { return this.eventBus; }
    getMode() { return this.mode; }
    getLevelId() { return this.levelId; }
    onExit() {
        this.effects.clear();
    }
}
//# sourceMappingURL=GameScene.js.map