const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, score, level, mode } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'upload':
      await db.collection('leaderboard').add({
        data: {
          openid: OPENID,
          score,
          level: level || 0,
          mode: mode || 'endless',
          createdAt: new Date(),
        },
      });
      return { success: true };

    case 'rank':
      const res = await db.collection('leaderboard')
        .where({ mode: mode || 'endless' })
        .orderBy('score', 'desc')
        .limit(100)
        .get();
      return { list: res.data };

    default:
      return { error: 'unknown action' };
  }
};
