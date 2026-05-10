// 微信小游戏存储封装
// setStorageSync/getStorageSync 在非微信环境会退化到内存存储（用于测试和开发）

const memStore = new Map<string, any>();

const wx = (globalThis as any).wx;

function setStorageSync(key: string, value: any): void {
  if (wx && wx.setStorageSync) {
    wx.setStorageSync(key, value);
  } else {
    memStore.set(key, value);
  }
}

function getStorageSync(key: string): any {
  if (wx && wx.getStorageSync) {
    return wx.getStorageSync(key);
  }
  return memStore.get(key);
}

export const Storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const val = getStorageSync(key);
      return val !== undefined && val !== null && val !== '' ? val : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key: string, value: any): void {
    try {
      setStorageSync(key, value);
    } catch {
      // 静默失败
    }
  },
};
