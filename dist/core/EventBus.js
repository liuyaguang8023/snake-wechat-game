"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
class EventBus {
    constructor() {
        this.handlers = new Map();
    }
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event).add(handler);
    }
    off(event, handler) {
        this.handlers.get(event)?.delete(handler);
    }
    emit(event, data) {
        this.handlers.get(event)?.forEach((handler) => handler(data));
    }
    clear() {
        this.handlers.clear();
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=EventBus.js.map