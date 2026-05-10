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
