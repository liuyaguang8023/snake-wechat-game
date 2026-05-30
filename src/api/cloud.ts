// 云函数排行榜 API 封装
const wx = (globalThis as any).wx;

export interface RankItem {
  openid: string;
  score: number;
  mode: string;
  createdAt?: string;
}

export const CloudAPI = {
  /** 上传分数到排行榜 */
  async uploadScore(score: number, mode: string): Promise<boolean> {
    if (!wx?.cloud) return false;
    try {
      const res = await wx.cloud.callFunction({
        name: 'leaderboard',
        data: { action: 'upload', score, mode },
      });
      return res.result?.success === true;
    } catch (e) {
      console.warn('上传分数失败:', e);
      return false;
    }
  },

  /** 获取排行榜前 100 名 */
  async getRank(mode: string): Promise<RankItem[]> {
    if (!wx?.cloud) return [];
    try {
      const res = await wx.cloud.callFunction({
        name: 'leaderboard',
        data: { action: 'rank', mode },
      });
      return res.result?.list ?? [];
    } catch (e) {
      console.warn('获取排行榜失败:', e);
      return [];
    }
  },
};
