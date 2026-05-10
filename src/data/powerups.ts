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
