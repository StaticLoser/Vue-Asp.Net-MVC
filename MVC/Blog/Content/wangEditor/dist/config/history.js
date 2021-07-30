"use strict";
/**
 * @description 历史记录 - 数据缓存的模式
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../utils/util");
/**
 * 是否为兼容模式。返回 true 表示当前使用兼容（内容备份）模式，否则使用标准（差异备份）模式
 */
function compatibleMode() {
    if (util_1.UA.isIE() || util_1.UA.isOldEdge) {
        return true;
    }
    return false;
}
exports.default = {
    compatibleMode: compatibleMode,
    historyMaxSize: 30,
};
//# sourceMappingURL=history.js.map