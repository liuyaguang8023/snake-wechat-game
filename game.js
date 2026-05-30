// 初始化云开发
if (typeof wx !== 'undefined' && wx.cloud) {
  wx.cloud.init({
    env: 'cloud1-d8gbfss9ob08cf382',
    traceUser: true,
  });
}

import './dist/main.js';
