import { describe, it, expect, beforeEach } from 'vitest';
import { LevelSystem } from '../src/systems/LevelSystem';
import { Storage } from '../src/utils/storage';
import { STORAGE_KEYS } from '../src/utils/constants';

describe('LevelSystem', () => {
  beforeEach(() => {
    // Clear storage before each test
    Storage.set(STORAGE_KEYS.unlockedLevel, 1);
    Storage.set(STORAGE_KEYS.levelStars, {});
  });

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
    Storage.set(STORAGE_KEYS.unlockedLevel, 10);
    const sys = new LevelSystem();
    sys.completeLevel(10, 3);
    expect(sys.unlockedLevel).toBe(10);
  });

  it('getStars returns 0 for unplayed level', () => {
    const sys = new LevelSystem();
    expect(sys.getStars(5)).toBe(0);
  });

  it('isUnlocked returns correct values', () => {
    const sys = new LevelSystem();
    expect(sys.isUnlocked(1)).toBe(true);
    expect(sys.isUnlocked(2)).toBe(false);
    sys.completeLevel(1, 1);
    expect(sys.isUnlocked(2)).toBe(true);
  });
});
