"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScene = exports.GameMode = void 0;
const Snake_1 = require("../entities/Snake");
const Food_1 = require("../entities/Food");
const Obstacle_1 = require("../entities/Obstacle");
const CollisionSystem_1 = require("../systems/CollisionSystem");
const ScoreSystem_1 = require("../systems/ScoreSystem");
const PowerUpSystem_1 = require("../systems/PowerUpSystem");
const LevelSystem_1 = require("../systems/LevelSystem");
const EventBus_1 = require("../core/EventBus");
const Effects_1 = require("../render/Effects");
const context_1 = require("../core/context");
const constants_1 = require("../utils/constants");
const powerups_1 = require("../data/powerups");
var GameMode;
(function (GameMode) {
    GameMode["Endless"] = "Endless";
    GameMode["Level"] = "Level";
})(GameMode || (exports.GameMode = GameMode = {}));
class GameScene {
    constructor(sceneManager, data) {
        this.sceneManager = sceneManager;
        this.obstacle = null;
        this.collisionSystem = new CollisionSystem_1.CollisionSystem();
        this.scoreSystem = new ScoreSystem_1.ScoreSystem();
        this.powerUpSystem = new PowerUpSystem_1.PowerUpSystem();
        this.levelSystem = new LevelSystem_1.LevelSystem();
        this.effects = new Effects_1.Effects();
        this.eventBus = new EventBus_1.EventBus();
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
            this.moveInterval = constants_1.SPEED_TIERS[0].interval;
        }
    }
    onEnter() {
        this.resetGame();
    }
    resetGame() {
        const startRow = Math.floor(constants_1.GameConfig.GRID_ROWS / 2);
        const startCol = Math.floor(constants_1.GameConfig.GRID_COLS / 3);
        this.snake = new Snake_1.Snake({ row: startRow, col: startCol }, constants_1.INITIAL_SNAKE_LENGTH, constants_1.Direction.Right);
        this.food = new Food_1.Food();
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
            this.obstacle = Obstacle_1.Obstacle.fromLayout(config.obstacles);
            this.moveInterval = config.speed;
        }
        else {
            this.moveInterval = constants_1.SPEED_TIERS[0].interval;
        }
        this.food.spawn([...this.snake.body, ...(this.obstacle?.positions ?? [])]);
        this.effects.bind(context_1.GameContext.renderer?.ctx);
    }
    onUpdate(dt) {
        if (this.paused || this.gameOver || this.won)
            return;
        const dir = context_1.GameContext.inputManager?.consumeDirection();
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
                this.snake.body[0] = { ...head, row: constants_1.GameConfig.GRID_ROWS - 1 };
            if (head.row >= constants_1.GameConfig.GRID_ROWS)
                this.snake.body[0] = { ...head, row: 0 };
            if (head.col < 0)
                this.snake.body[0] = { ...head, col: constants_1.GameConfig.GRID_COLS - 1 };
            if (head.col >= constants_1.GameConfig.GRID_COLS)
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
        if (this.fieldPowerUps.length >= constants_1.MAX_POWERUPS_ON_FIELD)
            return;
        if (this.scoreSystem.foodsEaten % constants_1.POWERUP_SPAWN_FOOD_COUNT !== 0)
            return;
        if (Math.random() > constants_1.POWERUP_SPAWN_CHANCE)
            return;
        const occupied = [
            ...this.snake.body,
            ...(this.obstacle?.positions ?? []),
            this.food.position,
            ...this.fieldPowerUps.map((p) => p.pos),
        ];
        const totalProb = powerups_1.POWERUP_DEFS.reduce((s, d) => s + d.probability, 0);
        let r = Math.random() * totalProb;
        let chosen = powerups_1.POWERUP_DEFS[0];
        for (const def of powerups_1.POWERUP_DEFS) {
            r -= def.probability;
            if (r <= 0) {
                chosen = def;
                break;
            }
        }
        const occupiedSet = new Set(occupied.map((p) => `${p.row},${p.col}`));
        const freeCells = [];
        for (let r = 0; r < constants_1.GameConfig.GRID_ROWS; r++) {
            for (let c = 0; c < constants_1.GameConfig.GRID_COLS; c++) {
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
        const tier = constants_1.SPEED_TIERS.find((t) => score <= t.maxScore);
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
        const renderer = context_1.GameContext.renderer;
        if (!renderer)
            return;
        renderer.clear();
        if (this.obstacle)
            renderer.drawObstacles(this.obstacle);
        renderer.drawFood(this.food.position);
        this.fieldPowerUps.forEach((fp) => {
            const def = powerups_1.POWERUP_DEFS.find((d) => d.id === fp.defId);
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
exports.GameScene = GameScene;
//# sourceMappingURL=GameScene.js.map