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
        var _a;
        (_a = this.handlers.get(event)) === null || _a === void 0 ? void 0 : _a.delete(handler);
    }
    emit(event, data) {
        var _a;
        (_a = this.handlers.get(event)) === null || _a === void 0 ? void 0 : _a.forEach((handler) => handler(data));
    }
    clear() {
        this.handlers.clear();
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=EventBus.js.map