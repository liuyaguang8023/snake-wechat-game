import { describe, it, expect } from 'vitest';
import { PowerUpSystem } from '../src/systems/PowerUpSystem';

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
    const ids = sys.activeIds();
    expect(ids).toContain('speed');
    expect(ids).toContain('double');
    expect(ids.length).toBe(2);
  });

  it('calculates movement speed multiplier', () => {
    const sys = new PowerUpSystem();
    expect(sys.getSpeedMultiplier()).toBe(1);
    sys.activate('speed');
    expect(sys.getSpeedMultiplier()).toBe(0.5);
    sys.activate('slow');
    expect(sys.getSpeedMultiplier()).toBe(1); // 0.5 * 2 = 1
  });

  it('calculates score multiplier', () => {
    const sys = new PowerUpSystem();
    expect(sys.getScoreMultiplier()).toBe(1);
    sys.activate('speed');
    expect(sys.getScoreMultiplier()).toBe(2);
    sys.activate('double');
    expect(sys.getScoreMultiplier()).toBe(4);
  });

  it('isInvincible returns true only when active', () => {
    const sys = new PowerUpSystem();
    expect(sys.isInvincible()).toBe(false);
    sys.activate('invincible');
    expect(sys.isInvincible()).toBe(true);
    sys.deactivate('invincible');
    expect(sys.isInvincible()).toBe(false);
  });

  it('isGhosting returns true only when active', () => {
    const sys = new PowerUpSystem();
    expect(sys.isGhosting()).toBe(false);
    sys.activate('ghost');
    expect(sys.isGhosting()).toBe(true);
  });
});
