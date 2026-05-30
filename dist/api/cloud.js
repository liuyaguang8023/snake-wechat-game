"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudAPI = void 0;
// 云函数排行榜 API 封装
const wx = globalThis.wx;
exports.CloudAPI = {
    /** 上传分数到排行榜 */
    uploadScore(score, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(wx === null || wx === void 0 ? void 0 : wx.cloud))
                return false;
            try {
                const res = yield wx.cloud.callFunction({
                    name: 'leaderboard',
                    data: { action: 'upload', score, mode },
                });
                return ((_a = res.result) === null || _a === void 0 ? void 0 : _a.success) === true;
            }
            catch (e) {
                console.warn('上传分数失败:', e);
                return false;
            }
        });
    },
    /** 获取排行榜前 100 名 */
    getRank(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!(wx === null || wx === void 0 ? void 0 : wx.cloud))
                return [];
            try {
                const res = yield wx.cloud.callFunction({
                    name: 'leaderboard',
                    data: { action: 'rank', mode },
                });
                return (_b = (_a = res.result) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0 ? _b : [];
            }
            catch (e) {
                console.warn('获取排行榜失败:', e);
                return [];
            }
        });
    },
};
//# sourceMappingURL=cloud.js.map