import { GameLoop } from './core/GameLoop';
import { SceneManager, Scene } from './core/SceneManager';
import { InputManager } from './core/InputManager';
import { Renderer } from './render/Renderer';
import { Effects } from './render/Effects';
import { GameContext } from './core/context';
import { MenuScene } from './scenes/MenuScene';
import { GameScene, GameMode } from './scenes/GameScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { ResultScene } from './scenes/ResultScene';
import { SettingsScene } from './scenes/SettingsScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';
import { CloudAPI } from './api/cloud';
import { Storage } from './utils/storage';
import { GameConfig, initDimensions, STORAGE_KEYS } from './utils/constants';

// WeChat mini game canvas — screen-adaptive sizing
const wx = (globalThis as any).wx;
const canvas = wx ? wx.createCanvas() : null;

let screenW = 375;   // fallback
let screenH = 667;   // fallback
let dpr = 1;

if (canvas && wx) {
  const sysInfo = wx.getSystemInfoSync();
  dpr = sysInfo.pixelRatio || 1;
  screenW = sysInfo.windowWidth;
  screenH = sysInfo.windowHeight;
  initDimensions(screenW, screenH);
  canvas.width = GameConfig.CANVAS_WIDTH * dpr;
  canvas.height = (GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT) * dpr;
}

const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D | null;

// Apply HiDPI pixel-ratio scaling only (no letterboxing)
if (ctx && canvas && wx) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const renderer = ctx ? new Renderer(ctx, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT) : null;
const inputManager = new InputManager();
const effects = new Effects();
const sceneManager = new SceneManager();
const gameLoop = new GameLoop();

// Wire up GameContext
if (renderer) GameContext.renderer = renderer;
GameContext.inputManager = inputManager;
if (ctx) effects.bind(ctx);

// Bind swipe input
if (canvas) inputManager.bind(canvas);

// 初始化云开发（失败不影响游戏运行）
try {
  if (wx?.cloud) {
    wx.cloud.init({
      env: 'cloud1-d8gbfss9ob08cf382',
      traceUser: true,
    });
  }
} catch (_e) {
  // 排行榜功能不可用，游戏正常运行
}

// Button definitions
interface Button {
  x: number; y: number; w: number; h: number;
  label: string;
  action: () => void;
}

let buttons: Button[] = [];

// Touch click detection (separate from swipe)
if (canvas) {
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener('touchstart', (e: any) => {
    const touch = e.touches[0];
    touchStartTime = Date.now();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  canvas.addEventListener('touchend', (e: any) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dt = Date.now() - touchStartTime;
    const dx = Math.abs(touch.clientX - touchStartX);
    const dy = Math.abs(touch.clientY - touchStartY);

    // Only treat as click if short duration and minimal movement
    if (dt < 300 && dx < 20 && dy < 20) {
      // Convert screen coordinates to game coordinates
      const scaleX = GameConfig.CANVAS_WIDTH / screenW;
      const scaleY = (GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT) / screenH;
      const gx = touch.clientX * scaleX;
      const gy = touch.clientY * scaleY;
      buttons.forEach((btn) => {
        if (gx >= btn.x && gx <= btn.x + btn.w &&
            gy >= btn.y && gy <= btn.y + btn.h) {
          btn.action();
        }
      });
    }
  });
}

// Start with menu
const menuScene = new MenuScene(sceneManager);
let currentGameScene: GameScene | null = null;

sceneManager.switchTo(menuScene);

// Main game loop
gameLoop.start((dt) => {
  sceneManager.update(dt);

  const current = sceneManager.getCurrentScene();

  if (current instanceof GameScene) {
    currentGameScene = current;
    // GameScene's onUpdate handles its own rendering
    current.onUpdate(dt);

    // Check for game state transitions
    if (current.isGameOver() || current.isWon()) {
      const scoreSystem = current.getScoreSystem();
      const mode = current.getMode();
      const levelId = current.getLevelId();
      const score = scoreSystem.score;
      const resultScene = new ResultScene(sceneManager);
      sceneManager.switchTo(resultScene, {
        mode,
        score,
        levelId,
        stars: scoreSystem.ratingStars,
      });
      // 游戏结束后自动上传分数到云端排行榜
      const modeStr = mode === GameMode.Endless ? 'endless' : 'level';
      CloudAPI.uploadScore(score, modeStr);
      currentGameScene = null;
    }
  } else if (current instanceof MenuScene) {
    renderMenu();
  } else if (current instanceof LevelSelectScene) {
    renderLevelSelect(current);
  } else if (current instanceof ResultScene) {
    renderResult(current);
  } else if (current instanceof SettingsScene) {
    renderSettings();
  } else if (current instanceof LeaderboardScene) {
    renderLeaderboard(current);
  }
});

// ==== Render Functions ====

function drawButton(x: number, y: number, w: number, h: number, text: string, color: string): void {
  if (!ctx) return;
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

function renderMenu(): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('\u{1F40D} 贪吃蛇', GameConfig.CANVAS_WIDTH / 2, 60);

  ctx.font = '48px sans-serif';
  ctx.fillText('\u{1F40D}', GameConfig.CANVAS_WIDTH / 2, 130);

  const bestScore = Storage.get<number>(STORAGE_KEYS.bestScoreEndless, 0);
  ctx.font = '14px sans-serif';
  ctx.fillText(`最高分: ${bestScore}`, GameConfig.CANVAS_WIDTH / 2, 170);

  const btnW = 160, btnH = 40, startY = 200, gap = 50;
  drawButton(GameConfig.CANVAS_WIDTH / 2 - btnW / 2, startY, btnW, btnH, '无尽模式', '#FFB300');
  drawButton(GameConfig.CANVAS_WIDTH / 2 - btnW / 2, startY + gap, btnW, btnH, '关卡模式', '#66BB6A');
  drawButton(GameConfig.CANVAS_WIDTH / 2 - btnW / 2, startY + gap * 2, btnW, btnH, '排行榜', '#AB47BC');
  drawButton(GameConfig.CANVAS_WIDTH / 2 - btnW / 2, startY + gap * 3, btnW, btnH, '设置', '#42A5F5');

  buttons = [
    { x: GameConfig.CANVAS_WIDTH / 2 - btnW / 2, y: startY, w: btnW, h: btnH, label: '无尽', action: startEndless },
    { x: GameConfig.CANVAS_WIDTH / 2 - btnW / 2, y: startY + gap, w: btnW, h: btnH, label: '关卡', action: () => {
      sceneManager.switchTo(new LevelSelectScene(sceneManager));
    }},
    { x: GameConfig.CANVAS_WIDTH / 2 - btnW / 2, y: startY + gap * 2, w: btnW, h: btnH, label: '排行榜', action: () => {
      sceneManager.switchTo(new LeaderboardScene(sceneManager));
    }},
    { x: GameConfig.CANVAS_WIDTH / 2 - btnW / 2, y: startY + gap * 3, w: btnW, h: btnH, label: '设置', action: () => {
      sceneManager.switchTo(new SettingsScene(sceneManager));
    }},
  ];
}

function startEndless(): void {
  const gameScene = new GameScene(sceneManager, { mode: GameMode.Endless });
  sceneManager.switchTo(gameScene);
}

function renderLevelSelect(scene: LevelSelectScene): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('关卡选择', GameConfig.CANVAS_WIDTH / 2, 36);

  const ls = scene.getLevelSystem();
  const cols = 2, rows = 5;
  const cardW = 120, cardH = 70, gapX = 20, gapY = 16;
  const startX = (GameConfig.CANVAS_WIDTH - (cols * cardW + (cols - 1) * gapX)) / 2;
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

  const backY = startY + rows * (cardH + gapY) + 10;
  drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, backY, 120, 36, '返回', '#9E9E9E');
  btns.push({ x: GameConfig.CANVAS_WIDTH / 2 - 60, y: backY, w: 120, h: 36, label: 'Back', action: () => {
    sceneManager.switchTo(new MenuScene(sceneManager));
  }});

  buttons = btns;
}

function renderResult(scene: ResultScene): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);

  const data = scene.getData();
  if (!data) return;

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';

  const btnY = 210;

  if (data.mode === GameMode.Level && data.stars && data.stars > 0) {
    ctx.fillText('🎉 通关!', GameConfig.CANVAS_WIDTH / 2, 50);
    ctx.font = '18px sans-serif';
    ctx.fillText(`分数: ${data.score}`, GameConfig.CANVAS_WIDTH / 2, 90);
    ctx.font = '28px sans-serif';
    ctx.fillText('⭐️'.repeat(data.stars), GameConfig.CANVAS_WIDTH / 2, 130);

    if (data.levelId === 10) {
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#E65100';
      ctx.fillText('悦宝，以后要辛苦你啦！', GameConfig.CANVAS_WIDTH / 2, 170);
      ctx.fillStyle = '#5D4037';
    }
  } else {
    ctx.fillText('Game Over', GameConfig.CANVAS_WIDTH / 2, 50);
    ctx.font = '18px sans-serif';
    ctx.fillText(`分数: ${data.score}`, GameConfig.CANVAS_WIDTH / 2, 90);
  }

  const best = Storage.get<number>(STORAGE_KEYS.bestScoreEndless, 0);
  if (data.mode === GameMode.Endless) {
    ctx.font = '14px sans-serif';
    ctx.fillText(`历史最高: ${best}`, GameConfig.CANVAS_WIDTH / 2, 130);
  }

  drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, btnY, 120, 40, '再来一局', '#FFB300');
  drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, btnY + 50, 120, 40, '返回菜单', '#66BB6A');

  buttons = [
    { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: btnY, w: 120, h: 40, label: 'Restart', action: () => scene.handleRestart() },
    { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: btnY + 50, w: 120, h: 40, label: 'Menu', action: () => scene.handleBackToMenu() },
  ];
}

function renderSettings(): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('设置', GameConfig.CANVAS_WIDTH / 2, 40);

  ctx.font = '14px sans-serif';
  ctx.fillText('更多功能开发中...', GameConfig.CANVAS_WIDTH / 2, 120);

  drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, 180, 120, 40, '返回', '#9E9E9E');
  buttons = [
    { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: 180, w: 120, h: 40, label: 'Back', action: () => {
      sceneManager.switchTo(new MenuScene(sceneManager));
    }},
  ];
}

function renderLeaderboard(scene: LeaderboardScene): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);
  ctx.fillStyle = '#FFFDE7';
  ctx.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT + GameConfig.HUD_HEIGHT);

  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('无尽模式排行榜', GameConfig.CANVAS_WIDTH / 2, 32);

  if (scene.isLoading()) {
    ctx.font = '14px sans-serif';
    ctx.fillText('加载中...', GameConfig.CANVAS_WIDTH / 2, 80);
    drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, 200, 120, 40, '返回', '#9E9E9E');
    buttons = [
      { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: 200, w: 120, h: 40, label: 'Back', action: () => scene.handleBack() },
    ];
    return;
  }

  if (scene.hasError()) {
    ctx.font = '14px sans-serif';
    ctx.fillText('加载失败，请检查网络', GameConfig.CANVAS_WIDTH / 2, 80);
    drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, 200, 120, 40, '返回', '#9E9E9E');
    buttons = [
      { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: 200, w: 120, h: 40, label: 'Back', action: () => scene.handleBack() },
    ];
    return;
  }

  const list = scene.getList();
  if (list.length === 0) {
    ctx.font = '14px sans-serif';
    ctx.fillText('暂无排行数据', GameConfig.CANVAS_WIDTH / 2, 80);
    drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, 200, 120, 40, '返回', '#9E9E9E');
    buttons = [
      { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: 200, w: 120, h: 40, label: 'Back', action: () => scene.handleBack() },
    ];
    return;
  }

  // Draw table header
  const tableStartY = 56;
  const rowH = 28;
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#5D4037';
  ctx.textAlign = 'left';
  ctx.fillText('排名', 20, tableStartY);
  ctx.fillText('分数', GameConfig.CANVAS_WIDTH / 2, tableStartY);
  ctx.textAlign = 'right';
  ctx.fillText('玩家', GameConfig.CANVAS_WIDTH - 20, tableStartY);

  // Header separator line
  ctx.strokeStyle = '#BDBDBD';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(12, tableStartY + 6);
  ctx.lineTo(GameConfig.CANVAS_WIDTH - 12, tableStartY + 6);
  ctx.stroke();

  // Draw rows
  const maxRows = Math.min(list.length, 20);
  ctx.font = '12px sans-serif';
  for (let i = 0; i < maxRows; i++) {
    const item = list[i];
    const y = tableStartY + 14 + (i + 1) * rowH;
    const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;

    ctx.textAlign = 'left';
    ctx.fillText(`${rankEmoji}`, 20, y);
    ctx.fillText(`${item.score}`, GameConfig.CANVAS_WIDTH / 2, y);
    ctx.textAlign = 'right';
    // 显示 openid 前 6 位
    const uid = item.openid ? item.openid.substring(0, 6) : '???';
    ctx.fillText(uid, GameConfig.CANVAS_WIDTH - 20, y);
  }

  const btnY = tableStartY + (maxRows + 1) * rowH + 20;
  drawButton(GameConfig.CANVAS_WIDTH / 2 - 60, btnY, 120, 40, '返回', '#9E9E9E');
  buttons = [
    { x: GameConfig.CANVAS_WIDTH / 2 - 60, y: btnY, w: 120, h: 40, label: 'Back', action: () => scene.handleBack() },
  ];
}
