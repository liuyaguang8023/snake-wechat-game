"use strict";
// 微信小游戏存储封装
// setStorageSync/getStorageSync 在非微信环境会退化到内存存储（用于测试和开发）
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const memStore = new Map();
const wx = globalThis.wx;
function setStorageSync(key, value) {
    if (wx && wx.setStorageSync) {
        wx.setStorageSync(key, value);
    }
    else {
        memStore.set(key, value);
    }
}
function getStorageSync(key) {
    if (wx && wx.getStorageSync) {
        return wx.getStorageSync(key);
    }
    return memStore.get(key);
}
exports.Storage = {
    get(key, defaultValue) {
        try {
            const val = getStorageSync(key);
            return val !== undefined && val !== null && val !== '' ? val : defaultValue;
        }
        catch {
            return defaultValue;
        }
    },
    set(key, value) {
        try {
            setStorageSync(key, value);
        }
        catch {
            // 静默失败
        }
    },
};
//# sourceMappingURL=storage.js.map