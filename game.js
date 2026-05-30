// 初始化云开发（失败不影响游戏运行）
try {
  if (typeof wx !== 'undefined' && wx.cloud) {
    wx.cloud.init({
      env: 'cloud1-d8gbfss9ob08cf382',
      traceUser: true,
    });
  }
} catch (e) {
  // 云开发初始化失败，游戏仍可正常运行（排行榜不可用）
}

import './dist/main.js';
