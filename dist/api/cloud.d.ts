export interface RankItem {
    openid: string;
    score: number;
    mode: string;
    createdAt?: string;
}
export declare const CloudAPI: {
    /** 上传分数到排行榜 */
    uploadScore(score: number, mode: string): Promise<boolean>;
    /** 获取排行榜前 100 名 */
    getRank(mode: string): Promise<RankItem[]>;
};
